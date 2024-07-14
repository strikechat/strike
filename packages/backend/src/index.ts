import express from 'express';
import { config } from 'dotenv';
import { Logger } from './modules/common/utils/Logger';
import { Database } from './modules/database';
import { setupPassport } from './modules/auth/passport';

config();

const app = express();

app.use(express.json());

import AuthRoutes from './modules/auth/routes';

app.use('/auth', AuthRoutes);

app.listen(process.env.STRIKE_API_PORT ?? 3000, async () => {
  Logger.info(`Server is running on port ${process.env.STRIKE_API_PORT ?? 3000}`);
  setupPassport();
  await new Database().connect();
});
