# 🚀 User Cohort Analytics Platform

A comprehensive full-stack application for advanced user cohort analysis, behavioral segmentation, and analytics with Node.js backend and React.js frontend.

## ✨ Key Features

### 📊 **Enhanced Analytics Dashboard**

- **6 Advanced Stats Cards** with real-time metrics and icons
- **Phone Coverage Analytics** with percentage tracking
- **Interactive Charts**: User growth, cohort distribution, phone analytics
- **Quick Actions Panel** with live data counts
- **Error-Free Interface** with robust error handling

### 👥 **User Management & Analytics**

- **Complete User Profiles** with phone number extraction
- **Behavioral Segmentation** (High Spenders, Frequent Buyers, etc.)
- **Phone Directory** with CSV export functionality
- **User Stats API** with comprehensive metrics
- **Defensive Programming** with array safety checks

### 📱 **Phone Numbers Integration**

- **Automated Phone Extraction** from user profiles
- **Phone Coverage Tracking** (percentage of users with phones)
- **Cohort-wise Phone Distribution** visualization
- **CSV Export** for phone numbers with user details

### 🛒 **Order & Transaction Analytics**

- **Order Management** with detailed tracking and validation
- **Revenue Analytics** with lifetime value calculations
- **Transaction Patterns** analysis
- **Average Order Value** tracking
- **Enhanced Order Creation** with proper data validation
- **Payment Method Tracking** with comprehensive options

### 🎯 **Advanced Cohort Analysis**

- **ML-Powered K-Means Clustering** for intelligent segmentation
- **Business Rule-Based Cohorts** (spending patterns, frequency)
- **Cohort Performance Metrics** and distribution analysis
- **Real-time Cohort Updates** with cron scheduling
- **Robust Error Handling** with graceful degradation

### 🔌 **Professional REST API**

- **Complete CRUD Operations** for users, orders, cohorts
- **Phone Numbers API** (`/api/users/phones`)
- **Analytics Endpoints** with comprehensive data
- **Enhanced Error Handling** and validation
- **Response Interceptors** for consistent data structure
- **Comprehensive Logging** for debugging and monitoring

## � Recent Improvements & Bug Fixes

### ✅ **Order Management Enhancements**

- **Fixed Order Creation**: Resolved validation errors with proper data structure mapping
- **Payment Method Integration**: Added comprehensive payment method options
- **Status Management**: Updated status enums to match backend validation
- **Enhanced Logging**: Detailed error logging for debugging
- **Data Validation**: Proper field mapping between frontend and backend

### ✅ **API Response Handling**

- **Response Interceptors**: Automatic response structure flattening
- **Error Boundaries**: Graceful error handling across all components
- **Array Safety**: Defensive programming with `.map()` safety checks
- **Missing Endpoint Handling**: Proper 404 error handling

### ✅ **Backend Stability**

- **User Model Fixes**: Resolved virtual property null pointer errors
- **Enhanced Validation**: Comprehensive data validation and error messages
- **Improved Logging**: Detailed logging for debugging and monitoring
- **Database Indexing**: Optimized queries with proper indexes

## �🛠️ Technology Stack

### Backend

- **Node.js 18+** with Express.js framework
- **MongoDB** with Mongoose ODM
- **ML-KMeans** for intelligent clustering
- **Cron Jobs** for automated cohort updates
- **Professional APIs** with error handling and validation

### Frontend

- **React.js 18** with modern hooks
- **React Router** for navigation
- **Recharts** for advanced data visualization
- **Lucide React** for professional icons
- **Responsive Design** with CSS Grid and Flexbox
- **Toast Notifications** for user feedback
- **Defensive Programming** with error boundaries
- **API Response Interceptors** for consistent data handling

### Database Schema

- **Users Collection**: Complete profiles with phone validation
- **Orders Collection**: Transaction data with user relationships
- **Automated Indexing** for optimal performance

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- MongoDB (local or cloud)
- npm or yarn package manager

### Backend Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Environment Configuration:**
   Create `.env` file in root directory:

```env
MONGODB_URI=mongodb://localhost:27017/cohort_analysis
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cohort_analysis

PORT=3000
NODE_ENV=development
```

3. **Start the backend server:**

```bash
npm start
# For development with auto-reload:
npm run dev
```

**Backend runs on:** `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory:**

```bash
cd frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start development server:**

```bash
npm start
```

**Frontend runs on:** `http://localhost:3001`

### 🎯 Application URLs

- **Dashboard:** http://localhost:3001
- **API Health:** http://localhost:3000/health
- **Phone Directory:** http://localhost:3001/phones
- **User Management:** http://localhost:3001/users

## 📋 API Documentation

### Core Endpoints

#### 👥 Users

- `GET /api/users` - Get all users with pagination
- `POST /api/users` - Create new user
- `GET /api/users/stats` - User statistics
- `GET /api/users/phones` - Phone numbers with CSV export

#### 🛒 Orders

- `GET /api/orders` - Get all orders with enhanced filtering
- `POST /api/orders` - Create new order with comprehensive validation
- `PUT /api/orders/:id` - Update existing order
- `GET /api/orders/stats` - Order analytics with revenue metrics
- **Enhanced Features**: Payment method tracking, status management, validation

#### 🎯 Cohorts

- `GET /api/cohorts/analytics` - Complete cohort analysis
- `POST /api/cohorts/generate` - Generate cohorts
- `GET /api/cohorts/stats` - Cohort statistics

### 📱 Phone Numbers API

```javascript
GET /api/users/phones
Response: {
  phones: [
    {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      cohort: "High Spender"
    }
  ],
  totalCount: 150,
  exportUrl: "/api/users/phones/export"
}
```

**Complete API documentation:** See `API_GUIDE.md` with Postman collection

## 📁 Project Structure

```
user-cohort-analytics/
├── 🔧 Backend (Node.js)
│   ├── src/
│   │   ├── controllers/         # Business logic & API handlers
│   │   │   ├── userController.js    # User CRUD + phone extraction
│   │   │   ├── orderController.js   # Order management
│   │   │   └── cohortController.js  # Cohort analytics
│   │   ├── models/             # MongoDB schemas
│   │   │   ├── User.js             # User model with phone validation
│   │   │   └── Order.js            # Order model with relationships
│   │   ├── routes/             # Express routes
│   │   │   ├── users.js            # User routes + phone API
│   │   │   ├── orders.js           # Order routes
│   │   │   └── cohorts.js          # Cohort routes
│   │   ├── services/           # Core business services
│   │   │   └── cohortService.js    # ML clustering & analytics
│   │   ├── utils/              # Helper functions
│   │   └── app.js              # Express app configuration
│   ├── .env                    # Environment variables
│   ├── package.json            # Dependencies & scripts
│   └── API_GUIDE.md           # Complete API documentation
│
├── 🎨 Frontend (React.js)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   └── Navbar.js           # Navigation with phone link
│   │   ├── pages/              # Application pages
│   │   │   ├── Dashboard.js        # Enhanced analytics dashboard
│   │   │   ├── Users.js            # User management
│   │   │   ├── PhoneNumbers.js     # Phone directory with export
│   │   │   ├── Orders.js           # Order management
│   │   │   └── Cohorts.js          # Cohort analysis
│   │   ├── services/           # API integration
│   │   │   └── api.js              # Axios API calls
│   │   └── App.js              # Main React component
│   ├── package.json            # Frontend dependencies
│   └── public/                 # Static assets
│
├── 📚 Documentation
│   ├── README.md               # This comprehensive guide
│   ├── API_GUIDE.md           # Detailed API documentation
│   ├── ERROR_FIX_SUMMARY.md   # Recent bug fixes and solutions
│   └── *.postman_collection.json # Ready-to-import API tests
│
└── 🚀 Deployment
    ├── vercel.json             # Vercel deployment config
    └── .gitignore              # Git ignore rules
```

## 🎯 Dashboard Features

### 📊 Analytics Overview

- **Real-time Statistics**: Users, orders, revenue, and phone coverage
- **Interactive Charts**: User growth, cohort distribution, phone analytics
- **Professional UI**: Modern design with Lucide React icons
- **Responsive Layout**: Works on desktop, tablet, and mobile

### 📱 Phone Numbers Management

- **Extraction**: Automatic phone number extraction from user profiles
- **Validation**: Phone number format validation and sanitization
- **Export**: CSV export functionality for marketing campaigns
- **Analytics**: Coverage tracking and cohort-wise distribution

### 🎨 Visual Components

- **Stats Cards**: 6 enhanced cards with icons and live data
- **Line Charts**: User growth trends with phone coverage overlay
- **Bar Charts**: Phone numbers distribution by cohort
- **Pie Charts**: Cohort distribution with color-coded segments

## 🔧 Scripts & Commands

### Backend Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with sample data
npm run cohorts    # Generate cohorts manually
```

### Frontend Scripts

```bash
npm start          # Start React development server
npm run build      # Build for production
npm test           # Run tests
```

### Database Operations

```bash
# Generate sample data
npm run seed

# Generate cohorts based on current data
npm run cohorts
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Backend**: Deploy to Vercel with `vercel.json` configuration
2. **Frontend**: Automatic deployment from React build
3. **Environment**: Set MongoDB URI in Vercel environment variables

### Manual Deployment

1. **Build Frontend**: `cd frontend && npm run build`
2. **Environment**: Configure production environment variables
3. **Database**: Ensure MongoDB is accessible from production

## 🔍 Monitoring & Health

### Health Endpoints

- `GET /health` - Server health check
- `GET /api/users/stats` - User statistics
- `GET /api/orders/stats` - Order analytics

### Error Handling & Debugging

- **Comprehensive Logging**: All errors logged with context and stack traces
- **API Response Standards**: Consistent error response format
- **Input Validation**: Server-side validation on all endpoints
- **Frontend Error Boundaries**: Graceful error handling in React components
- **Debug Mode**: Enhanced logging for development and troubleshooting

### 🔧 **Troubleshooting**

Common issues and solutions:

1. **Order Creation Failed**:

   - Ensure all required fields are filled
   - Check user ID exists in database
   - Verify payment method is selected

2. **API Connection Issues**:

   - Backend: http://localhost:3000
   - Frontend: http://localhost:3001
   - Check both servers are running

3. **Database Connection**:

   - Verify MongoDB URI in `.env` file
   - Check network connectivity to MongoDB

4. **Frontend Errors**:
   - Check browser console for detailed error messages
   - Verify API endpoints are responding
   - Check network tab for failed requests

## 📈 Performance Features

- **Database Indexing**: Optimized queries with proper indexes
- **Pagination**: Large datasets handled with pagination
- **Caching**: Response caching for improved performance
- **Clustering**: ML-based user clustering for better insights

## 🎯 Use Cases

### Business Analytics

- **Customer Segmentation**: Identify high-value customer groups
- **Marketing Campaigns**: Export phone numbers for targeted campaigns
- **Revenue Analysis**: Track revenue patterns and trends
- **Behavior Analysis**: Understand customer purchase behavior

### Technical Applications

- **API Integration**: RESTful APIs for third-party integrations
- **Data Export**: CSV exports for external analytics tools
- **Real-time Updates**: Live dashboard updates
- **Scalable Architecture**: Designed for production scaling

## 📋 Current Status

### ✅ **Completed Features**

- ✅ User management with CRUD operations
- ✅ Order management with enhanced validation
- ✅ Cohort analysis with ML clustering
- ✅ Phone numbers extraction and export
- ✅ Analytics dashboard with real-time metrics
- ✅ Error handling and debugging improvements
- ✅ API response interceptors
- ✅ Defensive programming implementation

### 🔄 **In Development**

- 🔄 Advanced phone number validation
- 🔄 Enhanced cohort metrics
- 🔄 Performance optimizations
- 🔄 Additional export formats

### 🚀 **Fully Functional**

The application is currently **fully functional** with all major features working:

- Both backend (port 3000) and frontend (port 3001) servers
- Complete CRUD operations for users and orders
- Real-time analytics and visualizations
- Error-free order creation and management
- Robust error handling across all components

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Developer** - Full-stack cohort analytics platform

---

⭐ **Star this repo if you find it helpful!** ⭐
