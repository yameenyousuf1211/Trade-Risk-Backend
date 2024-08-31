import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { STATUS_CODES } from '../utils/constants';
import { findUser } from '../models';

const authMiddleware = (roles: string[], types: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const accessToken = req.headers.authorization?.split(' ')[1] ?? req.session?.accessToken;

        if (!accessToken) return next({
            statusCode: STATUS_CODES.UNAUTHORIZED,
            message: 'Authorization failed!'
        });

        verify(accessToken, "secret", async (err: any, decoded: any) => {
            if (err) return next({
                statusCode: STATUS_CODES.UNAUTHORIZED,
                message: 'Invalid token!'
            });

            req.user = { ...decoded };

            const user = await findUser({ _id: req.user._id });
            if (!user) return next({
                statusCode: STATUS_CODES.UNAUTHORIZED,
                message: 'Unauthorized access!'
            });

            if (!roles.includes(req.user.role) || !types.includes(req.user.type)) return next({
                statusCode: STATUS_CODES.UNAUTHORIZED,
                message: 'Unauthorized access!'
            });

            // next middleware is called
            next();
        });
    }
}

export default authMiddleware;