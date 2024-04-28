import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../utils/constants';
import { asyncHandler } from '../../utils/helpers';
import { findUser } from '../../models'; 

export const emailExist = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await findUser({ email: req.body.email });

    if (user) return next({
        statusCode: STATUS_CODES.CONFLICT,
        message: 'Email already exist'
    });
    
    next();
});