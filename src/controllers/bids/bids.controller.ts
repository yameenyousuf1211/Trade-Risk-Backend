import { NextFunction, Request, Response } from "express";
import { asyncHandler, generateResponse } from "../../utils/helpers";
import { createBid, fetchBids, findBid, findLc } from "../../models";
import { STATUS_CODES } from "../../utils/constants";

export const getAllBids = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const page: number = +(req.query.page || 1);
    const limit = +(req.query.limit || 10);
    const lc = req.query.lc || '';
    const bidBy = req.query.bidBy === 'true' ? req.user._id : null;
    // const search = req.query.search || ''; 
    
    let query:any = {isDeleted: false};
    if(lc) query = { ...query, lc,status: 'Pending'}; // if kc is provide then give all the bids that has status pending only
    if(bidBy) query = { ...query, bidBy };
    

    const data = await fetchBids({limit, page, query});
 
    generateResponse(data, 'List fetched successfully', res);
})

export const createBids = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    
    const lc= await findLc({_id: req.body.lc});

    if(!lc) return next({
        message: 'Lc not found',
        statusCode: STATUS_CODES.NOT_FOUND
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
    const status = req.body.status;

    if(!bid) return next({
        message: 'Lc not found',
        statusCode: STATUS_CODES.NOT_FOUND
    })

    bid.status = status;
    await bid.save();
    generateResponse(bid, 'Bids status Updated', res);
})

