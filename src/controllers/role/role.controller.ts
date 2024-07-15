import { NextFunction, Request, Response } from "express";
import { generateResponse,asyncHandler } from "../../utils/helpers";
import { STATUS_CODES } from "../../utils/constants";
import { createRole, deleteRole, getAllRoles, getRole, updateRole } from "../../models";

export const createRoles =  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    req.body.creator = req.user._id;

    const findRole = await getRole({name:req.body.name,creator:req.user._id});
    
    if(findRole) return next({
        message: 'Role already exists',
        statusCode: STATUS_CODES.BAD_REQUEST
    })

    const role = await createRole(req.body);
    generateResponse(role, 'Role created successfully', res);
});

export const updateRoles = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const role = await updateRole(id,req.body);
    generateResponse(role, 'Role updated successfully', res);
});

export const deleteRoles = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const role = await deleteRole(req.params.id);
    generateResponse(role, 'Role deleted successfully', res);
})

export const fetchRole = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
   
    const role = await getRole({name:req.params.role,creator:req.user._id});
    
    if(!role) return next({
        message: 'Role not found',
        statusCode: STATUS_CODES.NOT_FOUND
    })

    generateResponse(role, 'Role fetched successfully', res);
})

export const fetchAllRoles = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const limit:number = +(req.query.limit || 10);
    const page:number = +(req.query.page || 1);
    const query:Object = { creator: req.user._id};

    const roles = await getAllRoles({ query, page, limit});
    
    generateResponse(roles, 'Role fetched successfully', res);
})

