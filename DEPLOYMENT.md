# CycleWell Deployment Guide

This document provides step-by-step instructions for deploying the CycleWell platform to production.

## 1. Database (Neon PostgreSQL)
1. Create a free account at [Neon.tech](https://neon.tech).
2. Create a new project named `CycleWell`.
3. Copy the **Connection String** (PostgreSQL URL).
   - Format: `postgresql://user:password@host/dbname?sslmode=require`

## 2. Backend (Railway)
1. Push your code to a GitHub repository.
2. Login to [Railway.app](https://railway.app) and create a "New Project".
3. Select "Deploy from GitHub repo" and choose your repository.
4. Go to the **Variables** tab and add the following:
   - `DATABASE_URL`: Your Neon Connection String.
   - `JWT_SECRET`: A random long string for security.
   - `OPENAI_API_KEY`: Your OpenAI API Key.
   - `FRONTEND_URL`: `https://cyclewell.vercel.app` (or your custom Vercel URL).
   - `PORT`: `3000` (Railway often provides this automatically).

## 3. Frontend (Vercel)
1. Login to [Vercel.com](https://vercel.com) and click "New Project".
2. Import your GitHub repository.
3. Configure the **Build Settings**:
   - Framework Preset: `Vite`.
   - Root Directory: `frontend`.
4. Add **Environment Variables**:
   - `VITE_API_URL`: Your Railway production URL (e.g., `https://nura-production.up.railway.app`).
5. Click **Deploy**.

## 4. Post-Deployment Verification
- Run a production build locally: `npm run build` in both directories.
- Check the Vercel URL to ensure the frontend loads.
- Verify that login/signup works (confirming backend and database connectivity).
- Open the **Alert Center** and **Reports** to verify feature functionality.

---

### Production Checklist
- [ ] CORS allows production frontend domain.
- [ ] Database migrations are applied (`npx prisma migrate deploy`).
- [ ] All API endpoints use the production URL.
- [ ] SEO meta tags are populated correctly.
- [ ] Error boundary is active.
