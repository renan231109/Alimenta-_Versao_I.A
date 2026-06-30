import { Router } from 'express';
import {
  getAiInsights,
  getPrioritizedDonations,
  getSuggestedRoute,
  calculateImpact,
  getCityImpact,
  getDashboardStats,
  getRanking,
  getAchievements,
  getCertificate,
  getAdminStats,
  createReview,
  getPublicStats,
} from '../controllers/analytics.controller';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

router.get('/public', getPublicStats);
router.get('/dashboard', authMiddleware, getDashboardStats);
router.get('/ranking', getRanking);
router.get('/city-impact', getCityImpact);
router.post('/calculator', calculateImpact);
router.get('/calculator', calculateImpact);

router.get('/ai/insights', authMiddleware, getAiInsights);
router.get('/ai/prioritized', authMiddleware, getPrioritizedDonations);
router.get('/ai/route', authMiddleware, getSuggestedRoute);

router.get('/achievements', authMiddleware, getAchievements);
router.get('/certificates/:achievementId', authMiddleware, getCertificate);
router.post('/reviews', authMiddleware, createReview);

router.get('/admin', authMiddleware, requireRole('ADMIN'), getAdminStats);

export default router;
