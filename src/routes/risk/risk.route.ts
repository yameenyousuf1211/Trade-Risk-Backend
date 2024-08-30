import { createRisks, deleteRisks, findSingleRisk, getRisks, riskUpdate } from "../../controllers";
import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import { ROLE_TYPES, ROLES } from "../../utils/constants";
import { upload } from "../../utils/multer";

export default class RiskAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), getRisks);
        this.router.post('/', upload("authorization").fields([{ name: 'authorization-letter', maxCount: 3 }]), authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), createRisks);
        this.router.delete('/:id', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), deleteRisks);
        this.router.put('/:id', upload("authorization").fields([{ name: 'authorization-letter', maxCount: 3 }]), authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), riskUpdate);
        this.router.get('/:id', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), findSingleRisk);
    }


    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/risk';
    }
}