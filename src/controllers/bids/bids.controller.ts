import { NextFunction, Request, Response } from "express";
import { asyncHandler, generateResponse, getMongoId } from "../../utils/helpers";

import { BidsStatusCount, createBid, fetchAllLcsWithoutPagination, fetchBids, findBid, findLc, findRisk, updateBid, updateBids, updateLc } from "../../models";
import { STATUS_CODES } from "../../utils/constants";


import { createAndSendNotifications } from "../../utils/firebase.notification&Storage";
import mongoose from "mongoose";

export const getAllBids = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const type = req.query.type || 'LC Confirmation';
    const bidBy = req.query.bidBy === 'true' ? req.user.business : null;
    const lc = req.query.lc || '';
    const corporateBusinessId = req.query.corporateBusinessId || null;

    const pipeline: mongoose.PipelineStage[] = [];

    if (type) pipeline.push({ $match: { bidType: type } });
    if (lc) pipeline.push({ $match: { lc: new mongoose.Types.ObjectId(lc as string) } });

    if (bidBy) {
        pipeline.push({ $match: { bidBy: new mongoose.Types.ObjectId(req.user.business as string) } });
    }

    if (corporateBusinessId) {
        const lcIds = await fetchAllLcsWithoutPagination({ createdBy: corporateBusinessId }).select('_id');
        const lcIdArray = lcIds.map((lc: any) => lc._id);
        pipeline.push({ $match: { lc: { $in: lcIdArray } } });
    }

    pipeline.push({
        $lookup: {
            from: 'businesses',
            localField: 'bidBy',
            foreignField: '_id',
            as: 'bidBy',
            pipeline: [
                { $project: { name: 1, email: 1, swiftCode: 1,  pocEmail:1 } }
            ]
        },
    });

    pipeline.push({
        $unwind: {
            path: '$bidBy',
            preserveNullAndEmptyArrays: true,
        },
    });

    pipeline.push({
        $lookup: {
            from: 'lcs',
            localField: 'lc',
            foreignField: '_id',
            as: 'lc',
            pipeline: [
                { $project: { amount: 1, refId: 1, issuingBanks: 1, confirmingBank:1,createdBy:1,status:1 } }
            ]
        },
    });

    pipeline.push({
        $unwind: {
            path: '$lc',
            preserveNullAndEmptyArrays: true,
        },
    });

    pipeline.push({
        $group: {
            _id: '$_id',
            bidType: { $first: '$bidType' },
            confirmationPrice: { $first: '$confirmationPrice' },
            perAnnum: { $first: '$perAnnum' },
            bids: { $first: '$bids' },
            bidValidity: { $first: '$bidValidity' },
            approvalStatus: { $first: '$approvalStatus' },
            status: { $first: '$status' },
            bidBy: { $first: '$bidBy' },
            lc: { $first: '$lc' },
            createdBy: { $first: '$createdBy' },
            createdAt: { $first: '$createdAt' },
            updatedAt: { $first: '$updatedAt' },
        },
    });

    pipeline.push({ $sort: { createdAt: -1 } });

    const fetchedBids = await fetchBids({ query: pipeline, page, limit });

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
            users: lc.createdBy,
            title: `${req.user.name}`,
            message: ` has added a bid on your LC refId ${lc.refId}`,
            requestId: lc._id, senderId: req.user._id, receiverId: lc.createdBy
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
            users: risk.createdBy,
            title: `${req.user.name}`,
            message: ` has added a bid on your RISK ${risk.transaction}`,
            requestId: null, senderId: req.user._id, receiverId: risk.createdBy
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
    await createAndSendNotifications(notification, false, 'corporate');
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

    if (!req.query.status) return next({
        message: 'status is required in query params',
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

    if (bid.status === 'Accepted') {
        if (key === 'lc') {
            await updateBids(
                { $and: [{ _id: { $ne: bid._id } }, { lc: bid.lc }] },
                {
                    status: 'Rejected',
                    bids: req.body.bids
                });

            const lc = await findLc({ _id: bid.lc }).select('status');
            lc.status = 'Accepted';
            await lc.save();
        } else {
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

    generateResponse(bid, 'Bids status Updated', res);
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
