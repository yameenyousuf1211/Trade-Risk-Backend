import { createRoles, defaultHandler, deleteRoles, fetchAllRoles, fetchRole, updateRoles  } from "../../controllers";
import { Router } from "express";
import { } from "../../controllers";
import authMiddleware from "../../middlewares/auth.middleware";
import { ROLES } from "../../utils/constants";
import { validateCreateRole, validateUpdateRole } from "../../validation/role/role.validator";

export default class RoleAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }
    
    setupRoutes() {
        this.router.get('/',authMiddleware(Object.values(ROLES)),fetchAllRoles);
        this.router.get('/:role',authMiddleware(Object.values(ROLES)),fetchRole);
        this.router.post('/',authMiddleware(Object.values(ROLES)),validateCreateRole,createRoles);
        this.router.put('/:id',authMiddleware(Object.values(ROLES)),validateUpdateRole,updateRoles);
        this.router.delete('/:id',authMiddleware(Object.values(ROLES)),deleteRoles);
    }
    
    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/role';
    }
}