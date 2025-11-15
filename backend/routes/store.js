import { Router } from 'express';
import { auth, isStoreOwner } from '../middleware/auth.js';
import { getRatings, getAverageRating } from '../controllers/storeController.js';

const router = Router();
router.use(auth, isStoreOwner);

router.get('/ratings', getRatings);
router.get('/average', getAverageRating);

export default router;