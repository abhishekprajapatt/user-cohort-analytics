import Order from '../models/Order.js';
import User from '../models/User.js';
import { API_RESPONSES } from '../utils/constants.js';
import logger from '../utils/logger.js';

// sabhi orders ko pagination aur filtering ke saath get karne ke liye
export const getOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      userId,
      status,
      startDate,
      endDate,
      sortBy = 'orderDate',
      sortOrder = 'desc',
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter conditions
    let filterConditions = {};
    if (userId) filterConditions.userId = userId;
    if (status) filterConditions.status = status;

    if (startDate && endDate) {
      filterConditions.orderDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Build sort conditions
    const sortConditions = {};
    sortConditions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const orders = await Order.find(filterConditions)
      .populate('userId', 'name email cohort')
      .select('-__v')
      .sort(sortConditions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalOrders = await Order.countDocuments(filterConditions);

    res.status(200).json({
      ...API_RESPONSES.SUCCESS,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalOrders,
          pages: Math.ceil(totalOrders / parseInt(limit)),
        },
        filters: {
          userId: userId || null,
          status: status || 'all',
          dateRange: startDate && endDate ? { startDate, endDate } : null,
          sortBy,
          sortOrder,
        },
      },
    });
  } catch (error) {
    logger.error('Error getting orders:', error);
    res.status(500).json({
      ...API_RESPONSES.ERROR,
      message: 'Failed to get orders',
      error: error.message,
    });
  }
};

/**
 * Get orders for a specific user
 */
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        ...API_RESPONSES.NOT_FOUND,
        message: 'User not found',
      });
    }

    const orders = await Order.find({ userId })
      .select('-__v')
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalOrders = await Order.countDocuments({ userId });

    // Calculate user order statistics
    const orderStats = await Order.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          avgOrderValue: { $avg: '$totalAmount' },
          totalItems: { $sum: '$totalItems' },
        },
      },
    ]);

    res.status(200).json({
      ...API_RESPONSES.SUCCESS,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          cohort: user.cohort,
        },
        orders,
        statistics: orderStats[0] || {
          totalOrders: 0,
          totalSpent: 0,
          avgOrderValue: 0,
          totalItems: 0,
        },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalOrders,
          pages: Math.ceil(totalOrders / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    logger.error('Error getting user orders:', error);
    res.status(500).json({
      ...API_RESPONSES.ERROR,
      message: 'Failed to get user orders',
      error: error.message,
    });
  }
};

/**
 * Get a specific order by ID
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('userId', 'name email cohort')
      .select('-__v');

    if (!order) {
      return res.status(404).json({
        ...API_RESPONSES.NOT_FOUND,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      ...API_RESPONSES.SUCCESS,
      data: order,
    });
  } catch (error) {
    logger.error('Error getting order by ID:', error);
    res.status(500).json({
      ...API_RESPONSES.ERROR,
      message: 'Failed to get order',
      error: error.message,
    });
  }
};

/**
 * Create a new order
 */
export const createOrder = async (req, res) => {
  try {
    const orderData = req.body;

    // Log the incoming order data for debugging
    logger.info(
      'Creating order with data:',
      JSON.stringify(orderData, null, 2)
    );

    // Verify that the user exists
    const user = await User.findById(orderData.userId);
    if (!user) {
      logger.error(`User not found with ID: ${orderData.userId}`);
      return res.status(404).json({
        ...API_RESPONSES.NOT_FOUND,
        message: 'User not found',
      });
    }

    const order = new Order(orderData);
    await order.save();

    // Populate user data for response
    await order.populate('userId', 'name email cohort');

    logger.info(`New order created: ${order.orderId} for user ${user.email}`);

    res.status(201).json({
      ...API_RESPONSES.SUCCESS,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      logger.error('Order validation failed:', {
        errors: Object.values(error.errors).map((err) => ({
          field: err.path,
          message: err.message,
          value: err.value,
        })),
        orderData: req.body,
      });
      return res.status(400).json({
        ...API_RESPONSES.VALIDATION_ERROR,
        message: 'Validation failed',
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    logger.error('Error creating order:', error);
    res.status(500).json({
      ...API_RESPONSES.ERROR,
      message: 'Failed to create order',
      error: error.message,
    });
  }
};

/**
 * Update an order
 */
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.orderId;
    delete updateData.userId;

    const order = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('userId', 'name email cohort')
      .select('-__v');

    if (!order) {
      return res.status(404).json({
        ...API_RESPONSES.NOT_FOUND,
        message: 'Order not found',
      });
    }

    logger.info(`Order updated: ${order.orderId}`);

    res.status(200).json({
      ...API_RESPONSES.SUCCESS,
      message: 'Order updated successfully',
      data: order,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        ...API_RESPONSES.VALIDATION_ERROR,
        message: 'Validation failed',
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    logger.error('Error updating order:', error);
    res.status(500).json({
      ...API_RESPONSES.ERROR,
      message: 'Failed to update order',
      error: error.message,
    });
  }
};

/**
 * Get order statistics
 */
export const getOrderStats = async (req, res) => {
  try {
    const { timeframe = '30' } = req.query; // Default to last 30 days

    const daysAgo = parseInt(timeframe);
    const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    const stats = await Order.aggregate([
      {
        $facet: {
          overall: [
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: '$totalAmount' },
                avgOrderValue: { $avg: '$totalAmount' },
                totalItems: { $sum: '$totalItems' },
              },
            },
          ],
          recent: [
            { $match: { orderDate: { $gte: startDate } } },
            {
              $group: {
                _id: null,
                recentOrders: { $sum: 1 },
                recentRevenue: { $sum: '$totalAmount' },
                avgRecentOrderValue: { $avg: '$totalAmount' },
              },
            },
          ],
          byStatus: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
                revenue: { $sum: '$totalAmount' },
              },
            },
          ],
          byPaymentMethod: [
            {
              $group: {
                _id: '$paymentMethod',
                count: { $sum: 1 },
                revenue: { $sum: '$totalAmount' },
              },
            },
          ],
          topCategories: [
            { $unwind: '$items' },
            {
              $group: {
                _id: '$items.category',
                totalSold: { $sum: '$items.quantity' },
                revenue: { $sum: '$items.totalPrice' },
              },
            },
            { $sort: { revenue: -1 } },
            { $limit: 10 },
          ],
        },
      },
    ]);

    res.status(200).json({
      ...API_RESPONSES.SUCCESS,
      data: {
        timeframe: `Last ${daysAgo} days`,
        ...stats[0],
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error('Error getting order stats:', error);
    res.status(500).json({
      ...API_RESPONSES.ERROR,
      message: 'Failed to get order statistics',
      error: error.message,
    });
  }
};

export default {
  getOrders,
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrder,
  getOrderStats,
};
