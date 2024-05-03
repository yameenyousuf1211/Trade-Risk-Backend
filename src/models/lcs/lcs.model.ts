import mongoose, { Schema, Document } from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IPaginationFunctionParams, IPaginationResult } from "../../utils/interfaces";
import { getMongoosePaginatedData } from "../../utils/helpers";
import { QueryWithHelpers } from "mongoose";

// Define the interface for your document
interface ILcs extends Document {
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
    curreny:{
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
    },
    confirmationCharges: {
        behalfOf: {
            type: String,
        },
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    pricePerAnnum: {
        type: Number,
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
    const { data, pagination }: IPaginationResult<ILcs> = await getMongoosePaginatedData({
        model: LcsModel, query,page, limit, populate
    });

    return { data, pagination };
};


export const createLc = (obj:ILcs) => LcsModel.create(obj)
export const findLc = (query: Record<string, any>): QueryWithHelpers<any, Document> => LcsModel.findOne(query);

