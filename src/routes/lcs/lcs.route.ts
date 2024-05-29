import { Router } from "express";
import { acceptOrRejectBids, createLcs, deleteLc, fetchAllLcs, findLcs, statusCheck,totalRequestLc,updateLcs } from "../../controllers";
import authMiddleware from "../../middlewares/auth.middleware";
import { lcsValidation } from "../../validation/lcs/lcs.validation";
import { ROLES } from "../../utils/constants";
import { upload } from "../../utils/multer";

export default class LcsAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/',authMiddleware(Object.values(ROLES)),fetchAllLcs);
        this.router.get('/:id',authMiddleware(Object.values(ROLES)),findLcs);
        this.router.get('/total-request/list',authMiddleware(Object.values(ROLES)),totalRequestLc);
        this.router.get('/status/check/:lc',authMiddleware(Object.values(ROLES)),statusCheck);
        this.router.post('/create',upload("authorization").fields([{name:'authorization-letter',maxCount:3}]),authMiddleware(Object.values(ROLES)),createLcs);
        this.router.delete('/:id',authMiddleware(Object.values(ROLES)),deleteLc);
        this.router.put('/',authMiddleware(Object.values(ROLES)),acceptOrRejectBids)
        this.router.put('/:id',upload("authorization").fields([{name:'authorization-letter',maxCount:3}]),authMiddleware(Object.values(ROLES)),lcsValidation,updateLcs)
        
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/lcs';
    }
}