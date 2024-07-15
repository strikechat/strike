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

            return res.status(201).json({ server });
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

            if (
                !serverId ||
                !server ||
                server.owner.toString() !== user._id.toString()
            )
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

            if(!serverId || !server || !member)
                return res.status(404).json({ message: 'Server not found' });

            return res.status(200).json({ server });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
