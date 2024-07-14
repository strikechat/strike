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
}
