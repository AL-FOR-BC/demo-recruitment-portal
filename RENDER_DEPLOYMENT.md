# Render Deployment Guide

This guide provides the correct configuration for deploying both the backend and frontend to Render.

## Backend Deployment (Web Service)

### Service Type
**Web Service** (NOT Static Site)

### Configuration
- **Repository**: `https://github.com/AL-FOR-BC/demo-recruitment-portal`
- **Branch**: `main`
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Node Version**: `18` or `20` (check your Node version)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### Environment Variables
Make sure to add all required environment variables in Render's dashboard:
- Database connection strings
- JWT secrets
- Email configuration
- Any other variables your backend needs

### Build Filters (Optional)
- **Included Paths**: `backend/**`
- **Ignored Paths**: `frontend/**`, `*.md`, `.gitignore`

---

## Frontend Deployment (Static Site)

### Service Type
**Static Site**

### Configuration
- **Repository**: `https://github.com/AL-FOR-BC/demo-recruitment-portal`
- **Branch**: `main`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `frontend/dist`

### Build Filters (Optional)
- **Included Paths**: `frontend/**`
- **Ignored Paths**: `backend/**`, `*.md`, `.gitignore`

### Important Notes
- The frontend is configured with `base: '/recruitment-app/'` in `vite.config.ts`
- A `_redirects` file has been created in `frontend/public/` to handle SPA routing
- The `_redirects` file ensures all routes under `/recruitment-app/*` are served by `index.html`
- Make sure your Render static site URL matches this base path, or update the base path in `vite.config.ts` to match your deployment URL

### Redirect Configuration
The `_redirects` file in `frontend/public/` contains:
```
/recruitment-app/*    /recruitment-app/index.html   200
/    /recruitment-app/   301
```

This ensures:
- All routes under `/recruitment-app/` (like `/recruitment-app/dashboard`) are handled by React Router
- Root path redirects to `/recruitment-app/` for better UX

---

## Quick Setup Steps

1. **Create Backend Web Service**:
   - Go to Render Dashboard → New → Web Service
   - Connect your GitHub repository
   - Use the backend configuration above
   - Add environment variables
   - Deploy

2. **Create Frontend Static Site**:
   - Go to Render Dashboard → New → Static Site
   - Connect your GitHub repository
   - Use the frontend configuration above
   - Deploy

3. **Update Frontend API URLs**:
   - After backend is deployed, update the API URL in `frontend/src/configs/app.config.ts`
   - Current production API: `https://recruitmentbackend.reachoutmbuya.org/api`
   - If using a new Render backend URL, update line 12 in `app.config.ts`:
     ```typescript
     apiPrefix: "https://your-backend-service.onrender.com/api",
     ```
   - Also update `API_BASE_URL` on line 27 if needed

---

## Troubleshooting

### Backend Issues
- Ensure all environment variables are set
- Check that the database is accessible from Render's network
- Verify Node version matches your local development version

### Frontend Issues
- If routes don't work, check the `base` path in `vite.config.ts`
- Ensure the `_redirects` file is in `frontend/public/` (it will be copied to `dist/` during build)
- If Render doesn't support `_redirects`, configure redirects in Render dashboard:
  - Go to your Static Site settings
  - Add custom redirect: `/recruitment-app/*` → `/recruitment-app/index.html` (200 status)
- Ensure API URLs in frontend config point to the deployed backend URL
- Check browser console for CORS errors

