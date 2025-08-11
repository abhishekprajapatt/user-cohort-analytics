import {
  generateAllCohorts,
  getCohortStatistics,
  getUsersByCohort,
  calculateUserMetrics,
} from '../services/cohortService.js';
import {
  getRevenueAnalysis,
  getCLVDistribution,
  getCustomerBehaviorInsights,
  getChurnRiskAnalysis,
} from '../services/analyticsService.js';
import { API_RESPONSES } from '../utils/constants.js';
import logger from '../utils/logger.js';

/**
 * Generate cohorts for all users
 */
export const generateCohorts = async (req, res) => {
  try {
    const { useKMeans = false } = req.body;

    logger.cohortInfo('Manual cohort generation started', { useKMeans });

    const results = await generateAllCohorts(useKMeans);

    res.status(200).json({
      ...API_RESPONSES.SUCCESS,
      message: 'Cohorts generated successfully',
      data: results,
    });
  } catch (error) {
    logger.cohortError('Error generating cohorts:', error);
    res.status(500).json({
      ...API_RESPONSES.ERROR,
      message: 'Failed to generate cohorts',
      error: error.message,
    });
  }
};

/**
 * Get cohort statistics and distribution
 */
export const getCohortStats = async (req, res) => {
  try {
    const stats = await getCohortStatistics();

    res.status(200).json({
      ...API_RESPONSES.SUCCESS,
      data: stats,
    });
  } catch (error) {
    logger.error('Error getting cohort statistics:', error);
    res.status(500).json({
      ...API_RESPONSES.ERROR,
      message: 'Failed to get cohort statistics',
      error: error.message,
    });
  }
};

/**
 * Get users in a specific cohort
 */
export const getCohortUsers = async (req, res) => {
  try {
    const { cohortName } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const result = await getUsersByCohort(
      cohortName,
      parseInt(page),
      parseInt(limit)
    );

    res.status(200).json({
      ...API_RESPONSES.SUCCESS,
      data: result,
    });
  } catch (error) {
    logger.error('Error getting cohort users:', error);
    res.status(500).json({
      ...API_RESPONSES.ERROR,
      message: 'Failed to get cohort users',
      error: error.message,
    });
  }
};

/**
 * Get comprehensive cohort analytics
 */
export const getCohortAnalytics = async (req, res) => {
  try {
    const [
      cohortStats,
      revenueAnalysis,
      clvDistribution,
      behaviorInsights,
      churnAnalysis,
    ] = await Promise.all([
      getCohortStatistics(),
      getRevenueAnalysis(),
      getCLVDistribution(),
      getCustomerBehaviorInsights(),
      getChurnRiskAnalysis(),
    ]);

    res.status(200).json({
      ...API_RESPONSES.SUCCESS,
      data: {
        overview: cohortStats,
        revenue: revenueAnalysis,
        clvDistribution,
        behaviorInsights,
        churnRisk: churnAnalysis,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error('Error getting cohort analytics:', error);
    res.status(500).json({
      ...API_RESPONSES.ERROR,
      message: 'Failed to get cohort analytics',
      error: error.message,
    });
  }
};

/**
 * Get user metrics for a specific user
 */
export const getUserMetrics = async (req, res) => {
  try {
    const { userId } = req.params;

    const metrics = await calculateUserMetrics(userId);

    res.status(200).json({
      ...API_RESPONSES.SUCCESS,
      data: {
        userId,
        metrics,
        calculatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error('Error getting user metrics:', error);
    res.status(500).json({
      ...API_RESPONSES.ERROR,
      message: 'Failed to get user metrics',
      error: error.message,
    });
  }
};

/**
 * Get all available cohort types and their definitions
 */
export const getCohortTypes = async (req, res) => {
  try {
    const { COHORT_TYPES, COHORT_THRESHOLDS } = await import(
      '../utils/constants.js'
    );

    res.status(200).json({
      ...API_RESPONSES.SUCCESS,
      data: {
        cohortTypes: COHORT_TYPES,
        thresholds: COHORT_THRESHOLDS,
        description: 'Available cohort types and their business rules',
      },
    });
  } catch (error) {
    logger.error('Error getting cohort types:', error);
    res.status(500).json({
      ...API_RESPONSES.ERROR,
      message: 'Failed to get cohort types',
      error: error.message,
    });
  }
};

export default {
  generateCohorts,
  getCohortStats,
  getCohortUsers,
  getCohortAnalytics,
  getUserMetrics,
  getCohortTypes,
};
