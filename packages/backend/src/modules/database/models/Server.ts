import { getModelForClass, prop, pre, Ref } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { User } from './User';
import { ServerFeature } from '@enums/server/ServerFeature';

class Server {
    public _id!: mongoose.Types.ObjectId;
    @prop({ required: true })
    public name!: string;

    @prop({ required: true, ref: () => User })
    public owner!: Ref<User>;

    @prop({ required: true, default: Date.now })
    public createdAt!: Date;

    @prop({ required: true, default: [] })
    public features!: ServerFeature[];
}

const ServerModel = getModelForClass(Server);
export default ServerModel;
export { Server };
