

import express from 'express';
import upload from '../middleware/upload.js';  // multer middleware
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Add upload middleware to accept avatar file on signup
router.post('/signup', upload.single('avatar'), register);
router.post('/login', login);

export default router;
