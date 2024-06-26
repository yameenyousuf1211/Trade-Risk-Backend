import { currentUser, login, logout, register } from "../../controllers";
import { Router } from "express";
import { loginValidation, registerValidation } from "../../validation/auth/auth.validation";
import { upload } from "../../utils/multer";
import authMiddleware from "../../middlewares/auth.middleware";
import { ROLES } from "../../utils/constants";

export default class AuthAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post('/register',upload("authorization").fields([{name:'image',maxCount:1}]),registerValidation ,register);
        this.router.post('/login', loginValidation,login);
        this.router.get('/current-user',authMiddleware(Object.values(ROLES)),currentUser)
        this.router.post('/logout',authMiddleware(Object.values(ROLES)),logout);
    }   

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/auth';
    }
}