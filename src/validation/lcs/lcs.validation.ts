import joi from 'joi';
import { validateRequest } from '../../middlewares/validation.middleware';

const lcsValidator = joi.object({
    participantRole: joi.string().valid('importer', 'exporter').required(),
    curreny: joi.string().required(),
    lcType: joi.string().valid("LC Confirmation","LC Discounting","LC Confirmation & Discounting").required(),
    amount: joi.number().required(),
    paymentTerms: joi.string().required(),
    extraInfo: joi.object({
        dats: joi.date().required(),
        other: joi.string().required()
    }).when('lcType',{
        is:'LC Discounting',
        then:joi.required(),
        otherwise:joi.forbidden()
    }),
    issuingBank: joi.object({
        bank: joi.string().required(),
        country: joi.string().required()
    }).required(),
    advisingBank: joi.object({
        bank: joi.string().required(),
        country: joi.string().required()
    }).required(),
    confirmingBank: joi.object({
        bank: joi.string().required(),
        country: joi.string().required()
    }).required(),
    shipmentPort: joi.object({
        country: joi.string().required(),
        port: joi.string().required()
    }).required(),
    transhipment: joi.boolean().required(),
    expectedConfirmationDate: joi.date().required(),
    expectedDiscountingDate: joi.date().required(),
    productDescription: joi.string().required(),
    lcPeriod:{
        startDate: joi.date().required(),
        endDate: joi.date().required()
    },
    importerInfo:{
        applicantName: joi.string().required(),
        countryOfImport: joi.string().required()
    },
    exporterInfo:{
        beneficiaryName: joi.string().required(),
        countryOfExport: joi.string().required(),
        beneficiaryCountry: joi.string().required()
    },
    confirmationCharges:{
        behalfOf: joi.string().required()
    },
    discountAtSight: joi.string().when('lcType',{
        is: 'LC Confirmation',
        then: joi.forbidden(),
        otherwise: joi.required()
    }),
    pricePerAnnum: joi.number().required(),
    isDraft: joi.boolean().optional(),
});

const lcsValidation = validateRequest(lcsValidator);
export {lcsValidation}