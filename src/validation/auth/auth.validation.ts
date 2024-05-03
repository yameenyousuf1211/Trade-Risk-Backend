import joi from 'joi';
import { validateRequest } from '../../middlewares/validation.middleware';

const registerValidator = joi.object({
    role: joi.string().valid('bank','corporate').required(),
    name: joi.string().required(),
    email: joi.string().email({ minDomainSegments: 2 }).required().trim(),
    address: joi.string().min(6).required(),
    constitution: joi.string().when('role', {
        is: 'bank',
        then: joi.forbidden(),
        otherwise: joi.required(),
    }).valid('partnership', 'public_limited_co', 'limited_liability_co', 'individual_proprietorship_co'),
    businessType: joi.string().when('role', {
        is: 'bank',
        then: joi.forbidden(),
        otherwise: joi.required(),
    }),
    phone: joi.string().max(15).when('role', {
        is: 'bank',
        then: joi.forbidden(),
        otherwise: joi.required(),
    }),
    bank: joi.string().required().when('role', {
        is: 'bank',
        then: joi.forbidden(),
        otherwise: joi.required(),
    }),
    swiftCode: joi.string().required(),
    accountNumber: joi.number().when('role', {
        is: 'bank',
        then: joi.forbidden(),
        otherwise: joi.required(),
    }),
    accountHolderName: joi.string().when('role', {
        is: 'bank',
        then: joi.forbidden(),
        otherwise: joi.required(),
    }),
    accountCountry: joi.string().when('role', {
        is: 'bank',
        then: joi.forbidden(),
        otherwise: joi.required(),
    }),
    accountCity: joi.string().when('role', {
        is: 'bank',
        then: joi.forbidden(),
        otherwise: joi.required(),
    }),
    productInfo: joi.object({
        product: joi.string().required(),
        annualSalary: joi.number().required(),
        annualValueExports: joi.number().required(),
        annualValueImports: joi.number().required(),
    }).when('role', {
        is: 'bank',
        then: joi.forbidden(),
        otherwise: joi.required(),
    }),
    pocEmail: joi.string().email({ minDomainSegments: 2 }).required().trim(),
    pocPhone: joi.string().required(),
    pocName: joi.string().when('role', {
        is: 'bank',
        then: joi.forbidden(),
        otherwise: joi.required(),
    }),
    poc: joi.string().when('role', {
        is: 'bank',
        then: joi.forbidden(),
        otherwise: joi.required(),
    }),
    pocDesignation: joi.string().when('role', {
        is: 'bank',
        then: joi.forbidden(),
        otherwise: joi.required(),
    }),
    currentBanks: joi.array().items(
        joi.object({
            name: joi.string().required(),
            country: joi.string().required(),
            city: joi.string().required(),
        })
    ).when('role', {
        is: 'bank',
        then: joi.forbidden(),
        otherwise: joi.required(),
    }),
    confirmationLcs: joi.when('role', {
        is: 'bank',
        then: joi.boolean().required(),
        otherwise: joi.forbidden(),
    }),
    discountingLcs: joi.when('role', {
        is: 'bank',
        then: joi.boolean().required(),
        otherwise: joi.forbidden(),
    }),
    guaranteesCounterGuarantees: joi.when('role', {
        is: 'bank',
        then: joi.boolean().required(),
        otherwise: joi.forbidden(),
    }),
    discountingAvalizedBills: joi.when('role', {
        is: 'bank',
        then: joi.boolean().required(),
        otherwise: joi.forbidden(),
    }),
    avalizationExportBills: joi.when('role', {
        is: 'bank',
        then: joi.boolean().required(),
        otherwise: joi.forbidden(),
    }),
    riskParticipation: joi.when('role', {
        is: 'bank',
        then: joi.boolean().required(),
        otherwise: joi.forbidden(),
    }),
    businessNature:joi.when('role', {
        is: 'bank',
        then: joi.forbidden(),
        otherwise: joi.string().required(),
    })
});

const loginValidator = joi.object({
    email: joi.string().email({minDomainSegments:2}).required().trim(),
    password: joi.string().min(6).required(),
    fcmToken: joi.string().optional(),
});

const registerValidation = [validateRequest(registerValidator)];
const loginValidation = validateRequest(loginValidator);


export {registerValidation,loginValidation}