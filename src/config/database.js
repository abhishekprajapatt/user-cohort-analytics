import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Create indexes for better performance
    await createIndexes();
  } catch (error) {
    logger.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create database indexes for optimal performance
const createIndexes = async () => {
  try {
    const db = mongoose.connection.db;

    // User collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ cohort: 1 });
    await db.collection('users').createIndex({ createdAt: 1 });

    // Order collection indexes
    await db.collection('orders').createIndex({ userId: 1 });
    await db.collection('orders').createIndex({ orderDate: 1 });
    await db.collection('orders').createIndex({ userId: 1, orderDate: -1 });

    logger.info('✅ Database indexes created successfully');
  } catch (error) {
    logger.warn('⚠️ Error creating indexes:', error.message);
  }
};

export default { connectDB };
