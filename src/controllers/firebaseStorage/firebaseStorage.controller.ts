import { asyncHandler, bucket } from './../../utils/helpers';
import { NextFunction, Request, Response } from "express";
import { generateResponse } from "../../utils/helpers";
import { STATUS_CODES } from '../../utils/constants';
const fs = require('fs');

export const uploadFile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (req.fileValidationError) return next({
    statusCode: STATUS_CODES.BAD_REQUEST,
    message: req.fileValidationError,
  });

  const file = (req.files as { [fieldname: string]: Express.Multer.File[] })['file'][0];
  console.log('file', file);

  const fileName = `${Date.now()}_${file.originalname}`;
  const filePath = file.path;

  await bucket.upload(filePath, {
    destination: fileName,
    metadata: {
      contentType: file.mimetype,
    },
  });

  const firebaseFile = bucket.file(fileName);

  await firebaseFile.makePublic();
  const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  fs.unlinkSync(filePath);
  generateResponse({ url, fileName }, "File uploaded successfully", res);
});

// Delete file from Firebase Storage
export const deleteFile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { fileId } = req.params;

  const file = bucket.file(fileId);

  const [exists] = await file.exists();
  if (!exists) return next({
    statusCode: STATUS_CODES.BAD_REQUEST,
    message: 'File not found'
  });

  await file.delete();
  generateResponse(null, "File deleted successfully", res);
});
