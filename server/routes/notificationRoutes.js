// routes/notificationRoutes.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  getNotifications,
  markAsRead,
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', authMiddleware, getNotifications);
router.patch('/:id/read', authMiddleware, markAsRead);

export default router;
