import { Router } from "express";
import { requireLoggedIn } from "../auth/passport";
import { ServerController } from "./controllers/ServerController";

const router = Router();

router.use(requireLoggedIn());

router.post('/', ServerController.createServer);
router.get('/@me', ServerController.getAllCurrentUserServers);
router.delete('/:serverId', ServerController.deleteServer);
router.post('/:serverId/channels', ServerController.createServerChannel);
router.get('/:serverId/channels', ServerController.getAllGuildChannels);

export default router;