import {
    acceptOrRejectBids, createBids, fetchbid, findBidsCount,
    getAllBids, approvedOrRejectBidsByBankAdmin
} from "../../controllers";
import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import { ROLES } from "../../utils/constants";
import { bidsValidation } from "../../validation/bids/bids.validation";

export default class BidsAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/', authMiddleware(Object.values(ROLES)), getAllBids);
        this.router.get('/:id', authMiddleware(Object.values(ROLES)), fetchbid);
        this.router.get('/count/list', authMiddleware(Object.values(ROLES)), findBidsCount);
        this.router.post('/', authMiddleware([ROLES.BANK]), bidsValidation, createBids)
        this.router.put('/update/:bidId', authMiddleware([ROLES.ADMIN]), approvedOrRejectBidsByBankAdmin);
        this.router.put('/', authMiddleware(Object.values(ROLES)), acceptOrRejectBids)
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/bids';
    }
}