import { NextFunction, Request, Response } from "express";
import { asyncHandler, generateResponse, parseBody } from "../../utils/helpers";
// import { createRisk, fetchRisks, findRisk, getAllUsers, riskCount, updateRisk } from "../../models";
import mongoose, { PipelineStage } from "mongoose";
import { ValidationResult } from "joi";
import { riskValidator } from "../../validation/risk/risk.validation";
import { CustomError } from "../../middlewares/validation.middleware";
import { STATUS_CODES } from "../../utils/constants";

export const fetchAllRisks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const draft = req.query.draft == 'true' ? true : false;
    const risk = req.query.risk;
    const createdBy = req.query.createdBy == 'true' ? true : false;
    const filter = req.query.filter;
    const search = req.query.search



    // const data = await fetchRisks({ limit, page, query });
    // generateResponse(data, "Risk fetched successfully", res);
});

export const createRisk = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // const body = parseBody(req.body);

    // if (!req.body.draft) {
    //     const { error }: ValidationResult = riskValidator.validate(body);
    //     if (error) {
    //         const customError: CustomError = {
    //             statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY!,
    //             message: error.details[0].message.replace(/"/g, ''),
    //         };
    //         return next(customError);
    //     }
    // }
    // const countRisks = await riskCount();
    // req.body.refId = countRisks + 1;
    // req.body.createdBy = req.user._id;

    // const risk = await createRisk(body);
    // generateResponse(risk, "Risk created successfully", res);
});

// export const riskUpdate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     if (!req.body.draft) {
//         const { error }: ValidationResult = riskValidator.validate(req.body);
//         if (error) {
//             const customError: CustomError = {
//                 statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY!,
//                 message: error.details[0].message.replace(/"/g, ''),
//             };
//             return next(customError);
//         }
//     }
//     req.body.createdBy = req.user._id;

//     const data = await updateRisk({ _id: req.params.id }, req.body);
//     generateResponse(data, "Risk updated successfully", res);
// });

// export const deleteRisks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     const data = await updateRisk({ _id: req.params.id }, { isDeleted: true });
//     generateResponse(data, "Risk deleted successfully", res);
// });

// export const findSingleRisk = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     const data = await findRisk({ _id: req.params.id });

//     if (!data) {
//         return next({
//             statusCode: STATUS_CODES.NOT_FOUND,
//             message: "Risk not found"
//         })
//     }
//     generateResponse(data, "Risk fetched successfully", res);
// });