import { createNotification, findUser, getAllUsers, getFcmTokens } from "../models";
import { ROLES } from "./constants";
const admin = require('firebase-admin');
const serviceAccount = require('../../traderisk-463ed-firebase-adminsdk-g2ow6-9cdef4d862.json');
require('dotenv').config()

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET
});

interface NotificationParams {
    title: string;
    body: string;
    token: any;
    userType:string;
    requestId:string;
}

export const createAndSendNotifications = async ({  users, title,message, requestId,senderId,receiverId }:any,sendToAll:boolean,userType:string) => {
  if(sendToAll){
    users=[];
    const query: object = { type: userType};
    const usersData = await getAllUsers({query,page:1,limit:10000})  
      await Promise.all(usersData.data.map(async (user: any) => {
      const notification = await createNotification({
          title,
          message,
          requestId,
          senderId,
          receiverId: user._id || '',
      });

      users.push(user._id);
      return notification;
  }));
  }
  else{
    users=await findUser({'business':users});
    await createNotification({title, message, requestId,senderId,receiverId: receiverId});
  }
  let fcmTokens = await getFcmTokens(users);
  fcmTokens = fcmTokens.flat();

  sendFirebaseNotification({ title,body:message, token:fcmTokens,userType,requestId });
}

export const sendFirebaseNotification = async ({ title, body, token,userType,requestId }:NotificationParams) => {
  const message = {
    notification: {
      title,
      body,
    },
    data: {
      userType,
      requestId,
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

export const bucket = admin.storage().bucket();