import { NextFunction, Request, Response } from "express";
import { asyncHandler, generateResponse, getMongoId } from "../../utils/helpers";
import { BidsStatusCount, countBids, createAndSendNotifications, createBid, fetchAllBids, fetchAllLcsWithoutPagination, findBid, findLc, findRisk, updateBid, updateBids, updateLc } from "../../models";
import { BID_APPROVAL_STATUS, LC_STATUS, NOTIFICATION_TYPES, ROLES, SOCKET_EVENTS, STATUS_CODES } from "../../utils/constants";
import { ICreateAndSendNotificationParams } from "../../utils/interfaces";
import { emitSocketEvent } from "../../socket";

export const getAllBids = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const corporateBusinessId = req.user.business;

    if (!type) return next({
        message: 'type is required',
        statusCode: STATUS_CODES.BAD_REQUEST
    });

    const corporateLcs = await fetchAllLcsWithoutPagination({ createdBy: corporateBusinessId }).select('_id');
    const lcIds = corporateLcs.map(lc => lc._id);

    const query = {
        bidType: type,
        lc: { $in: lcIds },
    }

    const populate = { path: 'lc', select: 'issuingBanks confirmingBank' };

    const fetchedBids = await fetchAllBids({ query, page, limit, populate });
    generateResponse(fetchedBids, 'List fetched successfully', res);
});

export const createBids = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.lc) return next({
        message: 'lc is required',
        statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY
    });

    const role = req.user.role;

    const lc = await findLc({ _id: req.body.lc });
    if (!lc) return next({
        message: 'Lc not found',
        statusCode: STATUS_CODES.NOT_FOUND
    });

    const isBidAlreadyAccepted = await findBid({ lc: req.body.lc, status: LC_STATUS.ACCEPTED });
    if (isBidAlreadyAccepted) return next({
        message: 'Lc already accepted a bid',
        statusCode: STATUS_CODES.BAD_REQUEST
    });

    req.body.bidBy = req.user.business;
    req.body.createdBy = req.user._id;

    req.body.bidNumber = await countBids({}) + 1;

    const approvalStatus = (role === ROLES.ADMIN) ? BID_APPROVAL_STATUS.APPROVED : BID_APPROVAL_STATUS.PENDING;
    const bid = await createBid({ ...req.body, approvalStatus });

    if (role === ROLES.ADMIN) {
        const updatedLc = await updateLc({ _id: req.body.lc, status: LC_STATUS.ADD_BID }, { $addToSet: { bids: bid._id } });
        if (!updatedLc) return next({
            message: 'Lc not found with status "Add bid"',
            statusCode: STATUS_CODES.NOT_FOUND
        });
    }

    await createAndSendNotifications({
        lc: req.body.lc,
        type: NOTIFICATION_TYPES.BID_CREATED,
        sender: req.user._id
    });

    emitSocketEvent(
        req,
        lc.createdBy.toString(),
        SOCKET_EVENTS.BID_CREATED,
        bid
    );

    generateResponse(bid, 'Bids created successfully', res);
})

export const deleteBid = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bid = await findBid({ _id: req.params.id });

    if (!bid) return next({
        message: 'Bid not found',
        statusCode: STATUS_CODES.NOT_FOUND
    })
    bid.isDeleted = true;
    await bid.save();
    generateResponse(bid, 'Bids deleted successfully', res);
})

export const acceptOrRejectBids = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const key = req.query.key ? req.query.key : 'lc';
    const status = req.query.status as string;

    if (!req.query.status || (req.query.status !== 'Accepted' && req.query.status !== 'Rejected')) return next({
        message: 'status should be either Accepted or Rejected',
        statusCode: STATUS_CODES.BAD_REQUEST
    })

    const bid: any = await findBid({ _id: req.body.id });
    if (!bid) return next({
        message: 'bid not found',
        statusCode: STATUS_CODES.NOT_FOUND
    })

    // Update the bid object
    bid.status = status;
    if (Array.isArray(req.body.bids) && req.body.bids.length > 0) bid.bids = req.body.bids;
    await bid.save();

    let notification = {
        type: key === 'lc' ? NOTIFICATION_TYPES.BID_REJECTED : NOTIFICATION_TYPES.RISK_REJECTED,
        sender: req.user._id,
        bid: bid._id,
        lc: bid.lc,
    }

    if (status === 'Accepted') {
        notification.type = NOTIFICATION_TYPES.BID_ACCEPTED;

        if (key === 'lc') {
            await updateBids(
                { $and: [{ _id: { $ne: bid._id } }, { lc: bid.lc }] },
                { status: 'Rejected' }
            );

            const lc = await findLc({ _id: bid.lc }).select('status');
            lc.status = 'Accepted';
            await lc.save();
        } else {
            notification.type = NOTIFICATION_TYPES.RISK_ACCEPTED;

            await updateBids({
                $and: [
                    { _id: { $ne: bid._id } },
                    { risk: bid.risk }
                ]
            }, { status: 'Rejected' });

            const risk = await findRisk({ _id: bid.risk }).select('status');
            if (risk) {
                risk.status = 'Accepted';
                await risk.save();
            }
        }
    }

    console.log('notification in acceptOrRejectBids >>>>>>>> ', notification);

    generateResponse(bid, 'Bids status Updated', res);

    await createAndSendNotifications(notification);
});

export const findBidsCount = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const businessId = req.user.business;

    const data = await BidsStatusCount(businessId);
    generateResponse(data, 'Bids count fetched successfully', res);
})

export const fetchbid = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const data = await findBid({ _id: id }).lean();
    generateResponse(data, 'Bid fetched successfully', res);
})

export const approvedOrRejectBidsByBankAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { bidId } = req.params;
    const { status } = req.body;

    const bid = await findBid({ _id: bidId, approvalStatus: 'Pending' });
    if (!bid) return next({
        message: 'Bid not found',
        statusCode: STATUS_CODES.NOT_FOUND
    });

    bid.approvalStatus = status;
    await bid.save();


    await updateLc({ _id: bid.lc, status: 'Add bid' }, { $addToSet: { bids: bidId } });
    generateResponse(bid, 'Bids created successfully', res);
})
