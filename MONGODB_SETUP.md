# MongoDB Setup Guide

## Option 1: Install MongoDB Locally (Recommended for Development)

### Windows Installation:

1. **Download MongoDB Community Server**
   - Go to https://www.mongodb.com/try/download/community
   - Select Windows, and download the MSI installer
2. **Install MongoDB**

   - Run the downloaded MSI file
   - Choose "Complete" setup type
   - Install MongoDB as a Service (recommended)
   - Install MongoDB Compass (GUI tool)

3. **Verify Installation**

   ```cmd
   mongod --version
   mongo --version
   ```

4. **Start MongoDB Service**

   ```cmd
   net start MongoDB
   ```

5. **Update .env file**
   ```env
   MONGODB_URI=mongodb://localhost:27017/user-cohorts
   ```

### Alternative: MongoDB with Chocolatey

```cmd
# Install Chocolatey first (if not installed)
# Then install MongoDB
choco install mongodb

# Start MongoDB
mongod
```

## Option 2: Use MongoDB Atlas (Cloud Database)

1. **Create MongoDB Atlas Account**

   - Go to https://www.mongodb.com/atlas
   - Sign up for a free account

2. **Create a Cluster**

   - Choose the free tier (M0)
   - Select a region close to you
   - Wait for cluster creation (2-3 minutes)

3. **Configure Database Access**

   - Go to "Database Access" → "Add New Database User"
   - Create username and password
   - Give "readWrite" permissions

4. **Configure Network Access**

   - Go to "Network Access" → "Add IP Address"
   - Add your IP address or use 0.0.0.0/0 for testing

5. **Get Connection String**

   - Go to "Clusters" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

6. **Update .env file**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/user-cohorts?retryWrites=true&w=majority
   ```

## Option 3: Docker MongoDB

1. **Install Docker Desktop**

   - Download from https://www.docker.com/products/docker-desktop

2. **Run MongoDB Container**

   ```cmd
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

3. **Update .env file**
   ```env
   MONGODB_URI=mongodb://localhost:27017/user-cohorts
   ```

## Testing Database Connection

After setting up MongoDB, test the connection:

1. **Start the application**

   ```cmd
   npm run dev
   ```

2. **Check health endpoint**

   - Open http://localhost:3000/health in browser
   - Should show database connection status

3. **Seed the database**

   ```cmd
   npm run seed
   ```

4. **Generate cohorts**
   ```cmd
   npm run cohorts
   ```

## Troubleshooting

### Common Issues:

1. **Connection Error**

   - Check if MongoDB service is running
   - Verify connection string in .env
   - Check firewall settings

2. **Authentication Failed**

   - Verify username and password
   - Check database user permissions

3. **Network Timeout**

   - Check internet connection
   - Verify IP whitelist in MongoDB Atlas

4. **Port Already in Use**

   ```cmd
   # Check what's using port 27017
   netstat -an | find "27017"

   # Kill the process if needed
   taskkill /F /PID <process_id>
   ```

### Useful Commands:

```cmd
# Check MongoDB service status
sc query MongoDB

# Start MongoDB service
net start MongoDB

# Stop MongoDB service
net stop MongoDB

# Connect to MongoDB shell
mongo

# Show databases
show dbs

# Use specific database
use user-cohorts

# Show collections
show collections

# Count documents
db.users.count()
db.orders.count()
```

## Next Steps

Once MongoDB is set up:

1. Run `npm run seed` to populate sample data
2. Run `npm run cohorts` to generate user cohorts
3. Start the API server with `npm run dev`
4. Test the API endpoints using the examples in API_EXAMPLES.md

## Production Deployment

For production:

- Use MongoDB Atlas or a managed MongoDB service
- Enable authentication and SSL
- Set up proper backup strategies
- Monitor database performance
- Use connection pooling
- Set up replica sets for high availability
