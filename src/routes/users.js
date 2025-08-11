import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
} from '../controllers/userController.js';

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users with pagination and filtering
 * @access  Public
 * @query   page, limit, cohort, sortBy, sortOrder
 */
router.get('/', getUsers);

/**
 * @route   GET /api/users/stats
 * @desc    Get user summary statistics
 * @access  Public
 */
router.get('/stats', getUserStats);

/**
 * @route   GET /api/users/:id
 * @desc    Get a specific user by ID
 * @access  Public
 * @params  id - User ID
 */
router.get('/:id', getUserById);

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Public
 * @body    User object
 */
router.post('/', createUser);

/**
 * @route   PUT /api/users/:id
 * @desc    Update a user
 * @access  Public
 * @params  id - User ID
 * @body    Updated user data
 */
router.put('/:id', updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user (soft delete)
 * @access  Public
 * @params  id - User ID
 */
router.delete('/:id', deleteUser);

export default router;
