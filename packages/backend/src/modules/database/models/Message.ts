import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { User } from './User';
import { Server } from './Server';
import { ServerChannel } from './ServerChannel';

class Message {
    public _id!: mongoose.Types.ObjectId;

    @prop({ required: true })
    public content!: string;

    @prop({ required: true, ref: () => User })
    public author!: Ref<User>;

    @prop({ required: true, ref: () => Server })
    public server!: Ref<Server>;

    @prop({ required: true, ref: () => ServerChannel })
    public channel!: Ref<ServerChannel>;

    @prop({ default: false })
    public pinned!: boolean;

    @prop({ default: Date.now })
    public createdAt!: Date;
}

const MessageModel = getModelForClass(Message);
export default MessageModel;
export { Message };
