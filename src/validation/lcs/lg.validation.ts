import joi from 'joi';
import { validateRequest } from '../../middlewares/validation.middleware';

const bondSchema = joi.object({
  Contract: joi.boolean(),
  lgDetailAmount: joi.number(),
  lgDetailCurrency: joi.string(),
  currencyType: joi.string(),
  cashMargin: joi.number(),
  valueInPercentage: joi.number(),
  expectedDate: joi.date(),
  lgExpiryDate: joi.date(),
  lgTenor: joi.object({
    lgTenorType: joi.string(),
    lgTenorValue: joi.number(),
  }),
  draft: joi.string(),
});

export const lgValidator = joi.object({
  lgIssuance: joi.string().required(),
  applicantDetails: joi.object({
    country: joi.string().required(),
    company: joi.string().required(),
    crNumber: joi.string().required(),
  }).required(),
  
  beneficiaryDetails: joi.object({
    country: joi.string().required(),
    name: joi.string().required(),
    address: joi.string().required(),
    phoneNumber: joi.string().required(),
  }).required(),
  
  lgDetailsType: joi.string().valid(
    'Contract Related LGs (Bid Bond, Advance Payment Bond, Performance Bond etc)',
    'Choose any other type of LGs'
  ).optional(),
  
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
    pricePerAnnum: joi.string().required(),
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
  
  issueLgWithStandardText: joi.boolean().required(),
  lgStandardText: joi.string().optional(),
  draft: joi.boolean().optional(),
  createdBy: joi.string().required(),
  refId: joi.number().required(),
  physicalLg: joi.boolean().optional(),
  physicalLgCountry: joi.string().optional(),
  physicalLgSwiftCode: joi.string().optional(),
});

