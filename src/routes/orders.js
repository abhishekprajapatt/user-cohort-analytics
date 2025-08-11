import express from 'express';
import {
  getOrders,
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrder,
  getOrderStats,
} from '../controllers/orderController.js';

const router = express.Router();

/**
 * @route   GET /api/orders
 * @desc    Get all orders with pagination and filtering
 * @access  Public
 * @query   page, limit, userId, status, startDate, endDate, sortBy, sortOrder
 */
router.get('/', getOrders);

/**
 * @route   GET /api/orders/stats
 * @desc    Get order statistics
 * @access  Public
 * @query   timeframe - Number of days to analyze (default: 30)
 */
router.get('/stats', getOrderStats);

/**
 * @route   GET /api/orders/user/:userId
 * @desc    Get orders for a specific user
 * @access  Public
 * @params  userId - User ID
 * @query   page, limit
 */
router.get('/user/:userId', getUserOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get a specific order by ID
 * @access  Public
 * @params  id - Order ID
 */
router.get('/:id', getOrderById);

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Public
 * @body    Order object
 */
router.post('/', createOrder);

/**
 * @route   PUT /api/orders/:id
 * @desc    Update an order
 * @access  Public
 * @params  id - Order ID
 * @body    Updated order data
 */
router.put('/:id', updateOrder);

export default router;
