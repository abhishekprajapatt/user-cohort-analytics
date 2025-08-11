# Frontend - Cohort Analytics Dashboard

A modern React.js dashboard for managing users, orders, and analyzing user cohorts.

## Features

- **Dashboard**: Overview with key metrics and charts
- **Users Management**: Create, edit, delete, and manage users
- **Orders Management**: Handle order data and transactions
- **Cohort Analysis**: Advanced analytics with visualizations

## Technology Stack

- React.js 18
- React Router for navigation
- Recharts for data visualization
- Styled Components for styling
- Axios for API communication
- React Toastify for notifications
- Lucide React for icons

## Installation

1. Navigate to frontend directory:

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

The application will open at `http://localhost:3001`

## API Integration

The frontend connects to the backend API running on `http://localhost:3000`

Make sure the backend server is running before starting the frontend.

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navbar.js       # Navigation component
├── pages/              # Main application pages
│   ├── Dashboard.js    # Overview dashboard
│   ├── Users.js        # User management
│   ├── Orders.js       # Order management
│   └── Cohorts.js      # Cohort analysis
├── services/           # API service layer
│   └── api.js          # API endpoints
├── App.js              # Main application component
├── index.js            # Application entry point
└── index.css           # Global styles
```
