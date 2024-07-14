import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { Server } from './Server';
import { ChannelType } from '@enums/channels/ChannelType';

class ServerChannel {
    public _id!: mongoose.Types.ObjectId;

    @prop({ required: true })
    public name!: string;

    @prop({ required: true })
    public server!: Ref<Server>;

    @prop({ required: true })
    public createdAt!: Date;

    @prop({ required: true })
    public type!: ChannelType;
}

export const ServerChannelModel = getModelForClass(ServerChannel);
export default ServerChannelModel;