import { Router } from "express";
import { requireLoggedIn } from "../auth/passport";
import { UserController } from "./controllers/UserController";

const router = Router();

router.use(requireLoggedIn());

router.get('/:userId/profile', UserController.fetchUserProfile);

export default router;