import { Request, Response, NextFunction } from 'express';
import { ValidationResult, Schema } from 'joi'; 
import { STATUS_CODES } from '../utils/constants';

export interface CustomError {
    statusCode: number;
    message: string;
}

export const validateRequest = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error }: ValidationResult = schema.validate(req.body);
        if (error) {
            const customError: CustomError = {
                statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
                message: error.details[0].message.replace(/"/g, ''),
            };
            return next(customError);
        }
        next();
    };
}

export const validateParams = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error }: ValidationResult = schema.validate(req.params, { abortEarly: false });
        if (error) {
            const customError: CustomError = {
                statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
                message: error.details[0].message.replace(/"/g, ''),
            };
            return next(customError);
        }
        next();
    };
}