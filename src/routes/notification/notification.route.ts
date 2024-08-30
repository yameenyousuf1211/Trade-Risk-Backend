import { Router } from "express";
import { deleteNotifications, fetchNotifications, updateNotifications } from "../../controllers";
import authMiddleware from "../../middlewares/auth.middleware";
import { ROLE_TYPES, ROLES } from "../../utils/constants";

export default class NotificationAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), fetchNotifications);
        this.router.put('/', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), updateNotifications);
        this.router.delete('/:id', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), deleteNotifications);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/notification';
    }
}