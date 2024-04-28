import { NextFunction, Request, Response } from "express";
import { asyncHandler, generateResponse } from "../../utils/helpers";

export const defaultHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    generateResponse(null, `Health check passed`, res);
});