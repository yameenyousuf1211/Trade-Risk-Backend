import joi from 'joi';
import { validateRequest } from '../../middlewares/validation.middleware';

const createRoleValidator = joi.object({
    name: joi.string().required()
});

const updateRoleValidator = joi.object({
    changeRequest: joi.boolean().optional(),
    viewBids: joi.boolean().optional(),
    acceptAndRejectBids: joi.boolean().optional(),
    manageUsers: joi.boolean().optional(),
    manageCompany: joi.boolean().optional(),
    manageRequests: joi.boolean().optional() 
});

export const validateCreateRole = validateRequest(createRoleValidator);
export const validateUpdateRole = validateRequest(updateRoleValidator);
