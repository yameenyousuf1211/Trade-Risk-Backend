import mongoose, { Schema, Document } from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IPaginationFunctionParams, IPaginationResult } from "../../utils/interfaces";
import { getMongooseAggregatePaginatedData, getMongoosePaginatedData } from "../../utils/helpers";

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
    risk: string
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
    discountMargin: Number,
    discountBaseRate: String,
    perAnnum: Boolean,
    status: {
        type: String,
        enum: ['Pending', 'Expired', 'Rejected', 'Accepted'],
        default: 'Pending'
    },
}, { timestamps: true, versionKey: false });

bidSchema.plugin(mongoosePaginate);
bidSchema.plugin(aggregatePaginate);
// Create the bid model
const BidModel = mongoose.model<IBid>('Bid', bidSchema);

export const createBid = (obj: IBid) => BidModel.create(obj);
export const findBid = (query: Record<string, any>) => BidModel.findOne(query);
export const findBids = (query: Record<string, any>) => BidModel.find(query);
export const updateBid = (query: Record<string, any>, update: Record<string, any>) => BidModel.updateOne(query, update);

// export const findMany = (query: Record<string, any>) => BidModel.find(query);

export const fetchBids = async ({ query, page, limit, populate }: IPaginationFunctionParams)
    : Promise<IPaginationResult<IBid>> => {
    const { data, pagination }: IPaginationResult<IBid> = await getMongooseAggregatePaginatedData({
        model: BidModel, query: [query], page, limit,
    });

    return { data, pagination };
};

export const BidsStatusCount = (userId: string) => BidModel.aggregate([
    {
        $match: { bidBy: new mongoose.Types.ObjectId(userId) }
    },
    {
        $group: {
            _id: '$status',
            count: { $sum: 1 }
        }
    }
]);

export const updateBids = (query: any, update: any) => BidModel.updateMany(query, update);



