import mongoose, { Schema, Document } from 'mongoose';
import { getMongooseAggregatePaginatedData } from "../../utils/helpers";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IPaginationFunctionParams, IPaginationResult } from "../../utils/interfaces";

export interface INotification extends Document {
    title: string;
    message: string;
    user:string
    createdAt: Date;
    isRead:boolean
}
export interface CreateNotificationInput {
    title: string;
    message: string;
    requestId:string;
    senderId:string;
    receiverId: string[];
}

const notificationSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    requestId:{
        type:String,
    },
    message: {
        type: String,
        required: true,
    },
    senderId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    receiverId: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    isRead:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

notificationSchema.plugin(mongoosePaginate);
notificationSchema.plugin(aggregatePaginate);

const NotificationModel = mongoose.model<INotification>('Notification', notificationSchema);

export const fetchNotification = async ({ query, page, limit }: IPaginationFunctionParams)
    : Promise<IPaginationResult<INotification>> => {
    const { data, pagination }: IPaginationResult<INotification> = await getMongooseAggregatePaginatedData({
        model: NotificationModel, query: [query], page, limit
    });
    return { data, pagination };
};

export const findNotification = (query: any) => NotificationModel.find(query);
export const createNotification =  (notification: CreateNotificationInput) => NotificationModel.create(notification);
export const updateNotification = (id: string, notification:any) => NotificationModel.findByIdAndUpdate(id, notification);
export const deleteNotification = (id: string) => NotificationModel.findByIdAndDelete(id);
