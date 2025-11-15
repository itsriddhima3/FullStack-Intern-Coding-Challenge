import { Router } from 'express';
import { auth, isAdmin } from '../middleware/auth.js';
import { getDashboard, getUsers, getStores, getUserDetails, addUser, addStore } from '../controllers/adminController.js';

const router = Router();
router.use(auth, isAdmin);

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.get('/users/:id', getUserDetails);
router.get('/stores', getStores);
router.post('/user', addUser);
router.post('/store', addStore);

export default router;