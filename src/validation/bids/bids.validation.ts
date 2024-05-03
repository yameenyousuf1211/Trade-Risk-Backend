import joi from 'joi';
import { validateRequest } from '../../middlewares/validation.middleware';

const bidsValidator = joi.object({
  bidType: joi.string().required(),
  bidValidity: joi.date().required(),
  confirmationPrice: joi.number().required(),
  discountingPrice: joi.number().when('bidType', { is: 'LC Confirmation', then: joi.forbidden(),otherwise:joi.required() }),
  lc: joi.string().required(),  
});

export const bidsValidation = validateRequest(bidsValidator);