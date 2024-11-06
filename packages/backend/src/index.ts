import express from 'express';
import { config } from 'dotenv';
import { Logger } from './modules/common/utils/Logger';
import { Database } from './modules/database';
import { getUserFromToken, setupPassport } from './modules/auth/passport';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: '*',
    },
});

setupPassport();

app.use(express.json());
app.use(
    cors({
        origin: '*',
    }),
);
app.use(getUserFromToken);

import AuthRoutes from './modules/auth/routes';
import ServerRoutes from './modules/server/routes';
import MessageRoutes from './modules/message/routes';
import InviteRoutes from './modules/invite/routes';
import UserRoutes from './modules/users/routes';
import UserModel, { User } from '@models/User';
import { verifyJWT } from './modules/websocket/verifyJWT';
import {
    MESSAGE_CREATE,
    MessageCreate,
} from './modules/websocket/events/MESSAGE_CREATE';
import ServerMemberModel from '@models/ServerMember';
import { UserStatus } from '@enums/user/UserStatus';

app.use('/auth', AuthRoutes);
app.use('/server', ServerRoutes);
app.use('/messages', MessageRoutes);
app.use('/invite', InviteRoutes);
app.use('/users', UserRoutes);

io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error: Token missing'));
    }
    next();
});

server.listen(process.env.STRIKE_API_PORT ?? 3000, async () => {
    io.listen(3000);
    Logger.info(
        `Server is running on port ${process.env.STRIKE_API_PORT ?? 3000}`,
    );
    io.on('connection', async (socket: Socket) => {
        verifyJWT(socket, async (err) => {
            if (err) {
                Logger.error(`Socket authentication error: ${err.message}`);
                socket.disconnect(true);
            } else {
                //TODO: Fix typing
                const user = (socket as any).user as any;
                Logger.info(
                    `${user.username} connected to websocket. Assigning to room: ${user.id}`,
                );

                await UserModel.updateOne(
                    {
                        _id: user.id,
                    },
                    {
                        $set: {
                            status: UserStatus.Online,
                        },
                    },
                );

                socket.join(user.id.toString());

                const userGuilds = await ServerMemberModel.find({
                    user: user.id,
                });

                for (const guild of userGuilds) {
                    Logger.info(
                        `Adding ${user.username} to room: ${guild.server}`,
                    );
                    socket.join(guild.server.toString());
                }

                socket.on(MESSAGE_CREATE, async (data: any) => {
                    await MessageCreate(io, socket, data);
                });

                socket.on('disconnect', async () => {
                    await UserModel.updateOne(
                        {
                            _id: user.id,
                        },
                        {
                            $set: {
                                status: UserStatus.Offline,
                            },
                        },
                    );
                });
            }
        });
    });

    await new Database().connect();
});

export { io };
