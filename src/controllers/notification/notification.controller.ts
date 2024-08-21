import { asyncHandler, generateResponse } from "../../utils/helpers";
import { NextFunction, Request, Response } from "express";
import {  deleteNotification, fetchNotification, findNotification, findUser, getAllUsers, updateNotification } from "../../models";
import { STATUS_CODES } from "../../utils/constants";
import mongoose, { PipelineStage } from "mongoose";

export const fetchNotifications = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
   const limit = +(req.query.limit || 10);
   const page = +(req.query.page || 1);

    const pipeline:PipelineStage[] = []
  
    pipeline.push({$match:{receiverId:new mongoose.Types.ObjectId(req.user.business as string)}})
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