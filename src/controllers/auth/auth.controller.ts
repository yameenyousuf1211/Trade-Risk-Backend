import { Request, Response, NextFunction } from "express";
import { asyncHandler, generatePassword, generateResponse, parseBody } from "../../utils/helpers";
import {  createBanks, createUser, findUser } from "../../models";
import { ROLES, STATUS_CODES } from "../../utils/constants";
import { IBank } from "../../interface";

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
// register user
    const body = parseBody(req.body);

    const isUserExist = await findUser({ email: body?.email });

    if (isUserExist) return next({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: 'User already exist'
    })

    const banks = await createBanks(body?.currentBanks);
    req.body.password = generatePassword();

    // email password to user later

    const user = await createUser({ ...body, currentBanks: banks.map((bank: IBank) => bank._id) });

    generateResponse(user, "Register successful", res);
});

// login user
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const body = parseBody(req.body);

    let user = await findUser({ email: body?.email }).select('+password');
    if (!user) return next({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: 'Invalid email or password'
    });

    // const isMatch = await user.isPasswordCorrect(body.password);            
    
    //console.log(isMatch);
    
    if (user.password != body.password) return next({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: 'Invalid password'
    });

    const accessToken = await user.generateAccessToken();
    req.session = { accessToken };

    // remove password
    user = user.toObject();
    delete user.password;

    generateResponse({ user, accessToken }, 'Login successful', res);
});



export const currentUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
   const user = await findUser({ _id: req.user._id });
    generateResponse(user, 'User fetched successfully', res);
});

export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    req.session = null;
    generateResponse(null, 'Logout successful', res);
});

