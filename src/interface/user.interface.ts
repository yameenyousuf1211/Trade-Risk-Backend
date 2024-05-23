import { Document } from "mongoose";

declare global {
    namespace Express {
        interface Request {
            user: { _id: string, role: string, email: string, socialId: string };
        }
    }
}

export interface IUser extends Document {
    _id?: string;
    name?: string;
    email: string;
    allowNotification?: boolean;
    role: string;
    gcmTokens: IGcmToken[];
    country?: string;
    phone?: string;
    address?: string;
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
    confirmationLcs?:boolean;
    discountingLcs?:boolean
    guaranteesCounterGuarantees?:boolean
    discountingAvalizedBills?:boolean
    avalizationExportBills?:boolean
    riskParticipation:boolean
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}


interface IKeys {
    auth: string;
    p256dh: string;
}

// Define the TypeScript interface for GcmToken
interface IGcmToken {
    endpoint: string;
    expirationTime: Date | null;
    keys: IKeys;
}