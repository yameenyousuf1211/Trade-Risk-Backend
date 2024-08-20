import joi from 'joi';
import { validateRequest } from '../../middlewares/validation.middleware';
import phone from 'phone';

const registerValidator = joi.object({
    name: joi.string().required(),
    email: joi.string().email({ minDomainSegments: 2 }).required().trim(),
    role: joi.string().valid('admin', 'user').required(),
    type: joi.string().valid('corporate', 'bank').required(),
    fcmTokens: joi.array().items(joi.string()).required(),

    businessData: joi.object({
        name: joi.string().required(),
        email: joi.string().email({ minDomainSegments: 2 }).required().trim(),
        type: joi.string().valid('corporate', 'bank').required(),
        address: joi.string().required(),
        country: joi.string().required(),
        swiftCode: joi.string().required(),
        pocEmail: joi.string().email({ minDomainSegments: 2 }).required().trim(),
        pocPhone: joi.string().required(),
        pocName: joi.string().required(),

        // Bank specific fields
        confirmationLcs: joi.boolean().when('type', { is: 'bank', then: joi.required(), otherwise: joi.forbidden() }),
        discountingLcs: joi.boolean().when('type', { is: 'bank', then: joi.required(), otherwise: joi.forbidden() }),
        guaranteesCounterGuarantees: joi.boolean().when('type', { is: 'bank', then: joi.required(), otherwise: joi.forbidden() }),
        discountingAvalizedBills: joi.boolean().when('type', { is: 'bank', then: joi.required(), otherwise: joi.forbidden() }),
        avalizationExportBills: joi.boolean().when('type', { is: 'bank', then: joi.required(), otherwise: joi.forbidden() }),
        riskParticipation: joi.boolean().when('type', { is: 'bank', then: joi.required(), otherwise: joi.forbidden() }),

        // Corporate specific fields
        phone: joi.string().when('type', {
            is: 'corporate',
            then: joi.string().required().custom((value, helpers) => {
                const { isValid } = phone(value);
                if (!isValid) {
                    return helpers.error('any.custom', { message: 'Invalid phone number' });
                } return value;
            }).messages({
                'any.custom': 'Invalid phone number'
            }), otherwise: joi.forbidden()
        }),
        commercialRegistrationNumber: joi.string()
            .pattern(/^\d{4,}$/) // Ensures at least 4 digits
            .when('type', {
                is: 'corporate',
                then: joi.required(),
                otherwise: joi.forbidden()
            })
            .messages({
                'string.pattern.base': 'Commercial Registration Number must contain at least 4 digits'
            }),

        constitution: joi.string().valid('partnership', 'public_limited_co', 'limited_liability_co', 'individual_proprietorship_co').when('type', { is: 'corporate', then: joi.required(), otherwise: joi.forbidden() }),
        businessType: joi.string().when('type', { is: 'corporate', then: joi.required(), otherwise: joi.forbidden() }),
        productInfo: joi.object({
            products: joi.array().items(joi.string()).required(),
            annualSalary: joi.number().required(),
            annualValueExports: joi.number().required(),
            annualValueImports: joi.number().required(),
        }).when('type', { is: 'corporate', then: joi.required(), otherwise: joi.forbidden() }),
        currentBanks: joi.array().items(
            joi.object({
                name: joi.string().required(),
                country: joi.string().required(),
                city: joi.string().required(),
            })
        ).when('type', { is: 'corporate', then: joi.required(), otherwise: joi.forbidden() }),
        bank: joi.string().when('type', { is: 'corporate', then: joi.required(), otherwise: joi.forbidden() }),
        accountNumber: joi.number().when('type', { is: 'corporate', then: joi.required(), otherwise: joi.forbidden() }),
        accountHolderName: joi.string().when('type', { is: 'corporate', then: joi.required(), otherwise: joi.forbidden() }),
        accountCountry: joi.string().when('type', { is: 'corporate', then: joi.required(), otherwise: joi.forbidden() }),
        accountCity: joi.string().when('type', { is: 'corporate', then: joi.required(), otherwise: joi.forbidden() }),
        businessNature: joi.string().when('type', { is: 'corporate', then: joi.required(), otherwise: joi.forbidden() }),
        poc: joi.string().when('type', { is: 'corporate', then: joi.required(), otherwise: joi.forbidden() }),
        pocDesignation: joi.string().when('type', { is: 'corporate', then: joi.required(), otherwise: joi.forbidden() }),
    }).required(),
});

const loginValidator = joi.object({
    email: joi.string().email({ minDomainSegments: 2 }).required().trim(),
    password: joi.string().min(6).required(),
    fcmToken: joi.string().optional(),
});

const registerValidation = [validateRequest(registerValidator)];
const loginValidation = validateRequest(loginValidator);


export { registerValidation, loginValidation }