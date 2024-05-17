import joi from 'joi';
import { validateRequest } from '../../middlewares/validation.middleware';

const bidsValidator = joi.object({
  bidType: joi.string().required(),
  bidValidity: joi.date().required(),
  confirmationPrice: joi.number().required(),
  lc: joi.string().required(),  
  discountMargin:joi.number().optional(),
  discountBaseRate:joi.number().optional()
});

export const bidsValidation = validateRequest(bidsValidator);