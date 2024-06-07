import multer from 'multer';
import fs from 'fs';
import { Request } from 'express'; // Import Request type from express

const generateFilename = (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '.' + file.originalname.split('.').pop());
};

const filterImageOrDocsOrPDF = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (!file.mimetype.match(/image\/(jpg|JPG|webp|jpeg|JPEG|png|PNG|gif|GIF|jfif|JFIF|svg|SVG|bmp|BMP|ico|ICO|tiff|TIFF|psd|PSD)/)) {
        // Allow any file type that is not an image
        cb(null, true);
    } else {
        req.fileValidationError = 'Only PDF files are allowed!';
        cb(null, false);
    }
};

export const upload = (folderName: string) => {
    return multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                const path = `/tmp/${folderName}/`;
                if (!fs.existsSync(path)) {
                    fs.mkdirSync(path, { recursive: true });
                }
                cb(null, path);
            },
            filename: generateFilename // Pass the function directly without wrapping it in another function
        }),
        limits: { fileSize: 10 * 1024 * 1024 },  // max 10MB //
        fileFilter: filterImageOrDocsOrPDF
    });
};
