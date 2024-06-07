import { NextFunction, Request, Response } from "express";
import { asyncHandler, generateRefId, generateResponse } from "../../utils/helpers";
import {  STATUS_CODES } from "../../utils/constants";    
import { createLc, fetchLcs, findBid, findLc,updateLc } from "../../models";
import mongoose  from 'mongoose';
import { ValidationResult, Schema } from 'joi'; 
import { lcsValidator } from "../../validation/lcs/lcs.validation";
import { CustomError } from "../../middlewares/validation.middleware";

export const fetchAllLcs = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const page: number = +(req.query.page || 1);
    const limit = +(req.query.limit || 10);
    const draft = req.query.draft === 'true' ? true : false;
    const createdBy = req.query.createdBy || '';
    const filter = req.query.filter || '';
    const search = req.query.search;
    const status = req.query.status;

    let pipeline: any = [
        { $match: { isDeleted: false, draft }}
    ];

    if(status) pipeline.push({ $match: { status } })
    if (filter) pipeline.push({ $match: { type: filter } });
    if (search) pipeline.push({ $match: { refId: Number(search) } });
    
    if (createdBy) {
        pipeline.push({ $match: { createdBy: new mongoose.Types.ObjectId(createdBy as string) } });
    }
    pipeline.push({
        $lookup: {
            from: 'bids',
            localField: '_id',
            foreignField: 'lc',
            as: 'bids'
        }
    });
    
    pipeline.push({
        $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'createdBy'
        }
    });

    pipeline.push({
        $addFields: {
            bidsCount: { $size: "$bids" }
        }
    });
    

    // Unwind the bids array to process each bid individually
    pipeline.push({
        $unwind: {
            path: '$bids',
            preserveNullAndEmptyArrays: true
        }
    });
    
    pipeline.push({
        $lookup: {
            from: 'users',
            localField: 'bids.bidBy',
            foreignField: '_id',
            as: 'bidUserInfo'
        }
    });
    
    pipeline.push({
        $unwind: {
            path: '$bidUserInfo',
            preserveNullAndEmptyArrays: true
        }
    });
    
    pipeline.push({
        $group: {
            _id: '$_id',
            refId: { $first: '$refId' },
            type: { $first: '$type' },
            issuingBank: { $first: '$issuingBank' },
            currency: { $first: '$currency' },
            exporterInfo: { $first: '$exporterInfo' },
            confirmingBank: { $first: '$confirmingBank' },
            advisingBank: { $first: '$advisingBank' },
            amount: { $first: '$amount' },
            bidsCount: { $first: '$bidsCount' },
            period: { $first: '$period' },
            baseRate:{ $first: '$baseRate' },
            bids: { 
                $push: {
                    _id: '$bids._id',
                    validity:'$bids.bidValidity', 
                    bidBy: '$bids.bidBy',
                    amount: '$bids.confirmationPrice',
                    discountMargin:'$bids.discountMargin',
                    discountBaseRate:'$bids.discountBaseRate',
                    createdAt: '$bids.createdAt',
                    status: '$bids.status',
                    userInfo: {
                        name: '$bidUserInfo.name',
                        email: '$bidUserInfo.email',
                        _id: '$bidUserInfo._id',
                        country: '$bidUserInfo.accountCountry'
                    }
                }
            },
            importerInfo: { $first: '$importerInfo' },
            status: { $first: '$status' },
            createdBy: { $first: '$createdBy' },
            createdAt: { $first: '$createdAt' },
            updatedAt: { $first: '$updatedAt' },
            
        }
    });

    pipeline.push({
        $addFields: {
            bids: {
                $cond: {
                    if: { $eq: ['$bidsCount', 0] },
                    then: [],
                    else: '$bids'
                }
            }
        }
    });
    
    // Project the final desired structure
    pipeline.push({
        $project: {
            refId: 1,
            type: 1,
            issuingBank: 1,
            currency: 1,
            exporterInfo: 1,
            confirmingBank: 1,
            advisingBank: 1,
            amount: 1,
            bidsCount: 1,
            period: 1,
            bids: 1,
            baseRate:1,
            importerInfo: 1,
            status: 1,
            'createdBy.name':1,
            'createdBy.accountCountry':1,
            createdAt: 1,
            updatedAt: 1
        }
        })

    pipeline.push({
        $sort:{
            createdAt:-1
        }
    });

    const data = await fetchLcs({ limit, page, query: pipeline });

    if (data) {
        data.data.forEach(async (lc) => {
            const endDate = new Date(lc.period?.endDate!);
            const today = new Date();
    
            if (endDate < today) {
                await updateLc({ _id: lc._id }, { status: 'Expired' });
            }
        });
    }

    const updatedData = await fetchLcs({ limit, page, query: pipeline });

    generateResponse({ updatedData }, 'List fetched successfully', res);
});




export const createLcs = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const draft = req.body.draft === 'true' ? true : false;

    console.log(draft);
    
    if(!draft) {
        const { error }: ValidationResult = lcsValidator.validate(req.body);
        if (error) {
            const customError: CustomError = {
                statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
                message: error.details[0].message.replace(/"/g, ''),
            };
            return next(customError);
        }
    }
  
    req.body.draft = draft;
    req.body.refId = generateRefId();
    req.body.createdBy = req.user._id;

    const lcs = await createLc(req.body);

    generateResponse(lcs, 'Lcs created successfully', res);
}); 
    
export const deleteLc = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const lc = await findLc({_id:req.params.id});

    if(!lc) return next({
        message: 'Lc not found',
        statusCode: STATUS_CODES.NOT_FOUND
    })

    lc.isDeleted= true;
    await lc.save();
    generateResponse(null, 'Lc deleted successfully', res);
})

export const findLcs = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const lc = await findLc({_id:id});

    if(!lc) return next({
        message: 'Lc not found',
        statusCode: STATUS_CODES.NOT_FOUND
    })

    generateResponse(lc, 'Lc fetched successfully', res);
})

export const statusCheck = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user._id;
    const requestId = req.params.requestId;
    const key = req.query.key ? req.query.key : 'lc';
    
    console.log("testing",requestId);
    
    let bid;
    
    if(key == 'lc') {
        console.log("LC key called");
        bid = await findBid({ $and: [{ bidBy: id }, {lc:requestId }] }).sort({ createdAt: -1 });
    }
    else{
        bid = await findBid({ $and: [{ bidBy: id }, {risk:requestId }] }).sort({ createdAt: -1 });
    }
    if(!bid) return generateResponse("Add bid", 'Status Fetched successfully', res);
  
    generateResponse(bid.status, 'LC status fetched successfully', res);
  });


export const updateLcs = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const draft = req.body.draft === 'true' ? true : false;
    
    if(!draft) {
        const { error }: ValidationResult = lcsValidator.validate(req.body);
        if (error) {
            const customError: CustomError = {
                statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
                message: error.details[0].message.replace(/"/g, ''),
            };
            return next(customError);
        }
    }

    req.body.draft = draft;

    const updatedLc = await updateLc({ _id: id }, req.body); 

    generateResponse(updatedLc, 'Lc updated successfully', res);
});


export const totalRequestLc = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
   
    const pipeline: any = [
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user._id as string)
            }
        },
        {
            $match:{
                isDeleted: false
            }
        },
       
        {
            $lookup:{
                from: 'bids',
                localField: '_id',
                foreignField: 'lc',
                as: 'bids'
            }
        },
        {
            $group: {
                _id: "$_id", // Group by _id to maintain document count
                totalLCCount: { $sum: 1 },
                bidStatusCounts: { 
                    $push: {
                        $cond: {
                            if: { $ne: ["$bids.status", []] },
                            then: "$bids.status",
                            else: null
                        }
                    }
                }
            }
        },
        { $unwind: "$bidStatusCounts" },
        { $unwind: "$bidStatusCounts" },
        {
            $group: {
                _id: "$bidStatusCounts",
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                status: "$_id",
                count: 1
            }
        }
    ];
    

    const data = await fetchLcs({ query: pipeline });

    generateResponse(data, 'Lc status count fetched successfully', res);
})
