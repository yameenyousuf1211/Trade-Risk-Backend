import webpush from 'web-push';
import { asyncHandler, generateResponse } from '../../utils/helpers';
import { NextFunction, Request, Response } from "express";
import { findUser, getAllUsers } from '../../models';
import { STATUS_CODES } from '../../utils/constants';
//  const vapidKeys = webpush.generateVAPIDKeys();

 
const publicKey = "BKOPYlgOw1eAWgeVCt8uZWCTAaBUd4ReGVd9Qfs2EtK_DvRXuI_LFQSiyxjMN8rg47BWP9_8drlyE0O1GXMP4ew";
const privateKey = 'iRirUzPo10bdjtVAsbeiJq15Lin1NrV9hd2s9edVQ5o'

webpush.setVapidDetails(
    "mailto:aliusaid55@gmail.com",
    publicKey,
    privateKey
);

export const notifications = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, body } = req.body;
      const payload = JSON.stringify({ title, body });
      const limit = +(req.query.limit || 1000);
      const page = +(req.query.page || 1); // Ensure page is parsed as an integer
      const query = {};
  
      // Send notification to a specific user if userId is provided
      if (req.query.userId) {
        const user = await findUser({ _id: req.query.userId });
        if (!user) {
            return next({
                status: STATUS_CODES.NOT_FOUND,
                message: 'User not found',
            });
        }
        if (Array.isArray(user.gcmTokens)) {
          for (const subscription of user.gcmTokens) {
            await webpush.sendNotification(subscription, payload).catch(err => {
              console.error('Error sending notification to user:', err);
            });
          }
        } else {
          console.error('user.gcmTokens is not an array:', user.gcmTokens);
        }
        return generateResponse(null, 'Notifications sent', res);
      }
  
      // Send notifications to all users if userId is not provided
      const users = await getAllUsers({ limit, page, query });
      for (const user of users.data) {
        if (Array.isArray(user.gcmTokens)) {
          for (const subscription of user.gcmTokens) {
            await webpush.sendNotification(subscription, payload).catch(err => {
              console.error('Error sending notification to user:', err);
            });
          }
        } else {
          console.error('user.gcmTokens is not an array:', user.gcmTokens);
        }
      }
      generateResponse(null, 'Notifications sent', res);
    } catch (error) {
      console.error('Error in notifications handler:', error);
      next(error); // Pass the error to the error handling middleware
    }
  });

export const subscribe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const subscription = req.body;
    
    const user = await findUser({_id:req.user._id})
    user.gcmTokens.push(subscription);
    // gcmTokens
    await user.save();
    
    generateResponse(subscription, 'Subscription stored', res);
});