import joi from 'Joi';
import { validateRequest } from '../../middlewares/validation.middleware';
const registerValidator = joi.object({
    role: joi.string().valid('bank','corporate').required(),
    name: joi.string().required(),
    email: joi.string().email({ minDomainSegments: 2 }).required().trim(),
    address: joi.string().min(6).required(),
    constitution: joi.string().required().valid('partnership', 'public_limited_co', 'limited_liability_co', 'individual_proprietorship_co'),
    businessType: joi.string().required(),
    phone: joi.string().required().max(15),
    bank: joi.string().required(),
    swiftCode: joi.string().required(),
    accountNumber: joi.number().required(),
    accountHolderName: joi.string().required(),
    accountCountry: joi.string().required(),
    accountCity: joi.string().required(),
    productInfo: joi.object({
        product: joi.string().required(),
        annualSalary: joi.number().required(),
        annualValueExports: joi.number().required(),
        annualValueImports: joi.number().required(),
    }).required(),
    pocEmail: joi.string().email({ minDomainSegments: 2 }).required().trim(),
    pocPhone: joi.string().required(),
    pocName: joi.string().required(),
    poc: joi.string().required(),
    pocDesignation: joi.string().required(),
    currentBanks: joi.array().items(
        joi.object({
            name: joi.string().required(),
            country: joi.string().required(),
            city: joi.string().required(),
        })
    ).required(),
    // Conditional validation for bank-related fields
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
});

const loginValidator = joi.object({
    email: joi.string().email({minDomainSegments:2}).required().trim(),
    password: joi.string().min(6).required(),
    fcmToken: joi.string().optional(),
});

const registerValidation = [validateRequest(registerValidator)];
const loginValidation = validateRequest(loginValidator);


export {registerValidation,loginValidation}