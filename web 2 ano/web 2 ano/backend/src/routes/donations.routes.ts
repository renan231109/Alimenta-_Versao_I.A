import { Router } from 'express';
import {
  createDonation,
  listDonations,
  getDonation,
  updateDonationStatus,
  requestDonation,
  approveRequest,
  rejectRequest,
  acceptDelivery,
  completeDelivery,
  listVolunteerDeliveries,
} from '../controllers/donations.controller';
import { authMiddleware, requireRole } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', listDonations);
router.get('/:id', getDonation);

router.post('/', authMiddleware, requireRole('DOADOR', 'ONG', 'ADMIN'), upload.single('photo'), createDonation);
router.patch('/:id/status', authMiddleware, updateDonationStatus);

router.post('/:id/request', authMiddleware, requireRole('FAMILIA', 'ONG'), requestDonation);
router.patch('/requests/:requestId/approve', authMiddleware, requireRole('DOADOR', 'ONG'), approveRequest);
router.patch('/requests/:requestId/reject', authMiddleware, requireRole('DOADOR', 'ONG'), rejectRequest);

router.post('/:id/delivery/accept', authMiddleware, requireRole('VOLUNTARIO'), acceptDelivery);
router.patch('/deliveries/:deliveryId/complete', authMiddleware, requireRole('VOLUNTARIO'), completeDelivery);
router.get('/volunteer/deliveries', authMiddleware, requireRole('VOLUNTARIO'), listVolunteerDeliveries);

export default router;
