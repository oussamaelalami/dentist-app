# Railway Deployment Guide

## Quick Deploy to Railway

### Step 1: Fix Git Push Issue
```bash
# Check git status
git status

# If origin not set:
git remote add origin https://github.com/YOUR_USERNAME/dentist-app.git

# Try pushing again
git push -u origin main

# If authentication fails:
# - Use GitHub Personal Access Token instead of password
# - Or set SSH key: https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh
```

### Step 2: Deploy Backend to Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize GitHub
5. Select your `dentist-app` repo
6. Click "Deploy"

### Step 3: Configure Environment Variables in Railway

1. Go to your Railway project
2. Click "Backend" service
3. Go to "Variables" tab
4. Add these variables:
   ```
   JWT_SECRET=your-super-secret-key-here-at-least-32-chars
   ALLOWED_ORIGIN=https://your-frontend-url.vercel.app
   PORT=5000
   NODE_ENV=production
   ```

5. Deploy

### Step 4: Get Backend URL

1. Go to "Deployments" tab
2. Copy the service URL (e.g., `https://dentist-api-prod.railway.app`)
3. Update this in your frontend `.env`:
   ```
   NEXT_PUBLIC_API_URL=https://dentist-api-prod.railway.app
   ```

### Step 5: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Import from GitHub
3. Select `dentist-app` repo
4. In "Environment Variables", add:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend-url
   ```
5. Deploy

---

## Common Railway Deployment Errors

### ❌ Error: "Cannot find module"
**Solution:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` locally
- Commit and push again

### ❌ Error: "Port is not available"
**Solution:**
Railway automatically assigns PORT via environment variable
- Make sure `index.js` uses: `process.env.PORT || 5000`
- ✅ Your server already does this!

### ❌ Error: "Database file not found"
**Solution:**
SQLite doesn't persist on Railway (ephemeral storage)
- Use PostgreSQL instead (Railway auto-provisions)
- Or accept database reset on redeploy

### ❌ Error: "CORS error"
**Solution:**
Update `server/.env`:
```
ALLOWED_ORIGIN=https://your-frontend-url.vercel.app
```

---

## Database Issue for Railway

Railway's filesystem is ephemeral (resets on redeploy). For production, use PostgreSQL:

### Switch to PostgreSQL (Recommended)

1. In Railway, click "Add"
2. Select "PostgreSQL"
3. Railway auto-creates connection string
4. Update `server/db.js` to use PostgreSQL:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = pool;
```

5. Update `server/package.json`:
```json
{
  "dependencies": {
    "pg": "^8.8.0"
  }
}
```

Or keep SQLite but add persistence:
```javascript
// Create data directory
const path = require('path');
const dbPath = process.env.DATABASE_PATH || './data/database.sqlite';
const db = new sqlite3.Database(dbPath);
```

---

## Step-by-Step Fix

### 1. Fix Git Push First
```bash
cd d:\dentist-app

# Check origin
git remote -v

# If missing:
git remote add origin https://github.com/YOUR_USERNAME/dentist-app.git

# Update .gitignore (should not include .env)
# But add production .env separately in Railway UI

# Push
git add .
git commit -m "Ready for Railway deployment"
git push -u origin main
```

### 2. Update Backend for Production
Already done! Your `.env` now has:
- `ALLOWED_ORIGIN=*` (Railway compatible)
- `NODE_ENV=production`

### 3. Deploy on Railway
1. Connect GitHub repo
2. Set environment variables in Railway UI
3. Railway auto-starts with `npm start`

### 4. Deploy Frontend to Vercel
1. Update `NEXT_PUBLIC_API_URL` env variable
2. Vercel auto-builds with `npm run build`

---

## Verify Deployment

### Test Backend
```bash
# From Railway, copy the backend URL and test:
curl https://your-railway-url/
# Should return: {"status":"API is running"}
```

### Test API
```bash
curl https://your-railway-url/services
# Should return services JSON
```

### Test Frontend
Visit your Vercel URL and:
1. Check if services load
2. Try booking appointment
3. Login to admin

---

## Still Having Issues?

Share the exact error message and I'll help you fix it!

Common places to find error messages:
1. Railway dashboard → Deployments → Logs
2. Vercel dashboard → Deployments → Logs
3. Browser console (F12) for frontend errors
