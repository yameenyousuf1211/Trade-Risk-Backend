import { NextFunction, Request, Response } from "express";
import { asyncHandler, generateResponse } from "../../utils/helpers";
import { getAllUsers } from "../../models";
import {  ROLES,STATUS_CODES,banks as bank } from "../../utils/constants";
import axios from "axios";


// get all users
export const fetchAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const page: number = +(req.query.page || 1);
    const limit = +(req.query.limit || 10);
    const query: object = { role: { $ne: ROLES.ADMIN }, isDeleted: false};

    const usersData = await getAllUsers({ query, page, limit });
    if (usersData?.data?.length === 0) {
        generateResponse(null, 'No user found', res);
        return;
    }

    generateResponse(usersData, 'List fetched successfully', res);
});

export const fetchCountries = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const data = ["Bahrain","Pakistan","Qatar","Bangladesh","Saudi","UAE"]
    generateResponse(data, 'Countries fetched successfully', res);
});

export const banks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const country = req.params.country;

    if (!country) {
        return next({
            message: 'Country is required',
            statusCode: STATUS_CODES.BAD_REQUEST
        });
    }   
 

    if (!(country in bank)) {
        return next({
            statusCode: STATUS_CODES.BAD_REQUEST,
            message: 'invalid country name'
        });
    }

    const banksList = (bank as { [key: string]: { code: string; list: string[] } })[country].list;
    generateResponse(banksList, 'Banks fetched successfully', res);
});
