import mongoose, { Schema, Document, UpdateQuery, FilterQuery } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IPaginationFunctionParams, IPaginationResult } from "../../utils/interfaces";
import { getMongoosePaginatedData } from "../../utils/helpers";
import { QueryWithHelpers } from "mongoose";
// import ILcs from "../../interface/lc.interface";
import { LC_STATUS, LG_ISSUANCE_TYPES } from "../../utils/constants";

const bondSchema = new Schema({
  Contract: Boolean,
  currencyType: String,
  cashMargin: Number,
  valueInPercentage: Number,
  expectedDate: String,
  lgExpiryDate: String,
  name: String,
  lgDetailAmount: Number,
  lgTenor: {
    lgTenorType: String,
    lgTenorValue: Number,
  },
  attachments: [Object],
  expectedPricing: Number,
  draft: Boolean,
}, { id: false });

// Define the schema
const LcsSchema: Schema = new Schema({
  // Assuming participant can be either importer or exporter
  participantRole: { type: String, enum: ["importer", "exporter"] },
  currency: String,
  // LC type
  type: {
    type: String,
    enum: [
      "LC Confirmation",
      "LC Discounting",
      "LC Confirmation & Discounting",
      "LG Issuance"]
  },
  amount: {
    price: Number,
    priceCurrency: String,
    margin: Number,
    marginCurrency: String,
    amountPercentage: String,
  },
  refId: Number,
  extraInfo: {
    days: Number,
    other: String,
  },
  paymentTerms: String,

  advisingBank: {
    bank: String,
    country: String,
  },
  expectedDiscountingDate: Date,
  expectedConfirmationDate: Date,
  confirmingBank: {
    bank: String,
    country: String,
  },
  shipmentPort: {
    country: String,
    port: String,
  },
  transhipment: Boolean,
  expectedDate: Date,
  productDescription: String,
  period: {
    expectedDate: Boolean,
    startDate: Date,
    endDate: Date,
  },
  importerInfo: {
    applicantName: String,
    countryOfImport: String,
  },
  exporterInfo: {
    beneficiaryName: String,
    countryOfExport: String,
    beneficiaryCountry: String,
    bank: String,
  },
  confirmationInfo: {
    behalfOf: String,
    pricePerAnnum: String,
  },
  discountingInfo: {
    discountAtSight: String,
    pricePerAnnum: String,
    behalfOf: String,
    basePerRate: String,
  },
  baseRate: String,

  // createdBy is business id
  createdBy: { type: Schema.Types.ObjectId, ref: "Business" },

  attachments: [Object],
  draft: { type: Boolean, default: false },
  status: { type: String, enum: Object.values(LC_STATUS), default: LC_STATUS.ADD_BID },

  lgDetailsType: String,  //  for LG Re-Issuance
  bidBond: bondSchema,
  advancePaymentBond: bondSchema,
  performanceBond: bondSchema,
  retentionMoneyBond: bondSchema,
  otherBond: bondSchema,

  beneficiaryBanksDetails: {
    bank: String,
    swiftCode: String,
  },

  totalLgAmount: Number,

  issuingBanks: [{
    bank: String,
    country: String,
    swiftCode: String,
    accountNumber: String,
  }],


  physicalLg: Boolean,
  physicalLgCountry: String,
  physicalLgSwiftCode: String,
  totalContractValue: String,
  totalContractCurrency: String,
  bids: { type: [Schema.Types.ObjectId], ref: "Bid", default: [] },

  lgIssuance: {
    type: String,
    enum: LG_ISSUANCE_TYPES, default: LG_ISSUANCE_TYPES.NONE
  },

  // 100% cash margin form fields
  // 1 - 100% cash margin
  applicantDetails: {
    country: String,
    company: String,
    crNumber: String,
  },

  // 2 - 100% cash margin
  preferredBanks: {
    country: String,
    banks: [{
      bank: String,
      swiftCode: String,
      accountNumber: String,
    }]
  },

  // 3 - 100% cash margin
  typeOfLg: { type: String },

  // 4 - 100% cash margin
  issueLgWithStandardText: Boolean,
  lgStandardText: String,
  draftAttachments: [Object],

  // 5 - 100% cash margin
  lgDetails: {
    currency: String,
    amount: Number,
    lgTenor: {
      lgTenorType: String,
      lgTenorValue: Number,
    },
    expectedDateToIssueLg: Date,
    lgExpiryDate: Date,
  },

  // 6 - 100% cash margin
  purpose: String,

  // 7 - 100% cash margin
  beneficiaryDetails: {
    name: String,
    country: String,
    city: String,
    address: String,
    phoneNumber: String,
  },

  // 8 - 100% cash margin
  lgIssueIn: { country: String, city: String, isoCode: String },

  // 9 - 100% cash margin
  isSameAsIssuance: Boolean,
  lgCollectIn: { country: String, city: String, isoCode: String },

  // 10 - 100% cash margin
  remarks: String,

  // 11 - 100% cash margin
  priceQuotes: String,

  // 12 - 100% cash margin
  expectedPrice: { expectedPrice: Boolean, pricePerAnnum: Number },

  // 13 - 100% cash margin
  lastDateOfReceivingBids: Date,


  // 100% LG Issuance within the country
  // 1 - applicantDetails
  // 2 - preferredBanks
  // 3 - beneficiaryDetails
  // 4 - lgDetails
  // lgDetailsType: String,
  // bidBond: bondSchema,
  // advancePaymentBond: bondSchema,
  // performanceBond: bondSchema,
  // retentionMoneyBond: bondSchema,
  // otherBond: bondSchema,
  // totalContractValue: String,
  // totalContractCurrency: String,
  // 5 - lgIssueIn
  // 6 - lgCollectIn & isSameAsIssuance
  // 7 - purpose
  // 8 - remarks
  // 9 - priceQuotes
  // 10 - expectedPrice: { expectedPrice: Boolean, pricePerAnnum: Number },
  // 11 - lastDateOfReceivingBids


}, { timestamps: true, versionKey: false });

LcsSchema.plugin(mongoosePaginate);
LcsSchema.plugin(aggregatePaginate);
// Create and export the model
const LcsModel = mongoose.model<any>("lcs", LcsSchema);

export const fetchLcs = async ({ query, page, limit, populate }: IPaginationFunctionParams): Promise<IPaginationResult<any>> => {
  const { data, pagination }: IPaginationResult<any> =
    await getMongoosePaginatedData({
      model: LcsModel,
      query,
      page,
      limit,
      populate,
    });
  return { data, pagination };
};

export const createLc = (obj: any) => LcsModel.create(obj);
export const findLc = (query: Record<string, any>): QueryWithHelpers<any, Document> => LcsModel.findOne(query);
export const updateLc = (query: FilterQuery<any>, update: UpdateQuery<any>):
  QueryWithHelpers<any, Document> => LcsModel.findOneAndUpdate(query, update, { new: true });

export const deleteLc = (id: string) => LcsModel.findByIdAndDelete(id);
export const lcsCount = (query?: any) => LcsModel.countDocuments(query);
export const aggregateFetchLcs = (query: any) => LcsModel.aggregate(query);
export const fetchAllLcsWithoutPagination = (query: any) => LcsModel.find(query);