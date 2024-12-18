import { Request, Response } from 'express';
import ServerModel, { Server } from '@models/Server';
import { userSchema } from '@schemas/user/userSchema';
import z from 'zod';
import { createServerSchema } from '@schemas/server/createServerSchema';
import { User } from '@models/User';
import ServerChannelModel from '@models/ServerChannel';
import { ChannelType } from '@enums/channels/ChannelType';
import ServerMemberModel from '@models/ServerMember';
import { Logger } from '@utils/Logger';
import { createServerChannelSchema } from '@schemas/server/createServerChannelSchema';
import mongoose from 'mongoose';
import MessageModel from '@models/Message';
import RoleModel from '@models/Role';
import { PermissionUtilities } from '@utils/PermissionUtilities';
import { Permissions } from '@enums/server/Permission';

export class ServerController {
    public static async createServer(
        req: Request,
        res: Response,
    ): Promise<Response> {
        try {
            const data = createServerSchema.parse(req.body);
            const user = req.user as unknown as User;

            const server = new ServerModel({
                name: data.name,
                owner: user._id!,
                createdAt: new Date(),
            });

            const initialChannel = new ServerChannelModel({
                server: server._id!,
                name: 'general',
                type: ChannelType.Text,
            });

            const initialMember = new ServerMemberModel({
                server: server._id!,
                user: user._id!,
            });

            await Promise.all([
                server.save(),
                initialChannel.save(),
                initialMember.save(),
            ]);

            return res.status(201).json({ server, channel: initialChannel });
        } catch (e) {
            if (e instanceof z.ZodError) {
                return res.status(400).json({ errors: e.errors });
            }
            Logger.error(String(e));
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public static async getAllCurrentUserServers(
        req: Request,
        res: Response,
    ): Promise<Response> {
        try {
            const user = req.user as unknown as User;
            const allUserMembers = await ServerMemberModel.find({
                user: user._id!,
            }).populate('server');
            const allUserServers = allUserMembers.map(
                (member) => member.server,
            );

            return res.status(200).json({ servers: allUserServers });
        } catch (e) {
            Logger.error(String(e));
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public static async deleteServer(
        req: Request,
        res: Response,
    ): Promise<Response> {
        try {
            const user = req.user as unknown as User;
            const serverId = req.params.serverId;

            const server = await ServerModel.findById(serverId);

            if (
                !serverId ||
                !server ||
                server.owner.toString() !== user._id.toString()
            )
                return res.status(404).json({ message: 'Server not found' });

            await ServerModel.findByIdAndDelete(serverId);

            await ServerChannelModel.deleteMany({ server: serverId });
            await ServerMemberModel.deleteMany({ server: serverId });

            return res
                .status(200)
                .json({ message: 'Server deleted successfully' });
        } catch (e) {
            Logger.error(String(e));
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public static async createServerChannel(
        req: Request,
        res: Response,
    ): Promise<Response> {
        try {
            const user = req.user as unknown as User;
            const serverId = req.params.serverId;
            const data = createServerChannelSchema.parse(req.body);

            const server = await ServerModel.findById(serverId);

            if (
                !serverId ||
                !server ||
                server.owner.toString() !== user._id.toString()
            )
                return res.status(404).json({ message: 'Server not found' });

            const channel = new ServerChannelModel({
                server: new mongoose.Types.ObjectId(serverId),
                name: data.name,
                type: data.type,
            });

            await channel.save();

            return res.status(201).json({ channel });
        } catch (e) {
            if (e instanceof z.ZodError) {
                return res.status(400).json({ errors: e.errors });
            }

            Logger.error(String(e));
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public static async getAllGuildChannels(
        req: Request,
        res: Response,
    ): Promise<Response> {
        try {
            const user = req.user as unknown as User;
            const serverId = req.params.serverId;

            const server = await ServerModel.findById(serverId);

            if (!serverId || !server)
                return res.status(404).json({ message: 'Server not found' });

            const channels = await ServerChannelModel.find({
                server: new mongoose.Types.ObjectId(serverId),
            });

            return res.status(200).json({ channels });
        } catch (e) {
            Logger.error(String(e));
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public static async me(req: Request, res: Response): Promise<Response> {
        try {
            const serverId = req.params.serverId;
            const user = req.user as unknown as User;
            const server = await ServerModel.findById(serverId);
            const member = await ServerMemberModel.findOne({
                server: serverId,
                user: user._id,
            });

            if (!serverId || !server || !member)
                return res.status(404).json({ message: 'Server not found' });

            return res.status(200).json({ server });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public static async getChannelById(
        req: Request,
        res: Response,
    ): Promise<Response> {
        try {
            const user = req.user as unknown as User;
            const serverId = req.params.serverId;
            const channelId = req.params.channelId;

            const server = await ServerModel.findById(serverId);

            if (!serverId || !server)
                return res.status(404).json({ message: 'Server not found' });

            const channel = await ServerChannelModel.findById(channelId);

            if (!channelId || !channel)
                return res.status(404).json({ message: 'Channel not found' });

            return res.status(200).json({ channel });
        } catch (e) {
            Logger.error(String(e));
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public static async updateChannel(
        req: Request,
        res: Response,
    ): Promise<Response> {
        try {
            const user = req.user as unknown as User;
            const serverId = req.params.serverId;
            const channelId = req.params.channelId;
            const data = req.body;

            const server = await ServerModel.findById(serverId);

            if (!serverId || !server)
                return res.status(404).json({ message: 'Server not found' });

            if (server.owner.toString() !== user._id.toString())
                return res.status(403).json({ message: 'Forbidden' });

            const channel = await ServerChannelModel.findById(channelId);

            if (!channelId || !channel)
                return res.status(404).json({ message: 'Channel not found' });

            await ServerChannelModel.findByIdAndUpdate(channelId, data);

            return res.status(200).json({ channel });
        } catch (e) {
            Logger.error(String(e));
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public static async getAllServerMembers(
        req: Request,
        res: Response,
    ): Promise<Response> {
        try {
            const user = req.user as unknown as User;
            const serverId = req.params.serverId;

            const server = await ServerModel.findById(serverId);
            const serverMember = await ServerMemberModel.findOne({
                server: serverId,
                user: user._id,
            });

            if (!serverId || !server || !serverMember)
                return res.status(404).json({ message: 'Server not found' });

            const members = await ServerMemberModel.find({
                server: serverId,
            }).populate('user', '-password -email');

            return res.status(200).json({ members });
        } catch (e) {
            Logger.error(String(e));
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public static async getChannelPins(
        req: Request,
        res: Response,
    ): Promise<Response> {
        try {
            const user = req.user as unknown as User;
            const serverId = req.params.serverId;
            const channelId = req.params.channelId;

            const server = await ServerModel.findById(serverId);

            if (!serverId || !server)
                return res.status(404).json({ message: 'Server not found' });

            const channel = await ServerChannelModel.findById(channelId);

            if (!channelId || !channel)
                return res.status(404).json({ message: 'Channel not found' });

            const pins = await MessageModel.find({
                server: serverId,
                channel: channelId,
                pinned: true,
            }).populate('user', '-password -email');

            return res.status(200).json({ pins });
        } catch (e) {
            Logger.error(String(e));
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public static async getAllRoles(
        req: Request,
        res: Response,
    ): Promise<Response> {
        try {
            const user = req.user as unknown as User;
            const serverId = req.params.serverId;

            const server = await ServerModel.findById(serverId);

            if (!serverId || !server)
                return res.status(404).json({ message: 'Server not found' });

            const roles = await RoleModel.find({
                server: serverId,
            });

            return res.status(200).json({ roles });
        } catch (e) {
            Logger.error(String(e));
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    //TODO: Validate role model
    public static async createRole(
        req: Request,
        res: Response,
    ): Promise<Response> {
        try {
            const user = req.user as unknown as User;
            const serverId = req.params.serverId;
            const data = req.body;

            const server = await ServerModel.findById(serverId);
            const member = await ServerMemberModel.findOne({
                server: serverId,
                user: user._id,
            });

            if (!serverId || !server || !member)
                return res.status(404).json({ message: 'Server not found' });

            if (
                !PermissionUtilities.hasPermissionInGuild(
                    member._id.toString(),
                    [Permissions.ManageRoles],
                )
            )
                return res.status(403).json({ message: 'Forbidden' });

            const role = await RoleModel.create({
                color: data.color,
                name: data.name,
                server: serverId,
                permissions: []
            });

            return res.status(201).json({ role });
        } catch (e) {
            Logger.error(String(e));
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
