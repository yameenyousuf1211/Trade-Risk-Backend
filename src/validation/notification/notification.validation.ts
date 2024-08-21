import joi from 'joi';
import { validateRequest } from '../../middlewares/validation.middleware';

const notificationValidator = joi.object({
    title: joi.string().required(),
    body: joi.string().required(),
    requestId:joi.string().optional()
});

export const notificationValidation = validateRequest(notificationValidator);
