import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import mongoose from 'mongoose';

import { User } from "./User";
import { Server } from "./Server";

class Invite {
    public _id!: mongoose.Types.ObjectId;

    @prop({ required: true, ref: () => User })
    public author!: Ref<User>

    @prop({ required: true, ref: () => Server })
    public server!: Ref<Server>

    @prop({ required: true })
    public code!: string

    @prop({ required: true })
    public expiresAt!: Date

    @prop({ required: true })
    public maxUses!: number

    @prop({ default: 0 })
    public uses!: number

    @prop({ default: Date.now })
    public createdAt!: Date;
}

const InviteModel = getModelForClass(Invite);
export default InviteModel;
export { Invite };