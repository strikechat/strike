import express from 'express';
import { config } from 'dotenv';
import { Logger } from './modules/common/utils/Logger';
import { Database } from './modules/database';
import { getUserFromToken, setupPassport } from './modules/auth/passport';
import cors from 'cors';
config();

const app = express();

setupPassport();

app.use(express.json());
app.use(cors({
  origin: "*"
}));
app.use(getUserFromToken);

import AuthRoutes from './modules/auth/routes';
import ServerRoutes from './modules/server/routes';
import MessageRoutes from './modules/message/routes';
import InviteRoutes from './modules/invite/routes';

app.use('/auth', AuthRoutes);
app.use('/server', ServerRoutes);
app.use('/messages', MessageRoutes);
app.use('/invite', InviteRoutes);

app.listen(process.env.STRIKE_API_PORT ?? 3000, async () => {
  Logger.info(`Server is running on port ${process.env.STRIKE_API_PORT ?? 3000}`);
  await new Database().connect();
});
