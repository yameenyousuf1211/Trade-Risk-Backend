export interface IBank extends Document {
    _id:string
    name: string;
    country: string;
    city: string;
    isDeleted:boolean
}