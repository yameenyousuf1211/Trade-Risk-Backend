import mongoose, { Schema, Document } from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IPaginationFunctionParams, IPaginationResult } from "../../utils/interfaces";
import { getMongoosePaginatedData } from "../../utils/helpers";
import { QueryWithHelpers } from "mongoose";

interface IBid extends Document {
    status: string;
    bidType: string;
    discountingPrice:number
    confirmationPrice:number
    isDeleted:boolean
    createdAt: Date;
    updatedAt: Date;
}

// Define the bid schema
const bidSchema: Schema = new Schema({
    
    bidType:{
        type: String,
        enum: ['LC Confirmation', 'LC Confirmation & Discounting', 'LC Discounting'],
    },
    lc:{
        type: Schema.Types.ObjectId,
        ref: 'lcs'
    },
    bidValidity:{
        type:Date
    },
    confirmationPrice:{
        type:Number
    },
    discountingPrice:{
        type:Number
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    bidBy:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status:{
        type:String,
        enum:['Pending','Expired','Rejected','Accepted'],
        default:'Pending'
    },
    
 }, { timestamps: true}
);
bidSchema.plugin(mongoosePaginate);
bidSchema.plugin(aggregatePaginate);
// Create the bid model
const BidModel = mongoose.model<IBid>('bid', bidSchema);

export const createBid  = (obj:IBid) => BidModel.create(obj);
export const findBid = (query: Record<string, any>) => BidModel.findOne(query);

export const fetchBids = async ({ query, page, limit, populate }: IPaginationFunctionParams)
    : Promise<IPaginationResult<IBid>> => {
    const { data, pagination }: IPaginationResult<IBid> = await getMongoosePaginatedData({
        model: BidModel, query,page, limit, populate
    });

    return { data, pagination };
};