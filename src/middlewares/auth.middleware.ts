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

            if (!decoded) return next({
                statusCode: STATUS_CODES.UNAUTHORIZED,
                message: 'Invalid token!'
            });

            // const decodedUser = decoded as any;
            req.user = { ...decoded };
            console.log('first >>>>>>>>', req.user);


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


            // findUser({ _id: decodedUser._id })
            //     .then(user => {
            //         if (!user) return next({
            //             statusCode: STATUS_CODES.UNAUTHORIZED,
            //             message: 'Invalid token user not found!'
            //         });

            //         console.log('token is working >>>>>>>>',)
            //         console.log('roles >>>>>>>>', roles)
            //         console.log('types >>>>>>>>', types)

            //         if (roles.includes(decodedUser.role) && types.includes(decodedUser.type)) {
            //             req.user = { ...decodedUser };
            //             next();
            //         } else return next({
            //             statusCode: STATUS_CODES.UNAUTHORIZED,
            //             message: 'Unauthorized access!'
            //         });
            //     }).catch(err => {
            //         return next({
            //             statusCode: STATUS_CODES.UNAUTHORIZED,
            //             message: 'Invalid token catch error!'
            //         });
            //     });
        });
    }
}

export default authMiddleware;