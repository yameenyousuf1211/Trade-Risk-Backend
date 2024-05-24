// https://restcountries.com/v3.1/all
import { NextFunction, Request, Response } from "express";
import { asyncHandler, generateResponse } from "../../utils/helpers";
import {  STATUS_CODES,banks as bank, portsData } from "../../utils/constants";
import { Country, City, ICountry }  from 'country-state-city';
// import fs from 'fs';
// import path from "path";
// import { PortsData } from "../../types/ports.types";

interface PortsByCountry {
    [key: string]: any;
}

export const banks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const country = req.params.country;

    if (!country) {
        return next({
            message: 'Country is required',
            statusCode: STATUS_CODES.BAD_REQUEST
        });
    }   
    interface BanksByCountry {
        [key: string]: any;
    }

    if (!(country in bank)) {
        return next({
            statusCode: STATUS_CODES.BAD_REQUEST,
            message: 'invalid country name'
        });
    }

    const banksList = (bank as BanksByCountry)[country];

    generateResponse(banksList, 'Banks fetched successfully', res);
});


export const fetchCities = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const{ country } = req.query

    if(!country) return next({
        message: 'Country is required',
        statusCode: STATUS_CODES.BAD_REQUEST
    })

    const data = await City.getCitiesOfCountry(country as string);
    generateResponse(data, 'Cities fetched successfully', res);
}); 

export const portsDetail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const country = req.query.country;

    // const filePath = path.join(__dirname, './ports_details.json');

    // // Read the contents of ports_detail.json
    // const rawData = fs.readFileSync(filePath).toString();
    // const portsData = JSON.parse(rawData);
    // const data = portsData.data;
    // let filteredPortsData:PortsData = data;

    // if (country) {
    //     filteredPortsData = data.filter((port: any) => port.COUNTRY === country);
    // }
   

  

    // const data = portsData;
    // if (country) {
    //     data= data .filter((port: any) => port.country === country);
    // }
    // generateResponse({data}, 'Filtered ports details fetched successfully', res);
    let data = portsData;
    if(country){
        data = portsData.filter((port: any) => port.country === country);
    }
    generateResponse(data, 'Ports details fetched successfully', res);
});


    export const currencies = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const currencies = Country.getAllCountries();
        const data = currencies.map((country: ICountry) => {
            return country.currency;
        });
        generateResponse(data, 'Currencies fetched successfully', res);
    })

    export const fetchCountries = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        
        const data =   Country.getAllCountries();
        generateResponse(data, 'Countries fetched successfully', res);
    });

    