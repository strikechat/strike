import { Request, Response } from 'express';
import UserModel, { User } from '@models/User';
import { Logger } from '@utils/Logger';
import ServerMemberModel from '@models/ServerMember';
import mongoose from 'mongoose';

export class UserController {

    public static async fetchUserProfile(req: Request, res: Response): Promise<Response> {
        try {
            const user = req.user as unknown as User;
            const { userId } = req.params;
    
            if (!userId) return res.status(400).json({ message: 'Bad Request' });
    
            const userData = await UserModel.findById(userId).select('-password -email').exec();
            if (!userData) return res.status(403).json({ message: 'Forbidden' });

            const mutualServers = await UserController.getMutualServers(user, userData);
    
            // temporary data
            return res.status(200).json({ user: userData, mutualServers, mutualFriends: [] });
        } catch (e) {
            Logger.error(String(e));
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public static async getMutualServers(me: User, user: User): Promise<{ id: string, name: string }[]> {
        try {
            const userServers = await ServerMemberModel.find({ user: new mongoose.Types.ObjectId(user._id!) }).populate('server');
            const meServers = await ServerMemberModel.find({ user: new mongoose.Types.ObjectId(me._id!) }).populate('server');
            
            const mutualServers = userServers
                .filter(server => meServers.some(meServer => meServer.server._id.toString() === server.server._id.toString()))
                .map(server => {
                    return {
                        id: server.server._id.toString(),
                        // @ts-ignore
                        name: server.server.name!
                    }
                });
    
            return mutualServers;
        } catch(e) {
            Logger.error(String(e));
            return [];
        }

    }
}