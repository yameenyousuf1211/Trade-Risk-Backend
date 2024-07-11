import { NextFunction, Request, Response } from "express";
import { asyncHandler, generateResponse } from "../../utils/helpers";
import { createBank, findBank, getAllUsers, updateUser } from "../../models";
import {  ROLES,STATUS_CODES,banks as bank } from "../../utils/constants";

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

export const updateUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user._id;
    const user = await updateUser(id, req.body);
    generateResponse(user, 'User updated successfully', res);
});

export const updateUserBank = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user._id;
    const { action, bankId,name,country,city} = req.body;

    if (action === 'add') {
        const bank = await createBank({ name,country,city });

        if (!bank) {
            return next({
                message: 'Bank not created',
                statusCode: STATUS_CODES.BAD_REQUEST
            });
        }

        const user = await updateUser(id, { $push: { currentBanks: bank._id } });

        if (!user) {
            return next({
                message: 'User not found',
                statusCode: STATUS_CODES.NOT_FOUND
            });
        }

        generateResponse(user, 'Bank added and user updated successfully', res);
    }  else if (action === 'remove') {
        if (!bankId) {
            return next({
                message: 'Bank ID is required to remove a bank',
                statusCode: STATUS_CODES.BAD_REQUEST
            });
        }

        const user = await updateUser(id, { $pull: { currentBanks: bankId } });

        if (!user) {
            return next({
                message: 'User not found',
                statusCode: STATUS_CODES.NOT_FOUND
            });
        }

        const bank = await findBank({ _id: bankId });
        bank.isDeleted = true;
        await bank.save();

        generateResponse(user, 'Bank removed and user updated successfully', res);
    } else {
        return next({
            message: 'Invalid action',
            statusCode: STATUS_CODES.BAD_REQUEST
        });
    }
});
