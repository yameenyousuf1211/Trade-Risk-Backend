import { Request, Response, NextFunction } from "express";
import { asyncHandler, generatePassword, generateResponse, parseBody, sendEmail } from "../../utils/helpers";
import { createBanks, createUser, findUser, updateUser } from "../../models";
import { ROLES, STATUS_CODES } from "../../utils/constants";
import { IBank } from "../../interface";
import uploadOnCloudinary from "../../utils/cloundinary";
import { createBusiness } from "../../models/business/business.model";

interface FileArray {
    image: Express.Multer.File[];
}

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const body = parseBody(req.body);

    const userExist = await findUser({ email: body?.email });
    if (userExist) return next({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: 'User already exist'
    });

    req.body.password = generatePassword(); // password will be generate and send to user via email later he can change

    const business = await createBusiness(body?.businessData);
    if (!business) return next({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: 'Business not created'
    });

    const { name, email, role, type, password, fcmTokens } = body;
    const user = await createUser({ name, email, role, type, password, business: business._id, fcmTokens });
    generateResponse(user, "Register successful", res);
});

// login user
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const body = parseBody(req.body);

    let user = await findUser({ email: body?.email }).populate('business').select('+password');
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
    if (body.fcmToken) {
        user = await updateUser(user._id, { $addToSet: { fcmTokens: body.fcmToken } });
    }
    // remove password
    user = user.toObject();
    delete user.password;

    generateResponse({ user, accessToken }, 'Login successful', res);
});


export const currentUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await findUser({ _id: req.user._id }).populate('business').select('+password');
    generateResponse(user, 'User fetched successfully', res);
});

export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    req.session = null;
    generateResponse(null, 'Logout successful', res);
});

