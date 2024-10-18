import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import { ROLE_TYPES, ROLES } from "../../utils/constants";
import { addRisk, fetchAllRisks, removeRisk } from "../../controllers";
import { updateRisk } from "../../models";

export default class RiskAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/', authMiddleware(Object.values(ROLES), [ROLE_TYPES.BANK]), fetchAllRisks);
        this.router.post('/', authMiddleware(Object.values(ROLES), [ROLE_TYPES.BANK]), addRisk);
        this.router.put('/:id', authMiddleware(Object.values(ROLES), [ROLE_TYPES.BANK]), updateRisk);
        this.router.delete('/:id', authMiddleware(Object.values(ROLES), [ROLE_TYPES.BANK]), removeRisk);
        // this.router.get('/:id', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), findSingleRisk);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/risk';
    }
}