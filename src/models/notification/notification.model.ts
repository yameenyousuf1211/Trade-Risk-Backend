import mongoose, { Schema, Document, Types } from 'mongoose';
import { getMongooseAggregatePaginatedData, sendFirebaseNotification } from "../../utils/helpers";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IPaginationFunctionParams, IPaginationResult, ICreateAndSendNotificationParams } from "../../utils/interfaces";
import { NOTIFICATION_TYPES, ROLE_TYPES } from '../../utils/constants';
import { findLc } from '../lcs/lcs.model';
import { findBid } from '../bids/bids.model.';
import { findUser, findUsers, getFcmTokens } from '../user/user.model';

interface INotification {
    id?: string;
    _id?: string;
    title: string;
    message: string;
    type: string;
    sender: Types.ObjectId;
    receivers?: [Types.ObjectId];
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
    receivers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
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

export const createAndSendNotifications = async ({ type, sender, lc, bid }: ICreateAndSendNotificationParams) => {
    let body: string = '';
    let title: string = '';
    let lcObj: any;
    let bidObj: any;
    let senderObj: any;
    let receivers: string[] = [];
    let data = {};

    if (lc) lcObj = await findLc({ _id: lc });
    if (bid) bidObj = await findBid({ _id: bid });
    if (sender) senderObj = await findUser({ _id: sender }).populate('business');

    switch (type) {
        case NOTIFICATION_TYPES.LC_CREATED:
            // get array of users ids
            const bankUsers = await findUsers({ type: ROLE_TYPES.BANK }).select('_id');
            // console.log('LC_CREATED users?.length >>>>>>>>>>', bankUsers?.length);

            receivers = bankUsers.map((user: any) => user._id);

            title = `New ${lcObj?.type} Request`;
            body = `Ref No: ${lcObj?.refId} from ${senderObj?.business?.name} by ${senderObj?.name}`;
            data = { lc: lcObj?._id };
            // console.log({ title, body });
            break;

        case NOTIFICATION_TYPES.BID_CREATED:
            // get array of users ids
            const corporateUsers = await findUsers({ business: lcObj?.createdBy, type: ROLE_TYPES.CORPORATE }).select('_id');
            // console.log('BID_CREATED users?.length >>>>>>>>>>', corporateUsers?.length);

            receivers = corporateUsers.map((user: any) => user._id);

            title = 'New Bid';
            body = `${senderObj?.business?.name} has placed a bid on request # ${lcObj?.refId}`;
            data = { lc: lcObj?._id, bid: bidObj?._id };
            break;

        case NOTIFICATION_TYPES.BID_ACCEPTED:
            // get array of users ids
            const bidSubmittedBy = await findUsers({ business: bidObj?.bidBy, type: ROLE_TYPES.BANK }).select('_id');
            // console.log('BID_ACCEPTED users?.length >>>>>>>>>>', bidSubmittedBy?.length);

            receivers = bidSubmittedBy.map((user: any) => user._id);

            title = 'Bid Accepted';
            body = `${senderObj?.business?.name} has accepted your bid on request # ${lcObj?.refId}`;
            data = { lc: lcObj?._id, bid: bidObj?._id };
            break;

        case NOTIFICATION_TYPES.BID_REJECTED:
            // get array of users ids
            const bidBy = await findUsers({ business: bidObj?.bidBy, type: ROLE_TYPES.BANK }).select('_id');
            // console.log('BID_REJECTED users?.length >>>>>>>>>>', bidBy?.length);

            receivers = bidBy.map((user: any) => user._id);

            title = 'Bid Rejected';
            body = `${senderObj?.business?.name} has rejected your bid on request # ${lcObj?.refId}`;
            data = { lc: lcObj?._id, bid: bidObj?._id };
            break;

        default:
            break;
    }

    if (!receivers?.length) return;

    // get fcm tokens of users
    const tokens = await getFcmTokens({ _id: { $in: receivers } });

    const notification = await NotificationModel.create({
        title,
        message: body,
        type,
        sender,
        receivers,
        lc,
        bid
    });

    if (!tokens?.length) return notification;

    await sendFirebaseNotification({ title, body, tokens, data });

    return notification;
}
