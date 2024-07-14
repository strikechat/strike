import express from 'express';
import { config } from 'dotenv';
import { Logger } from './modules/common/utils/Logger';
import { Database } from './modules/database';
import { getUserFromToken, setupPassport } from './modules/auth/passport';

config();

const app = express();

setupPassport();

app.use(express.json());
app.use(getUserFromToken);

import AuthRoutes from './modules/auth/routes';

app.use('/auth', AuthRoutes);

app.listen(process.env.STRIKE_API_PORT ?? 3000, async () => {
  Logger.info(`Server is running on port ${process.env.STRIKE_API_PORT ?? 3000}`);
  await new Database().connect();
});
