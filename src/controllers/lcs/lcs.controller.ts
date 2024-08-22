import { NextFunction, Request, Response } from "express";
import {
  asyncHandler,
  generateResponse,
} from "../../utils/helpers";
import { STATUS_CODES } from "../../utils/constants";
import { aggregateFetchLcs, createLc, deleteLc, fetchLcs, findBid, findLc, lcsCount, updateLc } from "../../models";
import mongoose from "mongoose";
import { ValidationResult } from "joi";
import { lcsValidator } from "../../validation/lcs/lcs.validation";
import { CustomError } from "../../middlewares/validation.middleware";
import { lgValidator } from "../../validation/lcs/lg.validation";
import { createAndSendNotifications } from "../../utils/firebase.notification&Storage";

export const fetchAllLcs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = +(req.query.page || 1);
    const limit = +(req.query.limit || 10);

    const filters: any[] = [];
    if (req.query.draft) {
      filters.push({ draft: true });
    }
    else{
      filters.push({ draft: false });
    }
    if (req.query.type) filters.push({ type: req.query.type });
    if (req.query.refId) filters.push({ refId: req.query.refId });
    if (req.query.createdBy) filters.push({ createdBy: req.query.createdBy });

    const query = filters.length > 0 ? { $and: filters } : {};
    const populate = {
      path: "bids",
      populate: { 'path': 'bidBy' }
    };

    const data = await fetchLcs({ limit, page, query, populate });
    generateResponse(data, "List fetched successfully", res);
  });

export const createLcOrLg = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  
  if (!req.body.type) return next({
    statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
    message: "Type is required",
  });

  const isLc = req.body.type.toLowerCase().includes("lc");
  const lcOrLgValidation = isLc ? lcsValidator : lgValidator;

  if (!req.body.draft) {
    const { error }: ValidationResult = lcOrLgValidation.validate(req.body);
    if (error) return next({
      statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
      message: error.details[0].message,
    });
  }

  const countLcs = await lcsCount();
  req.body.refId = countLcs + 1;
  
  req.body.createdBy = req.user.business;

  const lcs = await createLc(req.body);
    const notification={
      users:null,title:`New ${req.body.type} Confirmation Request Created with`,
      message:`Ref no ${lcs.refId} from ${req.user.name}`,
      requestId:lcs._id,senderId:req.user._id,receiverId:null
    }
  await createAndSendNotifications(notification,true,req.user.type)
  generateResponse(lcs, "Lcs created successfully", res);
});

export const deleteLcs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
   const lc = await deleteLc(req.params.id);
    
   if(!lc) return next({
      message: "Lc not found",
      statusCode: STATUS_CODES.NOT_FOUND,
    });

    generateResponse(null, "Lc deleted successfully", res);
  }
);

export const fetchLc = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { lcId } = req.params;

  const lc = await findLc({ _id: lcId }).populate({
    path: "bids",
    populate: { 'path': 'bidBy' }
  });

  if (!lc) return next({
    message: "Lc not found",
    statusCode: STATUS_CODES.NOT_FOUND,
  });

  generateResponse(lc, "Lc fetched successfully", res);
});

export const statusCheck = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user.business;
    
    const requestId = req.params.requestId;
    const key = req.query.key ? req.query.key : "lc";

    let bid;

    if (key == "lc") {
      bid = await findBid({ $and: [{ bidBy: id }, { lc: requestId }] }).sort({
        createdAt: -1,
      });
    } else {
      bid = await findBid({ $and: [{ bidBy: id }, { risk: requestId }] }).sort({
        createdAt: -1,
      });
    }
    if (!bid)
      return generateResponse("Add bid", "Status Fetched successfully", res);

    generateResponse(bid.status, "LC status fetched successfully", res);
  }
);

export const updateLcs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const draft = req.body.draft === "true" ? true : false;

    if (!draft) {
      const { error }: ValidationResult = lcsValidator.validate(req.body);
      if (error) {
        const customError: CustomError = {
          statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
          message: error.details[0].message.replace(/"/g, ""),
        };
        return next(customError);
      }
    }

    req.body.draft = draft;

    const updatedLc = await updateLc({ _id: id }, req.body);

    generateResponse(updatedLc, "Lc updated successfully", res);
  }
);

export const updateLg = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const draft =
      req.body.draft === "true" || req.body.draft === true ? true : false;

    if (!draft) {
      const { error }: ValidationResult = lgValidator.validate(req.body);
      if (error) {
        const customError: CustomError = {
          statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
          message: error.details[0].message.replace(/"/g, ""),
        };
        return next(customError);
      }
    }

    req.body.draft = draft;

    const updatedLc = await updateLc({ _id: id }, req.body);

    generateResponse(updatedLc, "Lc updated successfully", res);
  }
);

export const totalRequestLc = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const pipeline: any = [
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.user.business as string),
        },
      },
      {
        $lookup: {
          from: "bids",
          localField: "_id",
          foreignField: "lc",
          as: "bids",
        },
      },
      {
        // Flatten the bids array so each bid becomes a separate document
        $unwind: {
          path: "$bids",
          preserveNullAndEmptyArrays: true // This keeps documents with no bids
        },
      },
      {
        $group: {
          _id: "$bids.status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
    ];

    const data = await aggregateFetchLcs(pipeline);

    generateResponse(data, "Lc status count fetched successfully", res);
  }
);

