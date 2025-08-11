# User Cohort Analysis API Guide

Complete API documentation with Postman testing examples.

## Quick Start

1. **Install & Setup**

```bash
npm install
npm run dev    # Start development server
npm run seed   # Add sample data
```

2. **Base URL**: `http://localhost:3000`

## API Endpoints & Postman Testing

### 1. Users API

#### Get All Users

```
Method: GET
URL: /api/users
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)
- `cohort` (optional): Filter by cohort name
- `sortBy` (optional): Sort field (default: metrics.lifetimeValue)
- `sortOrder` (optional): asc/desc (default: desc)

**Postman Example:**

```
GET http://localhost:3000/api/users?page=1&limit=10&cohort=High Spender
```

#### Create New User

```
Method: POST
URL: /api/users
Headers: Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Rajesh Kumar",
  "email": "rajesh.kumar@email.com",
  "phone": "+919876543210",
  "address": "Mumbai, Maharashtra",
  "dateOfBirth": "1990-05-15"
}
```

#### Get User by ID

```
Method: GET
URL: /api/users/:id
```

**Postman Example:**

```
GET http://localhost:3000/api/users/64f1a2b3c4d5e6f7g8h9i0j1
```

### 2. Orders API

#### Get All Orders

```
Method: GET
URL: /api/orders
```

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Items per page
- `userId` (optional): Filter by user ID
- `status` (optional): Filter by order status
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)

**Postman Example:**

```
GET http://localhost:3000/api/orders?userId=64f1a2b3c4d5e6f7g8h9i0j1&status=Delivered
```

#### Create New Order

```
Method: POST
URL: /api/orders
Headers: Content-Type: application/json
```

**Request Body:**

```json
{
  "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "items": [
    {
      "name": "Wireless Headphones",
      "category": "Electronics",
      "price": 2500,
      "quantity": 1
    },
    {
      "name": "Phone Case",
      "category": "Accessories",
      "price": 500,
      "quantity": 2
    }
  ],
  "totalAmount": 3500,
  "paymentMethod": "Credit Card",
  "shippingAddress": "123 Main St, Mumbai",
  "source": "website"
}
```

#### Get Orders by User

```
Method: GET
URL: /api/orders/user/:userId
```

**Postman Example:**

```
GET http://localhost:3000/api/orders/user/64f1a2b3c4d5e6f7g8h9i0j1
```

### 3. Cohorts API

#### Get Cohort Statistics

```
Method: GET
URL: /api/cohorts
```

**Response Example:**

```json
{
  "success": true,
  "data": {
    "totalUsers": 1000,
    "cohorts": {
      "High Spender": { "count": 150, "percentage": 15 },
      "Frequent Buyer": { "count": 200, "percentage": 20 },
      "Bulk Buyer": { "count": 100, "percentage": 10 },
      "Loyal Customer": { "count": 250, "percentage": 25 },
      "At Risk": { "count": 180, "percentage": 18 },
      "Inactive": { "count": 120, "percentage": 12 }
    },
    "lastUpdated": "2024-08-12T10:30:00.000Z"
  }
}
```

#### Generate Cohorts

```
Method: POST
URL: /api/cohorts/generate
```

**Response:**

```json
{
  "success": true,
  "message": "Cohorts generated successfully",
  "data": {
    "usersProcessed": 1000,
    "cohortsUpdated": 6,
    "processingTime": 2345
  }
}
```

#### Get Users in Specific Cohort

```
Method: GET
URL: /api/cohorts/:cohortName/users
```

**Postman Example:**

```
GET http://localhost:3000/api/cohorts/High Spender/users
```

#### Get Cohort Analytics

```
Method: GET
URL: /api/cohorts/analytics
```

## Postman Collection Setup

### Step 1: Create New Collection

1. Open Postman
2. Click "New" → "Collection"
3. Name: "User Cohort Analysis API"

### Step 2: Environment Setup

Create environment variables:

- `baseUrl`: `http://localhost:3000`
- `userId`: (will be set after creating user)

### Step 3: Add Requests

#### Health Check

```
Method: GET
URL: {{baseUrl}}/health
```

#### Get All Users

```
Method: GET
URL: {{baseUrl}}/api/users
```

#### Create User

```
Method: POST
URL: {{baseUrl}}/api/users
Headers: Content-Type: application/json
Body: raw (JSON)
```

#### Create Order

```
Method: POST
URL: {{baseUrl}}/api/orders
Headers: Content-Type: application/json
Body: raw (JSON)
```

## Sample Test Data

### User Data Examples:

**High Value Customer:**

```json
{
  "name": "Priya Sharma",
  "email": "priya.sharma@email.com",
  "phone": "+919876543211",
  "address": "Bangalore, Karnataka",
  "dateOfBirth": "1985-08-25"
}
```

**Regular Customer:**

```json
{
  "name": "Amit Patel",
  "email": "amit.patel@email.com",
  "phone": "+919876543212",
  "address": "Ahmedabad, Gujarat",
  "dateOfBirth": "1992-12-10"
}
```

### Order Data Examples:

**High Value Order:**

```json
{
  "userId": "USER_ID_HERE",
  "items": [
    {
      "name": "iPhone 14 Pro",
      "category": "Electronics",
      "price": 129900,
      "quantity": 1
    },
    {
      "name": "Apple Watch",
      "category": "Electronics",
      "price": 45900,
      "quantity": 1
    }
  ],
  "totalAmount": 175800,
  "paymentMethod": "Credit Card",
  "shippingAddress": "Same as billing",
  "source": "website"
}
```

**Regular Order:**

```json
{
  "userId": "USER_ID_HERE",
  "items": [
    {
      "name": "T-Shirt",
      "category": "Fashion",
      "price": 799,
      "quantity": 2
    },
    {
      "name": "Jeans",
      "category": "Fashion",
      "price": 1999,
      "quantity": 1
    }
  ],
  "totalAmount": 3597,
  "paymentMethod": "UPI",
  "shippingAddress": "Home address",
  "source": "mobile"
}
```

## Testing Workflow

### Complete Test Sequence:

1. **Start Server**

```bash
npm run dev
```

2. **Add Sample Data**

```bash
npm run seed
```

3. **Test Health Check**

```
GET http://localhost:3000/health
```

4. **Get Initial Users**

```
GET http://localhost:3000/api/users
```

5. **Create New User**

```
POST http://localhost:3000/api/users
(Use sample user data)
```

6. **Create Orders for User**

```
POST http://localhost:3000/api/orders
(Use user ID from step 5)
```

7. **Generate Cohorts**

```
POST http://localhost:3000/api/cohorts/generate
```

8. **View Cohort Results**

```
GET http://localhost:3000/api/cohorts
```

9. **Check User's Cohort**

```
GET http://localhost:3000/api/users/USER_ID
```

## Response Formats

### Success Response:

```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

### Error Response:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## HTTP Status Codes

- `200`: Success
- `201`: Created successfully
- `400`: Bad request / Validation error
- `404`: Resource not found
- `500`: Internal server error

## Cohort Types

1. **High Spender** - Average cart value > ₹2000
2. **Frequent Buyer** - More than 3 orders per month
3. **Bulk Buyer** - Average 5+ items per order
4. **Loyal Customer** - 10+ orders with recent activity
5. **At Risk** - Last order 30-90 days ago
6. **Inactive** - Last order > 90 days ago

## Tips for Testing

1. **Always start with seeded data** using `npm run seed`
2. **Copy user IDs** from GET users response for creating orders
3. **Wait for cohort generation** to complete before checking results
4. **Use different order patterns** to test different cohort classifications
5. **Check response times** for performance testing

## Troubleshooting

**Common Issues:**

1. **Server not starting**: Check if MongoDB is running
2. **Database connection error**: Verify MONGODB_URI in .env
3. **Validation errors**: Check required fields in request body
4. **User not found**: Ensure user ID exists in database
5. **Cohorts not updating**: Run cohort generation endpoint

Happy Testing! 🚀
