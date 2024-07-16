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
        methods: ['GET', 'POST'],
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
import { User } from '@models/User';
import { verifyJWT } from './modules/websocket/verifyJWT';

app.use('/auth', AuthRoutes);
app.use('/server', ServerRoutes);
app.use('/messages', MessageRoutes);
app.use('/invite', InviteRoutes);

io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error: Token missing'));
    }
});

io.on('connection', (socket: Socket) => {
    verifyJWT(socket, (err) => {
        if (err) {
            Logger.error(`Socket authentication error: ${err.message}`);
            socket.disconnect(true);
        } else {
            const user = (socket as any).user as User;
            Logger.info(`${user.username} connected to websocket`);

            socket.on('message-create', async (data: any) => {
                console.log('message-create', data);
            });
        }
    });
});

server.listen(process.env.STRIKE_API_PORT ?? 3000, async () => {
    Logger.info(
        `Server is running on port ${process.env.STRIKE_API_PORT ?? 3000}`,
    );
    await new Database().connect();
});
