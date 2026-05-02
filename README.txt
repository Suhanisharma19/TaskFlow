TaskFlow — Project Management Platform
=====================================

Overview
--------
TaskFlow is a full-stack project management app (Admin/Member roles) with
Projects, Tasks, Team (admin-only in UI), and a premium dashboard.

Tech Stack
----------
- Frontend: React + Vite, Tailwind CSS, Framer Motion, Lucide icons
- Backend: Node.js, Express, MongoDB (Mongoose), JWT (httpOnly cookie + Bearer)

Repo Structure
--------------
- frontend/   React SPA (Vite)
- backend/    Express REST API

Prerequisites
-------------
- Node.js 18+
- MongoDB (local or MongoDB Atlas)

Local Development
-----------------
1) Backend
   cd backend
   npm install
   Create backend/.env (do not commit secrets):
   - PORT=5000
   - MONGODB_URI=<your mongodb connection string>
   - JWT_SECRET=<long random string>
   - JWT_EXPIRE=7d
   - NODE_ENV=development
   - CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175

   Run:
   - npm run dev     (nodemon)
   - npm start       (production-style: node server.js)

2) Frontend
   cd frontend
   npm install
   Create frontend/.env:
   - VITE_API_URL=http://localhost:5000/api

   Run:
   - npm run dev
   - npm run build && npm run preview   (test production build locally)

Sample Data (optional)
----------------------
From backend folder:
   npm run seed
Requires a valid MONGODB_URI in backend/.env.

Production / Railway
--------------------
Use two Railway services (recommended): one for backend, one for static frontend.

Backend service
- Root Directory: backend
- Start Command: npm start  (or node server.js)
- Variables:
  - NODE_ENV=production
  - MONGODB_URI=<Atlas URI with DB name in path, e.g. .../taskflow?...>
  - JWT_SECRET=<strong secret>
  - JWT_EXPIRE=7d
  - CORS_ORIGIN=https://<your-frontend-host>   (full URL, https, no trailing slash)
  - FRONTEND_URL=https://<your-frontend-host>  (optional; merged into CORS allowlist)

Frontend service
- Root Directory: frontend
- Build: npm install && npm run build
- Start: npm run preview -- --host 0.0.0.0 --port $PORT
  (or your platform’s static file server; ensure SPA fallback to index.html)
- Variables at build time:
  - VITE_API_URL=https://<your-backend-host>/api

MongoDB Atlas
-------------
- Database Access: user with read/write on your database
- Network Access: allow Railway (often 0.0.0.0/0 for class projects) or fixed IPs

Auth Notes
----------
- API may set an httpOnly cookie (cross-site: SameSite=None; Secure in production).
- The SPA also stores the JWT and sends Authorization: Bearer <token> when present.
- After deploy, log in once so the client stores the token; use the same JWT_SECRET
  everywhere (do not rotate without invalidating sessions).

Useful API Paths
----------------
- GET  /api/health
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/logout
- GET  /api/auth/me
- CRUD under /api/projects, /api/tasks, /api/team, /api/dashboard, /api/users

Troubleshooting
---------------
- CORS errors: set CORS_ORIGIN (and redeploy backend) to your exact frontend origin.
- 401 on /api/auth/me before login: normal until credentials exist; after login, check
  Network tab for Set-Cookie and Authorization header on requests.
- npm ci on Railway: keep frontend/package-lock.json in sync (run npm install locally
  in frontend/ and commit the lockfile).

GitHub
------
Remote may be configured as origin pointing to your TaskFlow repository.
