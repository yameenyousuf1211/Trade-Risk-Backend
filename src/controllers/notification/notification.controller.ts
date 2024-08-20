import webpush from "web-push";
import { asyncHandler, generateResponse } from "../../utils/helpers";
import { NextFunction, Request, Response } from "express";
import { createNotification, deleteNotification, fetchNotification, findNotification, findUser, getAllUsers, updateNotification } from "../../models";
import { STATUS_CODES } from "../../utils/constants";
import mongoose, { PipelineStage } from "mongoose";
//  const vapidKeys = webpush.generateVAPIDKeys();

const publicKey =
  "BKOPYlgOw1eAWgeVCt8uZWCTAaBUd4ReGVd9Qfs2EtK_DvRXuI_LFQSiyxjMN8rg47BWP9_8drlyE0O1GXMP4ew";
const privateKey = "iRirUzPo10bdjtVAsbeiJq15Lin1NrV9hd2s9edVQ5o";

webpush.setVapidDetails("mailto:aliusaid55@gmail.com", publicKey, privateKey);

// export const notifications = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { title, body,requestId } = req.body;
      
//     const role = req.query.role;
//     const userId = req.query.userId;

//     const payload = JSON.stringify({ title, body });
//     const limit = +(req.query.limit || 10000);
//     const page = +(req.query.page || 1); 
//     let query: any = {};

//     if (role) {
//       query = { ...query, role };
//     }
//     if (userId) {
//       query = { ...query, _id: userId };
//     }

//     const response = await getAllUsers({ limit, page, query });
//     const users = response.data;

//     for (const user of users) {
//       const userNotification = await createNotification({title,message:body,user:user._id!,requestId:requestId})
//       console.log(userNotification);
//       if (Array.isArray(user.fcmTokens) && user.fcmTokens.length > 0) {
//         for (const subscription of user.fcmTokens) {
//           try {
//             await webpush.sendNotification(subscription, payload);
//           } catch (error: any) {
//             console.log(error);

//             if (error.statusCode === 410) {
//               const findUserWithFalseSubscription = await findUser({
//                 _id: user._id,
//               });
//               findUserWithFalseSubscription.gcmTokens =
//                 findUserWithFalseSubscription.gcmTokens.filter(
//                   (token:any) => token.endpoint !== subscription.endpoint
//                 );
//               await findUserWithFalseSubscription.save();
//             } else {
//               console.error("Failed to send notification:");
//             }
//           }
//         }
//       }
//     }
//     generateResponse(null, "Notifications sent", res);
//   }
// );

export const subscribe = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const subscription = req.body;

    const user = await findUser({ _id: req.user._id });

    // Check if the subscription already exists in gcmTokens
    const tokenExists = user.gcmTokens.some(
      (token: any) => token.endpoint === subscription.endpoint
    );

    if (!tokenExists) {
      user.gcmTokens.push(subscription);
      await user.save();
      generateResponse(subscription, "Subscription stored", res);
    } else {
      generateResponse(null, "Subscription already exists", res);
    }
  }
);


export const fetchNotifications = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
   const limit = +(req.query.limit || 10);
   const page = +(req.query.page || 1);

    const pipeline:PipelineStage[] = []
  
    pipeline.push({$match:{receiverId:new mongoose.Types.ObjectId(req.user.business._id as string)}})
    pipeline.push({$sort:{createdAt:-1}})

    const notification = await fetchNotification({ limit, page,query:pipeline });
    generateResponse(notification, "Notifications fetched", res);
  }
);

export const updateNotifications = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {

  const id = req.query.id; // notification id 

  if(id) {
    await updateNotification(id as string,{isRead:true});
    return generateResponse(null, "Notification updated", res);
  } 

  const notification = await findNotification({user:req.user._id});
  notification.map(async (item:any) => {
    await updateNotification(item._id,{isRead:true});
  })

  generateResponse(null, "Notification updated", res);
})

export const deleteNotifications = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id; 
  const notification = await deleteNotification(id as string);
  generateResponse(notification, "Notification deleted", res);
})