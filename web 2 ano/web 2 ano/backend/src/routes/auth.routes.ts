import { Router } from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getProfile,
  updateProfile,
  uploadAvatar,
} from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-email/:token', verifyEmail);

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/profile/avatar', authMiddleware, upload.single('avatar'), uploadAvatar);

export default router;
