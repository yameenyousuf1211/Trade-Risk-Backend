import { NextFunction, Request, Response } from "express";
import moment from "moment";

export const log = (req: Request, res: Response, next: NextFunction) => {
    console.log("\n\n<<<< Request Logs >>>>");
    console.log(moment().utcOffset("+0500").format("DD-MMM-YYYY hh:mm:ss a"));
    console.log("req.originalUrl: ", req.originalUrl);
    console.log('client ip: ', req.clientIp);
    console.log("req.body: ", JSON.stringify(req.body));
    next();
}