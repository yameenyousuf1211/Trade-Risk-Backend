import mongoose, { Document, FilterQuery, Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IPaginationFunctionParams, IPaginationResult } from "../../utils/interfaces";
import { getMongoosePaginatedData } from "../../utils/helpers";
import { compare } from "bcrypt";
import { QueryWithHelpers } from "mongoose";
import { sign } from "jsonwebtoken";
import { IUser, IUserDoc } from "../../interface";

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

    fcmToken: String,
    attachments: { type: [String], default: [] },
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
    const businessId = this.business instanceof mongoose.Types.ObjectId ? this.business : this.business._id;
    return sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
            role: this.role,
            type: this.type,
            business: businessId
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

// mongoose pagination plugins
userSchema.plugin(mongoosePaginate);
userSchema.plugin(aggregatePaginate);

const UserModel = model("User", userSchema);

// create new user
export const createUser = (obj: Record<string, any>): Promise<IUserDoc> => UserModel.create(obj);

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

export const updateUser = (id: string, obj: Record<string, any>): Promise<IUserDoc> => UserModel.findByIdAndUpdate(id, obj, { new: true }).exec();

export const getFcmTokens = async (query: FilterQuery<IUser>): Promise<string[]> => {
    const users = await UserModel.find({
        ...query,
        fcmToken: { $ne: null }
    }).select('fcmToken');
    return users.map(user => user.fcmToken);
}

export const findUsers = (query: any) => UserModel.find(query);