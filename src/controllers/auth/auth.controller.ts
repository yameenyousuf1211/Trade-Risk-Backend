import { Request, Response, NextFunction } from "express";
import { asyncHandler, generatePassword, generateResponse, parseBody, sendEmail } from "../../utils/helpers";
import {  createBanks, createUser, findUser, updateUser } from "../../models";
import { ROLES, STATUS_CODES } from "../../utils/constants";
import { IBank } from "../../interface";
import uploadOnCloudinary from "../../utils/cloundinary";

interface FileArray {
    image: Express.Multer.File[];
  }

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
// register user
    const body = parseBody(req.body);

        const isUserExist = await findUser({ email: body?.email });

        if (isUserExist) return next({
            statusCode: STATUS_CODES.BAD_REQUEST,
            message: 'User already exist'
        });

     
        const banks = await createBanks(body?.currentBanks);
        req.body.password = generatePassword(); // password will be generate and send to user via email later he can change

        
        // if(!(req.files as unknown as FileArray).image){
        // return next({
        //     statusCode: STATUS_CODES.BAD_REQUEST,
        //     message: 'PDF is required'
        // });
        // }
        // const filePath = (req.files as unknown as FileArray).image[0]?.path ?? '';
        
        // req.body.authorizationPocLetter = (await uploadOnCloudinary(filePath))?.secure_url;
        
        const user = await createUser({ ...body, currentBanks: banks.map((bank: IBank) => bank._id) });
        // const email = await sendEmail({ to: 'aliusaid55@gmail.com', subject: 'Welcome to our platform', html: `Your password is ${req.body.password}` });
        // console.log(email);
        
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
    if (body.fcmToken) {
            user=await updateUser(user._id, { $addToSet: { fcmTokens: body.fcmToken } });
    }
    // remove password
    user = user.toObject();
    delete user.password;

    generateResponse({ user, accessToken }, 'Login successful', res);
});



export const currentUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
   const user = await findUser({ _id: req.user._id }).populate('currentBanks').select('+password');
    generateResponse(user, 'User fetched successfully', res);
});

export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    req.session = null;
    generateResponse(null, 'Logout successful', res);
});

