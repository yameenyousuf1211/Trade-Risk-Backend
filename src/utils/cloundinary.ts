import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: 'dgld5utcr',
  api_key: '338183275897566',
  api_secret: 'm3mWQsR2o7gEleAdUejiLk7xL3Q'
});

const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      folder: 'my-pdf-folder', 
      public_id: 'my-pdf-file',
      tags: 'pdf' 
    });

    console.log(response.url);
    return response;
  } catch (error) {
    console.log('Error in file upload:', error);
    fs.unlinkSync(localFilePath);
    throw error;
  }
};

export default uploadOnCloudinary;