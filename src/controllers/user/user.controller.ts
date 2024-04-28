import { NextFunction, Request, Response } from "express";
import { asyncHandler, generateResponse } from "../../utils/helpers";
import { getAllUsers } from "../../models";
import { ROLES } from "../../utils/constants";
import axios from "axios";


// get all users
export const fetchAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const page: number = +(req.query.page || 1);
    const limit = +(req.query.limit || 10);
    const query = { role: { $ne: ROLES.ADMIN } };

    const usersData = await getAllUsers({ query, page, limit });
    if (usersData?.data?.length === 0) {
        generateResponse(null, 'No user found', res);
        return;
    }

    generateResponse(usersData, 'List fetched successfully', res);
});

export const fetchCountries = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const {data} = await axios.get('https://restcountries.com/v3.1/all?');
    
    const countries = data.map((country:any) => ({
        name: country.name.common,
    }));

    generateResponse(countries, 'Countries fetched successfully', res);
});