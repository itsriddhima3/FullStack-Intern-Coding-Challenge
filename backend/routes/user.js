import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { getStores, submitRating } from '../controllers/userController.js';

const router = Router();
router.use(auth);

router.get('/stores', getStores);
router.post('/rate', submitRating);

export default router;