import joi from 'joi';

const bondSchema = joi.object({
  Contract: joi.boolean().default(false),
  lgDetailAmount: joi.number().default(0),
  lgDetailCurrency: joi.string().allow('').allow(null).optional(),
  currencyType: joi.string().allow(''),
  cashMargin: joi.number(),
  valueInPercentage: joi.string().allow(''),
  name: joi.string().allow(''),
  expectedDate: joi.date(),
  lgExpiryDate: joi.date(),
  lgTenor: joi.object({
    lgTenorType: joi.string().allow(''),
    lgTenorValue: joi.string().allow(''),
  }).optional(),
  draft: joi.string().allow(''),
});

const contractRelatedLGsCondition = 'Contract Related LGs (Bid Bond, Advance Payment Bond, Performance Bond etc)';

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
    city: joi.string().optional(),
  }).required(),

  lgDetailsType: joi.string().optional().default('Choose any other type of LGs'),


  bidBond: joi.when('lgDetailsType', {
    is: contractRelatedLGsCondition,
    then: joi.any(),
    otherwise: joi.forbidden(),
  }).optional(),
  advancePaymentBond: joi.when('lgDetailsType', {
    is: contractRelatedLGsCondition,
    then: joi.any(),
    otherwise: joi.forbidden(),
  }).optional(),
  performanceBond: joi.when('lgDetailsType', {
    is: contractRelatedLGsCondition,
    then: joi.any(),
    otherwise: joi.forbidden(),
  }).optional(),
  retentionMoneyBond: joi.when('lgDetailsType', {
    is: contractRelatedLGsCondition,
    then: joi.any(),
    otherwise: joi.forbidden(),
  }).optional(),

  otherBond: bondSchema.when("lgDetailsType", {
    is: 'Choose any other type of LGs',
    then: joi.required(),
    otherwise: joi.forbidden(),
  }).optional(),
  issuingBanks: joi.array().items(
    joi.object({
      bank: joi.string().required(),
      country: joi.string().required(),
      swiftCode: joi.string().allow(null, '')
    }).required()
  ).min(1).required(),
  beneficiaryBanksDetails: joi.object({
    bank: joi.string().optional().allow('').allow(null),
    swiftCode: joi.string().optional().allow('').allow(null),
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
  physicalLg: joi.boolean().optional().allow(null).allow(''),
  physicalLgBank: joi.string().optional().allow(null).allow(''),
  physicalLgCountry: joi.string().optional().allow(null).allow(''),
  physicalLgSwiftCode: joi.string().optional().allow(null).allow(''),
  lastDateOfReceivingBids: joi.date().required(),
  totalLgAmount: joi.number().optional(),
  totalContractValue: joi.string().optional().allow(null,''),
  totalContractCurrency: joi.string().optional().allow(null,''),
})
  .custom((value, helpers) => {
    if (value.lgDetailsType === contractRelatedLGsCondition) {
      const { bidBond, advancePaymentBond, performanceBond, retentionMoneyBond } = value;
      if (!bidBond && !advancePaymentBond && !performanceBond && !retentionMoneyBond) {
        return helpers.error('any.required', { label: 'At least one of the bond fields' });
      }
    }
    return value;
  }, 'At least one bond field required validation');

