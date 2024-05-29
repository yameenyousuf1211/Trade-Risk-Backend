import webpush from "web-push";
import { asyncHandler, generateResponse } from "../../utils/helpers";
import { NextFunction, Request, Response } from "express";
import { findUser, getAllUsers } from "../../models";
import { STATUS_CODES } from "../../utils/constants";
import { IGcmToken } from "../../interface";
//  const vapidKeys = webpush.generateVAPIDKeys();

const publicKey =
  "BKOPYlgOw1eAWgeVCt8uZWCTAaBUd4ReGVd9Qfs2EtK_DvRXuI_LFQSiyxjMN8rg47BWP9_8drlyE0O1GXMP4ew";
const privateKey = "iRirUzPo10bdjtVAsbeiJq15Lin1NrV9hd2s9edVQ5o";

webpush.setVapidDetails("mailto:aliusaid55@gmail.com", publicKey, privateKey);

export const notifications = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, body } = req.body;
    const role = req.query.role;
    const userId = req.query.userId;

    const payload = JSON.stringify({ title, body });
    const limit = +(req.query.limit || 1000);
    const page = +(req.query.page || 1); 
    let query: any = {};

    if (role) {
      query = { ...query, role };
    }
    if (userId) {
      query = { ...query, _id: userId };
    }

    const response = await getAllUsers({ limit, page, query });
    const users = response.data;

    for (const user of users) {
      if (Array.isArray(user.gcmTokens) && user.gcmTokens.length > 0) {
        for (const subscription of user.gcmTokens) {
          try {
            await webpush.sendNotification(subscription, payload);
          } catch (error: any) {
            console.log(error);

            if (error.statusCode === 410) {
              const findUserWithFalseSubscription = await findUser({
                _id: user._id,
              });
              findUserWithFalseSubscription.gcmTokens =
                findUserWithFalseSubscription.gcmTokens.filter(
                  (token: IGcmToken) => token.endpoint !== subscription.endpoint
                );
              await findUserWithFalseSubscription.save();
            } else {
              console.error("Failed to send notification:");
            }
          }
        }
      }
    }
    generateResponse(null, "Notifications sent", res);
  }
);

export const subscribe = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const subscription = req.body;

    const user = await findUser({ _id: req.user._id });

    // Check if the subscription already exists in gcmTokens
    const tokenExists = user.gcmTokens.some(
      (token: IGcmToken) => token.endpoint === subscription.endpoint
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
