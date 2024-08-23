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
  type: { type: String, enum: ["LC Confirmation", "LC Discounting", "LC Confirmation & Discounting", "LG Issuance"] },
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
  issuingBanks: [{
    bank: String,
    country: String,
    swiftCode: String,
  }],
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
  lgIssuance: String,
  applicantDetails: {
    country: String,
    company: String,
    crNumber: String,
  },
  beneficiaryDetails: {
    country: String,
    name: String,
    address: String,
    phoneNumber: String,
  },
  lgDetailsType: String,  //
  bidBond: bondSchema,
  advancePaymentBond: bondSchema,
  performanceBond: bondSchema,
  retentionMoneyBond: bondSchema,
  otherBond: bondSchema,

  beneficiaryBanksDetails: {
    bank: String,
    swiftCode: String,
  },
  purpose: String,
  remarks: String,
  priceQuotes: String,
  expectedPrice: {
    expectedPrice: Boolean,
    pricePerAnnum: String,
  },
  totalLgAmount: Number,
  typeOfLg: {
    type: String, enum: [
      "Bid Bond",
      "Advance Payment Bond",
      "Performance Bond",
      "Retention Money Bond",
      "Payment LG",
      "Zakat",
      "Custom",
      "SBLC",
      "Other",
    ],
  },
  issueLgWithStandardText: Boolean,
  lgStandardText: String,
  physicalLg: Boolean,
  physicalLgCountry: String,
  physicalLgSwiftCode: String,
  totalContractValue:String,
  totalContractCurrency:String,
  bids: { type: [Schema.Types.ObjectId], ref: "Bid", default: [] },
  lastDateOfReceivingBids: String
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