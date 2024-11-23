import { Permissions } from "@enums/server/Permission";
import { getModelForClass, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";

class Role {
    public _id!: mongoose.Types.ObjectId;

    @prop({ required: true })
    public name!: string;

    @prop({ required: true })
    public color!: string;

    @prop({ required: true })
    public server!: mongoose.Types.ObjectId;

    @prop({ required: true })
    public permissions!: Permissions[];
}

const RoleModel = getModelForClass(Role);
export default RoleModel;
export { Role };