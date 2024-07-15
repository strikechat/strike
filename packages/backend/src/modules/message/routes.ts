import { Router } from "express";
import { requireLoggedIn } from "../auth/passport";
import { MessageController } from "./controllers/MessageController";

const router = Router();

router.use(requireLoggedIn());

router.get('/:serverId/:channelId', MessageController.fetchMessages);
router.post('/', MessageController.createMessage);
router.delete('/:messageId', MessageController.deleteMessage);
router.put('/:messageId', MessageController.editMessage);
router.put('/:messageId/pin', MessageController.pinMessage);

export default router;