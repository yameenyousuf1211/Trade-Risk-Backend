import mongoose, { Schema, Document } from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IPaginationFunctionParams, IPaginationResult } from "../../utils/interfaces";
import { getMongoosePaginatedData,getMongooseAggregatePaginatedData } from "../../utils/helpers";
import { QueryWithHelpers } from "mongoose";
import ILcs from '../../interface/lc.interface';

const bondSchema = new Schema({
    Contract: {
      type: String,
    },
    currencyType: {
      type: String,
    },
    cashMargin:{
        type: Number,
    },
    valueInPercentage: {
      type: Number,
    },
    expectedDate: {
      type: Date,
    },
    lgExpiryDate: {
      type: Date,
    },
    lgTenor: {
      lgTenorType: {
        type: String,
      },
      lgTenorValue: {
        type: Number,
      },
    },
    draft: {
      type: String,
    },
  });

// Define the schema
const LcsSchema: Schema = new Schema({
    participantRole: {
        type: String,
        enum: ['importer', 'exporter'], // Assuming participant can be either importer or exporter
    },
    currency:{
        type: String, // usd or any other currency
    },
    type:{
        type: String, // LC type
        enum:["LC Confirmation","LC Discounting","LC Confirmation & Discounting","LG Issuance"]
    },
    amount: {
        price:{type:Number},
        priceCurrency:{type:String},
       margin:{type:Number},
       marginCurrency:{type:String},
       amountPercentage:{type:String}
    },
    refId:{
        type:Number
    },
    extraInfo:{
        date:{
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
        swiftCode: {
            type: String,
        }
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
    period: {
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
            type: String,
        },
    },
    discountingInfo:{
        discountAtSight: {
            type: String,
        },
        pricePerAnnum: {
            type: String,
        },
        behalfOf: {
            type: String,
        },
        basePerRate:{
            type:String
        }
    },
    baseRate:{
        type:String
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
    lgIssuance:{
        type: String,
    },
    applicantDetails:{
        country:{
            type:String
        },
        company:{
            type:String
        },
        crNumber:{
            type:String
        }
    },
    beneficiaryDetails:{
        country:{
            type:String
        },
        name:{
            type:String
        },
        address:{
            type:String
        },
        phoneNumber:{
            type:String
        }
    },
    lgDetailsType:{
        type:String,
        enum:['Contract Related LGs (Bid Bond, Advance Payment Bond, Performance Bond etc)','Choose any other type of LGs']
    },
    bidBond:bondSchema,
    advancePaymentBond:bondSchema,
    performanceBond:bondSchema,
    retentionMoneyBond:bondSchema,
    otherBond:bondSchema,
    beneficiaryBanksDetails:{
        bank:{
            type:String
        },
        swiftCode:{
            type:String
        }
    },
    purpose:{
        type:String
    },
    remarks:{
        type:String
    },
    priceQuotes:{
        type:String
    },
    expectedPrice:{
        expectedPrice:{
            type:Boolean,
        },
        pricePerAnnum:{
            type:String
        }
    },
    typeOfLg:{
        type:String,
        enum:['Bid Bond','Advance Payment Bond','Performance Bond','Retention Money Bond','Payment LG','Zakat','Custom','SBLC','Other']
    },
    issueLgWithStandardText:{
        type:Boolean
    },
    lgStandardText:{
        type:String
    },
    physicalLg:{
        type:Boolean
    },
    physicalLgCountry:{
        type:String
    },
    physicalLgSwiftCode:{
        type:String
    }
    // lgIssueAgainst:{
    //     type:String,
    // },
    // lgType:{
    //     type:String,
    // },
    // // purpose:{type:String},
    // standardSAMA:{type:Boolean,default:false},
    // benificiaryBankName:{type:String},
    // chargesBehalfOf: {type: String},
    // remarks:{type:String},
    // priceType:{type:String},
    // Instrument:{type:String},
    // lgDetail:{
    //     lgIssueBehalfOf:{type:String},
    //     applicantCountry:{type:String},
    //     lgIssueFavorOf:{type:String},
    //     address:{type:String},
    //     benficiaryCountry:{type:String},
    // },
    // // margin:{type:Number},
    // // amountPercentage:{type:String},
    // // lgType:{type:String},
    // // purpose:{type:String},
    // // lgDetail:{

    // }
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

