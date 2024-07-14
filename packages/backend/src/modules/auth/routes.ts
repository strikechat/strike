import { Router } from 'express';
import AuthController from './controllers/AuthController';
import { requireLoggedIn } from './passport';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/@me', requireLoggedIn(), AuthController.me)

export default router;