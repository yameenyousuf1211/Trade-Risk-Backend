import { Router } from "express";
import { notifications,subscribe } from "../../controllers";
import authMiddleware from "../../middlewares/auth.middleware";
import { ROLES } from "../../utils/constants";

export default class NotificationAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }
    
    setupRoutes() {
        this.router.post('/send-notification',authMiddleware(Object.values(ROLES)),notifications);
        this.router.post('/subscriptions',authMiddleware(Object.values(ROLES)),subscribe);
    }
    
    
    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/notification';
    }
}