import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import { ROLES } from "../../utils/constants";
import { upload } from "../../utils/multer";
import { deleteFile, uploadFile } from "../../controllers/firebaseStorage/firebaseStorage.controller";

export default class FIREBASESTORAGEAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }
    
    setupRoutes() {
        this.router.post('/', upload("file").fields([{ name: 'file', maxCount: 1 }]), authMiddleware(Object.values(ROLES)), uploadFile);
        this.router.delete('/:fileId', authMiddleware(Object.values(ROLES)), deleteFile);
    }    

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/firebasestorage';
    }
}