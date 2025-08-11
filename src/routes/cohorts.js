import express from 'express';
import {
  generateCohorts,
  getCohortStats,
  getCohortUsers,
  getCohortAnalytics,
  getUserMetrics,
  getCohortTypes,
} from '../controllers/cohortController.js';

const router = express.Router();

/**
 * @route   GET /api/cohorts
 * @desc    Get cohort statistics and distribution
 * @access  Public
 */
router.get('/', getCohortStats);

/**
 * @route   POST /api/cohorts/generate
 * @desc    Generate cohorts for all users
 * @access  Public
 * @body    { useKMeans: boolean }
 */
router.post('/generate', generateCohorts);

/**
 * @route   GET /api/cohorts/analytics
 * @desc    Get comprehensive cohort analytics
 * @access  Public
 */
router.get('/analytics', getCohortAnalytics);

/**
 * @route   GET /api/cohorts/types
 * @desc    Get all available cohort types and their definitions
 * @access  Public
 */
router.get('/types', getCohortTypes);

/**
 * @route   GET /api/cohorts/:cohortName/users
 * @desc    Get users in a specific cohort
 * @access  Public
 * @params  cohortName - Name of the cohort
 * @query   page, limit - Pagination parameters
 */
router.get('/:cohortName/users', getCohortUsers);

/**
 * @route   GET /api/cohorts/user/:userId/metrics
 * @desc    Get calculated metrics for a specific user
 * @access  Public
 * @params  userId - User ID
 */
router.get('/user/:userId/metrics', getUserMetrics);

export default router;
