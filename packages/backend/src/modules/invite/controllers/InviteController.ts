import InviteModel from '@models/Invite';
import ServerModel from '@models/Server';
import ServerMemberModel from '@models/ServerMember';
import { User } from '@models/User';
import { Logger } from '@utils/Logger';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

export class InviteController {

    public static async getInvite(req: Request, res: Response): Promise<Response> {
        try {
            const { inviteId } = req.params;
            if (!inviteId) return res.status(400).json({ message: 'Bad Request' });

            const invite = await InviteModel.findOne({ code: inviteId }).populate('server');
            return res.status(200).json({ invite });
        } catch (e) {
            Logger.error(String(e));
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public static async deleteInvite(req: Request, res: Response): Promise<Response> {
        try {
            const user = req.user as unknown as User;
            const { inviteId } = req.params;
            if (!inviteId) return res.status(400).json({ message: 'Bad Request' });

            const invite = await InviteModel.findOne({ _id: inviteId });
            if (!invite) return res.status(404).json({ message: 'Invite not found' });
            if (invite.author.toString() !== user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
            
            await invite.deleteOne();
            return res.status(200).json({ invite });
        } catch (e) {
            Logger.error(String(e));
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public static async acceptInvite(req: Request, res: Response): Promise<Response> {
        try {
            const user = req.user as unknown as User;
            const { inviteId } = req.params;
            if (!inviteId) return res.status(400).json({ message: 'Bad Request' });

            const invite = await InviteModel.findOne({ code: inviteId });
            if (!invite) return res.status(404).json({ message: 'Invite not found' });
            if (invite.uses >= invite.maxUses) return res.status(400).json({ message: 'Max uses reached' });
            if (invite.expiresAt < new Date()) return res.status(400).json({ message: 'Invite expired' });

            const serverMember = await ServerMemberModel.findOne({ user, server: new mongoose.Types.ObjectId(invite.server._id) });
            if (serverMember) return res.status(400).json({ message: 'You already have access to this server' });
        
            const member = new ServerMemberModel({
                server: new mongoose.Types.ObjectId(invite.server._id),
                user: new mongoose.Types.ObjectId(user._id),
                usedInvite: new mongoose.Types.ObjectId(invite._id),
            });
            await member.save();

            await invite.updateOne({ $inc: { uses: 1 } });
            
            return res.status(200).json({ member });
        } catch (e) {
            Logger.error(String(e));
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public static async createInvite(req: Request, res: Response): Promise<Response> {
        try {
            const user = req.user as unknown as User;
            const { serverId, maxUses, expiresAt } = req.body;
            if (!serverId || !maxUses || !expiresAt) return res.status(400).json({ message: 'Bad Request' });

            const server = await ServerModel.findOne({ _id: serverId });
            if (!server) return res.status(404).json({ message: 'Server not found' });

            const existingInvite = await InviteModel.findOne({
                author: new mongoose.Types.ObjectId(user._id),
                server: new mongoose.Types.ObjectId(server._id),
                expiresAt: { $gt: new Date() },
                uses: { $lt: maxUses },
            })
            if (existingInvite) return res.status(200).json({ invite: existingInvite });

            let code: string;
            let codeExists: boolean;
            do {
                code = Math.random().toString(36).substring(2, 8);
                codeExists = Boolean(await InviteModel.exists({ code }));
            } while (codeExists);

            const invite = new InviteModel({
                author: new mongoose.Types.ObjectId(user._id),
                server: new mongoose.Types.ObjectId(server._id),
                code,
                maxUses,
                expiresAt,
            });
            await invite.save();

            return res.status(200).json({ invite });
        } catch (e) {
            Logger.error(String(e));
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}