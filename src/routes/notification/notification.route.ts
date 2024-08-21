import { Router } from "express";
import { deleteNotifications, fetchNotifications, updateNotifications } from "../../controllers";
import authMiddleware from "../../middlewares/auth.middleware";
import { ROLES } from "../../utils/constants";

export default class NotificationAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }
    
    setupRoutes() {
        this.router.get('/',authMiddleware(Object.values(ROLES)),fetchNotifications);
        this.router.put('/',authMiddleware(Object.values(ROLES)),updateNotifications);
        this.router.delete('/:id',authMiddleware(Object.values(ROLES)),deleteNotifications);
    }    

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/notification';
    }
}