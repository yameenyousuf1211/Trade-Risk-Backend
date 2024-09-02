import { NextFunction, Request, Response } from "express";
import { asyncHandler, generateResponse, parseBody } from "../../utils/helpers";
import { createRisk, fetchRisks, findRisk, getAllUsers, riskCount, updateRisk } from "../../models";
import mongoose, { PipelineStage } from "mongoose";
import { ValidationResult } from "joi";
import { riskValidator } from "../../validation/risk/risk.validation";
import { CustomError } from "../../middlewares/validation.middleware";
import { STATUS_CODES } from "../../utils/constants";

export const getRisks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const draft = req.query.draft == 'true' ? true : false;
    const risk = req.query.risk;
    const createdBy = req.query.createdBy == 'true' ? true : false;
    const filter = req.query.filter;
    const search = req.query.search

    const query: PipelineStage[] = [];

    query.push({ $match: { isDeleted: false } });

    if (risk) query.push({ $match: { _id: new mongoose.Types.ObjectId(risk as string) } })
    if (createdBy) {
        query.push({ $match: { createdBy: new mongoose.Types.ObjectId(req.user._id as string) } });
    }
    else {
        query.push({ $match: { createdBy: { $ne: new mongoose.Types.ObjectId(req.user._id as string) } } });
    }

    query.push({
        $match: {
            draft
        }
    })
    if (search) {
        const isNumeric = !isNaN(Number(search));
        if (isNumeric) {
            query.push({ $match: { refId: Number(search) } });
        } else {
            const userQuery = { swiftCode: { $regex: search, $options: 'i' } };

            const { data: users } = await getAllUsers({
                query: userQuery,
            });

            const ids = users.map((user: any) => user._id);

            query.push({
                $match: {
                    createdBy: { $in: ids }
                }
            });
        }
    }
    query.push({
        $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'userCreatedRisk'
        }
    });

    query.push({
        $unwind: {
            path: '$userCreatedRisk',
            preserveNullAndEmptyArrays: true
        }
    });
    query.push({
        $lookup: {
            from: 'bids',
            localField: '_id',
            foreignField: 'risk',
            as: 'bids'
        }
    });
    query.push({
        $addFields: {
            bidsCount: { $size: "$bids" }
        }
    });

    query.push({
        $unwind: {
            path: '$bids',
            preserveNullAndEmptyArrays: true
        }
    });
    query.push({
        $lookup: {
            from: 'users',
            localField: 'bids.bidBy',
            foreignField: '_id',
            as: 'bidUserInfo'
        }
    });

    query.push({
        $unwind: {
            path: '$bidUserInfo',
            preserveNullAndEmptyArrays: true
        }
    });

    query.push({
        $group: {
            _id: '$_id',
            swiftCode: { $first: '$swiftCode' },
            country: { $first: '$country' },
            issuingBank: { $first: '$issuingBank' },
            exporterInfo: { $first: '$exporterInfo' },
            confirmingBank: { $first: '$confirmingBank' },
            advisingBank: { $first: '$advisingBank' },
            bidsCount: { $first: '$bidsCount' },
            refId: { $first: '$refId' },
            transaction: { $first: '$transaction' },
            riskParticipation: { $first: '$riskParticipation' },
            outrightSales: { $first: '$outrightSales' },
            riskParticipationTransaction: { $first: '$riskParticipationTransaction' },
            isLcDiscounting: { $first: '$isLcDiscounting' },
            expectedDiscounting: { $first: '$expectedDiscounting' },
            expectedDateDiscounting: { $first: '$expectedDateDiscounting' },
            expectedDateConfirmation: { $first: '$expectedDateConfirmation' },
            expiryDate: { $first: '$expiryDate' },
            startDate: { $first: '$startDate' },
            paymentTerms: { $first: '$paymentTerms' },
            bids: {
                $push: {
                    _id: '$bids._id',
                    validity: '$bids.bidValidity',
                    bidBy: '$bids.bidBy',
                    amount: '$bids.confirmationPrice',
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
            createdBy: {
                $first: {
                    _id: '$userCreatedRisk._id',
                    name: '$userCreatedRisk.name',
                    firstname: '$userCreatedRisk.firstname',
                    lastname: '$userCreatedRisk.lastname',
                    email: '$userCreatedRisk.email',
                    swiftCode: '$userCreatedRisk.swiftCode',
                    country: '$userCreatedRisk.accountCountry',
                }
            },
            createdAt: { $first: '$createdAt' },
            updatedAt: { $first: '$updatedAt' },

        }
    });

    query.push({
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
    query.push({ $sort: { createdAt: -1 } });


    const data = await fetchRisks({ limit, page, query });
    generateResponse(data, "Risk fetched successfully", res);
});

export const createRisks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const draft = req.body.draft == 'true' ? true : false
    const body = parseBody(req.body);

    if (!draft) {
        const { error }: ValidationResult = riskValidator.validate(body);
        if (error) {
            const customError: CustomError = {
                statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY!,
                message: error.details[0].message.replace(/"/g, ''),
            };
            return next(customError);
        }
    }
    const countRisks = await riskCount();
    req.body.refId = countRisks + 1;
    req.body.createdBy = req.user._id;
    req.body.draft = draft;

    const risk = await createRisk(body);
    generateResponse(risk, "Risk created successfully", res);
});

export const riskUpdate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const draft = req.body.draft == 'true' ? true : false

    if (!draft) {
        const { error }: ValidationResult = riskValidator.validate(req.body);
        if (error) {
            const customError: CustomError = {
                statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY!,
                message: error.details[0].message.replace(/"/g, ''),
            };
            return next(customError);
        }
    }
    req.body.draft = draft;
    req.body.createdBy = req.user._id;

    const data = await updateRisk({ _id: req.params.id }, req.body);

    generateResponse(data, "Risk updated successfully", res);
});

export const deleteRisks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const data = await updateRisk({ _id: req.params.id }, { isDeleted: true });
    generateResponse(data, "Risk deleted successfully", res);
});

export const findSingleRisk = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const data = await findRisk({ _id: req.params.id });

    if (!data) {
        return next({
            statusCode: STATUS_CODES.NOT_FOUND,
            message: "Risk not found"
        })
    }
    generateResponse(data, "Risk fetched successfully", res);
});