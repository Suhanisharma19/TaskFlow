<div align="center">

# TaskFlow - Premium SaaS Project Management Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?logo=mongodb)](https://www.mongodb.com)
[![Deployed on Railway](https://img.shields.io/badge/Deployed%20on-Railway-8A2BE2?logo=railway)](https://railway.app)

**A modern, full-stack project management platform built with premium dark-themed UI, role-based access control, and enterprise-grade architecture.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Deployment](#-deployment) • [API Documentation](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**TaskFlow** is a premium, production-ready SaaS project management platform designed for modern teams. It features a stunning dark-themed dashboard with glassmorphism UI, smooth animations, and enterprise-grade security.

Built with the MERN stack (MongoDB, Express, React, Node.js), TaskFlow provides complete project and task management capabilities with role-based access control, making it perfect for teams of any size.

### Key Highlights

✨ **Premium Dark UI** - Glassmorphism cards with neon accents and smooth Framer Motion animations  
🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing  
👥 **Role-Based Access** - Admin and Member roles with granular permissions  
📊 **Interactive Dashboard** - Real-time analytics with Recharts visualizations  
🚀 **Production-Ready** - Railway deployment optimized with proper error handling  
📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile  

---

## ✨ Features

### Authentication & Security
- 🔐 **JWT Authentication** - Secure token-based authentication
- 🔒 **Password Hashing** - bcrypt with 12 salt rounds
- 👤 **Role-Based Access Control** - Admin (full access) and Member (limited access)
- 🛡️ **Input Validation** - Express-validator for all endpoints
- 🚫 **Rate Limiting** - Protection against brute force attacks
- 🔑 **Secure Headers** - Helmet middleware for security

### Project Management
- 📁 **Create Projects** - Admin can create and manage projects
- 👥 **Team Assignment** - Assign team members to projects
- 📈 **Progress Tracking** - Automatic progress calculation based on tasks
- ⏰ **Deadline Management** - Set and track project deadlines
- 🗑️ **Cascade Deletion** - Delete projects with associated tasks

### Task Management
- ✅ **Create Tasks** - Add tasks to projects with full details
- 🎯 **Priority Levels** - Low, Medium, High priority classification
- 📅 **Due Dates** - Track task deadlines and overdue items
- 🔄 **Status Workflow** - Pending → In Progress → Completed
- 👤 **Task Assignment** - Assign tasks to specific team members
- 🔍 **Advanced Filtering** - Filter by status, priority, project, assignee

### Dashboard & Analytics
- 📊 **Real-time Statistics** - Total projects, tasks by status, overdue count
- 📈 **Task Trends** - 30-day task completion trends with line charts
- 🍩 **Status Distribution** - Donut chart showing task breakdown
- 📅 **Activity Feed** - Recent team activity with timestamps
- ⏰ **Upcoming Deadlines** - Tasks due in the next 7 days
- 📱 **Responsive Layout** - Adaptive grid for all screen sizes

### UI/UX
- 🎨 **Premium Dark Theme** - Deep navy/black gradient backgrounds
- 💎 **Glassmorphism Cards** - Backdrop blur with subtle borders
- 🌈 **Neon Accents** - Purple, cyan, orange, pink highlights
- 🎭 **Smooth Animations** - Framer Motion transitions and hover effects
- 📱 **Mobile Responsive** - Fully responsive design
- 🔆 **Interactive Elements** - Glowing hover effects and smooth transitions

---

## 📸 Screenshots

> 💡 **Add your screenshots here**

### Dashboard
![Dashboard](./screenshots/dashboard.png)
*Premium dark dashboard with statistics, charts, and activity feed*

### Projects View
![Projects](./screenshots/projects.png)
*Project grid with progress tracking and team assignments*

### Task Management
![Tasks](./screenshots/tasks.png)
*Task list with filtering, priority levels, and status updates*

### Login Page
![Login](./screenshots/login.png)
*Premium authentication page with glassmorphism design*

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2 | UI Framework |
| **Vite** | 5.0 | Build Tool & Dev Server |
| **Tailwind CSS** | 3.4 | Styling & Design System |
| **Framer Motion** | 10.18 | Animations & Transitions |
| **Recharts** | 2.10 | Data Visualization |
| **React Router** | 6.21 | Client-side Routing |
| **Axios** | 1.6 | HTTP Client |
| **React Icons** | 5.0 | Icon Library |
| **date-fns** | 3.2 | Date Formatting |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime Environment |
| **Express** | 4.18 | Web Framework |
| **MongoDB** | 8.0 | Database |
| **Mongoose** | 8.0 | ODM for MongoDB |
| **JWT** | 9.0 | Authentication Tokens |
| **bcryptjs** | 2.4 | Password Hashing |
| **Express Validator** | 7.0 | Input Validation |
| **Helmet** | 7.1 | Security Headers |
| **CORS** | 2.8 | Cross-Origin Resource Sharing |
| **Rate Limiter** | 7.1 | Request Rate Limiting |

### DevOps & Deployment
- **Railway** - Cloud hosting platform
- **MongoDB Atlas** - Cloud database service
- **GitHub** - Version control & CI/CD

---

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org)
- **npm** or **yarn** - Package manager
- **MongoDB** - Local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- **Git** - Version control

### Step-by-Step Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/taskflow.git
cd taskflow
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# See Environment Variables section below
```

#### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
```

#### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs at: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs at: `http://localhost:5173`

#### 5. Access the Application

Open your browser and navigate to:
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## ⚙️ Environment Variables

### Backend Configuration (`backend/.env`)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `5000` |
| `MONGODB_URI` | MongoDB connection string | **Yes** | `mongodb://localhost:27017/taskflow` |
| `JWT_SECRET` | Secret key for JWT tokens | **Yes** | `your-super-secret-key` |
| `JWT_EXPIRE` | Token expiration time | No | `7d` |
| `NODE_ENV` | Environment mode | No | `development` |
| `CORS_ORIGIN` | Frontend URL for CORS | No | `http://localhost:5173` |
| `RATE_LIMIT_WINDOW` | Rate limit window (minutes) | No | `15` |
| `RATE_LIMIT_MAX` | Max requests per window | No | `100` |

### Frontend Configuration (`frontend/.env`)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | **Yes** | `http://localhost:5000/api` |
| `VITE_APP_NAME` | Application name | No | `TaskFlow` |

### Generate JWT Secret

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/signup` | Public | Register new user |
| POST | `/auth/login` | Public | Login user |

### Project Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/projects` | Admin | Create project |
| GET | `/projects` | All | Get all projects |
| GET | `/projects/:id` | All | Get project details |
| PUT | `/projects/:id` | Admin | Update project |
| DELETE | `/projects/:id` | Admin | Delete project |
| GET | `/projects/:id/stats` | All | Get project statistics |

### Task Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/tasks` | All | Create task |
| GET | `/tasks` | All | Get all tasks |
| GET | `/tasks/project/:projectId` | All | Get project tasks |
| PUT | `/tasks/:id` | All | Update task |
| DELETE | `/tasks/:id` | Admin | Delete task |

### Dashboard Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/dashboard/stats` | All | Get dashboard statistics |
| GET | `/dashboard/task-trends` | All | Get task trends (30 days) |
| GET | `/dashboard/activity` | All | Get team activity feed |
| GET | `/dashboard/deadlines` | All | Get upcoming deadlines |

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Example Request

```javascript
// Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'password123'
  })
});

const { token } = await response.json();

// Get projects
const projects = await fetch('http://localhost:5000/api/projects', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## 🚀 Deployment

### Deploy to Railway

#### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/taskflow.git
git push -u origin main
```

#### 2. Deploy Backend

1. Go to [Railway](https://railway.app) and sign in
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Set **Root Directory** to `backend`
5. Add **MongoDB** plugin or set `MONGODB_URI` to Atlas connection
6. Configure environment variables:
   ```
   JWT_SECRET=<your-secret-key>
   NODE_ENV=production
   CORS_ORIGIN=https://<frontend-url>
   ```
7. Deploy and note the backend URL

#### 3. Deploy Frontend

1. Add another service from the same repository
2. Set **Root Directory** to `frontend`
3. Set environment variables:
   ```
   VITE_API_URL=https://<backend-url>/api
   ```
4. Deploy and note the frontend URL

#### 4. Update CORS

Update the backend's `CORS_ORIGIN` environment variable to match your frontend Railway URL.

### Deploy to Other Platforms

- **Vercel**: Frontend only (connect to Railway backend)
- **Heroku**: Both frontend and backend
- **Render**: Both frontend and backend
- **DigitalOcean**: Full stack deployment

---

## 📂 Project Structure

```
taskflow/
├── 📁 backend/                 # Backend API
│   ├── 📁 src/
│   │   ├── 📁 config/          # Database configuration
│   │   ├── 📁 controllers/     # Route handlers
│   │   ├── 📁 middleware/      # Auth & role middleware
│   │   ├── 📁 models/          # Mongoose schemas
│   │   ├── 📁 routes/          # API routes
│   │   └── 📁 utils/           # Validators
│   └── server.js               # Entry point
│
├── 📁 frontend/                # Frontend React app
│   └── 📁 src/
│       ├── 📁 components/      # Reusable UI components
│       ├── 📁 context/         # React context (Auth)
│       ├── 📁 pages/           # Page components
│       └── 📁 services/        # API service
│
└── README.md                   # Project documentation
```

---

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Background** | `#0a0e1a` | Main background |
| **Primary (Purple)** | `#8b5cf6` | Primary actions, highlights |
| **Secondary (Cyan)** | `#06b6d4` | Secondary elements, in-progress |
| **Success (Green)** | `#10b981` | Completed tasks, success states |
| **Warning (Orange)** | `#f59e0b` | Pending tasks, warnings |
| **Danger (Red)** | `#ef4444` | Overdue tasks, errors |

### Glassmorphism Card

```css
background: rgba(17, 24, 39, 0.7);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 1rem;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React** - UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Charting library
- **MongoDB** - Database
- **Railway** - Hosting platform

---

## 📧 Contact

**Your Name** - [@yourtwitter](https://twitter.com/yourtwitter)  
**Project Link:** [https://github.com/yourusername/taskflow](https://github.com/yourusername/taskflow)

---

<div align="center">

**Made with ❤️ using React, Node.js, and MongoDB**

[⭐ Star this repo](https://github.com/yourusername/taskflow) • [🐛 Report Bug](https://github.com/yourusername/taskflow/issues) • [💡 Request Feature](https://github.com/yourusername/taskflow/issues)

</div>
