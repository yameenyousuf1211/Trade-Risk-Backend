import joi from 'joi';
import { validateRequest } from '../../middlewares/validation.middleware';

export const lcsValidator = joi.object({
    participantRole: joi.string().valid('importer', 'exporter').when('type',{
        is: 'LG Issuance',
        then: joi.forbidden(),
        otherwise: joi.required()
    }),
    currency: joi.string().when('type',{
        is: 'LG Issuance',
        then: joi.forbidden(),
        otherwise: joi.required()
    }),
    type: joi.string().valid("LC Confirmation","LC Discounting","LC Confirmation & Discounting","LG Issuance").required(),
    amount: joi.object({
        price: joi.number().required(),
        margin: joi.number().optional(),
        amountPercentage: joi.string().optional()
    }).required(),
    paymentTerms: joi.string().when('type',{
        is: 'LG Issuance',
        then: joi.forbidden(),
        otherwise: joi.required()
    }), 
    extraInfo: joi.object({
        dats: joi.date(),
        other: joi.string()
    }).optional(),
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
    }).when('type',{
        is: 'LG Issuance',
        then: joi.forbidden(),
        otherwise: joi.required()
    }),
    transhipment: joi.boolean().when('type',{
        is: 'LG Issuance',
        then: joi.forbidden(),
        otherwise: joi.required()
    }),
    expectedConfirmationDate: joi.date().when('type',{
        is: ["LC Discounting","LG Issuance"],
        then: joi.forbidden(),
        otherwise: joi.required()
    }),
    expectedDiscountingDate: joi.date().when('type',{
        is: 'LC Discounting',
        then: joi.required(),
        otherwise: joi.forbidden()
    }),
    productDescription: joi.string().required(),
    period:{
        expectedDate: joi.boolean().required(),
        startDate: joi.date().required(),
        endDate: joi.date().required()
    },
    importerInfo:joi.object({
        applicantName: joi.string().required(),
        countryOfImport: joi.string().required()
    }).when('type',{
        is: 'LG Issuance',
        then: joi.forbidden(),
        otherwise: joi.required()
    }
    ),
    exporterInfo:joi.object({
        beneficiaryName: joi.string().required(),
        countryOfExport: joi.string().required(),
        beneficiaryCountry: joi.string().required(),
        bank:joi.string().optional()
    }).when('type',{
        is: 'LG Issuance',
        then: joi.forbidden(),
        otherwise: joi.required()
    }),
    discountingInfo:  joi.object({
        behalfOf: joi.string().required(),
        pricePerAnnum: joi.string().required(),
        discountAtSight: joi.string().required(),
        basePerRate: joi.string().optional()
        }).when('type',{
        is: ['LC Confirmation','LG Issuance'],
        then: joi.forbidden(),
        otherwise: joi.required()
    }),
    confirmationInfo: joi.object({
            behalfOf: joi.string().required(),
            pricePerAnnum: joi.string().required(),
    }).when('type',{
        is: ['LC Discounting','LG Issuance'],
        then: joi.forbidden(),
        otherwise: joi.required()
    }),
    draft:joi.boolean().optional(),
    lgIssueAgainst: joi.string().when('type',{
        is: 'LG Issuance',
        then: joi.required(),
        otherwise: joi.forbidden()
    }),
    lgType: joi.string().when('type',{
        is: 'LG Issuance',
        then: joi.required(),
        otherwise: joi.forbidden()
    }),
    standardSAMA: joi.boolean().when('type',{
        is: 'LG Issuance',
        then: joi.required(),
        otherwise: joi.forbidden()
    }),
    chargesBehalfOf: joi.string().when('type',{
        is: 'LG Issuance',
        then: joi.required(),
        otherwise: joi.forbidden()
    }),
    remarks: joi.string().when('type',{
        is: 'LG Issuance',
        then: joi.required(),
        otherwise: joi.forbidden()
    }),
    priceType: joi.string().when('type',{
        is: 'LG Issuance',
        then: joi.required(),
        otherwise: joi.forbidden()
    }),
    baseRate:joi.string().when('type',{
        is: ['LG Issuance','LC Confirmation','LC Confirmation & Discounting'],
        then: joi.forbidden(),
        otherwise: joi.required()
    }),
    priceCurrency:joi.string().when('type',{
        is: 'LG Issuance',
        then: joi.required(),
        otherwise: joi.forbidden()
    }),
    marginCurrency:joi.string().when('type',{
        is: 'LG Issuance',
        then: joi.required(),
        otherwise: joi.forbidden()
    }),
    benificiaryBankName:joi.string().when('type',{
        is: 'LG Issuance',
        then: joi.required(),
        otherwise: joi.forbidden()
    }),
    instrument:joi.string().when('type',{
        is: 'LG Issuance',
        then: joi.required(),
        otherwise: joi.forbidden()
    }),
    lgDetail:joi.object({
        lgIssueBehalfOf:joi.string().required(),
        applicantCountry:joi.string().required(),
        lgIssueFavorOf:joi.string().required(),
        address:joi.string().required(),
        benficiaryCountry:joi.string().required()
    }).when('type',{
        is: 'LG Issuance',
        then: joi.required(),
        otherwise: joi.forbidden()
    }),
});

const lcsValidation = validateRequest(lcsValidator);
export {lcsValidation}