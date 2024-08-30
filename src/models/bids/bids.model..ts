import mongoose, { Schema, Document } from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IPaginationFunctionParams, IPaginationResult } from "../../utils/interfaces";
import { getMongooseAggregatePaginatedData, getMongoosePaginatedData } from "../../utils/helpers";
import { get } from 'axios';

export interface IBid extends Document {
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
    bidType: {
        type: String,
        enum: ['LC Confirmation', 'LC Confirmation & Discounting', 'LC Discounting', 'Risk', 'LG Issuance'],
    },
    lc: { type: Schema.Types.ObjectId, ref: 'lcs' },
    risk: { type: Schema.Types.ObjectId, ref: 'risks' },
    bidValidity: Date,
    confirmationPrice: Number,
    discountingPrice: Number,
    bidBy: { type: Schema.Types.ObjectId, ref: 'Business' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    discountMargin: Number,
    discountBaseRate: String,
    perAnnum: Boolean,
    status: {
        type: String,
        enum: ['Pending', 'Expired', 'Rejected', 'Accepted'],
        default: 'Pending'
    },

    // admin bid submit status
    approvalStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'] },

    // for LG Re-Issuance
    bids: [{
        bank: String,
        bidType: { type: String, enum: ['Bid Bond', 'Advance Payment Bond', 'Performance Bond', 'Retention Money Bond', 'Other Bond'] },
        price: Number,
        perAnnum: Boolean,
        status: { type: String, enum: ['Pending', 'Rejected', 'Accepted'], default: 'Pending' },
    }],
}, { timestamps: true, versionKey: false });

bidSchema.plugin(mongoosePaginate);
bidSchema.plugin(aggregatePaginate);
// Create the bid model
const BidModel = mongoose.model<IBid>('Bid', bidSchema);

export const createBid = (obj: IBid) => BidModel.create(obj);
export const findBid = (query: Record<string, any>) => BidModel.findOne(query);
export const findBids = (query: Record<string, any>) => BidModel.find(query);
export const updateBid = (query: Record<string, any>, update: Record<string, any>) => BidModel.findOneAndUpdate(query, update, { new: true });

// export const findMany = (query: Record<string, any>) => BidModel.find(query);

export const BidsStatusCount = (userId: string) => BidModel.aggregate([
    {
        $match: { bidBy: new mongoose.Types.ObjectId(userId) }
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


export const fetchBids = async (pipelineStage: mongoose.PipelineStage[], page: number, limit = 10) => {
    const pipeline = [...pipelineStage,]
    // Lookup to join with businesses collection
    pipeline.push({
        $lookup: {
            from: 'businesses',
            localField: 'bidBy',
            foreignField: '_id',
            as: 'bidBy',
            pipeline: [
                { $project: { name: 1, email: 1, swiftCode: 1, pocEmail: 1 } }
            ]
        },
    });

    // Unwind the bidBy array to get a single object
    pipeline.push({
        $unwind: {
            path: '$bidBy',
            preserveNullAndEmptyArrays: true,
        },
    });

    // Lookup to join with lcs collection
    pipeline.push({
        $lookup: {
            from: 'lcs',
            localField: 'lc',
            foreignField: '_id',
            as: 'lc',
            pipeline: [
                { $project: { amount: 1, refId: 1, issuingBanks: 1, confirmingBank: 1, createdBy: 1, status: 1 } }
            ]
        },
    });

    // Unwind the lc array to get a single object
    pipeline.push({
        $unwind: {
            path: '$lc',
            preserveNullAndEmptyArrays: true,
        },
    });

    // Group the results
    pipeline.push({
        $group: {
            _id: '$_id',
            bidType: { $first: '$bidType' },
            confirmationPrice: { $first: '$confirmationPrice' },
            perAnnum: { $first: '$perAnnum' },
            bids: { $first: '$bids' },
            bidValidity: { $first: '$bidValidity' },
            approvalStatus: { $first: '$approvalStatus' },
            status: { $first: '$status' },
            bidBy: { $first: '$bidBy' },
            lc: { $first: '$lc' },
            createdBy: { $first: '$createdBy' },
            createdAt: { $first: '$createdAt' },
            updatedAt: { $first: '$updatedAt' },
        },
    });

    // Sort the results by creation date
    pipeline.push({ $sort: { createdAt: -1 } });
    const { data, pagination }: IPaginationResult<IBid> = await getMongooseAggregatePaginatedData({
        model: BidModel, query: [pipeline], page, limit
    });
    return { data, pagination }

}
