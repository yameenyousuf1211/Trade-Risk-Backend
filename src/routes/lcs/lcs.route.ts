import { Router } from "express";
import { acceptOrRejectBids, createLcOrLg, deleteLcs, fetchAllLcs, fetchLc, statusCheck, totalRequestLc, updateLcs, fetchAllLcsWithPendingBids } from "../../controllers";
import authMiddleware from "../../middlewares/auth.middleware";
import { ROLE_TYPES, ROLES } from "../../utils/constants";

export default class LcsAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), fetchAllLcs);
        this.router.get('/pending-bids', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), fetchAllLcsWithPendingBids);
        this.router.get('/:lcId', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), fetchLc);
        this.router.get('/total-request/list', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), totalRequestLc);
        this.router.get('/status/check/:requestId', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), statusCheck);
        this.router.post('/create', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), createLcOrLg);
        this.router.delete('/:id', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), deleteLcs);
        this.router.put('/', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), acceptOrRejectBids)
        this.router.put('/:id', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), updateLcs)
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/lcs';
    }
}