import mongoose, { Schema, Document, QueryWithHelpers, FilterQuery, UpdateQuery } from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IPaginationFunctionParams, IPaginationResult } from "../../utils/interfaces";
import { getMongoosePaginatedData } from "../../utils/helpers";
import { IRisk } from './risk.interface';

const RiskSchema: Schema = new Schema({
    // createdBy is business id / user id
    business: { type: Schema.Types.ObjectId, ref: "Business" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    draft: { type: Boolean, default: false },
    refId: Number,
    status: { type: String, enum: ["", ""], default: "" },


    banks: [{ country: String, city: String, bank: String, swiftCode: String }],
    signedCopy: [Object],
    // 1
    transaction: { type: String, enum: ["Risk Participation", "Outright Sales"] },

    // 2
    riskParticipation: { type: String, enum: ["Non-Funded", "Funded"] },
    transactionType: { type: String, enum: ["LC Confirmation", "LG", "SBLC", "Analization", "Supply Chain Finance"] },
    riskParticipationTransaction: {
        currency: { type: String },
        amount: { type: Number },
        isParticipationOffered: { type: Boolean },
        percentage: { type: Number },
        participationCurrency: { type: String },
        participationValue: { type: Number },
        pricingOffered: { type: Number },
    },

    // 3 
    // LC Issuing Bank
    issuingBank: { bank: String, country: String },
    // LC Advising Bank
    advisingBank: { bank: String, country: String },
    // LC Confirming Bank
    confirmingBank: { bank: String, country: String, dateType: { type: String, enum: ["Date LC confirmed", "Expected date to confirm"] }, date: { type: Date } },
    lcPeriod: { dateType: { type: String, enum: ["Date LC issued", "Expected date of LC issuance"] }, date: { type: Date }, lcExpiry: { type: Date } },
    // Payment Terms
    paymentTerms: { type: String, enum: ["Sight LC", "Usance LC", "Deferred LC", "UPAS LC"] },
    extraInfo: { days: Number, other: String },
    // Port of Shipment
    shipmentPort: { country: String, port: String },
    transhipment: { type: Boolean },
    productDescription: { type: String },

    // 4 - Importer Info
    importerInfo: { name: String, countryOfImport: String, port: String },

    // 5 - Exporter Info
    exporterInfo: { name: String, countryOfExport: String, beneficiaryCountry: String },

    // 6 - Attach LC copy
    attachment: [Object],

    // 7 - Last Date of receiving bids
    lastDateOfReceivingBids: Date,

    // 8 - Additional notes
    additionalNotes: { type: String },
}, { timestamps: true });

RiskSchema.plugin(mongoosePaginate);
RiskSchema.plugin(aggregatePaginate);

const RiskModel = mongoose.model<IRisk>('risks', RiskSchema);

export const getAllRisks = async ({ query, page, limit, populate }: IPaginationFunctionParams): Promise<IPaginationResult<IRisk>> => {
    const { data, pagination }: IPaginationResult<IRisk> = await getMongoosePaginatedData({
        model: RiskModel,
        query,
        page,
        limit,
        populate,
    });

    return { data, pagination };
};
export const createRisk = (obj: IRisk) => RiskModel.create(obj);
export const findRisk = (query: Record<string, any>): QueryWithHelpers<any, Document> => RiskModel.findOne(query);
export const updateRisk = (query: FilterQuery<IRisk>, update: UpdateQuery<IRisk>): QueryWithHelpers<any, Document> => RiskModel.findOneAndUpdate(query, update, { new: true });
export const riskCount = (query?: any) => RiskModel.countDocuments(query);
export const deleteRisk = (id: string) => RiskModel.findByIdAndDelete(id);
// export const fetchRisksAggregate = (query: any) => RiskModel.aggregate(query);
// export const fetchAllRisksWithoutPagination = (query: any) => RiskModel.find(query);