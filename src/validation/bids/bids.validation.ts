import joi from 'joi';
import { validateRequest } from '../../middlewares/validation.middleware';

const bidsValidator = joi.object({
  bidType: joi.string().required(),
  bidValidity: joi.date(),
  confirmationPrice: joi.number(),
  lc: joi.string().optional(),
  perAnnum: joi.boolean().optional(),
  risk: joi.string().optional(),
  discountMargin: joi.number().optional(),
  discountBaseRate: joi.string().optional(),
  bids: joi.array().items().optional(),
});

export const bidsValidation = validateRequest(bidsValidator);
