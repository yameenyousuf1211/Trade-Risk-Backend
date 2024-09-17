import {
    acceptOrRejectBids, createBids, fetchbid, findBidsCount,
    getAllBids, approvedOrRejectBidsByBankAdmin
} from "../../controllers";
import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import { ROLE_TYPES, ROLES } from "../../utils/constants";

export default class BidsAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/', authMiddleware(Object.values(ROLES), [ROLE_TYPES.CORPORATE]), getAllBids);
        this.router.get('/:id', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), fetchbid);
        this.router.get('/count/list', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), findBidsCount);
        this.router.post('/', authMiddleware(Object.values(ROLES), [ROLE_TYPES.BANK]), createBids)
        this.router.put('/update/:bidId', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), approvedOrRejectBidsByBankAdmin);
        this.router.put('/', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), acceptOrRejectBids)
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/bids';
    }
}