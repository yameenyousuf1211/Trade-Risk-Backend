import { Error as MongooseError } from "mongoose";
import { Request, Response, NextFunction } from "express";

export function notFound(req: Request, res: Response, next: NextFunction) {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

class ApiError extends Error {
    public statusCode: number;
    public message: string;
    public errors: any[];

    constructor(
        statusCode: number,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    const statusCode = err.statusCode ? err.statusCode : err instanceof MongooseError ? 400 : 500;
    const error = new ApiError(statusCode, err?.message?.replace(/\"/g, '') || 'Internal Server Error', err?.errors, err?.stack);

    return res.status(statusCode).json({
        message: error?.message,
        errors: error?.errors || [],
        statusCode: error?.statusCode,
        stack: error?.stack,
    });
}


