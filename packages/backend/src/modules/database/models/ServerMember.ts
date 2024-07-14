import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { User } from './User';
import { Server } from './Server';

export class ServerMember {
    @prop({ required: true, ref: () => User })
    user!: Ref<User>;

    @prop({ required: true, ref: () => Server })
    server!: Ref<Server>;

    @prop({ default: Date.now })
    joinedAt!: Date;
}

const ServerMemberModel = getModelForClass(ServerMember);
export default ServerMemberModel;