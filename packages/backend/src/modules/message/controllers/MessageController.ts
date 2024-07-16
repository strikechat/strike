import { Request, Response } from 'express';
import MessageModel from '@models/Message';
import { User } from '@models/User';
import { ServerChannel } from '@models/ServerChannel';
import mongoose from 'mongoose';
import { Logger } from '@utils/Logger';
import ServerMemberModel from '@models/ServerMember';
import { io } from 'src';
import { MESSAGE_CREATE } from 'src/modules/websocket/events/MESSAGE_CREATE';

export class MessageController {

    public static async fetchMessages(req: Request, res: Response): Promise<Response> {
        try {
            const user = req.user as unknown as User;
            const { serverId, channelId } = req.params;
            const { limit = 50, skip = 0 } = req.query;

            if(!serverId || !channelId) return res.status(400).json({ message: 'Bad Request' });

            const serverMember = await ServerMemberModel.findOne({ user, server: new mongoose.Types.ObjectId(serverId) });
            if(!serverMember) return res.status(403).json({ message: 'Forbidden' });

            const messages = await MessageModel.find({ 
                server: new mongoose.Types.ObjectId(serverId), 
                channel: new mongoose.Types.ObjectId(channelId) 
            })
            .populate('author', '-password -email')
            // .skip(parseInt(skip as string))
            // .limit(parseInt(limit as string))
            .exec();
            
            return res.status(200).json({ messages });
        } catch(e) {
            Logger.error(String(e));
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public static async createMessage(req: Request, res: Response): Promise<Response> {
        try {
            const user = req.user as unknown as User;
            const { content, serverId, channelId } = req.body;

            if(!content || !serverId || !channelId) return res.status(400).json({ message: 'Bad Request' });

            const serverMember = await ServerMemberModel.findOne({ user, server: new mongoose.Types.ObjectId(serverId) });
            if(!serverMember) return res.status(403).json({ message: 'Forbidden' });

            const message = new MessageModel({
                content,
                author: user._id!,
                server: new mongoose.Types.ObjectId(serverId),
                channel: new mongoose.Types.ObjectId(channelId),
                createdAt: new Date(),
            });

            await message.save();
            await message.populate('author', '-email -password');

            io.to(serverId).emit(MESSAGE_CREATE, message);

            return res.status(201).json({ message });
        } catch(e) {
            Logger.error(String(e));
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public static async deleteMessage(req: Request, res: Response): Promise<Response> {
        try {
            const user = req.user as unknown as User;
            const { messageId } = req.body;

            const message = await MessageModel.findById(messageId);
            if (!message || message.author.toString() !== user._id.toString()) return res.status(404).json({ message: 'Message not found or unauthorized' });

            // maybe another delete logic??
            await MessageModel.findByIdAndDelete(messageId);

            return res.status(200).json({ message: 'Message deleted successfully' });
        } catch(e) {
            Logger.error(String(e));
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public static async editMessage(req: Request, res: Response): Promise<Response> {
        try {
            const user = req.user as unknown as User;
            const { messageId } = req.params;
            const { content } = req.body;

            const message = await MessageModel.findById(messageId);
            if (!message || message.author.toString() !== user._id.toString()) return res.status(404).json({ message: 'Message not found or unauthorized' });

            message.content = content;
            await message.save();
            return res.status(200).json({ message })
        } catch(e) {
            Logger.error(String(e))
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    public static async pinMessage(req: Request, res: Response): Promise<Response> {
        try {
            const user = req.user as unknown as User;
            const { messageId } = req.params;

            const message = await MessageModel.findById(messageId);
            if (!message) return res.status(404).json({ message: 'Message not found or unauthorized' });

            // here is check permissions for pinning (for now only author can pin)
            if (message.author.toString() !== user._id.toString()) return res.status(403).json({ message: 'Forbidden' });

            message.pinned = !message.pinned;
            await message.save();

            const systemMessage = new MessageModel({
                author: null,
                isSystem: true,
                content: `${user.username} ${message.pinned ? 'pinned' : 'unpinned'} message.`,
                server: message.server,
                channel: message.channel,
                createdAt: new Date(),
                pinned: false
            })

            await systemMessage.save();
            io.to(message.server.toString()).emit(MESSAGE_CREATE, systemMessage);

            return res.status(200).json({ message })
        } catch(e) {
            Logger.error(String(e))
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }
}