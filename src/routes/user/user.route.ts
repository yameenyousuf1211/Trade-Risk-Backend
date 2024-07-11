import { Router } from "express";
import { fetchAllUsers, updateUserBank, updateUsers } from "../../controllers";
import authMiddleware from "../../middlewares/auth.middleware";
import { ROLES } from "../../utils/constants";

export default class UserAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/', fetchAllUsers);
        this.router.put('/',authMiddleware(Object.values(ROLES)),updateUsers);
        this.router.put('/bank',authMiddleware(Object.values(ROLES)),updateUserBank);
        
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/user';
    }
}