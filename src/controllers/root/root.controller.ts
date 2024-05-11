import { NextFunction, Request, Response } from "express";
import { asyncHandler, generateResponse } from "../../utils/helpers";
import {  ROLES,STATUS_CODES,banks as bank } from "../../utils/constants";
import {portsList} from '../../utils/helpers'

export const defaultHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    generateResponse(null, `Health check passed`, res);
});


export const banks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const country = req.params.country;

    if (!country) {
        return next({
            message: 'Country is required',
            statusCode: STATUS_CODES.BAD_REQUEST
        });
    }   
 

    if (!(country in bank)) {
        return next({
            statusCode: STATUS_CODES.BAD_REQUEST,
            message: 'invalid country name'
        });
    }

    const banksList = (bank as { [key: string]: { code: string; list: string[] } })[country].list;
    generateResponse(banksList, 'Banks fetched successfully', res);
});


export const fetchCities = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const country = req.query.country?.toString();
    if (!country) {
        return next({
            message: 'Country is required',
            statusCode: STATUS_CODES.BAD_REQUEST
        });
    }

    const cities = {
        "Bahrain": ["Manama", "Muharraq", "Riffa", "Hamad Town", "Isa Town"],
        "Pakistan": ["Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Multan", "Islamabad"],
        "Qatar": ["Doha", "Al Wakrah", "Al Khor", "Al Rayyan", "Umm Salal"],
        "Bangladesh": ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet"],
        "Saudi": ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam"],
        "Uae": ["Dubai", "Abu Dhabi", "Sharjah", "Al Ain", "Ajman"]
    };

    const countryEntry = Object.entries(cities).find(([key, value]) => key === country);
    if (!countryEntry) {
        return next({
            message: 'Cities not found for the provided country',
            statusCode: STATUS_CODES.NOT_FOUND
        });
    }

    generateResponse(countryEntry[1], 'Cities fetched successfully', res);
}); 
export const portsDetail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let data = portsList;
    const country = req.query.country || '';

    if (country) {
        data = data.filter((port:any) => port.country === country);
    }
    generateResponse(data, 'Ports detail fetched successfully', res);
});

    export const currencies = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const currencies = [
            "BHD",
            "PKR",
            "QAR",
            "BDT",
            "SAR",
            "AED",
            "USD"
        ];
        generateResponse(currencies, 'Currencies fetched successfully', res);
    });