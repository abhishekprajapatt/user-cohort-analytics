# User Cohort Analytics

A full-stack application for user cohort analysis and management with Node.js backend and React.js frontend.

## Features

- **User Management**: Create, edit, and manage user profiles
- **Order Tracking**: Handle order data and transactions
- **Cohort Analysis**: Advanced user segmentation and analytics
- **Dashboard**: Real-time metrics and visualizations
- **REST API**: Complete backend API with comprehensive documentation

## Technology Stack

### Backend

- Node.js + Express.js
- MongoDB with Mongoose
- RESTful API design
- Professional error handling

### Frontend

- React.js 18
- React Router for navigation
- Recharts for data visualization
- Modern responsive UI

## Quick Start

### Backend Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file:

```
MONGODB_URI=mongodb://localhost:27017/cohort_analysis
PORT=3000
```

3. Start the server:

```bash
npm start
```

### Frontend Setup

1. Navigate to frontend:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm start
```

Frontend runs on `http://localhost:3001`
Backend API runs on `http://localhost:3000`

## API Documentation

Complete API documentation is available in `API_GUIDE.md` with:

- All endpoint details
- Request/response examples
- Postman collection for testing

## Project Structure

```
├── src/                 # Backend source code
│   ├── controllers/     # Business logic
│   ├── models/         # Database schemas
│   ├── routes/         # API routes
│   └── services/       # Core services
├── frontend/           # React.js application
│   ├── src/components/ # UI components
│   ├── src/pages/     # Application pages
│   └── src/services/  # API integration
├── API_GUIDE.md       # Complete API documentation
└── *.postman_collection.json # Ready-to-import Postman tests
```
