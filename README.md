# User Cohort Analysis System

A Node.js application for analyzing user behavior and creating customer cohorts based on purchase patterns, cart values, and engagement metrics.

## Features

- User segmentation based on transaction behavior
- Rule-based and K-means clustering algorithms
- RESTful API for cohort management
- Automated cohort updates via cron jobs
- MongoDB integration with optimized schemas
- Sample data generation for testing

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Analytics**: K-means clustering algorithm
- **Automation**: Node-cron for scheduled tasks

## Installation

```bash
npm install
```

## Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Create `.env` file:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/user-cohorts
```

3. Start the application:

```bash
# Development
npm run dev

# Production
npm start
```

## Usage

```bash
# Seed database with sample data
npm run seed

# Generate user cohorts
npm run cohorts
```

## API Testing

For detailed API documentation with Postman examples, see **[API_GUIDE.md](./API_GUIDE.md)**

**Quick API Test:**

```bash
# 1. Start server
npm run dev

# 2. Add sample data
npm run seed

# 3. Test endpoints
GET http://localhost:3000/api/users
GET http://localhost:3000/api/cohorts
POST http://localhost:3000/api/cohorts/generate
```

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user details

### Orders

- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `GET /api/orders/user/:userId` - Get user orders

### Cohorts

- `GET /api/cohorts` - Get cohort statistics
- `POST /api/cohorts/generate` - Generate cohorts
- `GET /api/cohorts/:name/users` - Get users in cohort

## Cohort Types

1. **High Spender** - Average cart value > ₹2000
2. **Frequent Buyer** - More than 3 orders per month
3. **Bulk Buyer** - Average 5+ items per order
4. **Loyal Customer** - 10+ orders with recent activity
5. **At Risk** - Last order 30-90 days ago
6. **Inactive** - Last order > 90 days ago

## Project Structure

```
src/
├── config/database.js       # MongoDB connection
├── models/                  # Data models
├── routes/                  # API routes
├── controllers/             # Business logic
├── services/                # Core services
├── utils/                   # Utilities
└── scripts/                 # Helper scripts
```

## License

MIT License
