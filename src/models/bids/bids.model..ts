import mongoose, { Schema, Document } from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IPaginationFunctionParams, IPaginationResult } from "../../utils/interfaces";
import { getMongoosePaginatedData } from "../../utils/helpers";

export interface IBid extends Document {
    bidType: string;
    bidValidity:Date
    discountingPrice:number
    confirmationPrice:number
    isDeleted:boolean
    createdAt: Date;
    bidBy:string
    status: string;
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
    
 }, { timestamps: true,versionKey:false}
);
bidSchema.plugin(mongoosePaginate);
bidSchema.plugin(aggregatePaginate);
// Create the bid model
const BidModel = mongoose.model<IBid>('bid', bidSchema);

export const createBid  = (obj:IBid) => BidModel.create(obj);
export const findBid = (query: Record<string, any>) => BidModel.findOne(query);
// export const findMany = (query: Record<string, any>) => BidModel.find(query);
export const fetchBids = async ({ query, page, limit, populate }: IPaginationFunctionParams)
    : Promise<IPaginationResult<IBid>> => {
    const { data, pagination }: IPaginationResult<IBid> = await getMongoosePaginatedData({
        model: BidModel, query,page, limit, populate
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

export const allBidsOfOneUser = (userId:string) => BidModel.aggregate([
    {
        $lookup: {
            from: 'lcs',
            localField: 'lc',
            foreignField: '_id',
            as: 'lc'
        }
    },
    {
        $unwind: '$lc'
    },
    {
        $project: {
            _id: 1,
            bidType: 1,
            bidValidity: 1,
            confirmationPrice: 1,
            discountingPrice: 1,
            isDeleted: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            lc: {
                _id: 1,
                lcNumber: 1,
                lcType: 1,
                lcValue: 1,
                lcStatus: 1,
                lcExpiryDate: 1,
                createdAt: 1,
                updatedAt: 1,
                createdBy:1,
                amount:1
            }
        }
    },
    {
        $match: { 'lc.createdBy': new mongoose.Types.ObjectId(userId) }
    },
    {
        $sort: {
            'lc.amount': -1 // Sort by createdAt field in descending order
        }
    }
]);