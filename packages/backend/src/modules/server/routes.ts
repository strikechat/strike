import { Router } from "express";
import { requireLoggedIn } from "../auth/passport";
import { ServerController } from "./controllers/ServerController";

const router = Router();

router.use(requireLoggedIn());

router.post('/', ServerController.createServer);
router.get('/@me', ServerController.getAllCurrentUserServers);
router.delete('/:serverId', ServerController.deleteServer);

export default router;