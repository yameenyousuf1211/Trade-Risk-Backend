import joi from 'joi';
import { validateRequest } from '../../middlewares/validation.middleware';

const notificationValidator = joi.object({
    title: joi.string().required(),
    body: joi.string().required()
});

const subscriptionValidator = joi.object({
    endpoint: joi.string().uri().required(),
    expirationTime: joi.any().allow(null),
    keys: joi.object({
        auth: joi.string().required(),
        p256dh: joi.string().required()
    }).required()
});

export const subscriptionValidation = validateRequest(subscriptionValidator);
export const notificationValidation = validateRequest(notificationValidator);
