import webpush from 'web-push';
import { asyncHandler, generateResponse } from '../../utils/helpers';
import { NextFunction, Request, Response } from "express";
import { findUser } from '../../models';
//  const vapidKeys = webpush.generateVAPIDKeys();

 
const publicKey = "BKOPYlgOw1eAWgeVCt8uZWCTAaBUd4ReGVd9Qfs2EtK_DvRXuI_LFQSiyxjMN8rg47BWP9_8drlyE0O1GXMP4ew";
const privateKey = 'iRirUzPo10bdjtVAsbeiJq15Lin1NrV9hd2s9edVQ5o'

webpush.setVapidDetails(
    "mailto:aliusaid55@gmail.com",
    publicKey,
    privateKey
);

export const notifications = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
    const user = await findUser({ _id: req.user._id });
    const { title, body } = req.body;
    const payload = JSON.stringify({ title, body });

    const results = [];

    for (const subscription of user.gcmTokens) {
        try {
            const result = await webpush.sendNotification(subscription, payload);
            results.push({ subscription, status: 'success', result });
        } catch (error) {
            results.push({ subscription, status: 'failure', error });
        }
    }

    generateResponse(results, 'Notifications sent', res);
});

export const subscribe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const subscription = req.body;
    
    const user = await findUser({_id:req.user._id})
    user.gcmTokens.push(subscription);
    // gcmTokens
    await user.save();
    
    generateResponse(subscription, 'Subscription stored', res);
});