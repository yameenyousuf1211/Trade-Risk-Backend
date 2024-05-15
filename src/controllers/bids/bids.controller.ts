import { NextFunction, Request, Response } from "express";
import { asyncHandler, generateResponse } from "../../utils/helpers";
import {  BidsStatusCount, createBid, fetchBids, findBid, findBids, findLc, IBid, updateBid } from "../../models";
import { STATUS_CODES } from "../../utils/constants";

import mongoose, { PipelineStage } from "mongoose";

export const getAllBids = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const page: number = +(req.query.page || 1);
    const limit = +(req.query.limit || 10);
    const lc = req.query.lc || '';
    const bidBy = req.query.bidBy === 'true' ? req.user._id : null;
    const search = req.query.search || ''; 
    const filter = req.query.filter || '';
    const lcOwner = req.query.lcOwner || '';

    let pipeline: PipelineStage[] = [{ $match: { isDeleted: false } }];

    if (lc) {
        pipeline.push({ $match: { lc: new mongoose.Types.ObjectId(lc as string), status: 'Pending' } });
    }

    if (bidBy) {
        pipeline.push({ $match: { bidBy:new mongoose.Types.ObjectId(bidBy as string) } });
    }

    // if (filter) {
    //     pipeline.push({ $match: { bidType: filter } });
    // }
    
    if (filter) {
        pipeline.push({ $match: { $or: [{ bidType: filter },{status:filter}]}});
    }
    // if (search) {
    //     pipeline.push({ $match: { status: search } });
    // }


    pipeline.push({
        $lookup: {
            from: 'users',
            localField: 'bidBy',
            foreignField: '_id',
            as: 'bidBy'
        }
    })
    pipeline.push({
        $lookup:{
            from:'lcs',
            localField:'lc',
            foreignField:'_id',
            as: 'lcOwner'
        }
    });

    if(lcOwner){
        pipeline.push({
            $match: { 'lcOwner.createdBy': new mongoose.Types.ObjectId(lcOwner as string) }
        })
    }

    pipeline.push({
        $project: {
            'lcOwner': [
            {
                $arrayElemAt: ['$lcOwner.createdBy', 0]
            }
            ],
            'bidBy': [
                { $arrayElemAt: ['$bidBy.name', 0] },
                { $arrayElemAt: ['$bidBy.email', 0] },
                { $arrayElemAt: ['$bidBy.country', 0] }
            ],
            'status': 1,
            'createdAt': 1,
            'updatedAt': 1,
            'isDeleted': 1,
            'bidType': 1,
            'confirmationPrice': 1,
            'discountingPrice': 1,
            'bidValidity': 1,
        }
    });
    
 
    const fetchedBids = await fetchBids({ limit, page, query: pipeline });

    // Iterate through fetched bids
    for (const bid of fetchedBids.data) {
        if (new Date(bid.bidValidity) < new Date()) {
            bid.status = "Expired";
            await updateBid({ _id: bid._id }, { status: 'Expired' });
        }
    }

    generateResponse(fetchedBids, 'List fetched successfully', res);
});


export const createBids = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const lc= await findLc({_id: req.body.lc});

    if(!lc) return next({
        message: 'Lc not found',
        statusCode: STATUS_CODES.NOT_FOUND
    })

    // we can only bid to those lc again if they dont have a bid with status accepted
    const isbidExist = await findBid({lc: req.body.lc, status:'Accepted'}); 
    
    if(isbidExist) return next({
        message: 'Lc already accepted a bid',
        statusCode: STATUS_CODES.BAD_REQUEST
    })

    lc.status = 'Pending'
    await lc.save();
    req.body.bidBy = req.user._id;
    const bid = await createBid(req.body);
    generateResponse(bid, 'Bids created successfully', res);
})

export const deleteBid = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bid = await findBid({_id:req.params.id});

    if(!bid) return next({
        message: 'Lc not found',
        statusCode: STATUS_CODES.NOT_FOUND
    })
    bid.isDeleted= true;
    await bid.save();
    generateResponse(bid, 'Bids deleted successfully', res);
})

export const acceptOrRejectBids = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bid = await findBid({_id:req.body.id});
    if(!req.query.status) return next({
        message: 'status is required in query params',
        statusCode: STATUS_CODES.BAD_REQUEST
    })

    const status = req.query.status as string; 
    
    if(!bid) return next({
        message: 'bid not found',
        statusCode: STATUS_CODES.NOT_FOUND
    })
    bid.status = status;
    
    await bid.save();

    if(bid.status === 'Accepted'){
        const bids = await findBids({ _id: { $ne: bid._id }, lc: bid.lc });

        bids.forEach(async (bid) => {
            bid.status = 'Rejected';
            await bid.save();
        });
    }
    generateResponse(bid, 'Bids status Updated', res);
})

export const findBidsCount = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id;
    
    const data = await BidsStatusCount(userId);
    generateResponse(data, 'Bids count fetched successfully', res);
})

export const fetchbid = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const data = await findBid({_id:id});
    generateResponse(data, 'Bid fetched successfully', res);
})
