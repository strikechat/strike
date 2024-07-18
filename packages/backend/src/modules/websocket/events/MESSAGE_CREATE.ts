import MessageModel from '@models/Message';
import mongoose from 'mongoose';
import { Socket, Server } from 'socket.io';

export const MESSAGE_CREATE = 'MESSAGE_CREATE';

export const MessageCreate = async (io: Server, socket: any, data: any) => {
    if (!data.content || !data.serverId || !data.channelId) return;

    let message = await (await MessageModel.create({
        author: new mongoose.Types.ObjectId(socket.user.id),
        content: data.content,
        server: new mongoose.Types.ObjectId(data.serverId),
        channel: new mongoose.Types.ObjectId(data.channelId),
        createdAt: new Date(),
        pinned: false,
    })).populate('author', '-password -email');

    await message.save();

    io.to(data.serverId).emit(MESSAGE_CREATE, message);
};
