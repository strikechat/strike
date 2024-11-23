import { Permissions } from '@enums/server/Permission';
import { Role } from '@models/Role';
import { Server } from '@models/Server';
import ServerMemberModel from '@models/ServerMember';
export class PermissionUtilities {
    public static async hasPermissionInGuild(
        memberId: string,
        permissions: Permissions[],
    ) {
        const member = await ServerMemberModel.findOne({
            _id: memberId,
        }).populate('server').populate('roles');
        if (!member) return false;
        const server = member.server as Server;

        if(server.owner.toString() === memberId) return true;

        const roles = member.roles as Role[];
    
        for (const role of roles) {
            if (role.permissions.some((p) => permissions.includes(p))) {
                return true;
            }
        }
        return false;
    }
}
