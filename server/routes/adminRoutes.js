// routes/adminRoutes.js
import express from 'express';
import adminMiddleware from '../middleware/adminMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { getAllIssues } from '../controllers/issueController.js';

import { adminLogin } from '../controllers/adminAuthController.js';

const router = express.Router();

router.post('/login', adminLogin);



router.get('/admin/issues', authMiddleware, adminMiddleware, getAllIssues);


export default router;
