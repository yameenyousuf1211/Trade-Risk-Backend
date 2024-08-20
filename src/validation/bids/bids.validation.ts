import joi from 'joi';
import { validateRequest } from '../../middlewares/validation.middleware';

const bidsValidator = joi.object({
  bidType: joi.string().valid('LC Confirmation', 'LC Confirmation & Discounting', 'LC Discounting', 'Risk', 'LG Issuance').required(),
  bidValidity: joi.date(),
  confirmationPrice: joi.number(),
  perAnnum: joi.boolean(),
  lc: joi.string(),
  risk: joi.string().allow(null, ''),
  discountMargin: joi.number().allow(null, 0),
  discountingPrice: joi.number().allow(null, 0),
  discountBaseRate: joi.string().allow(null, ''),
  bids: joi.array().items(),
});

export const bidsValidation = validateRequest(bidsValidator);
