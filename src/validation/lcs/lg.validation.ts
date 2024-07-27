import joi from 'joi';
import { validateRequest } from '../../middlewares/validation.middleware';

const bondSchema = joi.object({
  Contract: joi.boolean(),
  lgDetailAmount: joi.number(),
  lgDetailCurrency: joi.string().allow(''),
  currencyType: joi.string().allow(''),
  cashMargin: joi.number(),
  valueInPercentage: joi.string().allow(''),
  expectedDate: joi.date(),
  lgExpiryDate: joi.date(),
  lgTenor: joi.object({
    lgTenorType: joi.string().allow(''),
    lgTenorValue: joi.string().allow(''),
  }).optional(),
  draft: joi.string().allow(''),
});

export const lgValidator = joi.object({
  lgIssuance: joi.string().required(),
  type: joi.string().required(),
  applicantDetails: joi.object({
    country: joi.string().required(),
    company: joi.string().required(),
    crNumber: joi.string().required(),
  }).required(),
  
  beneficiaryDetails: joi.object({
    country: joi.string().required(),
    name: joi.string().required(),
    address: joi.string().optional(),
    phoneNumber: joi.string().optional(),
  }).required(),
  
  lgDetailsType: joi.string().optional().allow(null).allow(''),
  bidBond: bondSchema.when('lgDetailsType', {
    is: 'Contract Related LGs (Bid Bond, Advance Payment Bond, Performance Bond etc)',
    then: joi.required(),
    otherwise: joi.forbidden(),
  }).optional(),
  advancePaymentBond: bondSchema.when('lgDetailsType', {
    is: 'Contract Related LGs (Bid Bond, Advance Payment Bond, Performance Bond etc)',
    then: joi.required(),
    otherwise: joi.forbidden(),
  }).optional(),
  performanceBond: bondSchema.when('lgDetailsType', {
    is: 'Contract Related LGs (Bid Bond, Advance Payment Bond, Performance Bond etc)',
    then: joi.required(),
    otherwise: joi.forbidden(),
  }).optional(),
  retentionMoneyBond: bondSchema.when('lgDetailsType', {
    is: 'Contract Related LGs (Bid Bond, Advance Payment Bond, Performance Bond etc)',
    then: joi.required(),
    otherwise: joi.forbidden(),
  }).optional(),
  otherBond: bondSchema.when("lgDetailsType",{
    is: 'Choose any other type of LGs',
    then: joi.required(),
    otherwise: joi.forbidden(),
  }).optional(),

  issuingBank: joi.object({
    bank: joi.string().required(),
    country: joi.string().required(),
    swiftCode: joi.string().required(),
  }).required(),
  beneficiaryBanksDetails: joi.object({
    bank: joi.string().required(),
    swiftCode: joi.string().required(),
  }).optional(),
  
  purpose: joi.string().optional(),
  remarks: joi.string().optional(),
  priceQuotes: joi.string().required(),
  
  expectedPrice: joi.object({
    expectedPrice: joi.boolean().required(),
    pricePerAnnum: joi.string().optional(),
  }).required(),
  
  typeOfLg: joi.string().valid(
    'Bid Bond', 'Advance Payment Bond', 'Performance Bond', 'Retention Money Bond', 
    'Payment LG', 'Zakat', 'Custom', 'SBLC', 'Other'
  ).when('lgIssuance', {
    is: 'LG 100% Cash Margin',
    then: joi.required(),
    otherwise: joi.forbidden(),
  }
  ),
  issueLgWithStandardText: joi.boolean().optional(),
  lgStandardText: joi.string().optional(),
  draft: joi.boolean().optional(), 
  createdBy: joi.string().required(),
  refId: joi.number().required(),
  physicalLg: joi.boolean().optional().allow(null),
  physicalLgBank: joi.string().optional().allow(null),
  physicalLgCountry: joi.string().optional().allow(null),
  physicalLgSwiftCode: joi.string().optional().allow(null),
});

