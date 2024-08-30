import { createRoles, deleteRoles, fetchAllRoles, fetchRole, updateRoles } from "../../controllers";
import { Router } from "express";
import { } from "../../controllers";
import authMiddleware from "../../middlewares/auth.middleware";
import { ROLE_TYPES, ROLES } from "../../utils/constants";
import { validateCreateRole, validateUpdateRole } from "../../validation/role/role.validator";

export default class RoleAPI {
    constructor(private readonly router: Router) {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), fetchAllRoles);
        this.router.get('/:role', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), fetchRole);
        this.router.post('/', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), validateCreateRole, createRoles);
        this.router.put('/:id', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), validateUpdateRole, updateRoles);
        this.router.delete('/:id', authMiddleware(Object.values(ROLES), Object.values(ROLE_TYPES)), deleteRoles);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/role';
    }
}