import mongoose, { Schema, Document } from 'mongoose';
import { QueryWithHelpers } from 'mongoose';
import { IBank } from '../../interface';



const BankSchema: Schema = new Schema({
    name: { type: String },
    country: { type: String },
    city: { type: String },
    isDeleted:{type:Boolean,default:false}
});

const BankModel = mongoose.model<IBank>('bank', BankSchema);

export const createBanks = (array:IBank[]): Promise<any> => BankModel.insertMany(array);
// export const findBank = (query: Record<string, any>): QueryWithHelpers<any, Document<any, any, any>> => BankModel.findOne(query);
