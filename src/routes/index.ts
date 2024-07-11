import { Request, Response, NextFunction, Application, Router } from "express";

import RootAPI from "./root/root.route";
import AuthAPI from "./auth/auth.route";
import UserAPI from "./user/user.route";
import LcsAPI from "./lcs/lcs.route";
import BidsAPI from "./bids/bids.route";
import CountryAPI from "./country/country.route";
import RiskAPI from "./risk/risk.route";
import NotificationAPI from "./notification/notification.route";
import RoleAPI from "./role/role.route";

export default class API {
    router: Router;
    routeGroups: any[];

    constructor(private readonly app: Application) {
        this.router = Router();
        this.routeGroups = [];
    }

    loadRouteGroups() {
        const routeGroups = this.routeGroups;
        const router = this.router;

        routeGroups.push(new RootAPI(router));
        routeGroups.push(new AuthAPI(router));
        routeGroups.push(new UserAPI(router));
        routeGroups.push(new LcsAPI(router))
        routeGroups.push(new BidsAPI(router))
        routeGroups.push(new CountryAPI(router))
        routeGroups.push(new RiskAPI(router))
        routeGroups.push(new NotificationAPI(router))
        routeGroups.push(new RoleAPI(router))
    }

    setContentType(req: Request, res: Response, next: NextFunction) {
        res.set("Content-Type", "application/json");
        next();
    }

    registerGroups() {
        this.loadRouteGroups();
        this.routeGroups.forEach((rg) => {
            console.log("Route group: " + rg.getRouterGroup());
            this.app.use("/api" + rg.getRouterGroup(), this.setContentType, rg.getRouter());
        });
    }
}