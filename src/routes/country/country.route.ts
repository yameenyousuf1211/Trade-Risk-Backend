import { Router } from "express";
import { } from "../../controllers";
import { banks, fetchCountries, fetchCities, portsDetail, currencies } from "../../controllers";
export default class CountryAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/banks/:country', banks);
        this.router.get('/', fetchCountries);
        this.router.get('/list/cities', fetchCities)
        this.router.get('/ports/details', portsDetail)
        this.router.get('/currencies/list', currencies)
    }


    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/country';
    }
}