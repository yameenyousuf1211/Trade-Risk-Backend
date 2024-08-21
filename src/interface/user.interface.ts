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


export interface IUser {
    name?: string;
    email: string;
    password?: string;
    role: 'admin' | 'user';
    type?: 'corporate' | 'bank';
    business?: string;

    // Notification settings
    allowNotification?: boolean;
    allowBidsNotification?: boolean;
    allowNewRequestNotification?: boolean;

    fcmTokens?: string[];
    
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IUserDocs  extends Document,IUser {
    _id: string;
    isPasswordCorrect(password: string): Promise<boolean>;
} 
