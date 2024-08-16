import { createNotification, getAllUsers, getFcmTokens } from "../models";
import { ROLES } from "./constants";

const admin = require('firebase-admin');
const serviceAccount = require('path-to-json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

interface NotificationParams {
    title: string;
    body: string;
    token: any;
}

export const createAndSendNotifications = async ({  users, title,message, requestId,senderId,receiverId }:any,sendToAll:any) => {
  if(sendToAll){
    const query: object = { role: { $ne: ROLES.ADMIN }, isDeleted: false};
    const usersData = await getAllUsers({query,page:1,limit:10000})  //TODO how to find all users without passing limit ?
    users = usersData.data.map((user:any) => user._id);
  }
    let fcmTokens = await getFcmTokens(users);
    fcmTokens = fcmTokens.flat();
    const notification = await createNotification({ title, message,requestId,senderId,receiverId  });

    sendFirebaseNotification({ title,body:message, token:fcmTokens });

    return notification;
}

export const sendFirebaseNotification = async ({ title, body, token }:NotificationParams) => {
  const message = {
    notification: {
      title,
      body,
    }
  };

  try {
    if (Array.isArray(token)) {
      const multicastMessage = {
        ...message,
        tokens: token, 
      };
      const response = await admin.messaging().sendMulticast(multicastMessage);
      return response;
    }
  } catch (error) {
    console.error('Error sending message:', error);
    return error;
  }
};
