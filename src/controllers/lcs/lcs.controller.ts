import { NextFunction, Request, Response } from "express";
import { asyncHandler, generateRefId, generateResponse } from "../../utils/helpers";
import { ROLES, STATUS_CODES } from "../../utils/constants";    
import { createLc, fetchLcs, findBid, findLc,updateLc } from "../../models";
import mongoose  from 'mongoose';
export const fetchAllLcs = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const page: number = +(req.query.page || 1);
    const limit = +(req.query.limit || 10);
    const draft = req.query.draft === 'true' ? true : false;
    const createdBy = req.query.createdBy || '';
    const filter = req.query.filter || '';
    const search = req.query.search;
    
    let pipeline: any = [
        { $match: { isDeleted: false, draft }}
    ];
    
    if (filter) pipeline.push({ $match: { lcType: filter } });
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
        $addFields: {
            bidsCount: { $size: '$bids' } 
        }
    });
    
    pipeline.push({
        $project:{
       refId:1,
       lcType:1,
       issuingBank:1,
       exporterInfo:1,
       amount:1,
       'bidsCount':1,
       lcPeriod:1,
       importerInfo:1,
       createdBy:1
        }
    })
   

    const data = await fetchLcs({ limit, page, query: pipeline });
    generateResponse({ data }, 'List fetched successfully', res);
});


export const createLcs = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const draft = req.body.isDraft === 'true' ? true : false;

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

    const id = req.user._id
    const lc = req.params.lc    
    const bid = await findBid({ $and: [{ bidBy: id }, { lc: lc }] });

    if(!bid) return generateResponse("Add bid", 'Status Fetched successfully', res);
    generateResponse(bid.status, 'Lc status fetched successfully', res);
})


export const updateLcs = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const draft = req.body.isDraft === 'true' ? true : false;

    req.body.draft = draft;

    const updatedLc = await updateLc({ _id: id }, req.body); 

    generateResponse(updatedLc, 'Lc updated successfully', res);
});