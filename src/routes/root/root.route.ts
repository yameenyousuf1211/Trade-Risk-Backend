import { defaultHandler  } from "../../controllers";
import { Router } from "express";
import { } from "../../controllers";
export default class RootAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }
    
    setupRoutes() {
        this.router.get('/', defaultHandler);
        
    }
    
    
    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/';
    }
}