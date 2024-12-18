import { getModelForClass, prop, Ref, Severity } from '@typegoose/typegoose';
import { User } from './User';
import { Server } from './Server';
import { Invite } from './Invite';
import { Role } from './Role';

export class ServerMember {
    @prop({ required: true, ref: () => User })
    user!: Ref<User>;

    @prop({ required: true, ref: () => Server })
    server!: Ref<Server>;

    @prop({ default: Date.now })
    joinedAt!: Date;

    @prop({ default: null, allowMixed: Severity.ALLOW })
    usedInvite!: Ref<Invite> | null; 

    @prop({ default: false, allowMixed: Severity.ALLOW })
    roles!: Ref<Role>[];
}

const ServerMemberModel = getModelForClass(ServerMember);
export default ServerMemberModel;