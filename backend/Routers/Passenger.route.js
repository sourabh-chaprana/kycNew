import express from 'express';
import {
  getPNRs,
  getPNRById,
  createPNR,
  updatePassengerStatus,
  approveAllPending,
  deletePNR
} from '../Controllers/Passenger.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateCreatePNR, validateUpdatePassengerStatus } from '../middleware/validator.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/passengers
// @desc    Get all PNRs with optional status filter
// @access  Private
router.get('/', getPNRs);

// @route   GET /api/passengers/:id
// @desc    Get single PNR by ID
// @access  Private
router.get('/:id', getPNRById);

// @route   POST /api/passengers
// @desc    Create new PNR
// @access  Private
router.post('/', validateCreatePNR, createPNR);

// @route   PUT /api/passengers/:pnrId/passengers/:passengerId
// @desc    Update passenger status
// @access  Private
router.put('/:pnrId/passengers/:passengerId', validateUpdatePassengerStatus, updatePassengerStatus);

// @route   PUT /api/passengers/:pnrId/passengers/approve-all
// @desc    Approve all pending passengers in a PNR
// @access  Private
router.put('/:pnrId/passengers/approve-all', approveAllPending);

// @route   DELETE /api/passengers/:id
// @desc    Delete PNR
// @access  Private
router.delete('/:id', deletePNR);

export default router;

