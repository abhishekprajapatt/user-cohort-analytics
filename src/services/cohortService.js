import User from '../models/User.js';
import Order from '../models/Order.js';
import {
  COHORT_THRESHOLDS,
  COHORT_TYPES,
  CLUSTERING_CONFIG,
} from '../utils/constants.js';
import logger from '../utils/logger.js';
import kmeans from 'ml-kmeans';

// user ke order history ke base pe metrics calculate karte hain
export const calculateUserMetrics = async (userId) => {
  try {
    const orders = await Order.find({
      userId,
      status: { $in: ['Delivered', 'Shipped', 'Processing'] },
    }).sort({ orderDate: 1 });

    if (orders.length === 0) {
      return {
        totalOrders: 0,
        totalSpent: 0,
        avgCartValue: 0,
        avgItemsPerOrder: 0,
        orderFrequency: 0,
        daysSinceLastOrder: null,
        daysSinceFirstOrder: null,
        lifetimeValue: 0,
        lastOrderDate: null,
        firstOrderDate: null,
      };
    }

    // Calculate basic metrics
    const totalOrders = orders.length;
    const totalSpent = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const totalItems = orders.reduce((sum, order) => sum + order.totalItems, 0);

    const avgCartValue = totalSpent / totalOrders;
    const avgItemsPerOrder = totalItems / totalOrders;

    // Date calculations
    const firstOrderDate = orders[0].orderDate;
    const lastOrderDate = orders[orders.length - 1].orderDate;
    const now = new Date();

    const daysSinceFirstOrder = Math.floor(
      (now - firstOrderDate) / (1000 * 60 * 60 * 24)
    );
    const daysSinceLastOrder = Math.floor(
      (now - lastOrderDate) / (1000 * 60 * 60 * 24)
    );

    // Order frequency (orders per month)
    const monthsSinceFirstOrder = Math.max(1, daysSinceFirstOrder / 30.44); // Average days per month
    const orderFrequency = totalOrders / monthsSinceFirstOrder;

    return {
      totalOrders,
      totalSpent,
      avgCartValue: Math.round(avgCartValue * 100) / 100,
      avgItemsPerOrder: Math.round(avgItemsPerOrder * 100) / 100,
      orderFrequency: Math.round(orderFrequency * 100) / 100,
      daysSinceLastOrder,
      daysSinceFirstOrder,
      lifetimeValue: totalSpent,
      lastOrderDate,
      firstOrderDate,
    };
  } catch (error) {
    logger.error('Error calculating user metrics:', error);
    throw error;
  }
};

/**
 * Assign cohort based on business rules
 * @param {Object} metrics - User metrics
 * @param {Object} user - User object
 * @returns {String} Cohort name
 */
export const assignRuleBasedCohort = (metrics, user) => {
  const {
    avgCartValue,
    orderFrequency,
    avgItemsPerOrder,
    totalOrders,
    daysSinceLastOrder,
  } = metrics;

  // Check if user is new (registered within last 7 days)
  const daysSinceRegistration = Math.floor(
    (Date.now() - user.registrationDate) / (1000 * 60 * 60 * 24)
  );
  if (daysSinceRegistration <= COHORT_THRESHOLDS.NEW_CUSTOMER_DAYS) {
    return COHORT_TYPES.NEW_CUSTOMER.name;
  }

  // No orders yet
  if (totalOrders === 0) {
    return COHORT_TYPES.NEW_CUSTOMER.name;
  }

  // Inactive customers (no order in 90+ days)
  if (daysSinceLastOrder > COHORT_THRESHOLDS.INACTIVE_DAYS) {
    return COHORT_TYPES.INACTIVE.name;
  }

  // At risk customers (no order in 30-90 days)
  if (daysSinceLastOrder > COHORT_THRESHOLDS.AT_RISK_DAYS) {
    return COHORT_TYPES.AT_RISK.name;
  }

  // High spender (average cart value > threshold)
  if (avgCartValue > COHORT_THRESHOLDS.HIGH_SPENDER_AMOUNT) {
    return COHORT_TYPES.HIGH_SPENDER.name;
  }

  // Loyal customer (many orders + recent activity)
  if (
    totalOrders >= COHORT_THRESHOLDS.LOYAL_CUSTOMER_MIN_ORDERS &&
    daysSinceLastOrder <= COHORT_THRESHOLDS.AT_RISK_DAYS
  ) {
    return COHORT_TYPES.LOYAL_CUSTOMER.name;
  }

  // Frequent buyer (high order frequency)
  if (orderFrequency > COHORT_THRESHOLDS.FREQUENT_BUYER_ORDERS_PER_MONTH) {
    return COHORT_TYPES.FREQUENT_BUYER.name;
  }

  // Bulk buyer (many items per order)
  if (avgItemsPerOrder > COHORT_THRESHOLDS.BULK_BUYER_ITEMS_PER_ORDER) {
    return COHORT_TYPES.BULK_BUYER.name;
  }

  // Default to regular customer
  return COHORT_TYPES.REGULAR_CUSTOMER.name;
};

/**
 * Normalize feature values for clustering
 * @param {Array} users - Array of users with metrics
 * @returns {Array} Normalized feature vectors
 */
export const normalizeFeatures = (users) => {
  const features = [
    'avgCartValue',
    'orderFrequency',
    'daysSinceLastOrder',
    'lifetimeValue',
  ];
  const normalized = [];

  // Calculate min/max for each feature
  const stats = {};
  features.forEach((feature) => {
    const values = users.map((user) => {
      if (feature === 'daysSinceLastOrder') {
        // For recency, treat null as very high value (inactive)
        return user.metrics[feature] || 365;
      }
      return user.metrics[feature] || 0;
    });
    stats[feature] = {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  });

  // Normalize each user's features
  users.forEach((user) => {
    const userFeatures = [];
    features.forEach((feature) => {
      let value = user.metrics[feature] || 0;

      if (feature === 'daysSinceLastOrder') {
        value = value || 365; // Treat null as 365 days
        // For recency, lower is better, so invert the scale
        value = stats[feature].max - value;
      }

      const { min, max } = stats[feature];
      const normalizedValue = max === min ? 0 : (value - min) / (max - min);
      userFeatures.push(normalizedValue);
    });

    normalized.push(userFeatures);
  });

  return { features: normalized, stats };
};

/**
 * Perform K-means clustering on user data
 * @param {Array} users - Array of users with metrics
 * @returns {Object} Clustering results
 */
export const performKMeansClustering = async (users) => {
  try {
    if (users.length < CLUSTERING_CONFIG.K) {
      logger.warn('Not enough users for K-means clustering');
      return null;
    }

    const { features, stats } = normalizeFeatures(users);

    // Perform K-means clustering
    const result = kmeans(features, CLUSTERING_CONFIG.K, {
      maxIterations: CLUSTERING_CONFIG.MAX_ITERATIONS,
      tolerance: CLUSTERING_CONFIG.TOLERANCE,
    });

    // Analyze clusters and assign meaningful names
    const clusterAnalysis = analyzeClusters(result, users, stats);

    logger.cohortInfo('K-means clustering completed', {
      clusters: CLUSTERING_CONFIG.K,
      iterations: result.iterations,
      users: users.length,
    });

    return {
      clusters: result.clusters,
      centroids: result.centroids,
      analysis: clusterAnalysis,
      stats,
    };
  } catch (error) {
    logger.error('Error in K-means clustering:', error);
    return null;
  }
};

/**
 * Analyze clusters and assign meaningful names
 * @param {Object} clusterResult - K-means result
 * @param {Array} users - Original user data
 * @param {Object} stats - Feature statistics
 * @returns {Array} Cluster analysis
 */
export const analyzeClusters = (clusterResult, users, stats) => {
  const clusterAnalysis = [];

  for (let i = 0; i < CLUSTERING_CONFIG.K; i++) {
    const clusterUsers = users.filter(
      (user, index) => clusterResult.clusters[index] === i
    );

    if (clusterUsers.length === 0) continue;

    // Calculate cluster characteristics
    const avgCartValue =
      clusterUsers.reduce((sum, user) => sum + user.metrics.avgCartValue, 0) /
      clusterUsers.length;
    const avgFrequency =
      clusterUsers.reduce((sum, user) => sum + user.metrics.orderFrequency, 0) /
      clusterUsers.length;
    const avgRecency =
      clusterUsers.reduce(
        (sum, user) => sum + (user.metrics.daysSinceLastOrder || 365),
        0
      ) / clusterUsers.length;
    const avgLifetime =
      clusterUsers.reduce((sum, user) => sum + user.metrics.lifetimeValue, 0) /
      clusterUsers.length;

    // Assign cluster name based on characteristics
    let clusterName = 'Regular Customer';
    if (avgCartValue > COHORT_THRESHOLDS.HIGH_SPENDER_AMOUNT) {
      clusterName = 'High Value Cluster';
    } else if (
      avgFrequency > COHORT_THRESHOLDS.FREQUENT_BUYER_ORDERS_PER_MONTH
    ) {
      clusterName = 'High Frequency Cluster';
    } else if (avgRecency > COHORT_THRESHOLDS.INACTIVE_DAYS) {
      clusterName = 'Inactive Cluster';
    } else if (avgRecency > COHORT_THRESHOLDS.AT_RISK_DAYS) {
      clusterName = 'At Risk Cluster';
    }

    clusterAnalysis.push({
      clusterId: i,
      name: clusterName,
      userCount: clusterUsers.length,
      characteristics: {
        avgCartValue: Math.round(avgCartValue * 100) / 100,
        avgFrequency: Math.round(avgFrequency * 100) / 100,
        avgRecency: Math.round(avgRecency * 100) / 100,
        avgLifetimeValue: Math.round(avgLifetime * 100) / 100,
      },
    });
  }

  return clusterAnalysis;
};

/**
 * Update cohorts for all users
 * @param {Boolean} useKMeans - Whether to use K-means clustering
 * @returns {Object} Update results
 */
export const generateAllCohorts = async (useKMeans = false) => {
  try {
    logger.cohortInfo('Starting cohort generation for all users');

    const users = await User.find({ isActive: true });
    const updateResults = {
      totalUsers: users.length,
      updatedUsers: 0,
      cohortDistribution: {},
      errors: [],
      clusteringResults: null,
    };

    // Calculate metrics for all users first
    for (const user of users) {
      try {
        const metrics = await calculateUserMetrics(user._id);
        user.metrics = metrics;
      } catch (error) {
        logger.error(`Error calculating metrics for user ${user._id}:`, error);
        updateResults.errors.push({
          userId: user._id,
          error: error.message,
        });
      }
    }

    // Apply K-means clustering if requested
    if (useKMeans) {
      const clusteringResults = await performKMeansClustering(users);
      if (clusteringResults) {
        updateResults.clusteringResults = clusteringResults.analysis;

        // Update users with cluster information
        users.forEach((user, index) => {
          user.clusterData.clusterId = clusteringResults.clusters[index];
          user.clusterData.features = {
            normalizedCartValue: clusteringResults.features[index][0],
            normalizedFrequency: clusteringResults.features[index][1],
            normalizedRecency: clusteringResults.features[index][2],
            normalizedLifetimeValue: clusteringResults.features[index][3],
          };
        });
      }
    }

    // Apply rule-based cohort assignment
    for (const user of users) {
      try {
        const oldCohort = user.cohort;
        const newCohort = assignRuleBasedCohort(user.metrics, user);

        user.cohort = newCohort;
        user.lastCohortUpdate = new Date();

        await user.save();
        updateResults.updatedUsers++;

        // Track cohort distribution
        updateResults.cohortDistribution[newCohort] =
          (updateResults.cohortDistribution[newCohort] || 0) + 1;

        if (oldCohort !== newCohort) {
          logger.debug(
            `User ${user._id} moved from ${oldCohort} to ${newCohort}`
          );
        }
      } catch (error) {
        logger.error(`Error updating cohort for user ${user._id}:`, error);
        updateResults.errors.push({
          userId: user._id,
          error: error.message,
        });
      }
    }

    logger.cohortInfo('Cohort generation completed', {
      totalUsers: updateResults.totalUsers,
      updatedUsers: updateResults.updatedUsers,
      errors: updateResults.errors.length,
      distribution: updateResults.cohortDistribution,
    });

    return updateResults;
  } catch (error) {
    logger.cohortError('Error in cohort generation:', error);
    throw error;
  }
};

/**
 * Get cohort statistics
 * @returns {Object} Cohort statistics
 */
export const getCohortStatistics = async () => {
  try {
    const pipeline = [
      {
        $group: {
          _id: '$cohort',
          count: { $sum: 1 },
          avgLifetimeValue: { $avg: '$metrics.lifetimeValue' },
          avgCartValue: { $avg: '$metrics.avgCartValue' },
          avgOrderFrequency: { $avg: '$metrics.orderFrequency' },
          totalRevenue: { $sum: '$metrics.totalSpent' },
        },
      },
      {
        $sort: { count: -1 },
      },
    ];

    const cohortStats = await User.aggregate(pipeline);
    const totalUsers = await User.countDocuments({ isActive: true });

    const formattedStats = {
      totalUsers,
      cohorts: {},
      totalRevenue: 0,
    };

    cohortStats.forEach((stat) => {
      const percentage =
        Math.round((stat.count / totalUsers) * 100 * 100) / 100;
      formattedStats.cohorts[stat._id] = {
        count: stat.count,
        percentage,
        avgLifetimeValue: Math.round((stat.avgLifetimeValue || 0) * 100) / 100,
        avgCartValue: Math.round((stat.avgCartValue || 0) * 100) / 100,
        avgOrderFrequency:
          Math.round((stat.avgOrderFrequency || 0) * 100) / 100,
        totalRevenue: Math.round((stat.totalRevenue || 0) * 100) / 100,
      };
      formattedStats.totalRevenue += stat.totalRevenue || 0;
    });

    formattedStats.totalRevenue =
      Math.round(formattedStats.totalRevenue * 100) / 100;

    return formattedStats;
  } catch (error) {
    logger.error('Error getting cohort statistics:', error);
    throw error;
  }
};

/**
 * Get users by cohort
 * @param {String} cohortName - Name of the cohort
 * @param {Number} page - Page number for pagination
 * @param {Number} limit - Number of users per page
 * @returns {Object} Users in the cohort
 */
export const getUsersByCohort = async (cohortName, page = 1, limit = 50) => {
  try {
    const skip = (page - 1) * limit;

    const users = await User.find({
      cohort: cohortName,
      isActive: true,
    })
      .select('-__v')
      .sort({ 'metrics.lifetimeValue': -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments({
      cohort: cohortName,
      isActive: true,
    });

    return {
      cohort: cohortName,
      users,
      pagination: {
        page,
        limit,
        total: totalUsers,
        pages: Math.ceil(totalUsers / limit),
      },
    };
  } catch (error) {
    logger.error('Error getting users by cohort:', error);
    throw error;
  }
};

export default {
  calculateUserMetrics,
  assignRuleBasedCohort,
  performKMeansClustering,
  generateAllCohorts,
  getCohortStatistics,
  getUsersByCohort,
};
