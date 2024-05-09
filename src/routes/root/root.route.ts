import { currencies, defaultHandler,banks, fetchCities, fetchCountries, portsDetail  } from "../../controllers";
import { Router } from "express";
import { } from "../../controllers";
export default class RootAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/', defaultHandler);
        this.router.get('/banks/:country', banks);
        this.router.get('/countries/list', fetchCountries);
        this.router.get('/countries/list/cities',fetchCities)
        this.router.get('/ports/details',portsDetail)
        this.router.get('/currencies/list',currencies)
    }
    
    
    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/';
    }
}