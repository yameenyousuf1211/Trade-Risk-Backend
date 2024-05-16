import joi from 'joi';
import { validateRequest } from '../../middlewares/validation.middleware';

const riskValidator = joi.object({
    banks:joi.array().items(joi.string()).required(),
    transaction:joi.string().valid("Risk Participation","Outright Sales").required(),
    riskParticipation:joi.string().required(),
    outrightSales:joi.string().when('transaction',{
        is:'Outright Sales',
        then:joi.required(),
        otherwise:joi.forbidden()
    }),
    riskParticipationTransaction:joi.object({
        type:joi.string().required(),
        amount:joi.number().required(),
        returnOffer:joi.string().required(),
        baseRate:joi.string().required(),
        perAnnum:joi.string().required(),
        participationRate:joi.string().required(),
    }).required(),
    issuingBank: joi.object({
        bank: joi.string().required(),
        country: joi.string().required()
    }).required(),
    advisingBank: joi.object({
        bank: joi.string().optional(),
        country: joi.string().optional()
    }).optional(),
    confirmingBank: joi.object({
        bank: joi.string().required(),
        country: joi.string().required()
    }).required(),
    isLcDiscounting: joi.boolean().required(),
    expectedDiscounting: joi.boolean().required(),
    expectedDateDiscounting: joi.date().required(),
    expiryDate: joi.date().required(),
    startDate: joi.date().required(),
    paymentTerms: joi.string().required(),
    days:joi.number().required(),
    shipmentPort: joi.object({
        country: joi.string().required(),
        port: joi.string().required(),
    }).required(),
    transhipment: joi.boolean().required(),
    expectedDateConfimation: joi.date().required(),
    description: joi.string().required(),
    importerInfo:joi.object({
        applicantName: joi.string().required(),
        countryOfImport: joi.string().required()
    }).required(),
    exporterInfo:joi.object({
        beneficiaryName: joi.string().required(),
        countryOfExport: joi.string().required(),
        beneficiaryCountry: joi.string().required(),
    }).required(),
    paymentType:joi.string().required(),
    note:joi.string().required(),
    draft:joi.boolean().optional().default(false),
})

export const validateRisk = validateRequest(riskValidator);