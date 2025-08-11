import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cron from 'node-cron';
import dotenv from 'dotenv';

// routes ko import karte hain
import userRoutes from './routes/users.js';
import orderRoutes from './routes/orders.js';
import cohortRoutes from './routes/cohorts.js';

// services ko import karte hain
import { generateAllCohorts } from './services/cohortService.js';
import logger from './utils/logger.js';
import { connectDB } from './config/database.js';

// environment variables load karte hain
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// middleware setup karte hain
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes setup karte hain
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cohorts', cohortRoutes);

// server health check ke liye endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// welcome page ke liye root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'User Cohort Analysis API',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      users: '/api/users',
      orders: '/api/orders',
      cohorts: '/api/cohorts',
      health: '/health',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Something went wrong!',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Automated cohort generation - Every Monday at midnight
if (process.env.CRON_SCHEDULE) {
  cron.schedule(process.env.CRON_SCHEDULE, async () => {
    try {
      logger.info('Starting automated cohort generation...');
      await generateAllCohorts();
      logger.info('Automated cohort generation completed successfully');
    } catch (error) {
      logger.error('Error in automated cohort generation:', error);
    }
  });
}

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
      logger.info(
        `📊 Cohort cron schedule: ${process.env.CRON_SCHEDULE || 'Disabled'}`
      );
      console.log(`
╭─────────────────────────────────────────╮
│     User Cohort Analysis API v1.0.0     │
│                                         │
│  🌐 Server: http://localhost:${PORT}     │
│  📚 Health: http://localhost:${PORT}/health │
│  🎯 Ready for cohort analysis!          │
╰─────────────────────────────────────────╯
      `);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    logger.info('MongoDB connection closed.');
    process.exit(0);
  });
});

startServer();

export default app;
