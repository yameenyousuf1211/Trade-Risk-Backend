// import { createNotification, findUser, getAllUsers, getFcmTokens } from "../models";
// import admin from 'firebase-admin';
// import path from 'path';
// // require('dotenv').config()

// const serviceAccount = path.resolve('./traderisk-463ed-firebase-adminsdk-g2ow6-9cdef4d862.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: process.env.STORAGE_BUCKET,
// });

// interface IPayload {
//   [key: string]: any;
// }

// interface NotificationParams {
//   title: string;
//   body: string;
//   tokens: string[];
//   payload?: IPayload;
// }

// const fetchUsers = async (sendToAll: boolean, userType: string, users: any[]) => {
//   if (sendToAll) {
//     const query = { type: userType };
//     const usersData = await getAllUsers({ query, page: 1, limit: 1000 });
//     console.log('usersData>>>>>>>>>>', usersData);
//     return usersData.data.map((user: any) => user._id);
//   } else {
//     const user = await findUser({ business: users });
//     return [user._id];
//   }
// };

// const createNotifications = async (users: string[], title: string, message: string, requestId: string, senderId: string, receiverId?: string) => {
//   const notifications = users.map(userId => createNotification({
//     title,
//     message,
//     requestId,
//     senderId,
//     receiverId: userId || '',
//   }));
//   await Promise.all(notifications);
// };

// export const createAndSendNotifications = async ({
//   users,
//   title,
//   message,
//   requestId,
//   senderId,
//   receiverId,
// }: any, sendToAll: boolean, userType: string) => {

//   console.log('sendToAll, userType, users>>>>>>>>>>', sendToAll, userType, users);

// const userIds = await fetchUsers(sendToAll, userType, users);
// await createNotifications(userIds, title, message, requestId, senderId, receiverId);

// const fcmTokens = await getFcmTokens(userIds);
// const payload = { userType, requestId: requestId.toString() };

//   const notificationData: NotificationParams = { title, body: message, tokens: fcmTokens, payload };
//   await sendFirebaseNotification(notificationData);
// };