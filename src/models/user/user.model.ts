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
const userSchema = new Schema<IUser>({
    name: { type: String },
    email: { type: String, lowercase: true, required: true },
    password: { type: String, select: false },
    address: { type: String },
    country:{ type: String },
    phone: { type: String },
    constitution: { type: String, enum: Object.values(COMPANY_CONSTITUTION) },
    businessType: { type: String },
    role: { type: String, enum: Object.values(ROLES), default: "user", required: true },
    productInfo: {
        product: { type: String },
        annualSalary: { type: Number },
        annualValueExports: { type: Number },
        annualValueImports: { type: Number }
    },
    currentBanks: [{ type: Schema.Types.ObjectId, ref: "bank" }],
    bank: { type: String, },
    accountNumber: { type: Number },
    swiftCode: { type: String },
    accountHolderName: { type: String },
    accountCountry: { type: String },
    accountCity: { type: String},
    pocName: { type: String },
    pocEmail: { type: String },
    pocPhone: { type: String },
    poc: { type: String },
    pocDesignation: { type: String },
    confirmationLcs: { type: Boolean },
    discountingLcs: { type: Boolean },
    guaranteesCounterGuarantees: { type: Boolean },
    discountingAvalizedBills: { type: Boolean },
    avalizationExportBills: { type: Boolean },
    riskParticipation: { type: Boolean },
    authorizationPocLetter: { type: String },
    
    isDeleted: { type: Boolean, default: false },

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
            role: this.role
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
        model: UserModel, query,page, limit, populate
    });

    return { data, pagination };
};