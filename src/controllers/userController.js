import User from '../models/User.js';
import { API_RESPONSES } from '../utils/constants.js';
import logger from '../utils/logger.js';

// sabhi users ko pagination aur filtering ke saath get karne ke liye
export const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      cohort,
      sortBy = 'metrics.lifetimeValue',
      sortOrder = 'desc',
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // filter conditions banate hain
    let filterConditions = { isActive: true };
    if (cohort) {
      filterConditions.cohort = cohort;
    }

    // Build sort conditions
    const sortConditions = {};
    sortConditions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const users = await User.find(filterConditions)
      .select('-__v')
      .sort(sortConditions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments(filterConditions);

    res.status(200).json({
      ...API_RESPONSES.SUCCESS,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalUsers,
          pages: Math.ceil(totalUsers / parseInt(limit)),
        },
        filters: {
          cohort: cohort || 'all',
          sortBy,
          sortOrder,
        },
      },
    });
  } catch (error) {
    logger.error('Error getting users:', error);
    res.status(500).json({
      ...API_RESPONSES.ERROR,
      message: 'Failed to get users',
      error: error.message,
    });
  }
};

/**
 * Get a specific user by ID
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-__v');

    if (!user) {
      return res.status(404).json({
        ...API_RESPONSES.NOT_FOUND,
        message: 'User not found',
      });
    }

    res.status(200).json({
      ...API_RESPONSES.SUCCESS,
      data: user,
    });
  } catch (error) {
    logger.error('Error getting user by ID:', error);
    res.status(500).json({
      ...API_RESPONSES.ERROR,
      message: 'Failed to get user',
      error: error.message,
    });
  }
};

/**
 * Create a new user
 */
export const createUser = async (req, res) => {
  try {
    const userData = req.body;

    // Check if user with email already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({
        ...API_RESPONSES.VALIDATION_ERROR,
        message: 'User with this email already exists',
      });
    }

    const user = new User(userData);
    await user.save();

    logger.info(`New user created: ${user.email}`);

    res.status(201).json({
      ...API_RESPONSES.SUCCESS,
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        ...API_RESPONSES.VALIDATION_ERROR,
        message: 'Validation failed',
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    logger.error('Error creating user:', error);
    res.status(500).json({
      ...API_RESPONSES.ERROR,
      message: 'Failed to create user',
      error: error.message,
    });
  }
};

/**
 * Update a user
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.metrics;
    delete updateData.cohort;
    delete updateData.clusterData;
    delete updateData._id;

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-__v');

    if (!user) {
      return res.status(404).json({
        ...API_RESPONSES.NOT_FOUND,
        message: 'User not found',
      });
    }

    logger.info(`User updated: ${user.email}`);

    res.status(200).json({
      ...API_RESPONSES.SUCCESS,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        ...API_RESPONSES.VALIDATION_ERROR,
        message: 'Validation failed',
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    logger.error('Error updating user:', error);
    res.status(500).json({
      ...API_RESPONSES.ERROR,
      message: 'Failed to update user',
      error: error.message,
    });
  }
};

/**
 * Delete a user (soft delete)
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        ...API_RESPONSES.NOT_FOUND,
        message: 'User not found',
      });
    }

    logger.info(`User soft deleted: ${user.email}`);

    res.status(200).json({
      ...API_RESPONSES.SUCCESS,
      message: 'User deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting user:', error);
    res.status(500).json({
      ...API_RESPONSES.ERROR,
      message: 'Failed to delete user',
      error: error.message,
    });
  }
};

/**
 * Get user summary statistics
 */
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const newUsers = await User.countDocuments({
      isActive: true,
      registrationDate: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      },
    });

    const cohortDistribution = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$cohort', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const topUsers = await User.find({ isActive: true })
      .select('name email metrics.lifetimeValue metrics.totalOrders cohort')
      .sort({ 'metrics.lifetimeValue': -1 })
      .limit(10);

    res.status(200).json({
      ...API_RESPONSES.SUCCESS,
      data: {
        totalUsers,
        newUsers,
        cohortDistribution,
        topUsers,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error('Error getting user stats:', error);
    res.status(500).json({
      ...API_RESPONSES.ERROR,
      message: 'Failed to get user statistics',
      error: error.message,
    });
  }
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
};
