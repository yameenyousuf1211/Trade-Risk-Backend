import { NextFunction, Request, Response } from "express";
import { asyncHandler, generateResponse } from "../../utils/helpers";
import { createRisk, fetchRisks, updateRisk } from "../../models";
import mongoose, { PipelineStage } from "mongoose";

export const getRisks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const createdBy = req.query.createdBy == 'true' ? true : false;
    const filter = req.query.filter;
    
    const query:PipelineStage[] = [];
    
    if(createdBy) {
        query.push({$match: {createdBy: new mongoose.Types.ObjectId(req.user._id as string)}});
    }
    else{
        query.push({$match: {createdBy: {$ne: new mongoose.Types.ObjectId(req.user._id as string)} }});
    }
    query.push({$match: {isDeleted: false}});
    query.push({$sort: {createdAt: -1}});


    const data = await fetchRisks({limit,page,query});
    generateResponse(data,"Risk fetched successfully",res);
});

export const createRisks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const draft = req.query.draft == 'true' ? true :false
    
    req.body.createdBy = req.user._id;
    req.body.draft = draft;

    const data = await createRisk(req.body);
    generateResponse(data,"Risk created successfully",res);
});

export const riskUpdate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const draft = req.query.draft == 'true' ? true :false

    req.body.draft = draft;
    req.body.createdBy = req.user._id;

    const data = await updateRisk({_id:req.params.id},req.body);
    generateResponse(data,"Risk updated successfully",res);
});

export const deleteRisks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const data = await updateRisk({_id:req.params.id},{isDeleted:true});
    generateResponse(data,"Risk deleted successfully",res);
});

