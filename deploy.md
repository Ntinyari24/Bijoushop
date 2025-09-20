# Deployment Guide

## Frontend Deployment Options

### 1. Vercel (Recommended - Easiest)
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set environment variable: `VITE_API_BASE_URL=https://bijoushop.onrender.com`
4. Deploy automatically

### 2. Netlify
1. Go to [netlify.com](https://netlify.com)
2. Import your GitHub repository
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Set environment variable: `VITE_API_BASE_URL=https://bijoushop.onrender.com`

### 3. Render (Static Site)
1. Go to [render.com](https://render.com)
2. Create new "Static Site"
3. Connect your GitHub repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Set environment variable: `VITE_API_BASE_URL=https://bijoushop.onrender.com`

### 4. Manual Build
```bash
# Build for production
npm run build

# The dist folder contains your production files
# Upload dist folder contents to any static hosting service
```

## Environment Variables Needed
- `VITE_API_BASE_URL=https://bijoushop.onrender.com`

## Backend is Already Deployed
- Backend URL: https://bijoushop.onrender.com
- API endpoints: https://bijoushop.onrender.com/api/
- Health check: https://bijoushop.onrender.com/health/
