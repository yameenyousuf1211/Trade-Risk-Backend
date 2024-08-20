import mongoose, { Schema, Document } from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IPaginationFunctionParams, IPaginationResult } from "../../utils/interfaces";
import { getMongooseAggregatePaginatedData } from "../../utils/helpers";

interface IRisk extends Document {
    banks: string[];
    baftAgreement: {
        agreement: string;
        signCopy: string;
    };
    status:string;
    transaction: "Risk Participation" | "Outright Sales";
    riskParticipation?: string;
    outrightSales?: string;
    riskParticipationTransaction: {
        type: string;
        amount: number;
        returnOffer: string;
        baseRate: string;
        perAnnum: string;
        participationRate: string;
    };
    issuingBank: {
        bank: string;
        country: string;
    };
    advisingBank: {
        bank: string;
        country: string;
    };
    confirmingBank: {
        bank: string;
        country: string;
    };
    days: number;
    isLcDiscounting?: boolean;
    expectedDiscounting?: boolean;
    expectedDateDiscounting?: Date;
    expiryDate?: Date;
    startDate?: Date;
    paymentTerms?: string;
    shipmentPort: {
        country: string;
        port: string;
    };
    currency:string;
    transhipment?: boolean;
    expectedDateConfirmation?: Date;
    description?: string;
    importerInfo: {
        applicantName: string;
        countryOfImport: string;
    };
    exporterInfo: {
        beneficiaryName: string;
        countryOfExport: string;
        beneficiaryCountry: string;
    };
    paymentReceivedType?: string;
    attachment: string[];
    note?: string;
    createdBy: {
        _id: Schema.Types.ObjectId;
        ref: string;
    };
    draft?: boolean;
    isDeleted: boolean;
}

const RiskSchema: Schema = new Schema({
    banks: [{ type: String }],
    baftAgreement:{
        agreement: { type: String },
        signCopy:{type:String}
    },
    refId:{type:Number},
    transaction:{type:String,enum:["Risk Participation","Outright Sales"]} ,
    riskParticipation:{type:String},
    outrightSales:{type:String},
    riskParticipationTransaction:{
        type:{type:String},
        amount:{type:Number},
        returnOffer:{type:String},
        baseRate:{type:String},
        perAnnum:{type:String},
        participationRate:{type:String},
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
    days:{type:Number},
    isLcDiscounting:{type:Boolean},
    expectedDiscounting:{type:Boolean},
    expectedDateDiscounting:{type:Date},
    expiryDate:{type:Date},
    startDate:{type:Date},
    paymentTerms:{type:String},
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
    currency:{
        type:String
    },
    expectedDateConfirmation:{type:Date},
    description:{type:String},
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
    paymentReceviedType:{type:String},
    attachment:[{type:String}],
    note:{type:String},
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'user'
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
},{timestamps:true});

RiskSchema.plugin(mongoosePaginate);
RiskSchema.plugin(aggregatePaginate);

const RiskModel = mongoose.model<IRisk>('risks', RiskSchema);

export const fetchRisks = async ({ query, page, limit, populate }: IPaginationFunctionParams)
    : Promise<IPaginationResult<IRisk>> => {
    const { data, pagination }: IPaginationResult<IRisk> = await getMongooseAggregatePaginatedData({
        model: RiskModel, query: [query], page, limit
    });
    return { data, pagination };
};
export const createRisk = (payload:IRisk) => RiskModel.create(payload);
export const findRisk = (query: Record<string, any>) => RiskModel.findOne(query);
export const updateRisk = async (query: Record<string, any>, payload: Record<string, any>) => RiskModel.findOneAndUpdate(query, payload, { new: true });



