import mongoose, { Schema, Document, Types } from 'mongoose';
import { getMongooseAggregatePaginatedData, sendFirebaseNotification } from "../../utils/helpers";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IPaginationFunctionParams, IPaginationResult } from "../../utils/interfaces";
import { NOTIFICATION_TYPES } from '../../utils/constants';
import { findLc } from '../lcs/lcs.model';
import { findBid } from '../bids/bids.model.';
import { findUser } from '../user/user.model';

interface INotification {
    id?: string;
    _id?: string;
    title: string;
    message: string;
    type: string;
    sender: Types.ObjectId;
    receiver?: Types.ObjectId;
    lc: Types.ObjectId;
    bid: Types.ObjectId;
    isRead: boolean
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema: Schema = new Schema<INotification>({
    title: String,
    message: String,
    type: { type: String, enum: Object.values(NOTIFICATION_TYPES) },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: Schema.Types.ObjectId, ref: 'User' },
    lc: { type: Schema.Types.ObjectId, ref: 'LC', default: null },
    bid: { type: Schema.Types.ObjectId, ref: 'Bid', default: null },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

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
export const createNotification = (notification: INotification) => NotificationModel.create(notification);
export const updateNotification = (id: string, notification: any) => NotificationModel.findByIdAndUpdate(id, notification);
export const deleteNotification = (id: string) => NotificationModel.findByIdAndDelete(id);

export const createAndSendNotifications = async ({ type, sender, receiver, lc, bid }: any) => {
    let body: string;
    let title: string;
    let lcObj: any;
    let bidObj: any;
    let senderObj: any;

    if (lc) lcObj = await findLc({ _id: lc });
    if (bid) bidObj = await findBid({ _id: bid });
    if (sender) senderObj = await findUser({ _id: sender }).populate('business');


    switch (type) {
        case NOTIFICATION_TYPES.LC_CREATED:
            title = `New ${lcObj?.type} Request`;
            body = `Ref No: ${lcObj?.refId} from ${senderObj?.business?.name} by ${senderObj?.name}`;
            break;

        // case NOTIFICATION_TYPES.BID_CREATED:
        //     //   title = `${sender?.userName}`;
        //     body = `Commented on your post`;
        //     break;

        default:
            break;
    }

    const notification = await NotificationModel.create();
    await sendFirebaseNotification({ title, body, tokens: [receiver?.fcmToken] });

    return notification;

}
