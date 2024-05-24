import mongoose, { Schema, Document } from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IPaginationFunctionParams, IPaginationResult } from "../../utils/interfaces";
import { getMongoosePaginatedData,getMongooseAggregatePaginatedData } from "../../utils/helpers";
import { QueryWithHelpers } from "mongoose";

// Define the interface for your document
interface ILcs extends Document {
    _id:string
    participantRole?:string
    lcType?:string
    curreny:string 
    amount?:number
    paymentTerms:string
    createdBy?:string
    issuingBank:{
        bank:string
        country:string
    }
    extraInfo:{
        days:Date
        other:string
    }
    advisingBank:{
        bank:string
        country:string
    }
    confirmingBank:{
        bank:string
        country:string
    }
    shipmentPort:{
        country:string
        port:string
    }
    transhipment:boolean
    expectedConfirmationDate:Date
    expectedDiscountingDate:Date
    productDescription:string
    lcPeriod:{
        expectedDate:boolean
        startDate:Date
        endDate:Date
    }
    importerInfo:{
        applicantName:string
        countryOfImport:string
    }
    exporterInfo:{
        beneficiaryName?:string
        countryOfExport?:string
        beneficiaryCountry?:string
    }
    confirmationCharges:{
      behalfOf?: string
    }
    discountAtSight?:string
    pricePerAnnum?:number
    refId?:number
    attachments?:string[]
    draft?:boolean,
    createdAt:Date,
    updatedAt:Date
}

// Define the schema
const LcsSchema: Schema = new Schema({
    participantRole: {
        type: String,
        enum: ['importer', 'exporter'], // Assuming participant can be either importer or exporter
    },
    currency:{
        type: String, // usd or any other currency
    },
    lcType:{
        type: String, // LC type
        enum:["LC Confirmation","LC Discounting","LC Confirmation & Discounting"]
    },
    amount: {
        type: Number,
    },
    refId:{
        type:Number
    },
    extraInfo:{
        dats:{
            type:Date
        },
        other:{
            type:String
        }
    },
    paymentTerms: {
        type: String,
    },
    issuingBank: {
        bank: {
            type: String,
        },
        country: {
            type: String,
        },
    },
    advisingBank: {
        bank: {
            type: String,
        },
        country: {
            type: String,
        },
    },
    expectedDiscountingDate:{
        type:Date
    },
    expectedConfirmationDate:{
        type:Date
    },
    confirmingBank: {
        bank: {
            type: String,
        },
        country: {
            type: String,
        },
    },
    shipmentPort: {
        country: {
            type: String,
        },
        port: {
            type: String,
        },
    },
    transhipment: {
        type: Boolean,
    },
    expectedDate: {
        type: Date,
    },
    productDescription: {
        type: String,
    },
    lcPeriod: {
        expectedDate:{
            type: Boolean,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
    },
    importerInfo: {
        applicantName: {
            type: String,
        },
        countryOfImport: {
            type: String,
        },
    },
    exporterInfo: {
        beneficiaryName: {
            type: String,
        },
        countryOfExport: {
            type: String,
        },
        beneficiaryCountry: {
            type: String,
        },
        bank: {
            type: String,
        },
    },
    confirmationInfo: {
        behalfOf: {
            type: String,
        },
        pricePerAnnum: {
            type: Number,
        },
    },
    discountingInfo:{
        discountAtSight: {
            type: String,
        },
        pricePerAnnum: {
            type: Number,
        },
        behalfOf: {
            type: String,
        },
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
 
    attachments: {
        type: [String], // Assuming an array of strings for attachment URLs
    },
    draft: {
        type: Boolean,
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        enum:['Pending','Expired','Rejected','Accepted','Add bid'],
        default:'Add bid'
    },
},{timestamps:true,versionKey:false});

LcsSchema.plugin(mongoosePaginate);
LcsSchema.plugin(aggregatePaginate);
// Create and export the model
const LcsModel =  mongoose.model<ILcs>('lcs', LcsSchema);

export const fetchLcs = async ({ query, page, limit, populate }: IPaginationFunctionParams)
    : Promise<IPaginationResult<ILcs>> => {
    const { data, pagination }: IPaginationResult<ILcs> = await getMongooseAggregatePaginatedData({
        model: LcsModel, query: [query], page, limit
    });
    return { data, pagination };
};


export const createLc = (obj:ILcs) => LcsModel.create(obj)
export const findLc = (query: Record<string, any>): QueryWithHelpers<any, Document> => LcsModel.findOne(query);
export const updateLc = (query: Record<string, any>, update: Record<string, any>): QueryWithHelpers<any, Document> => LcsModel.findOneAndUpdate(query, update)

