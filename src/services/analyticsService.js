import User from '../models/User.js';
import Order from '../models/Order.js';
import logger from '../utils/logger.js';

/**
 * Get user analytics and insights
 * @param {String} userId - User ID (optional)
 * @returns {Object} Analytics data
 */
export const getUserAnalytics = async (userId = null) => {
  try {
    const matchStage = userId
      ? { $match: { _id: mongoose.Types.ObjectId(userId) } }
      : { $match: {} };

    const pipeline = [
      matchStage,
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'userId',
          as: 'orders',
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          cohort: 1,
          registrationDate: 1,
          metrics: 1,
          orderCount: { $size: '$orders' },
          orders: {
            $map: {
              input: '$orders',
              as: 'order',
              in: {
                orderId: '$$order.orderId',
                totalAmount: '$$order.totalAmount',
                orderDate: '$$order.orderDate',
                status: '$$order.status',
                totalItems: '$$order.totalItems',
              },
            },
          },
        },
      },
    ];

    const result = await User.aggregate(pipeline);
    return userId ? result[0] : result;
  } catch (error) {
    logger.error('Error in getUserAnalytics:', error);
    throw error;
  }
};

/**
 * Get order trends and patterns
 * @param {Object} filters - Date filters and cohort filters
 * @returns {Object} Order trends data
 */
export const getOrderTrends = async (filters = {}) => {
  try {
    const { startDate, endDate, cohort } = filters;

    let matchConditions = {};
    if (startDate && endDate) {
      matchConditions.orderDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const pipeline = [
      { $match: matchConditions },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
    ];

    if (cohort) {
      pipeline.push({ $match: { 'user.cohort': cohort } });
    }

    pipeline.push(
      {
        $group: {
          _id: {
            year: { $year: '$orderDate' },
            month: { $month: '$orderDate' },
            day: { $dayOfMonth: '$orderDate' },
          },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          avgOrderValue: { $avg: '$totalAmount' },
          totalItems: { $sum: '$totalItems' },
          uniqueCustomers: { $addToSet: '$userId' },
        },
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day',
            },
          },
          totalOrders: 1,
          totalRevenue: { $round: ['$totalRevenue', 2] },
          avgOrderValue: { $round: ['$avgOrderValue', 2] },
          totalItems: 1,
          uniqueCustomers: { $size: '$uniqueCustomers' },
        },
      },
      { $sort: { date: 1 } }
    );

    const trends = await Order.aggregate(pipeline);
    return trends;
  } catch (error) {
    logger.error('Error in getOrderTrends:', error);
    throw error;
  }
};

/**
 * Get revenue analysis by cohort
 * @returns {Object} Revenue analysis data
 */
export const getRevenueAnalysis = async () => {
  try {
    const pipeline = [
      {
        $group: {
          _id: '$cohort',
          userCount: { $sum: 1 },
          totalRevenue: { $sum: '$metrics.totalSpent' },
          avgLifetimeValue: { $avg: '$metrics.lifetimeValue' },
          avgCartValue: { $avg: '$metrics.avgCartValue' },
          totalOrders: { $sum: '$metrics.totalOrders' },
        },
      },
      {
        $project: {
          cohort: '$_id',
          userCount: 1,
          totalRevenue: { $round: ['$totalRevenue', 2] },
          avgLifetimeValue: { $round: ['$avgLifetimeValue', 2] },
          avgCartValue: { $round: ['$avgCartValue', 2] },
          totalOrders: 1,
          revenuePerUser: {
            $round: [{ $divide: ['$totalRevenue', '$userCount'] }, 2],
          },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ];

    const revenueData = await User.aggregate(pipeline);

    // Calculate total metrics
    const totals = revenueData.reduce(
      (acc, cohort) => {
        acc.totalUsers += cohort.userCount;
        acc.totalRevenue += cohort.totalRevenue;
        acc.totalOrders += cohort.totalOrders;
        return acc;
      },
      { totalUsers: 0, totalRevenue: 0, totalOrders: 0 }
    );

    return {
      cohortBreakdown: revenueData,
      totalMetrics: {
        totalUsers: totals.totalUsers,
        totalRevenue: Math.round(totals.totalRevenue * 100) / 100,
        totalOrders: totals.totalOrders,
        avgRevenuePerUser:
          Math.round((totals.totalRevenue / totals.totalUsers) * 100) / 100,
      },
    };
  } catch (error) {
    logger.error('Error in getRevenueAnalysis:', error);
    throw error;
  }
};

/**
 * Get customer lifetime value distribution
 * @returns {Object} CLV distribution data
 */
export const getCLVDistribution = async () => {
  try {
    const pipeline = [
      {
        $bucket: {
          groupBy: '$metrics.lifetimeValue',
          boundaries: [
            0,
            1000,
            5000,
            10000,
            25000,
            50000,
            100000,
            Number.MAX_VALUE,
          ],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            totalRevenue: { $sum: '$metrics.lifetimeValue' },
            avgOrders: { $avg: '$metrics.totalOrders' },
            cohorts: { $push: '$cohort' },
          },
        },
      },
    ];

    const distribution = await User.aggregate(pipeline);

    // Format the results with readable bucket names
    const formattedDistribution = distribution.map((bucket) => {
      let bucketName;
      if (bucket._id === 0) bucketName = '₹0 - ₹1,000';
      else if (bucket._id === 1000) bucketName = '₹1,000 - ₹5,000';
      else if (bucket._id === 5000) bucketName = '₹5,000 - ₹10,000';
      else if (bucket._id === 10000) bucketName = '₹10,000 - ₹25,000';
      else if (bucket._id === 25000) bucketName = '₹25,000 - ₹50,000';
      else if (bucket._id === 50000) bucketName = '₹50,000 - ₹1,00,000';
      else if (bucket._id === 100000) bucketName = '₹1,00,000+';
      else bucketName = 'Other';

      // Count cohorts in this bucket
      const cohortCounts = {};
      bucket.cohorts.forEach((cohort) => {
        cohortCounts[cohort] = (cohortCounts[cohort] || 0) + 1;
      });

      return {
        range: bucketName,
        userCount: bucket.count,
        totalRevenue: Math.round(bucket.totalRevenue * 100) / 100,
        avgOrders: Math.round(bucket.avgOrders * 100) / 100,
        cohortDistribution: cohortCounts,
      };
    });

    return formattedDistribution;
  } catch (error) {
    logger.error('Error in getCLVDistribution:', error);
    throw error;
  }
};

/**
 * Get customer behavior insights
 * @returns {Object} Behavior insights
 */
export const getCustomerBehaviorInsights = async () => {
  try {
    // Get top-performing segments
    const topSegments = await User.aggregate([
      {
        $group: {
          _id: '$cohort',
          userCount: { $sum: 1 },
          avgLifetimeValue: { $avg: '$metrics.lifetimeValue' },
          avgOrderFrequency: { $avg: '$metrics.orderFrequency' },
          avgCartValue: { $avg: '$metrics.avgCartValue' },
        },
      },
      { $sort: { avgLifetimeValue: -1 } },
      { $limit: 5 },
    ]);

    // Get most popular product categories by cohort
    const categoryAnalysis = await Order.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $group: {
          _id: {
            cohort: '$user.cohort',
            category: '$items.category',
          },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.totalPrice' },
          orderCount: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.cohort',
          categories: {
            $push: {
              category: '$_id.category',
              totalQuantity: '$totalQuantity',
              totalRevenue: '$totalRevenue',
              orderCount: '$orderCount',
            },
          },
        },
      },
    ]);

    // Get seasonal trends
    const seasonalTrends = await Order.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$orderDate' },
            year: { $year: '$orderDate' },
          },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          avgOrderValue: { $avg: '$totalAmount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    return {
      topPerformingSegments: topSegments,
      categoryPreferences: categoryAnalysis,
      seasonalTrends: seasonalTrends,
    };
  } catch (error) {
    logger.error('Error in getCustomerBehaviorInsights:', error);
    throw error;
  }
};

/**
 * Get churn risk analysis
 * @returns {Object} Churn risk data
 */
export const getChurnRiskAnalysis = async () => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    const churnAnalysis = await User.aggregate([
      {
        $addFields: {
          riskLevel: {
            $switch: {
              branches: [
                {
                  case: { $gte: ['$metrics.daysSinceLastOrder', 90] },
                  then: 'High Risk',
                },
                {
                  case: { $gte: ['$metrics.daysSinceLastOrder', 60] },
                  then: 'Medium Risk',
                },
                {
                  case: { $gte: ['$metrics.daysSinceLastOrder', 30] },
                  then: 'Low Risk',
                },
              ],
              default: 'Active',
            },
          },
        },
      },
      {
        $group: {
          _id: '$riskLevel',
          userCount: { $sum: 1 },
          avgLifetimeValue: { $avg: '$metrics.lifetimeValue' },
          totalAtRiskRevenue: { $sum: '$metrics.lifetimeValue' },
          cohorts: { $push: '$cohort' },
        },
      },
    ]);

    // Format cohort distribution for each risk level
    const formattedAnalysis = churnAnalysis.map((risk) => {
      const cohortCounts = {};
      risk.cohorts.forEach((cohort) => {
        cohortCounts[cohort] = (cohortCounts[cohort] || 0) + 1;
      });

      return {
        riskLevel: risk._id,
        userCount: risk.userCount,
        avgLifetimeValue: Math.round(risk.avgLifetimeValue * 100) / 100,
        totalAtRiskRevenue: Math.round(risk.totalAtRiskRevenue * 100) / 100,
        cohortDistribution: cohortCounts,
      };
    });

    return formattedAnalysis;
  } catch (error) {
    logger.error('Error in getChurnRiskAnalysis:', error);
    throw error;
  }
};

export default {
  getUserAnalytics,
  getOrderTrends,
  getRevenueAnalysis,
  getCLVDistribution,
  getCustomerBehaviorInsights,
  getChurnRiskAnalysis,
};
