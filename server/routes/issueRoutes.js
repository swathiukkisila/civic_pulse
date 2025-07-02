import express from 'express';
import upload from '../middleware/upload.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import {
  getAllIssues,
  getMyIssues,
  createIssue,
  updateIssue,
  deleteIssue,
  upvoteIssue,
  removeUpvote,
} from '../controllers/issueController.js';
import { updateIssueStatus } from '../controllers/adminController.js';
import { getSingleIssue } from '../controllers/issueController.js';



const router = express.Router();

router.get('/', getAllIssues);
router.get('/my', authMiddleware, getMyIssues);
router.get('/:id', getSingleIssue);
router.post('/', authMiddleware, upload.single('image'), createIssue);
router.put('/:id', authMiddleware, updateIssue);
router.delete('/:id', authMiddleware, deleteIssue);
router.put('/admin/issues/:id/status', authMiddleware, adminMiddleware, updateIssueStatus);
router.post('/:id/upvote', authMiddleware, upvoteIssue);
router.post('/:id/remove-upvote', authMiddleware, removeUpvote);




export default router;
