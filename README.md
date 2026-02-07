# Portfolio SaaS

A full-stack Portfolio SaaS that lets admins curate and publish portfolios while the public can browse approved work. Built with Next.js App Router on the frontend and Express + MongoDB on the backend, using JWT-based auth and role-based access control.

**Status:** Production-ready baseline with cookie-based authentication and admin route protection.

## Features
- Public portfolio listing and detail pages
- Admin dashboard for publish/unpublish workflow
- JWT authentication with role-based access control
- HTTP-only cookie session on the frontend
- Clean dark UI with loading, success, and error states

## Tech Stack
- Frontend: Next.js (App Router), React, Tailwind CSS
- Backend: Node.js, Express, MongoDB (Mongoose)
- Auth: JWT + RBAC (admin)

## Folder Structure
```
backend/
  controllers/
  middleware/
  models/
  routes/
  server.js

frontend/
  app/
    admin/portfolios/
    api/
    lib/
    login/
    portfolios/
  middleware.ts
```

## Environment Variables
Create these files locally (see `.env.example` in each app):

**`backend/.env`**
```
PORT=5000
JWT_SECRET=replace-with-strong-secret
MONGO_URI=mongodb+srv://USER:PASSWORD@HOST/portfolioSaaS
```

**`frontend/.env.local`**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Deployment

### Frontend (Vercel)
1. Create a new Vercel project from the `frontend/` folder.
2. Set `NEXT_PUBLIC_API_URL` to your backend URL.
3. Build command: `npm run build`
4. Output: `.next`

### Backend (Render)
1. Create a new Web Service from the `backend/` folder.
2. Set environment variables: `PORT`, `JWT_SECRET`, `MONGO_URI`.
3. Start command: `npm start`
4. Health check: `GET /`

## Running Locally

**Backend**
```
cd backend
npm install
npm run dev
```

**Frontend**
```
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`  
Backend runs on `http://localhost:5000`

## Admin Workflow
1. Register an admin user (set `role: "admin"` when creating the user).
2. Sign in at `/login`.
3. You’ll be redirected to `/admin/portfolios`.
4. Publish/unpublish portfolios via the admin table.
5. Public visitors can view published portfolios at `/portfolios`.

## Auth Flow (High Level)
- Login hits Next API route `POST /api/auth/login`.
- Next proxies to backend `/api/auth/login`, gets a JWT.
- JWT stored as HTTP-only cookie (`auth_token`).
- Next middleware protects all `/admin/*` routes.
