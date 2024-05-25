import joi from 'joi';
import { validateRequest } from '../../middlewares/validation.middleware';

const lcsValidator = joi.object({
    participantRole: joi.string().valid('importer', 'exporter').required(),
    currency: joi.string().required(),
    lcType: joi.string().valid("LC Confirmation","LC Discounting","LC Confirmation & Discounting").required(),
    amount: joi.number().required(),
    paymentTerms: joi.string().required(),
    extraInfo: joi.object({
        dats: joi.date(),
        other: joi.string()
    }).when('paymentTerms',{
        is: 'Usance LC',
        then: joi.required(),
        otherwise: joi.forbidden()
    }),
    issuingBank: joi.object({
        bank: joi.string().required(),
        country: joi.string().required()
    }).required(),
    advisingBank: joi.object({
        bank: joi.string().optional(),
        country: joi.string().optional()
    }).optional(),
    confirmingBank: joi.object({
        bank: joi.string().optional(),
        country: joi.string().optional()
    }).optional(),
    shipmentPort: joi.object({
        country: joi.string().required(),
        port: joi.string().required(),
    }).required(),
    transhipment: joi.boolean().required(),
    expectedConfirmationDate: joi.date().when('lcType',{
        is: 'LC Discounting',
        then: joi.forbidden(),
        otherwise: joi.required()
    }),
    expectedDiscountingDate: joi.date().when('lcType',{
        is: 'LC Discounting',
        then: joi.required(),
        otherwise: joi.forbidden()
    }),
    productDescription: joi.string().required(),
    lcPeriod:{
        expectedDate: joi.boolean().required(),
        startDate: joi.date().required(),
        endDate: joi.date().required()
    },
    importerInfo:{
        applicantName: joi.string().required(),
        countryOfImport: joi.string().required()
    },
    exporterInfo:joi.object({
        beneficiaryName: joi.string().required(),
        countryOfExport: joi.string().required(),
        beneficiaryCountry: joi.string().required(),
        bank:joi.string().optional()
    }),
    discountingInfo:  joi.object({
        behalfOf: joi.string().required(),
        pricePerAnnum: joi.number().required(),
        discountAtSight: joi.string().required()
        }).when('lcType',{
        is: 'LC Confirmation',
        then: joi.forbidden(),
        otherwise: joi.required()
    }),
    confirmationInfo: joi.object({
            behalfOf: joi.string().required(),
            pricePerAnnum: joi.number().required(),
    }).when('lcType',{
        is: 'LC Discounting',
        then: joi.forbidden(),
        otherwise: joi.required()
    }),

    isDraft: joi.boolean().optional(),
});

const lcsValidation = validateRequest(lcsValidator);
export {lcsValidation}