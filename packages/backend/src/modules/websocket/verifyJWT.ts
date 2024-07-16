import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';

export const verifyJWT = (socket: Socket, next: (err?: any) => void) => {
    const token = socket.handshake.auth.token
        ? socket.handshake.auth.token.split(' ')[1]
        : null;
    if (!token) {
        return next(new Error('Authentication error: Token missing'));
    }

    jwt.verify(token, process.env.STRIKE_JWT_SECRET!, (err, decoded: any) => {
        if (err) {
            return next(new Error('Authentication error: Invalid token'));
        }

        (socket as any).user = decoded.user;

        next();
    });
};
