import joi from 'joi';
import { validateRequest } from '../../middlewares/validation.middleware';

export const riskValidator = joi.object({
    banks:joi.array().items(joi.string()).required(),
    transaction:joi.string().valid("Risk Participation","Outright Sales").required(),
    riskParticipation:joi.string().required(),
    currency:joi.string().required(),
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
        perAnnum:joi.string().when('riskParticipation',{
            is:'Funded',
            then:joi.forbidden(),
            otherwise:joi.required()
        }),
        participationRate:joi.string().required(),
    }).required(),
    issuingBanks: joi.array().items(
        joi.object({
            bank: joi.string().required(),
            country: joi.string().required(),
            swiftCode: joi.string().allow(null, '')
        })
    ).required(),
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
    paymentTerms: joi.string().required(),
    days:joi.number().when('paymentTerms',{
        is:'Tenor LC',
        then:joi.required(),
        otherwise:joi.forbidden()
    }),
    shipmentPort: joi.object({
        country: joi.string().required(),
        port: joi.string().required(),
    }).required(),
    transhipment: joi.boolean().required(),
    expectedDateConfirmation: joi.date().required(),
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
    paymentReceviedType :joi.string().required(),
    note:joi.string().required(),
    draft:joi.boolean().optional().default(false),
    period: joi.object({
        expectedDate: joi.boolean().required(),
        startDate: joi.date().optional()
    }).required(),
    country:joi.string().required(),
    swiftCode:joi.string().optional(),
})

export const validateRisk = validateRequest(riskValidator);