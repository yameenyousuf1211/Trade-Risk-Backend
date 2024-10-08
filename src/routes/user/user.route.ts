import { Router } from "express";
import { fetchAllUsers, updateUsers, updateUserBank } from "../../controllers";
import authMiddleware from "../../middlewares/auth.middleware";
import { ROLE_TYPES, ROLES } from "../../utils/constants";

export default class UserAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/', fetchAllUsers);
        this.router.put('/', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), updateUsers);
        this.router.put('/bank', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), updateUserBank);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/user';
    }
}