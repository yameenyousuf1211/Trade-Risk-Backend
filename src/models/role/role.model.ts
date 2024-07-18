import { Schema, model, Document } from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IPaginationFunctionParams, IPaginationResult } from '../../utils/interfaces';
import { getMongoosePaginatedData } from '../../utils/helpers';

interface IRole extends Document {
    name: string;
    creator: Schema.Types.ObjectId;
    changeRequest: boolean;
    viewBids: boolean;
    acceptAndRejectBids: boolean;
    manageUsers: boolean;
    manageCompany: boolean;
    manageRequests: boolean;
}

const RoleSchema = new Schema<IRole>({
    name: {
        type: String,
    },
    creator:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    changeRequest:{
        type:Boolean,
        default:false,
    },
    viewBids:{
        type:Boolean,
        default:false,
    },
    acceptAndRejectBids:{
        type:Boolean,
        default:false,
    },
    manageUsers:{
        type:Boolean,
        default:false,
    },
    manageCompany:{
        type:Boolean,
        default:false,
    },
    manageRequests:{
        type:Boolean,
        default:false,
    }
},{timestamps: true});

RoleSchema.plugin(mongoosePaginate);
RoleSchema.plugin(aggregatePaginate);

const RoleModel = model('Role', RoleSchema);



export const createRole = (obj: Record<string, any>): Promise<any> => RoleModel.create(obj)
export const getRole = (obj: Record<string, any>): Promise<any> => RoleModel.findOne(obj);

export const getAllRoles = async ({ query, page, limit, populate }: IPaginationFunctionParams)
    : Promise<IPaginationResult<IRole>> => {
    const { data, pagination }: IPaginationResult<IRole> = await getMongoosePaginatedData({
        model: RoleModel, query,page, limit, populate
    });

    return { data, pagination };
};
export const deleteRole = (id:string): Promise<any> => RoleModel.findByIdAndDelete(id);
export const updateRole = (id:string, obj: Record<string, any>): Promise<any> => RoleModel.findByIdAndUpdate(id,obj,{new:true});
