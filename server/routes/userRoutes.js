import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { getUserIssueStats } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, upload.single('avatar'), updateProfile);
router.get('/user/stats', authMiddleware, getUserIssueStats);

export default router;
