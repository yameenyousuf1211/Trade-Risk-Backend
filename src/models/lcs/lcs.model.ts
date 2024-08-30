import mongoose, { Schema, Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import {
  IPaginationFunctionParams,
  IPaginationResult,
} from "../../utils/interfaces";
import {
  getMongoosePaginatedData,
  getMongooseAggregatePaginatedData,
} from "../../utils/helpers";
import { QueryWithHelpers } from "mongoose";
import ILcs from "../../interface/lc.interface";

const bondSchema = new Schema({
  Contract: String,
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
  draft: String,
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
  createdBy: { type: Schema.Types.ObjectId, ref: "Business" },

  attachments: [String],
  draft: Boolean,
  status: { type: String, enum: ["Pending", "Expired", "Accepted", "Add bid"], default: "Add bid" },




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


  physicalLg: Boolean,
  physicalLgCountry: String,
  physicalLgSwiftCode: String,
  totalContractValue: String,
  totalContractCurrency: String,
  bids: { type: [Schema.Types.ObjectId], ref: "Bid", default: [] },

  lgIssuance: String,
  // enum: [
  // "LG Re-Issuance within counrty", 
  // "LG Re-Issuance in anothor country", 
  // "100% Cash Margin"],

  // 100% cash margin form fields
  // 1 - 100% cash margin
  applicantDetails: {
    country: String,
    company: String,
    crNumber: String,
  },

  // 2 - 100% cash margin
  issuingBanks: [{
    bank: String,
    country: String,
    swiftCode: String,
    accountNumber: String,
  }],

  // 3 - 100% cash margin
  typeOfLg: { type: String },

  // 4 - 100% cash margin
  issueLgWithStandardText: Boolean,
  lgStandardText: String,

  // 5 - 100% cash margin
  lgDetails: {
    currency: String,
    amount: Number,
    LgTenor: { type: String, enum: ["Days", "Months", "Years"] },
    number: Number,
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
  lgIssueIn: { country: String, city: String },

  // 9 - 100% cash margin
  lgCollectIn: { country: String, city: String },

  // 10 - 100% cash margin
  remarks: String,

  // 11 - 100% cash margin
  priceQuotes: String,

  // 12 - 100% cash margin
  expectedPrice: { expectedPrice: Boolean, pricePerAnnum: Number },

  // 13 - 100% cash margin
  lastDateOfReceivingBids: String,

}, { timestamps: true, versionKey: false });

LcsSchema.plugin(mongoosePaginate);
LcsSchema.plugin(aggregatePaginate);
// Create and export the model
const LcsModel = mongoose.model<ILcs>("lcs", LcsSchema);

export const fetchLcs = async ({
  query,
  page,
  limit,
  populate,
}: IPaginationFunctionParams): Promise<IPaginationResult<ILcs>> => {
  const { data, pagination }: IPaginationResult<ILcs> =
    await getMongoosePaginatedData({
      model: LcsModel,
      query,
      page,
      limit,
      populate,
    });
  return { data, pagination };
};

export const createLc = (obj: ILcs) => LcsModel.create(obj);

export const findLc = (
  query: Record<string, any>,
  populate?: string | string[]
): QueryWithHelpers<any, Document> => {
  const queryBuilder = LcsModel.findOne(query);
  if (populate) {
    queryBuilder.populate(populate);
  }
  return queryBuilder;
};

export const updateLc = (query: any, update: any) => LcsModel.findOneAndUpdate(query, update, { new: true });
export const deleteLc = (id: string) => LcsModel.findByIdAndDelete(id);
export const lcsCount = (query?: any) => LcsModel.countDocuments(query);
export const aggregateFetchLcs = (query: any) => LcsModel.aggregate(query);
export const fetchAllLcsWithoutPagination = (query: any) => LcsModel.find(query);