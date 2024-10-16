import mongoose, { Schema, Document } from 'mongoose';
import { IBank } from '../../interface';

const BankSchema: Schema = new Schema({
    name: { type: String },
    country: { type: String },
    city: { type: String },
    isDeleted: { type: Boolean, default: false }
});

const BankModel = mongoose.model<IBank>('Bank', BankSchema);

export const createBanks = (array: IBank[]): Promise<any> => BankModel.insertMany(array);
export const createBank = (obj: any): Promise<any> => BankModel.create(obj);
export const findBank = (query: Record<string, any>): any => BankModel.findOne(query);
// export const findBank = (query: Record<string, any>): QueryWithHelpers<any, Document<any, any, any>> => BankModel.findOne(query);
