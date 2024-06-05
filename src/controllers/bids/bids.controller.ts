import { NextFunction, Request, Response } from "express";
import { asyncHandler, generateResponse } from "../../utils/helpers";
import {  BidsStatusCount, createBid, fetchBids, findBid, findBids, findLc, findRisk, IBid, updateBid } from "../../models";
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
    const riskOwner = req.query.riskOwner || '';
    const risk = req.query.risk || '';
    
    let pipeline: PipelineStage[] = [{ $match: { isDeleted: false } }];

    if (lc) {
        pipeline.push({ $match: { lc: new mongoose.Types.ObjectId(lc as string), status: 'Pending' } });
    }

    if(risk){
        pipeline.push({ $match: { risk: new mongoose.Types.ObjectId(risk as string) } });
    }

    if (bidBy) {
        pipeline.push({ $match: { bidBy:new mongoose.Types.ObjectId(bidBy as string) } });
    }

    if (filter) {
        pipeline.push({ $match: { $or: [{ bidType: filter },{status:filter}]}});
    }
  
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
            as: 'lcInfo'
        }
    });

    pipeline.push({
        $lookup:{
            from:'risks',
            localField:'risk',
            foreignField:'_id',
            as: 'risk'
        }
    });
    
    if(lcOwner){
        pipeline.push({
            $match: { 'lcInfo.createdBy': new mongoose.Types.ObjectId(lcOwner as string) }
        })
    }

    if(riskOwner){
        pipeline.push({
            $match: { 'risk.createdBy': new mongoose.Types.ObjectId(riskOwner as string) }
        })
    }
    
    pipeline.push({
        $project: {
            'lcInfo': [
                {
                    $arrayElemAt: ['$lcInfo.createdBy', 0 ]
                },
                {
                    $arrayElemAt: ['$lcInfo.issuingBank', 0]
                },
                {
                    $arrayElemAt: ['$lcInfo.confirmingBank', 0]
                }
            ],
            'lc': '$lcInfo._id',
            'bidBy': [
                { $arrayElemAt: ['$bidBy.name', 0] },
                { $arrayElemAt: ['$bidBy.email', 0] },
                { $arrayElemAt: ['$bidBy.accountCountry', 0] },
            ],
            'status': 1,
            'createdAt': 1,
            'updatedAt': 1,
            'isDeleted': 1,
            'bidType': 1,
            "risk":[
                {
                    $arrayElemAt: ['$risk._id', 0]
                },
                {
                    $arrayElemAt: ['$risk.riskParticipationTransaction', 0]
                },
                {
                    $arrayElemAt: ['$risk.issuingBank', 0]
                },
                {
                    $arrayElemAt: ['$risk.advisingBank', 0]
                },
                {
                    $arrayElemAt: ['$risk.exporterInfo', 0]
                },
                {
                    $arrayElemAt: ['$risk.createdBy', 0]
                }
            ],
            discountBaseRate:1,
            discountMargin:1,
            'confirmationPrice': 1,
            'discountingPrice': 1,
            'bidValidity': 1,
        }
    });
    
    pipeline.push({
        $sort: { createdAt: -1 }
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

    if(!req.body.lc && !req.body.risk) return next({
        message: 'lc or risk is required',
        statusCode: STATUS_CODES.BAD_REQUEST
    })

    if(req.body.lc){
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
    
    } else{
        const risk = await findRisk({_id: req.body.risk});
        if(!risk) return next({
            message: 'Risk not found',
            statusCode: STATUS_CODES.NOT_FOUND
        })

        const isbidExist = await findBid({risk: req.body.risk, status:'Accepted'});

        if(isbidExist) return next({
            message: 'Risk already accepted a bid',
            statusCode: STATUS_CODES.BAD_REQUEST
        })
        risk.status = 'Pending'
        await risk.save();
    }
    req.body.bidBy = req.user._id;
    const bid = await createBid(req.body);
    generateResponse(bid, 'Bids created successfully', res);
})

export const deleteBid = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bid = await findBid({_id:req.params.id});

    if(!bid) return next({
        message: 'Bid not found',
        statusCode: STATUS_CODES.NOT_FOUND
    })
    bid.isDeleted= true;
    await bid.save();
    generateResponse(bid, 'Bids deleted successfully', res);
})

export const acceptOrRejectBids = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const bid = await findBid({_id:req.body.id});
    const key = req.query.key ? req.query.key : 'lc';
    const status = req.query.status as string; 

    if(!req.query.status) return next({
        message: 'status is required in query params',
        statusCode: STATUS_CODES.BAD_REQUEST
    })

    if(!bid) return next({
        message: 'bid not found',
        statusCode: STATUS_CODES.NOT_FOUND
    })

    bid.status = status;
    await bid.save();

    if(bid.status === 'Accepted'){
        if(key === 'lc'){
        const bids = await findBids({ _id: { $ne: bid._id }, lc: bid.lc });

        bids.forEach(async (bid) => {
            bid.status = 'Rejected';
            await bid.save();
        });

        const lc = await findLc({_id: bid.lc});
        lc.status = 'Accepted';
        await lc.save();
    }else{
        const bids = await findBids({ _id: { $ne: bid._id }, risk: bid.risk });

        bids.forEach(async (bid) => {
            bid.status = 'Rejected';
            await bid.save();
        });
    
        const risk = await findRisk({_id: bid.risk});
    
        if (risk) {
            risk.status = 'Accepted';
            await risk.save();
        }
    }
    
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

