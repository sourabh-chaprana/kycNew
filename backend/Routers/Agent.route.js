import express from 'express';
import {
  getAllAgents,
  getAgentPassengers
} from '../Controllers/Agent.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected and admin only
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/agents
// @desc    Get all agents with stats
// @access  Private (Admin only)
router.get('/', getAllAgents);

// @route   GET /api/agents/:agentId/passengers
// @desc    Get passengers/PNRs for specific agent
// @access  Private (Admin only)
router.get('/:agentId/passengers', getAgentPassengers);

export default router;

