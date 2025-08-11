# Quick Deployment Commands

## GitHub Setup

```bash
# If you haven't created GitHub repo yet:
git remote add origin https://github.com/YOUR_USERNAME/user-cohort-analytics.git
git push -u origin main
```

## Vercel Deployment (Recommended)

### Method 1: Vercel CLI (Command Line)

```bash
# 1. Install Vercel CLI (already done)
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy your project
cd "d:\AbhiSDE\Projects\JSFSD\New folder (2)"
vercel

# 4. Add environment variables
vercel env add MONGODB_URI
vercel env add NODE_ENV

# 5. Redeploy with environment variables
vercel --prod
```

### Method 2: Vercel Dashboard (Web Interface)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Import Git Repository"
4. Select your `user-cohort-analytics` repo
5. Add Environment Variables:
   - MONGODB_URI: your_mongodb_atlas_connection_string
   - NODE_ENV: production
6. Click Deploy

## Alternative: Railway Deployment

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "Deploy from GitHub repo"
4. Select your repo
5. Add MongoDB service
6. Add Environment Variables

## Alternative: Render Deployment

1. Go to https://render.com
2. Click "New Web Service"
3. Connect GitHub repo
4. Build Command: `npm run build`
5. Start Command: `npm start`
6. Add Environment Variables

## Environment Variables Needed:

- MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
- NODE_ENV=production
- PORT=3000

## After Deployment:

Your app will be live at:

- Frontend: https://your-app-name.vercel.app
- API: https://your-app-name.vercel.app/api

## Test Your Deployed App:

1. Visit your live URL
2. Test user creation
3. Test order management
4. Test cohort analysis
