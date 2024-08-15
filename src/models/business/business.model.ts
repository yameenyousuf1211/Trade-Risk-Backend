import { model, Schema, Document } from 'mongoose';
import { COMPANY_CONSTITUTION, ROLES } from '../../utils/constants';

const BusinessSchema: Schema = new Schema({
    // common fields
    name: { type: String },
    email: { type: String, lowercase: true, required: true },
    type: { type: String, enum: ['corporate', 'bank'] },
    address: { type: String },
    swiftCode: { type: String },
    pocEmail: { type: String },
    pocPhone: { type: String },
    country: { type: String },

    // bank fields 
    confirmationLcs: { type: Boolean },
    discountingLcs: { type: Boolean },
    guaranteesCounterGuarantees: { type: Boolean },
    discountingAvalizedBills: { type: Boolean },
    avalizationExportBills: { type: Boolean },
    riskParticipation: { type: Boolean },

    // corporate fields
    phone: { type: String },
    constitution: { type: String }, //enum: Object.values(COMPANY_CONSTITUTION) },
    businessType: { type: String },
    productInfo: {
        products: [String],
        annualSalary: Number,
        annualValueExports: Number,
        annualValueImports: Number
    },
    currentBanks: {
        type: [{ name: String, country: String, city: String }]
    },
    bank: { type: String, },
    accountNumber: { type: Number },
    accountHolderName: { type: String },
    accountCountry: { type: String },
    accountCity: { type: String },
    pocName: { type: String },
    businessNature: { type: String },
    poc: { type: String },
    pocDesignation: { type: String },

});

const BusinessModel = model('Business', BusinessSchema);

export const createBusiness = (obj: any): Promise<any> => BusinessModel.create(obj);
// export const createBank = (obj:any): Promise<any> => BusinessModel.create(obj);
// export const findBank = (query: Record<string, any>): any => BusinessModel.findOne(query);
// // export const findBank = (query: Record<string, any>): QueryWithHelpers<any, Document<any, any, any>> => BankModel.findOne(query);


// create dummy business data for testing
const businessData = {
    name: { type: String },
    email: { type: String, lowercase: true, required: true },
    type: { type: String, enum: ['corporate', 'bank'] },
    address: { type: String },
    swiftCode: { type: String },
    pocEmail: { type: String },
    pocPhone: { type: String },
    country: { type: String },

    // bank fields 
    confirmationLcs: { type: Boolean },
    discountingLcs: { type: Boolean },
    guaranteesCounterGuarantees: { type: Boolean },
    discountingAvalizedBills: { type: Boolean },
    avalizationExportBills: { type: Boolean },
    riskParticipation: { type: Boolean },
};

