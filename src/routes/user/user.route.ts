import { Router } from "express";
import { banks, fetchAllUsers, fetchCountries } from "../../controllers";

export default class UserAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/', fetchAllUsers);
        this.router.get('/:country', banks);
        this.router.get('/countries', fetchCountries);

    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/user';
    }
}