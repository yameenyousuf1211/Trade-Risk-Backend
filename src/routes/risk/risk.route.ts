import { createRisks, defaultHandler, deleteRisks, getRisks, riskUpdate  } from "../../controllers";
import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import { ROLES } from "../../utils/constants";
import { upload } from "../../utils/multer";

export default class RiskAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }
    
    setupRoutes() {
        this.router.get('/',authMiddleware(Object.values(ROLES)),getRisks);
        this.router.post('/',upload("authorization").fields([{name:'authorization-letter',maxCount:3}]),authMiddleware(Object.values(ROLES)),createRisks);
        this.router.delete('/:id',authMiddleware(Object.values(ROLES)),deleteRisks);
        this.router.put('/:id',upload("authorization").fields([{name:'authorization-letter',maxCount:3}]),authMiddleware(Object.values(ROLES)),riskUpdate);
    }
    
    
    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/risk';
    }
}