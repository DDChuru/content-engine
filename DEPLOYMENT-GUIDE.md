# Backend Deployment Guide

This guide covers how to deploy your Content Engine backend to the cloud so it runs 24/7.

---

## Overview

**What needs to be deployed:** The Node.js Express API (`packages/backend`)

**What it does:**
- Listens on a port (default: 3001)
- Accepts API requests to generate content
- Uses Claude API, Gemini API, GitHub integration
- Uploads generated files to Firebase Storage
- Returns URLs to generated presentations

**What Firebase does:**
- **Storage ONLY** - Stores generated HTML files and thumbnails
- **NOT a compute platform** - Cannot run your Node.js server

---

## Deployment Options

### 🚂 Option 1: Railway (Recommended)

**Why Railway:**
- ✅ Simple deployment from GitHub
- ✅ Automatic builds on git push
- ✅ Built-in environment variables
- ✅ Free tier available ($5/month credit)
- ✅ Custom domains
- ✅ Excellent for Node.js apps

#### Setup Steps:

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login to Railway**
```bash
railway login
```

3. **Initialize Project**
```bash
cd packages/backend
railway init
```

4. **Set Environment Variables**

In the Railway dashboard, add these:

```env
ANTHROPIC_API_KEY=sk-ant-api03-...
GEMINI_API_KEY=AIzaSy...
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@your-project.iam.gserviceaccount.com
GITHUB_TOKEN=ghp_... (optional)
PORT=3001
NODE_ENV=production
```

5. **Deploy**
```bash
railway up
```

6. **Get Your URL**

Railway will give you a URL like:
```
https://content-engine-production.up.railway.app
```

7. **Test It**
```bash
curl https://your-app.up.railway.app/api/health
```

#### Auto-Deploy from GitHub

1. Go to Railway dashboard
2. Connect your GitHub repo
3. Select `packages/backend` as the root
4. Railway will auto-deploy on every push to `main`

---

### 🎨 Option 2: Render

**Why Render:**
- ✅ Free tier (with limitations)
- ✅ Auto-deploy from GitHub
- ✅ Simple UI
- ✅ Good for startups

#### Setup Steps:

1. **Go to:** https://render.com

2. **Create New Web Service**
   - Connect GitHub repo
   - Root Directory: `packages/backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: `Node`

3. **Add Environment Variables** (same as Railway)

4. **Deploy**

You get a URL like:
```
https://content-engine.onrender.com
```

**Note:** Free tier sleeps after 15 minutes of inactivity (slow first request)

---

### ▲ Option 3: Vercel

**Why Vercel:**
- ✅ Excellent for serverless
- ✅ Free tier
- ✅ Fast deployments
- ✅ Great developer experience

**⚠️ Limitation:** Serverless functions have 10-second timeout on free tier (may be too short for AI generation)

#### Setup Steps:

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Configure vercel.json**

Already created at project root. Just deploy:

```bash
cd packages/backend
vercel deploy --prod
```

3. **Add Environment Variables**

In Vercel dashboard or via CLI:
```bash
vercel env add ANTHROPIC_API_KEY
vercel env add GEMINI_API_KEY
# ... etc
```

You get:
```
https://content-engine.vercel.app
```

---

### 🪂 Option 4: Fly.io

**Why Fly.io:**
- ✅ Good free tier
- ✅ Run anywhere in the world
- ✅ Great for Node.js
- ✅ Docker-based (flexible)

#### Setup Steps:

1. **Install Fly CLI**
```bash
curl -L https://fly.io/install.sh | sh
```

2. **Login**
```bash
fly auth login
```

3. **Initialize**
```bash
cd packages/backend
fly launch
```

Follow prompts:
- App name: `content-engine-backend`
- Region: Choose closest to you
- PostgreSQL: No
- Redis: No

4. **Set Environment Variables**
```bash
fly secrets set ANTHROPIC_API_KEY=sk-ant-...
fly secrets set GEMINI_API_KEY=AIza...
# ... etc
```

5. **Deploy**
```bash
fly deploy
```

You get:
```
https://content-engine-backend.fly.dev
```

---

### 🐳 Option 5: Self-Hosted (VPS)

**Why Self-Hosted:**
- ✅ Full control
- ✅ Potentially cheaper for high usage
- ✅ No vendor lock-in

**Options:**
- DigitalOcean Droplet
- AWS EC2
- Google Cloud Compute Engine
- Your own server

#### Setup Steps (Ubuntu):

```bash
# 1. SSH into your server
ssh user@your-server.com

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2 (process manager)
sudo npm install -g pm2

# 4. Clone your repo
git clone https://github.com/yourusername/content-engine.git
cd content-engine/packages/backend

# 5. Install dependencies
npm install

# 6. Create .env file
nano .env
# Add all your environment variables

# 7. Build
npm run build

# 8. Start with PM2
pm2 start npm --name "content-engine" -- start
pm2 save
pm2 startup

# 9. Set up nginx reverse proxy
sudo apt install nginx
sudo nano /etc/nginx/sites-available/content-engine
```

Nginx config:
```nginx
server {
    listen 80;
    server_name api.yourcompany.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/content-engine /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Install SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourcompany.com
```

---

## Recommended: Railway

For your use case, **Railway is the best choice**:

1. ✅ Easy to set up
2. ✅ Auto-deploy from GitHub
3. ✅ No timeout issues (unlike Vercel free tier)
4. ✅ Always running (unlike Render free tier)
5. ✅ Good free credits

---

## Post-Deployment Workflow

Once deployed, you never need to manually start the backend again!

### Generate Content:

```bash
# Set your deployed API URL
export API_URL=https://content-engine.up.railway.app

# Generate content
./scripts/generate-content.sh user-manual iClean
```

### What Happens:

1. Script calls your deployed API
2. Backend (running 24/7 in the cloud) processes request
3. Claude/Gemini generate content
4. Files uploaded to Firebase Storage
5. URLs returned to you
6. Script downloads HTML to local machine
7. You open in browser and record with OBS

---

## Cost Estimates

### Railway
- Free: $5/month in credits
- After free tier: ~$5-10/month for light usage
- Scales with usage

### Render
- Free tier: Available but sleeps after inactivity
- Paid: $7/month minimum

### Vercel
- Free: Generous limits but 10s function timeout
- Pro: $20/month

### Fly.io
- Free: 3 shared-cpu VMs
- Paid: ~$5-10/month

### Self-Hosted VPS
- DigitalOcean: $6/month (basic droplet)
- AWS/GCP: Variable

---

## Quick Start: Deploy to Railway Now

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Deploy
cd packages/backend
railway init
railway up

# 4. Add environment variables in dashboard
# https://railway.app/dashboard

# 5. Test
curl https://your-app.up.railway.app/api/health

# Done! Backend is now running 24/7
```

---

## Monitoring Your Deployment

### Railway Dashboard:
- View logs
- Check CPU/memory usage
- Monitor requests
- See deployment history

### Health Check Endpoint:
```bash
curl https://your-app.up.railway.app/api/health
```

Returns:
```json
{
  "status": "ok",
  "timestamp": "2025-10-21T...",
  "environment": "production",
  "services": {
    "claude": "✓",
    "gemini": "✓",
    "firebase": "✓"
  }
}
```

---

## Troubleshooting

### Backend not responding:
1. Check Railway logs
2. Verify environment variables are set
3. Check API keys are valid
4. Ensure build succeeded

### Generation failing:
1. Check API quotas (Claude, Gemini)
2. Verify Firebase credentials
3. Check backend logs for errors

### Slow responses:
1. Check if on free tier with cold starts
2. Consider upgrading plan
3. Monitor API rate limits

---

## Next Steps

1. **Choose a platform** (Railway recommended)
2. **Deploy backend** following steps above
3. **Test with health endpoint**
4. **Update your generate-content.sh script** with production URL
5. **Generate content** and record with OBS!

No more manually starting servers - it's all automated! 🚀
