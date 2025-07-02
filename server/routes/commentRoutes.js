import express from 'express';
import { addComment, getComments } from '../controllers/commentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/issues/:issueId/comments
router.post('/:issueId/comments', authMiddleware, addComment);

// GET /api/issues/:issueId/comments
router.get('/:issueId/comments', getComments);

export default router;
