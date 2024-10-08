import { NextFunction, Request, Response } from "express";
import { asyncHandler, generateResponse } from "../../utils/helpers";
import { createBank, findBank, getAllUsers, updateUser } from "../../models";
import { ROLES, STATUS_CODES, banks as bank } from "../../utils/constants";
import { updateBusiness } from "../../models/business/business.model";

// get all users
export const fetchAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const page: number = +(req.query.page || 1);
    const limit: number = +(req.query.limit || 10);
    const query: object = { role: { $ne: ROLES.ADMIN } };

    const usersData = await getAllUsers({ query, page, limit });

    if (usersData?.data?.length === 0) {
        generateResponse(null, 'No user found', res);
        return;
    }

    generateResponse(usersData, 'List fetched successfully', res);
});

export const updateUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user._id;
    const user = await updateUser(id, req.body);
    generateResponse(user, 'User updated successfully', res);
});

export const updateBusinessCurrentBanks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;

    const business = await updateBusiness({ _id: req.user.business }, { $set: { currentBanks: body } });

    if (!business) return next({
        message: 'Business not found',
        statusCode: STATUS_CODES.NOT_FOUND
    });

    generateResponse(business, 'Business updated successfully', res);
});

export const updateUserBank = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const currentBanks = req.body;

    const user = await updateBusiness({ _id: req.user.business }, { $set: { currentBanks } });
    if (!user) return next({
        message: 'User not found',
        statusCode: STATUS_CODES.NOT_FOUND
    });

    generateResponse(user, 'Banks updated successfully', res);
});