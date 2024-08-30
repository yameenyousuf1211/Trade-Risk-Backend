import { updateBusinessCurrentBanks } from "../../controllers";
import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import { ROLE_TYPES, ROLES } from "../../utils/constants";

export default class BusinessAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.put('/update-bank', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), updateBusinessCurrentBanks);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/business';
    }
}