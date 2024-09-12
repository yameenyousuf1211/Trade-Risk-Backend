import { NextFunction, Request, Response } from "express";
import { asyncHandler, generateResponse, getMongoId } from "../../utils/helpers";
import { BidsStatusCount, createAndSendNotifications, createBid, fetchAllBids, findBid, findLc, findRisk, updateBid, updateBids, updateLc } from "../../models";
import { NOTIFICATION_TYPES, STATUS_CODES } from "../../utils/constants";

export const getAllBids = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (!type) return next({
        message: 'type is required',
        statusCode: STATUS_CODES.BAD_REQUEST
    });

    const query = {
        bidType: type,
        bidBy: req.user.business
    }

    const populate = { path: 'lc', select: 'issuingBanks confirmingBank' };

    const fetchedBids = await fetchAllBids({ query, page, limit, populate });
    generateResponse(fetchedBids, 'List fetched successfully', res);
});

export const createBids = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.lc && !req.body.risk) return next({
        message: 'lc or risk is required',
        statusCode: STATUS_CODES.BAD_REQUEST
    });
    const role = req.user.role;
    let notification: any;

    const newBidId = getMongoId();

    if (req.body.lc) {
        const lc = await findLc({ _id: req.body.lc });
        if (!lc) return next({
            message: 'Lc not found',
            statusCode: STATUS_CODES.NOT_FOUND
        });

        notification = {
            lc: req.body.lc,
            type: NOTIFICATION_TYPES.BID_CREATED,
            sender: req.user._id
        }

        const isBidAlreadyAccepted = await findBid({ lc: req.body.lc, status: 'Accepted' });
        if (isBidAlreadyAccepted) return next({
            message: 'Lc already accepted a bid',
            statusCode: STATUS_CODES.BAD_REQUEST
        });

        if (role === 'admin') {
            const updatedLc = await updateLc({ _id: req.body.lc, status: 'Add bid' }, { $addToSet: { bids: newBidId } });
            if (!updatedLc) return next({
                message: 'Lc not found',
                statusCode: STATUS_CODES.NOT_FOUND
            });
        }
    } else {
        const risk = await findRisk({ _id: req.body.risk });
        if (!risk) return next({
            message: 'Risk not found',
            statusCode: STATUS_CODES.NOT_FOUND
        })

        notification = {
            risk: req.body.risk,
            type: NOTIFICATION_TYPES.RISK_CREATED,
            sender: req.user._id,
        }

        const isbidExist = await findBid({ risk: req.body.risk, status: 'Accepted' });

        if (isbidExist) return next({
            message: 'Risk already accepted a bid',
            statusCode: STATUS_CODES.BAD_REQUEST
        })
        risk.status = 'Pending'
        await risk.save();
    }

    req.body.bidBy = req.user.business;
    req.body.createdBy = req.user._id;

    const approvalStatus = role === 'admin' ? 'Approved' : 'Pending';

    const bid = await createBid({ ...req.body, _id: newBidId, approvalStatus });
    generateResponse(bid, 'Bids created successfully', res);

    await createAndSendNotifications(notification);
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
