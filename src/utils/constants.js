// Cohort thresholds and business rules
export const COHORT_THRESHOLDS = {
  HIGH_SPENDER_AMOUNT: 2000, // Minimum average cart value for high spenders
  FREQUENT_BUYER_ORDERS_PER_MONTH: 3, // Minimum orders per month for frequent buyers
  BULK_BUYER_ITEMS_PER_ORDER: 5, // Minimum average items per order for bulk buyers
  LOYAL_CUSTOMER_MIN_ORDERS: 10, // Minimum total orders for loyal customers
  AT_RISK_DAYS: 30, // Days since last order to be considered "at risk"
  INACTIVE_DAYS: 90, // Days since last order to be considered "inactive"
  NEW_CUSTOMER_DAYS: 7, // Days since registration to be considered "new"
};

// Cohort names and descriptions
export const COHORT_TYPES = {
  HIGH_SPENDER: {
    name: 'High Spender',
    description: 'Customers with high average cart values',
    color: '#FF6B6B',
    priority: 1,
  },
  FREQUENT_BUYER: {
    name: 'Frequent Buyer',
    description: 'Customers who place orders regularly',
    color: '#4ECDC4',
    priority: 2,
  },
  BULK_BUYER: {
    name: 'Bulk Buyer',
    description: 'Customers who buy many items per order',
    color: '#45B7D1',
    priority: 3,
  },
  LOYAL_CUSTOMER: {
    name: 'Loyal Customer',
    description: 'Long-term customers with consistent engagement',
    color: '#96CEB4',
    priority: 4,
  },
  AT_RISK: {
    name: 'At Risk',
    description: "Customers who haven't ordered recently",
    color: '#FFEAA7',
    priority: 5,
  },
  INACTIVE: {
    name: 'Inactive',
    description: 'Customers with no recent activity',
    color: '#DDA0DD',
    priority: 6,
  },
  REGULAR_CUSTOMER: {
    name: 'Regular Customer',
    description: 'Standard customers with moderate activity',
    color: '#74B9FF',
    priority: 7,
  },
  NEW_CUSTOMER: {
    name: 'New Customer',
    description: 'Recently registered customers',
    color: '#A29BFE',
    priority: 8,
  },
};

// Product categories for sample data
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Books',
  'Sports & Outdoors',
  'Health & Beauty',
  'Toys & Games',
  'Food & Beverages',
  'Automotive',
  'Jewelry',
];

// Payment methods
export const PAYMENT_METHODS = [
  'Credit Card',
  'Debit Card',
  'UPI',
  'Net Banking',
  'Cash on Delivery',
  'Wallet',
];

// Order sources
export const ORDER_SOURCES = ['Website', 'Mobile App', 'Phone', 'Store'];

// Sample product data for seeding
export const SAMPLE_PRODUCTS = [
  // Electronics
  { name: 'Smartphone', category: 'Electronics', basePrice: 15000 },
  { name: 'Laptop', category: 'Electronics', basePrice: 45000 },
  { name: 'Headphones', category: 'Electronics', basePrice: 2000 },
  { name: 'Smart Watch', category: 'Electronics', basePrice: 8000 },
  { name: 'Tablet', category: 'Electronics', basePrice: 25000 },

  // Clothing
  { name: 'T-Shirt', category: 'Clothing', basePrice: 500 },
  { name: 'Jeans', category: 'Clothing', basePrice: 1200 },
  { name: 'Dress', category: 'Clothing', basePrice: 1500 },
  { name: 'Shoes', category: 'Clothing', basePrice: 2500 },
  { name: 'Jacket', category: 'Clothing', basePrice: 3000 },

  // Home & Garden
  { name: 'Coffee Maker', category: 'Home & Garden', basePrice: 3500 },
  { name: 'Vacuum Cleaner', category: 'Home & Garden', basePrice: 8000 },
  { name: 'Bedsheet Set', category: 'Home & Garden', basePrice: 1000 },
  { name: 'Garden Tools', category: 'Home & Garden', basePrice: 1500 },
  { name: 'Kitchen Knife Set', category: 'Home & Garden', basePrice: 2000 },

  // Books
  { name: 'Programming Book', category: 'Books', basePrice: 800 },
  { name: 'Novel', category: 'Books', basePrice: 300 },
  { name: 'Cookbook', category: 'Books', basePrice: 600 },
  { name: 'Self-Help Book', category: 'Books', basePrice: 400 },
  { name: 'Biography', category: 'Books', basePrice: 500 },

  // Sports & Outdoors
  { name: 'Cricket Bat', category: 'Sports & Outdoors', basePrice: 2500 },
  { name: 'Football', category: 'Sports & Outdoors', basePrice: 800 },
  { name: 'Gym Bag', category: 'Sports & Outdoors', basePrice: 1200 },
  { name: 'Yoga Mat', category: 'Sports & Outdoors', basePrice: 600 },
  { name: 'Dumbbells', category: 'Sports & Outdoors', basePrice: 1500 },
];

// Indian names for sample data
export const SAMPLE_NAMES = [
  // Male names
  'Aarav Sharma',
  'Vivaan Patel',
  'Aditya Singh',
  'Vihaan Kumar',
  'Arjun Gupta',
  'Sai Reddy',
  'Reyansh Agarwal',
  'Ayaan Shah',
  'Krishna Jain',
  'Ishaan Mishra',
  'Shaurya Tiwari',
  'Atharv Yadav',
  'Rudra Verma',
  'Aadhya Pandey',
  'Pranav Modi',

  // Female names
  'Saanvi Sharma',
  'Ananya Patel',
  'Diya Singh',
  'Pihu Kumar',
  'Priya Gupta',
  'Anvi Reddy',
  'Kavya Agarwal',
  'Aanya Shah',
  'Myra Jain',
  'Sara Mishra',
  'Aditi Tiwari',
  'Aadhya Yadav',
  'Kiara Verma',
  'Veda Pandey',
  'Ira Modi',

  // More names
  'Rohit Kapoor',
  'Amit Khanna',
  'Suresh Nair',
  'Rajesh Iyer',
  'Manoj Pillai',
  'Neha Sethi',
  'Pooja Malhotra',
  'Ritu Saxena',
  'Kavita Joshi',
  'Sunita Rao',
];

// Indian cities for addresses
export const INDIAN_CITIES = [
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Delhi', state: 'Delhi' },
  { city: 'Bangalore', state: 'Karnataka' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Lucknow', state: 'Uttar Pradesh' },
  { city: 'Kanpur', state: 'Uttar Pradesh' },
  { city: 'Nagpur', state: 'Maharashtra' },
  { city: 'Indore', state: 'Madhya Pradesh' },
  { city: 'Thane', state: 'Maharashtra' },
  { city: 'Bhopal', state: 'Madhya Pradesh' },
];

// API response templates
export const API_RESPONSES = {
  SUCCESS: {
    success: true,
    message: 'Operation completed successfully',
  },
  ERROR: {
    success: false,
    message: 'An error occurred',
  },
  NOT_FOUND: {
    success: false,
    message: 'Resource not found',
  },
  VALIDATION_ERROR: {
    success: false,
    message: 'Validation failed',
  },
};

// Logging levels
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

// K-means clustering parameters
export const CLUSTERING_CONFIG = {
  K: 4, // Number of clusters
  MAX_ITERATIONS: 100, // Maximum iterations for convergence
  TOLERANCE: 0.01, // Convergence tolerance
  FEATURES: [
    'normalizedCartValue',
    'normalizedFrequency',
    'normalizedRecency',
    'normalizedLifetimeValue',
  ],
};

export default {
  COHORT_THRESHOLDS,
  COHORT_TYPES,
  PRODUCT_CATEGORIES,
  PAYMENT_METHODS,
  ORDER_SOURCES,
  SAMPLE_PRODUCTS,
  SAMPLE_NAMES,
  INDIAN_CITIES,
  API_RESPONSES,
  LOG_LEVELS,
  CLUSTERING_CONFIG,
};
