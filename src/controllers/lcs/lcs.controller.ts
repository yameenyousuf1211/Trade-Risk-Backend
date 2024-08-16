import { NextFunction, Request, Response } from "express";
import {
  asyncHandler,
  generateRefId,
  generateResponse,
} from "../../utils/helpers";
import { STATUS_CODES } from "../../utils/constants";
import { createLc, fetchLcs, findBid, findLc, lcsCount, updateLc } from "../../models";
import mongoose from "mongoose";
import { ValidationResult, Schema } from "joi";
import { lcsValidator } from "../../validation/lcs/lcs.validation";
import { CustomError } from "../../middlewares/validation.middleware";
import { lgValidator } from "../../validation/lcs/lg.validation";
import { createAndSendNotifications } from "../../utils/notification";

export const fetchAllLcs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = +(req.query.page || 1);
    const limit = +(req.query.limit || 10);

    const filters: any[] = [];
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

export const createLcs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.draft) {
      const { error }: ValidationResult = lcsValidator.validate(req.body);
      if (error) return next({
        statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
        message: error.details[0].message,
      });
    }
    req.body.draft = draft;
    req.body.refId = generateRefId();
    req.body.createdBy = req.user._id;
    const lcs = await createLc(req.body);
     const notification={
      users:req.user._id,title:"New LC Confirmation Request",
      message:`Ref no ${lcs.refId} from ${lcs?.issuingBank?.bank}`,
      requestId:null,senderId:req.user._id,receiverId:req.user._id
    }
    await createAndSendNotifications(notification,true)
    generateResponse(lcs, "Lcs created successfully", res);
  }
);

export const createLg = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const draft = req.body.draft;

    req.body.createdBy = req.user.business;

    if (!draft) {
      const countLcs = await lcsCount({ draft: false });
      req.body.refId = countLcs + 1;

      const { error }: ValidationResult = lgValidator.validate(req.body);
      if (error) return next({
        statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
        message: error.details[0].message,
      });
    }

    const lg = await createLc(req.body);
    const notification={
      users:req.user._id,title:"New LG Confirmation Request",
      message:`Ref no ${lg.refId} from ${lg?.issuingBank?.bank}`,
      requestId:null,senderId:req.user._id,receiverId:req.user._id
    }
    await createAndSendNotifications(notification,true)
    generateResponse(lg, "Lcs created successfully", res);
  }
);

export const deleteLc = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const lc = await findLc({ _id: req.params.id });

    if (!lc)
      return next({
        message: "Lc not found",
        statusCode: STATUS_CODES.NOT_FOUND,
      });

    lc.isDeleted = true;
    await lc.save();
    generateResponse(null, "Lc deleted successfully", res);
  }
);

export const findLcs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

export const statusCheck = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user._id;
    const requestId = req.params.requestId;
    const key = req.query.key ? req.query.key : "lc";

    console.log("testing", requestId);

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
          createdBy: new mongoose.Types.ObjectId(req.user._id as string),
        },
      },
      {
        $match: {
          isDeleted: false,
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
        $group: {
          _id: "$_id", // Group by _id to maintain document count
          totalLCCount: { $sum: 1 },
          bidStatusCounts: {
            $push: {
              $cond: {
                if: { $ne: ["$bids.status", []] },
                then: "$bids.status",
                else: null,
              },
            },
          },
        },
      },
      { $unwind: "$bidStatusCounts" },
      { $unwind: "$bidStatusCounts" },
      {
        $group: {
          _id: "$bidStatusCounts",
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

    const data = await fetchLcs({ query: pipeline });

    generateResponse(data, "Lc status count fetched successfully", res);
  }
);
