import mongoose, { Schema, Document, FilterQuery } from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IPaginationFunctionParams, IPaginationResult } from "../../utils/interfaces";
import { getMongoosePaginatedData } from "../../utils/helpers";
import { BID_APPROVAL_STATUS, BID_STATUS } from '../../utils/constants';

export interface IBid extends Document {
    bidNumber: number;
    bidType: string;
    bidValidity: Date
    lc: string;
    discountingPrice: number
    confirmationPrice: number
    isDeleted: boolean
    createdAt: Date;
    bidBy: string
    status: string;
    updatedAt: Date;
    risk: string;
    approvalStatus: string;
}

// Define the bid schema
const bidSchema: Schema = new Schema({
    bidNumber: Number,
    bidType: { type: String, enum: ['LC Confirmation', 'LC Confirmation & Discounting', 'LC Discounting', 'Risk', 'LG Issuance'] },
    lc: { type: Schema.Types.ObjectId, ref: 'Lcs' },
    risk: { type: Schema.Types.ObjectId, ref: 'Risks' },
    bidValidity: Date,
    confirmationPrice: Number,
    discountingPrice: Number,
    bidBy: { type: Schema.Types.ObjectId, ref: 'Business' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    discountMargin: Number,
    discountBaseRate: String,
    perAnnum: Boolean,
    status: { type: String, enum: Object.values(BID_STATUS), default: BID_STATUS.PENDING },

    // admin bid submit status
    approvalStatus: { type: String, enum: Object.values(BID_APPROVAL_STATUS) },

    // for LG Re-Issuance
    bids: [{
        bank: String,
        bidType: { type: String, enum: ['Bid Bond', 'Advance Payment Bond', 'Performance Bond', 'Retention Money Bond', 'Other Bond'] },
        price: Number,
        perAnnum: Boolean,
        status: { type: String, enum: ['Pending', 'Rejected', 'Accepted'], default: 'Pending' },
    }],

    attachments: [Object],                                                      // for LG 100% Cash Margin
    issueLg: { email: String, city: String, branchName: String, branchAddress: String },      // for LG 100% Cash Margin
    collectLg: { email: String, city: String, branchName: String, branchAddress: String }     // for LG 100% Cash Margin

}, { timestamps: true, versionKey: false });

bidSchema.plugin(mongoosePaginate);
bidSchema.plugin(aggregatePaginate);

// Create the bid model
const BidModel = mongoose.model<IBid>('Bid', bidSchema);

export const createBid = (obj: IBid) => BidModel.create(obj);
export const findBid = (query: Record<string, any>) => BidModel.findOne(query);
export const findBids = (query: Record<string, any>) => BidModel.find(query);
export const updateBid = (query: Record<string, any>, update: Record<string, any>) => BidModel.findOneAndUpdate(query, update, { new: true });
export const countBids = (query: FilterQuery<IBid>) => BidModel.countDocuments(query);

export const BidsStatusCount = (businessId: string) => BidModel.aggregate([
    {
        $match: { bidBy: new mongoose.Types.ObjectId(businessId) }
    },
    {
        $group: {
            _id: '$status',
            count: { $sum: 1 }
        }
    },
    {
        $project: {
            _id: 0,
            status: '$_id',
            count: 1
        }
    }
]);

export const updateBids = (query: any, update: any) => BidModel.updateMany(query, update);

export const fetchAllBids = async ({ query, page, limit, populate, sort = { updatedAt: -1 } }: IPaginationFunctionParams): Promise<IPaginationResult<IBid>> => {
    const { data, pagination }: IPaginationResult<IBid> =
        await getMongoosePaginatedData({
            model: BidModel,
            query,
            page,
            limit,
            populate,
            sort
        });
    return { data, pagination };
};
