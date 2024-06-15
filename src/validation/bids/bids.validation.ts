import joi from 'joi';
import { validateRequest } from '../../middlewares/validation.middleware';

const bidsValidator = joi.object({
  bidType: joi.string().required(),
  bidValidity: joi.date().required(),
  confirmationPrice: joi.number().required(),
  lc: joi.string().optional(),
  perAnnum: joi.boolean().optional(),
  risk: joi.string().optional(),
  discountMargin:joi.number().optional(),
  discountBaseRate:joi.string().optional()
});

export const bidsValidation = validateRequest(bidsValidator);
