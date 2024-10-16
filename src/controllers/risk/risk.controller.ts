import { NextFunction, Request, Response } from "express";
import { asyncHandler, generateResponse } from "../../utils/helpers";
import { STATUS_CODES } from "../../utils/constants";
import { createAndSendNotifications, createRisk, getAllRisks, riskCount } from "../../models";

export const fetchAllRisks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const page = +(req.query.page || 1);
    const limit = +(req.query.limit || 10);

    const filters: any[] = [{ draft: req.query.draft === 'true' ? true : false }];
    if (req.query.type) filters.push({ type: req.query.type });
    if (req.query.refId) filters.push({ refId: +(req.query.refId) });
    if (req.query.business) filters.push({ business: req.query.business });
    if (req.query.user) filters.push({ user: req.query.user });

    const query = filters.length > 0 ? { $and: filters } : {};
    const populate = [
        // { path: "bids", populate: { 'path': 'bidBy' } },
        { path: "business", select: "accountCity accountNumber accountHolderName" }
    ]

    const risks = await getAllRisks({ limit, page, query, populate });
    generateResponse(risks, "fetched successfully", res);

    // const data = await fetchRisks({ limit, page, query });
    // generateResponse(data, "Risk fetched successfully", res);
});

export const addRisk = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const countRisks = await riskCount();
    req.body.refId = countRisks + 1;

    req.body.business = req.user.business;
    req.body.user = req.user._id;

    const risk = await createRisk(req.body);

    // send notification only if it is not a draft
    // if (req.body.draft !== true)
    //     await createAndSendNotifications({
    //         lc: risk._id,
    //         type: NOTIFICATION_TYPES.LC_CREATED,
    //         sender: req.user._id,
    //     });

    // emitSocketEvent(req, ROLE_TYPES.BANK, SOCKET_EVENTS.LC_CREATED, risk);
    // generateResponse(risk, "Lcs created successfully", res);
});

// export const riskUpdate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     if (!req.body.draft) {
//         const { error }: ValidationResult = riskValidator.validate(req.body);
//         if (error) {
//             const customError: CustomError = {
//                 statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY!,
//                 message: error.details[0].message.replace(/"/g, ''),
//             };
//             return next(customError);
//         }
//     }
//     req.body.createdBy = req.user._id;

//     const data = await updateRisk({ _id: req.params.id }, req.body);
//     generateResponse(data, "Risk updated successfully", res);
// });

// export const deleteRisks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     const data = await updateRisk({ _id: req.params.id }, { isDeleted: true });
//     generateResponse(data, "Risk deleted successfully", res);
// });

// export const findSingleRisk = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     const data = await findRisk({ _id: req.params.id });

//     if (!data) {
//         return next({
//             statusCode: STATUS_CODES.NOT_FOUND,
//             message: "Risk not found"
//         })
//     }
//     generateResponse(data, "Risk fetched successfully", res);
// });