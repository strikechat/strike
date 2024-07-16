import { Router } from "express";
import { requireLoggedIn } from "../auth/passport";
import { InviteController } from "./controllers/InviteController";

const router = Router();

router.use(requireLoggedIn());

router.post('/', InviteController.createInvite);
router.get('/:inviteId', InviteController.getInvite);
router.delete('/:inviteId', InviteController.deleteInvite);
router.put('/:inviteId/accept', InviteController.acceptInvite);

export default router;