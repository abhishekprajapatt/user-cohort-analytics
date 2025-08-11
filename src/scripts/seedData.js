import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Order from '../models/Order.js';
import {
  SAMPLE_NAMES,
  INDIAN_CITIES,
  SAMPLE_PRODUCTS,
  PAYMENT_METHODS,
  ORDER_SOURCES,
} from '../utils/constants.js';
import { connectDB } from '../config/database.js';
import logger from '../utils/logger.js';

// environment variables load karte hain
dotenv.config();

// min aur max ke beech random number generate karte hain
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate random date between start and end
 */
const getRandomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

/**
 * Generate random email from name
 */
const generateEmail = (name) => {
  const username = name.toLowerCase().replace(/\s+/g, '.');
  const domains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'rediffmail.com',
  ];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${username}${getRandomNumber(1, 999)}@${domain}`;
};

/**
 * Generate realistic user data
 */
const generateUsers = (count) => {
  const users = [];
  const usedEmails = new Set();

  for (let i = 0; i < count; i++) {
    const name = SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
    let email = generateEmail(name);

    // Ensure unique emails
    let counter = 1;
    while (usedEmails.has(email)) {
      email = generateEmail(name) + counter;
      counter++;
    }
    usedEmails.add(email);

    const city =
      INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)];
    const registrationDate = getRandomDate(
      new Date(2023, 0, 1), // Jan 1, 2023
      new Date(2024, 7, 1) // Aug 1, 2024
    );

    const user = {
      name,
      email,
      phone: `+91${getRandomNumber(7000000000, 9999999999)}`,
      dateOfBirth: getRandomDate(new Date(1980, 0, 1), new Date(2000, 11, 31)),
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      address: {
        street: `${getRandomNumber(1, 999)} ${
          [
            'Main Street',
            'Park Road',
            'Gandhi Nagar',
            'MG Road',
            'Station Road',
          ][Math.floor(Math.random() * 5)]
        }`,
        city: city.city,
        state: city.state,
        zipCode: getRandomNumber(100000, 999999).toString(),
        country: 'India',
      },
      registrationDate,
      isActive: true,
    };

    users.push(user);
  }

  return users;
};

/**
 * Generate realistic order data for users
 */
const generateOrders = (users, ordersPerUser = { min: 0, max: 20 }) => {
  const orders = [];

  users.forEach((user) => {
    const orderCount = getRandomNumber(ordersPerUser.min, ordersPerUser.max);

    for (let i = 0; i < orderCount; i++) {
      const orderDate = getRandomDate(
        user.registrationDate,
        new Date() // Today
      );

      // Generate order items
      const itemCount = getRandomNumber(1, 8);
      const items = [];
      let subtotal = 0;

      for (let j = 0; j < itemCount; j++) {
        const product =
          SAMPLE_PRODUCTS[Math.floor(Math.random() * SAMPLE_PRODUCTS.length)];
        const quantity = getRandomNumber(1, 5);
        const unitPrice =
          product.basePrice +
          getRandomNumber(-product.basePrice * 0.3, product.basePrice * 0.5);
        const totalPrice = quantity * unitPrice;

        items.push({
          productId: `PROD${getRandomNumber(1000, 9999)}`,
          productName: product.name,
          category: product.category,
          quantity,
          unitPrice: Math.round(unitPrice),
          totalPrice: Math.round(totalPrice),
          discount: getRandomNumber(0, Math.round(totalPrice * 0.1)),
        });

        subtotal += totalPrice;
      }

      const discount = getRandomNumber(0, Math.round(subtotal * 0.15));
      const tax = Math.round((subtotal - discount) * 0.18); // 18% GST
      const shippingCost = subtotal > 500 ? 0 : getRandomNumber(50, 150);
      const totalAmount = subtotal - discount + tax + shippingCost;

      const order = {
        orderId: `ORD${Date.now()}${getRandomNumber(1000, 9999)}`,
        userId: user._id,
        items,
        subtotal: Math.round(subtotal),
        discount,
        tax,
        shippingCost,
        totalAmount: Math.round(totalAmount),
        status: ['Delivered', 'Shipped', 'Processing', 'Cancelled'][
          Math.floor(Math.random() * 4)
        ],
        paymentStatus: 'Completed',
        paymentMethod:
          PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)],
        orderDate,
        expectedDeliveryDate: new Date(
          orderDate.getTime() + getRandomNumber(3, 10) * 24 * 60 * 60 * 1000
        ),
        shippingAddress: {
          name: user.name,
          street: user.address.street,
          city: user.address.city,
          state: user.address.state,
          zipCode: user.address.zipCode,
          country: user.address.country,
          phone: user.phone,
        },
        source: ORDER_SOURCES[Math.floor(Math.random() * ORDER_SOURCES.length)],
      };

      // Set delivered date for delivered orders
      if (order.status === 'Delivered') {
        order.deliveredDate = new Date(
          orderDate.getTime() + getRandomNumber(1, 7) * 24 * 60 * 60 * 1000
        );
      }

      orders.push(order);
    }
  });

  return orders;
};

/**
 * Create different user segments for realistic cohort distribution
 */
const createUserSegments = () => {
  const segments = [];

  // High Spenders (10% - Premium customers)
  segments.push(
    ...generateUsers(100).map((user) => ({
      ...user,
      segmentType: 'high_spender',
    }))
  );

  // Frequent Buyers (15% - Regular customers)
  segments.push(
    ...generateUsers(150).map((user) => ({
      ...user,
      segmentType: 'frequent_buyer',
    }))
  );

  // Regular Customers (40% - Average customers)
  segments.push(
    ...generateUsers(400).map((user) => ({
      ...user,
      segmentType: 'regular',
    }))
  );

  // Inactive Users (20% - Haven't ordered recently)
  segments.push(
    ...generateUsers(200).map((user) => ({
      ...user,
      segmentType: 'inactive',
      registrationDate: getRandomDate(
        new Date(2023, 0, 1),
        new Date(2023, 6, 1) // Earlier registration
      ),
    }))
  );

  // New Users (15% - Recently registered)
  segments.push(
    ...generateUsers(150).map((user) => ({
      ...user,
      segmentType: 'new',
      registrationDate: getRandomDate(
        new Date(2024, 6, 1), // Recent registration
        new Date()
      ),
    }))
  );

  return segments;
};

/**
 * Generate orders based on user segments
 */
const generateSegmentedOrders = (users) => {
  const orders = [];

  users.forEach((user) => {
    let orderConfig;

    switch (user.segmentType) {
      case 'high_spender':
        orderConfig = { min: 8, max: 25 }; // High order frequency
        break;
      case 'frequent_buyer':
        orderConfig = { min: 5, max: 15 }; // Medium-high frequency
        break;
      case 'regular':
        orderConfig = { min: 2, max: 8 }; // Medium frequency
        break;
      case 'inactive':
        orderConfig = { min: 1, max: 4 }; // Low frequency, older orders
        break;
      case 'new':
        orderConfig = { min: 0, max: 3 }; // Very few or no orders
        break;
      default:
        orderConfig = { min: 1, max: 5 };
    }

    const userOrders = generateOrders([user], orderConfig);

    // Modify orders based on segment
    userOrders.forEach((order) => {
      if (user.segmentType === 'high_spender') {
        // Increase order values for high spenders
        order.items = order.items.map((item) => ({
          ...item,
          unitPrice: Math.round(item.unitPrice * 1.5),
          totalPrice: Math.round(item.totalPrice * 1.5),
        }));
        order.subtotal = Math.round(order.subtotal * 1.5);
        order.totalAmount = Math.round(order.totalAmount * 1.5);
      }

      if (user.segmentType === 'inactive') {
        // Make orders older for inactive users
        order.orderDate = getRandomDate(
          user.registrationDate,
          new Date(2024, 3, 1) // Before April 2024
        );
      }
    });

    orders.push(...userOrders);
  });

  return orders;
};

/**
 * Seed the database with sample data
 */
const seedDatabase = async () => {
  try {
    logger.info('🌱 Starting database seeding...');

    // Connect to database
    await connectDB();

    // Clear existing data
    logger.info('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Order.deleteMany({});

    // Generate users with realistic segments
    logger.info('👥 Generating users...');
    const userData = createUserSegments();
    const users = await User.insertMany(userData);
    logger.info(`✅ Created ${users.length} users`);

    // Generate orders for users
    logger.info('🛒 Generating orders...');
    const orderData = generateSegmentedOrders(users);
    const orders = await Order.insertMany(orderData);
    logger.info(`✅ Created ${orders.length} orders`);

    // Display summary statistics
    const stats = await User.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'userId',
          as: 'orders',
        },
      },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          usersWithOrders: {
            $sum: {
              $cond: [{ $gt: [{ $size: '$orders' }, 0] }, 1, 0],
            },
          },
          totalOrders: { $sum: { $size: '$orders' } },
          avgOrdersPerUser: { $avg: { $size: '$orders' } },
        },
      },
    ]);

    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          avgOrderValue: { $avg: '$totalAmount' },
          totalItems: { $sum: '$totalItems' },
        },
      },
    ]);

    logger.info('📊 Database seeding completed! Summary:');
    console.log('================================================');
    console.log(`👥 Total Users: ${stats[0].totalUsers}`);
    console.log(`🛒 Users with Orders: ${stats[0].usersWithOrders}`);
    console.log(`📦 Total Orders: ${stats[0].totalOrders}`);
    console.log(
      `📊 Avg Orders per User: ${
        Math.round(stats[0].avgOrdersPerUser * 100) / 100
      }`
    );
    console.log(
      `💰 Total Revenue: ₹${Math.round(
        orderStats[0].totalRevenue
      ).toLocaleString()}`
    );
    console.log(
      `💳 Avg Order Value: ₹${Math.round(orderStats[0].avgOrderValue)}`
    );
    console.log(`📦 Total Items Sold: ${orderStats[0].totalItems}`);
    console.log('================================================');

    logger.info('🎯 Ready to generate cohorts! Run: npm run cohorts');
  } catch (error) {
    logger.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding process
seedDatabase().catch(console.error);
