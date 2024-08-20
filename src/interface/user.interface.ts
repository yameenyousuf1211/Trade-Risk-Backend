import { Document } from "mongoose";

declare global {
    namespace Express {
        interface Request {
            user: {
                _id: string,
                name:string,
                role: string,
                email: string,
                type: string,
                business: any
            };
        }
    }
}

export interface IUser extends Document {
    _id?: string;
    name?: string;
    email: string;
    businessNature?: string;
    allowNotification?: boolean;
    role: string;
    allowBidsNotification?: boolean;
    allowNewRequestNotification?: boolean;
    fcmTokens: string;
    country?: string;
    phone?: string;
    address?: string;
    commercialRegistrationNumber?: string;
    constitution?: string;
    password?: string;
    bank?: string;
    accountNumber?: number;
    swiftCode?: string;
    accountHolderName?: string;
    accountCountry?: string;
    accountCity?: string;
    businessType?: string;
    productInfo?: {
        product: string;
        annualSalary: number;
        annualValueExports: number;
        annualValueImports: number;
    };
    pocName?: string;
    pocEmail?: string;
    pocPhone?: string;
    poc?: string;
    pocDesignation?: string;
    currentBanks?: string[];
    authorizationPocLetter?: string;
    confirmationLcs?: boolean;
    discountingLcs?: boolean
    guaranteesCounterGuarantees?: boolean
    discountingAvalizedBills?: boolean
    avalizationExportBills?: boolean
    riskParticipation: boolean
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
