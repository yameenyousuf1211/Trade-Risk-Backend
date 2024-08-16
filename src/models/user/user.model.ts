import { Document, Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IPaginationFunctionParams, IPaginationResult } from "../../utils/interfaces";
import { COMPANY_CONSTITUTION, ROLES } from "../../utils/constants";
import { getMongoosePaginatedData } from "../../utils/helpers";
import { compare } from "bcrypt";
import { QueryWithHelpers } from "mongoose";
import { sign } from "jsonwebtoken";
import { IUser } from "../../interface";

// Define the Mongoose schema
const userSchema = new Schema({
    name: { type: String },
    email: { type: String, lowercase: true, required: true },
    password: { type: String, select: false },
    role: { type: String, enum: ['admin', 'user'], default: "user", required: true },
    type: { type: String, enum: ['corporate', 'bank'] },
    business: { type: Schema.Types.ObjectId, ref: "Business" },

    // notification settings
    allowNotification: { type: Boolean, default: true },
    allowBidsNotification: { type: Boolean, default: true },
    allowNewRequestNotification: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    fcmTokens: { type: [String], default: [] },
}, { timestamps: true, versionKey: false });

// hash password before saving
// userSchema.pre<IUser>("save", async function (next: any) {
//     if (!this.isModified("password")) return next();
//     this.password = await hash(this.password, 10);
//     next();
// });

userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
    return await compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
    return sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
            role: this.role,
            type: this.type,
            business: this.business
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

userSchema.methods.generateRefreshToken = function (): string {
    return sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

// mongoose pagination plugins
userSchema.plugin(mongoosePaginate);
userSchema.plugin(aggregatePaginate);

const UserModel = model("User", userSchema);

// create new user
export const createUser = (obj: Record<string, any>): Promise<any> => UserModel.create(obj);

// find user by query
export const findUser = (query: Record<string, any>): QueryWithHelpers<any, Document> => UserModel.findOne(query);

// get all users
export const getAllUsers = async ({ query, page, limit, populate }: IPaginationFunctionParams)
    : Promise<IPaginationResult<IUser>> => {
    const { data, pagination }: IPaginationResult<IUser> = await getMongoosePaginatedData({
        model: UserModel, query, page, limit, populate
    });

    return { data, pagination };
};

export const updateUser = (id: string, obj: Record<string, any>): Promise<any> => UserModel.findByIdAndUpdate(id,obj,{new:true});

export const updateUser = (id: string, obj: Record<string, any>): Promise<any> => UserModel.findByIdAndUpdate(id, obj, { new: true });


export const getFcmTokens = async (ids:any) => {
    const users = await UserModel.find({ _id: { $in: ids } }).select('fcmTokens');
    return users?.map(user => user?.fcmTokens);
  }
