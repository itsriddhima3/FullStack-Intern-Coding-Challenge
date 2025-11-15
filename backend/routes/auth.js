import { Router } from 'express';
import { login, signup, changePassword } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.post('/login', login);
router.post('/signup', signup);
router.put('/change-password', auth, changePassword);

export default router;