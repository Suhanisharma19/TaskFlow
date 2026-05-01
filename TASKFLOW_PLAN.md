# TaskFlow - Premium SaaS Project Management Platform

## Project Structure

```
ethira_ai/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js    # Login/signup logic
│   │   │   ├── projectController.js # CRUD operations
│   │   │   ├── taskController.js    # Task management
│   │   │   └── dashboardController.js # Dashboard analytics
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js    # JWT verification
│   │   │   └── roleMiddleware.js    # Role-based access
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   ├── Project.js           # Project schema
│   │   │   └── Task.js              # Task schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   └── dashboardRoutes.js
│   │   ├── utils/
│   │   │   └── validators.js        # Reusable validation rules
│   │   └── app.js                   # Express app setup
│   ├── .env.example
│   ├── package.json
│   └── server.js                    # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx      # Premium sidebar navigation
│   │   │   │   ├── TopBar.jsx       # Search bar + user menu
│   │   │   │   └── DashboardLayout.jsx # Main layout wrapper
│   │   │   ├── ui/
│   │   │   │   ├── StatCard.jsx     # Glassmorphism stat cards
│   │   │   │   ├── TaskCard.jsx     # Task display with animations
│   │   │   │   ├── ProjectCard.jsx  # Project card with progress
│   │   │   │   ├── Modal.jsx        # Reusable modal
│   │   │   │   ├── Button.jsx       # Premium button variants
│   │   │   │   └── Input.jsx        # Styled form inputs
│   │   │   ├── charts/
│   │   │   │   ├── TaskChart.jsx    # Recharts visualization
│   │   │   │   └── ProgressChart.jsx # Project progress pie
│   │   │   ├── widgets/
│   │   │   │   ├── CalendarWidget.jsx # Mini calendar
│   │   │   │   ├── ActivityFeed.jsx  # Team activity log
│   │   │   │   └── DeadlinesWidget.jsx # Upcoming deadlines
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state management
│   │   ├── pages/
│   │   │   ├── Login.jsx            # Dark-themed auth page
│   │   │   ├── Signup.jsx           # Premium signup form
│   │   │   ├── Dashboard.jsx        # Main dashboard with charts
│   │   │   ├── Projects.jsx         # Project grid/list view
│   │   │   ├── ProjectDetails.jsx   # Project analytics + tasks
│   │   │   └── Tasks.jsx            # Task management board
│   │   ├── services/
│   │   │   └── api.js               # Axios instance
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css                # Tailwind + custom styles
│   ├── public/
│   │   └── logo.svg
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## Implementation Steps

### Phase 1: Backend Setup

**1. Initialize Backend**
- Create `backend/package.json` with dependencies: express, mongoose, jsonwebtoken, bcryptjs, dotenv, cors, express-validator
- Create `backend/server.js` entry point with production error handling
- Set up environment variables in `.env.example`
- Add nodemon for development

**2. Database Configuration**
- File: `backend/src/config/database.js`
- MongoDB connection with error handling
- Connection pooling for production
- Graceful shutdown on app termination

**3. User Model & Authentication**
- File: `backend/src/models/User.js`
  - Fields: name, email, password (hashed), role (enum: 'admin', 'member'), avatar (optional)
  - Pre-save hook for password hashing with bcrypt (salt rounds: 12)
  - Method to compare passwords
  - Exclude password from JSON responses
  
- File: `backend/src/controllers/authController.js`
  - `signup`: Validate input, hash password, create user, return JWT
  - `login`: Validate credentials, generate JWT token
  - JWT payload: userId, email, role, name
  - Token expiry: 7 days
  - Return user data (without password) on successful auth
  
- File: `backend/src/routes/authRoutes.js`
  - POST `/api/auth/signup`
  - POST `/api/auth/login`

**4. Middleware**
- File: `backend/src/middleware/authMiddleware.js`
  - Extract JWT from Authorization header (Bearer token)
  - Verify token and attach user to req.user
  - Return 401 if invalid/missing token
  - Handle token expiration gracefully
  
- File: `backend/src/middleware/roleMiddleware.js`
  - `requireAdmin`: Check if user.role === 'admin'
  - `requireMember`: Check if user.role === 'admin' OR 'member'
  - Return 403 if insufficient permissions

**5. Project Management**
- File: `backend/src/models/Project.js`
  - Fields: name, description, deadline, teamMembers (array of userIds), createdBy (userId), status (active, completed, on-hold)
  - Timestamps enabled
  - Virtual for progress calculation based on tasks
  - Populate team members on query
  
- File: `backend/src/controllers/projectController.js`
  - `createProject`: Admin only, validate input, save project
  - `getAllProjects`: Admin sees all, members see assigned projects
  - `getProjectById`: Fetch with populated team members and task count
  - `updateProject`: Admin only
  - `deleteProject`: Admin only, cascade delete tasks
  - `getProjectStats`: Tasks by status, completion percentage
  
- File: `backend/src/routes/projectRoutes.js`
  - POST `/api/projects` (admin)
  - GET `/api/projects`
  - GET `/api/projects/:id`
  - PUT `/api/projects/:id` (admin)
  - DELETE `/api/projects/:id` (admin)
  - GET `/api/projects/:id/stats`

**6. Task Management**
- File: `backend/src/models/Task.js`
  - Fields: title, description, priority (enum: 'low', 'medium', 'high'), dueDate, assignedTo (userId), status (enum: 'pending', 'in-progress', 'completed'), project (projectId), createdBy (userId)
  - Timestamps enabled
  - Virtual for checking if overdue
  - Index on project, assignedTo, status for query performance
  
- File: `backend/src/controllers/taskController.js`
  - `createTask`: Validate, assign to member, link to project
  - `getTasksByProject`: Filter by project, populate assigned user
  - `updateTask`: Update status, reassign, log activity
  - `deleteTask`: Remove task
  - `getAllTasks`: With filters (status, priority, assignee)
  
- File: `backend/src/routes/taskRoutes.js`
  - POST `/api/tasks`
  - GET `/api/tasks`
  - GET `/api/tasks/project/:projectId`
  - PUT `/api/tasks/:id`
  - DELETE `/api/tasks/:id` (admin only)

**7. Dashboard Analytics**
- File: `backend/src/controllers/dashboardController.js`
  - `getDashboardStats`: Total projects, tasks by status, overdue count
  - `getTaskTrends`: Task completion trends over last 30 days (aggregation)
  - `getTeamActivity`: Recent activity log (last 20 events)
  - `getUpcomingDeadlines`: Tasks due in next 7 days
  
- File: `backend/src/routes/dashboardRoutes.js`
  - GET `/api/dashboard/stats`
  - GET `/api/dashboard/task-trends`
  - GET `/api/dashboard/activity`
  - GET `/api/dashboard/deadlines`

**8. Validation Utilities**
- File: `backend/src/utils/validators.js`
  - Reusable express-validator chains
  - Email validation, password strength (min 8 chars)
  - Required field validators
  - Custom validators for dates, priorities, status values
  - Sanitization to prevent XSS

**9. App Setup**
- File: `backend/src/app.js`
  - Configure CORS with production domains
  - JSON parsing with size limits (10mb)
  - Rate limiting for auth endpoints (100 requests per 15 min)
  - Mount routes with /api prefix
  - Global error handler
  - Validation error middleware
  - 404 handler for undefined routes
  - Helmet for security headers

### Phase 2: Frontend Setup

**1. Initialize Frontend**
- Create Vite + React app with `frontend/package.json`
- Install: react-router-dom, axios, framer-motion, recharts, react-icons
- Configure Tailwind CSS in `tailwind.config.js` with custom theme
- Set up `vite.config.js` with proxy for API calls
- Configure PostCSS in `postcss.config.js`

**2. API Service**
- File: `frontend/src/services/api.js`
  - Axios instance with base URL from env
  - Request interceptor: Attach JWT token from localStorage
  - Response interceptor: Handle 401 (redirect to login), 403 (forbidden)
  - Error handling with user-friendly messages

**3. Authentication Context**
- File: `frontend/src/context/AuthContext.jsx`
  - Store user data and token
  - Provide login/logout functions
  - Check authentication on app load
  - Persist auth state across sessions
  - Loading state during auth check

**4. Protected Routes**
- File: `frontend/src/components/ProtectedRoute.jsx`
  - Redirect to login if not authenticated
  - Check role for admin-only routes
  - Show loading spinner while checking auth

**5. Layout Components**
- File: `frontend/src/components/layout/Sidebar.jsx`
  - Premium dark sidebar with glassmorphism effect
  - Logo and brand name "TaskFlow"
  - Navigation links with icons: Dashboard, Projects, Tasks
  - Active state highlighting with neon accent (purple glow)
  - Collapse/expand functionality
  - Smooth framer-motion animations
  - User profile section at bottom with avatar
  
- File: `frontend/src/components/layout/TopBar.jsx`
  - Search bar with focus animation and debounce
  - Notification bell icon with badge
  - User dropdown menu (profile, logout)
  - Breadcrumbs for current page
  - Mobile hamburger menu toggle
  - Glassmorphism background
  
- File: `frontend/src/components/layout/DashboardLayout.jsx`
  - Main layout wrapper with sidebar + topbar + content
  - Responsive grid structure
  - Dark gradient background
  - Page transition animations

**6. UI Components**
- File: `frontend/src/components/ui/StatCard.jsx`
  - Glassmorphism card with gradient borders
  - Icon, title, value, trend indicator
  - Hover animation with framer-motion (scale + glow)
  - Neon accent colors (purple, cyan, orange, pink)
  - Animated counter on load
  
- File: `frontend/src/components/ui/TaskCard.jsx`
  - Task display with priority color coding
  - Status badge with animations
  - Assignee avatar
  - Due date with overdue warning (red highlight)
  - Quick actions (edit, delete for admin)
  - Hover effects with smooth transitions
  
- File: `frontend/src/components/ui/ProjectCard.jsx`
  - Project overview card
  - Progress bar with percentage (animated)
  - Team member avatars (stacked)
  - Deadline countdown
  - Hover effects and smooth transitions
  - Click to navigate to details
  
- File: `frontend/src/components/ui/Modal.jsx`
  - Backdrop blur effect
  - Animated open/close with framer-motion
  - Close on backdrop click or ESC key
  - Form content wrapper
  - Prevent body scroll when open
  
- File: `frontend/src/components/ui/Button.jsx`
  - Variants: primary (purple gradient), secondary, danger, ghost
  - Sizes: sm, md, lg
  - Loading state with spinner
  - Hover animations (brightness + translateY)
  - Disabled state styling
  
- File: `frontend/src/components/ui/Input.jsx`
  - Dark-themed input fields
  - Label, error message support
  - Focus ring with neon purple accent
  - Icon support (left/right)
  - Validation states (error/success borders)

**7. Chart Components**
- File: `frontend/src/components/charts/TaskChart.jsx`
  - Recharts line/bar chart for task trends (last 30 days)
  - Dark theme styling with custom colors
  - Custom tooltips with glassmorphism
  - Animated data loading
  - Responsive container
  
- File: `frontend/src/components/charts/ProgressChart.jsx`
  - Recharts pie/donut chart for task status distribution
  - Color-coded segments (purple, cyan, orange, green)
  - Center label with total count
  - Responsive sizing
  - Legend with hover effects

**8. Widget Components**
- File: `frontend/src/components/widgets/CalendarWidget.jsx`
  - Mini calendar showing current month
  - Highlight dates with deadlines (dot indicators)
  - Navigate between months
  - Click date to see tasks for that day
  - Glassmorphism styling
  
- File: `frontend/src/components/widgets/ActivityFeed.jsx`
  - Recent activity log (last 20 events)
  - Activity items: "Task X completed", "Project Y created"
  - Timestamps (e.g., "2 hours ago")
  - User avatars
  - Scrollable container with custom scrollbar
  - Auto-refresh every 60 seconds
  
- File: `frontend/src/components/widgets/DeadlinesWidget.jsx`
  - Upcoming deadlines (next 7 days)
  - Task name, project name, due date
  - Overdue highlighting with red accent
  - Quick view link to task
  - Empty state message

**9. Authentication Pages**
- File: `frontend/src/pages/Login.jsx`
  - Premium dark-themed login page with gradient background
  - Centered card with glassmorphism
  - Animated TaskFlow logo/brand
  - Form: email, password
  - Validation: required fields, email format
  - Error/success messages with framer-motion
  - "Remember me" checkbox
  - Link to signup page
  - On success: store token, redirect to dashboard
  - Subtle animated background pattern
  
- File: `frontend/src/pages/Signup.jsx`
  - Dark-themed signup form matching login style
  - Form: name, email, password, confirm password, role
  - Validation: password match, min length 8, strength indicator
  - Password strength meter (weak/medium/strong)
  - Role selection dropdown (default: 'member')
  - Terms and conditions checkbox
  - Link to login page
  - Gradient background with animated elements

**10. Dashboard**
- File: `frontend/src/pages/Dashboard.jsx`
  - Premium dark dashboard layout
  - Stat cards row (4 cards): 
    - Total Projects (purple accent)
    - Completed Tasks (green accent)
    - In Progress (cyan accent)
    - Overdue Tasks (red accent)
    - Each with animated counters on load
  - Charts section:
    - Task trends line chart (last 30 days)
    - Task status distribution pie chart
  - Widgets row:
    - Calendar widget (left, 33%)
    - Activity feed (center, 33%)
    - Upcoming deadlines (right, 33%)
  - Framer-motion stagger animations on load (delay 0.1s per item)
  - Responsive grid layout (stack on mobile)
  - Loading states with skeleton cards
  - Error state with retry button

**11. Project Management**
- File: `frontend/src/pages/Projects.jsx`
  - Grid of ProjectCard components (3 columns on desktop)
  - Admin: "Create Project" button with purple gradient
  - Modal form for create/edit project with validation
  - Admin: Edit/Delete buttons on each project (hover reveal)
  - Members: View only assigned projects
  - Filter/search projects by name, status
  - Sort by deadline, name, progress
  - Empty state with illustration and CTA
  - Loading skeleton grid
  - Pagination or infinite scroll
  
- File: `frontend/src/pages/ProjectDetails.jsx`
  - Project header with name, description, deadline, status badge
  - Progress bar with completion percentage
  - Team members section with avatars and names
  - Task list for this project (filterable)
  - Admin: Edit project details button
  - Task creation button (admin)
  - Analytics mini-section: tasks by status, completion rate
  - Back button to projects list

**12. Task Management**
- File: `frontend/src/pages/Tasks.jsx`
  - List view with TaskCard components
  - Filter by project, status, priority, assignee
  - Search tasks by title/description
  - Status badges: Pending (orange), In Progress (cyan), Completed (green)
  - Priority indicators: High (red), Medium (yellow), Low (blue)
  - Admin/Assignee: Update status dropdown inline
  - Admin: Create task modal form
  - Bulk actions for admin (select multiple, update status)
  - Empty state with CTA to create task
  - Sort by due date, priority, status
  - Overdue tasks highlighted with red border

**13. App Routing & Configuration**
- File: `frontend/src/App.jsx`
  - Define routes:
    - `/login`, `/signup` (public, redirect if authenticated)
    - `/dashboard` (protected)
    - `/projects` (protected)
    - `/projects/:id` (protected)
    - `/tasks` (protected)
  - Wrap protected routes with ProtectedRoute
  - Animate page transitions with framer-motion
  - Scroll to top on route change
  
- File: `frontend/src/main.jsx`
  - React 18 createRoot
  - BrowserRouter wrapper
  - AuthContext provider
  - StrictMode enabled

### Phase 3: Premium Dark Theme Design

**Color Palette Configuration in Tailwind**
```javascript
colors: {
  background: '#0a0e1a',
  card: 'rgba(17, 24, 39, 0.7)',
  primary: '#8b5cf6',    // Purple neon
  secondary: '#06b6d4',  // Cyan neon
  success: '#10b981',    // Green
  warning: '#f59e0b',    // Orange
  danger: '#ef4444',     // Red/Pink neon
  text: {
    primary: '#f9fafb',
    secondary: '#9ca3af',
    disabled: '#6b7280'
  }
}
```

**Glassmorphism Effect**
```css
background: rgba(17, 24, 39, 0.7);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.1);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
border-radius: 1rem; (rounded-2xl)
```

**Gradient Backgrounds**
- Main background: linear-gradient(135deg, #0a0e1a 0%, #1a1f3a 100%)
- Card hover: subtle gradient shift
- Buttons: linear-gradient(90deg, #8b5cf6, #06b6d4)
- Accent gradients for various UI elements

**Typography**
- Font family: Inter, system-ui, sans-serif
- Heading sizes: text-xl, text-2xl, text-3xl, text-4xl
- Font weights: font-normal (400), font-medium (500), font-semibold (600), font-bold (700)
- Letter spacing for headings: tracking-tight

**Framer Motion Animations**
- Page entrance: fade in + slide up (duration: 0.4s, ease: easeOut)
- Stagger children: delay 0.1s between items
- Modal: scale from 0.9 to 1.0 + opacity 0 to 1
- Hover on cards: scale 1.02 with spring physics
- Button hover: brightness(1.1) + translateY(-2px)
- Counter animation: animate number from 0 to target value
- Loading spinners: rotate with pulse effect
- Dropdown menus: slide down + fade in

**Responsive Design**
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Sidebar: full width on desktop, icon-only on tablet, hidden (hamburger) on mobile
- Stack cards on mobile (1 column), 2 columns on tablet, 3-4 on desktop
- Touch-friendly tap targets (min 44px)
- Hide non-essential elements on mobile

### Phase 4: Advanced Features & Interactions

**Search Functionality**
- Top bar search: debounce input (300ms), search projects and tasks
- Filter sidebar on projects/tasks pages
- Real-time search results with highlighting
- Clear search button

**Form Handling**
- Controlled components with useState
- Real-time validation on blur/change
- Error messages below inputs (red text)
- Submit button disabled when form invalid
- Loading state during submission (spinner + disabled)
- Success/error toast notifications
- Reset form on successful submission

**Toast Notification System**
- Create toast utility with context
- Variants: Success (green), Error (red), Warning (orange), Info (cyan)
- Auto-dismiss after 3 seconds
- Stack multiple toasts (max 3 visible)
- Positioned top-right with slide-in animation
- Manual dismiss button on each toast

**Loading States**
- Skeleton loaders for cards/lists (animated shimmer effect)
- Spinner for buttons during submission
- Page load transitions with fade
- Optimistic UI updates where appropriate (task status change)

### Phase 5: Validation & Error Handling

**Backend Validation**
- Use express-validator for all routes with reusable validators
- Validate: email format, password strength (min 8 chars, 1 uppercase, 1 special char)
- Check if email already exists on signup
- Verify project/task exists before update/delete
- Validate user permissions before operations
- Sanitize inputs to prevent XSS/injection
- Return structured error responses with field-level errors:
  ```json
  {
    "success": false,
    "errors": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
  ```

**Frontend Validation**
- Real-time form validation on blur/change
- Display error messages from API with field highlighting (red border)
- Handle network errors gracefully with user-friendly messages
- Show loading states during API calls
- Prevent duplicate submissions (disable button)
- Confirm dialogs for destructive actions (delete project/task)

**Error Boundaries**
- React ErrorBoundary component for graceful fallback
- Display error message with retry button
- Log errors to console in development

### Phase 6: Environment Configuration

**Backend `.env.example`**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

**Frontend `.env.example`**
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=TaskFlow
```

### Phase 7: Railway Deployment Configuration

**Backend `backend/package.json` scripts**
- `"start": "node server.js"` for production
- `"dev": "nodemon server.js"` for development
- Add `engines` field: `"node": ">=18.0.0"`

**Frontend `frontend/vite.config.js`**
- Configure build output directory (dist)
- Set up production API URL from env
- Optimize bundle size (code splitting)
- Configure preview server for testing production build

**Railway Configuration**
- Create `railway.json` for backend service auto-detection
- Document deployment steps in README
- Separate services for frontend and backend

**CORS & Security for Production**
- Update CORS to allow Railway frontend domain
- Helmet middleware for secure headers
- Rate limiting for production (adjust limits)
- HTTPS enforcement in production

### Phase 8: Testing & Polish

**API Testing**
- Test all endpoints with Postman/Insomnia
- Verify authentication flow (signup, login, token refresh)
- Test role-based access control (admin vs member permissions)
- Test validation error responses
- Verify error handling for edge cases (invalid IDs, missing fields)
- Test concurrent requests

**UI Testing**
- Test responsive design on multiple screen sizes (mobile 375px, tablet 768px, desktop 1280px+)
- Verify all animations work smoothly (60fps)
- Check color contrast for accessibility (WCAG AA)
- Test all form validations (valid and invalid inputs)
- Verify modal open/close behavior (ESC, backdrop click)
- Test navigation and routing (back button, deep links)
- Test on multiple browsers (Chrome, Firefox, Safari, Edge)

**Performance Optimization**
- Lazy load route components with React.lazy()
- Optimize images and assets (SVG for icons)
- Minimize bundle size (tree shaking, code splitting)
- Add loading states for better UX
- Implement pagination for large datasets (projects, tasks)
- Memoize expensive computations (useMemo, useCallback)

**Final Polish**
- Add comments explaining setup and configuration
- Verify all environment variables documented
- Test deployment locally with production build
- Ensure all console.log removed from production
- Add favicon and meta tags (title, description, OG tags)
- Verify all links work
- Test on real mobile devices

## Design System & Visual Guidelines

### Color Palette
```
Background: #0a0e1a (deep navy/black)
Card Background: rgba(17, 24, 39, 0.7) with backdrop blur

Accent Colors (Neon):
- Purple: #8b5cf6 (primary actions, highlights, active states)
- Cyan: #06b6d4 (secondary, in-progress status, info)
- Orange: #f59e0b (warnings, pending status)
- Pink/Red: #ef4444 (danger, overdue, high priority, errors)
- Green: #10b981 (success, completed status, confirmations)

Text:
- Primary: #f9fafb (near white, headings, important text)
- Secondary: #9ca3af (muted gray, descriptions, labels)
- Disabled: #6b7280 (inactive elements)

Borders:
- Default: rgba(255, 255, 255, 0.1)
- Focus: rgba(139, 92, 246, 0.5) (purple glow)
- Error: rgba(239, 68, 68, 0.5) (red glow)
```

### Glassmorphism Card Style
```css
background: rgba(17, 24, 39, 0.7);
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 1rem;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
```

### Hover Animations
- Cards: scale(1.02) with increased shadow (box-shadow: 0 12px 48px rgba(139, 92, 246, 0.2))
- Buttons: brightness(1.1) + translateY(-2px)
- Links: color transition to accent color (purple)
- Icons: rotate(5deg) or scale(1.1) on hover
- Input focus: border-color change + glow effect

### Framer Motion Patterns
- Page entrance: 
  ```javascript
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
  ```
- Stagger children: 
  ```javascript
  variants={{
    container: { transition: { staggerChildren: 0.1 } }
  }}
  ```
- Modal: 
  ```javascript
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.9, opacity: 0 }}
  ```
- Hover: 
  ```javascript
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  ```

## Key Implementation Details

### JWT Authentication Flow
1. User signs up → password hashed (bcrypt, 12 rounds) → user created → JWT returned
2. User logs in → password verified → JWT returned with user data
3. Frontend stores JWT in localStorage with user info
4. Every API request includes `Authorization: Bearer <token>` header
5. Backend middleware verifies token, attaches user to req.user
6. Token expiry: 7 days (configurable via env)
7. Logout: Clear localStorage, redirect to login

### Role-Based Access Control
- **Admin**: Full access
  - Create/edit/delete projects
  - Create/edit/delete tasks
  - View all projects and tasks
  - Access dashboard analytics
  - Manage team members
  
- **Member**: Limited access
  - View assigned projects only
  - View assigned tasks
  - Update task status (own tasks)
  - View dashboard (own stats only)
  - Cannot delete or create projects/tasks

### Task Status Workflow
- Pending → In Progress → Completed
- Status changes logged in activity feed
- Overdue detection: dueDate < currentDate AND status !== 'completed'
- Overdue tasks highlighted in red across UI

### Dashboard Analytics Calculation
- Total projects: Count all projects (admin) or assigned (member)
- Total tasks: Count all accessible tasks
- Completed: status === 'completed'
- In Progress: status === 'in-progress'
- Overdue: dueDate < now AND status !== 'completed'
- Task trends: Group tasks by creation/completion date (last 30 days) using MongoDB aggregation
- Activity feed: Recent task/project updates with timestamps (last 20 events)
- Upcoming deadlines: Tasks due in next 7 days, sorted by due date

### Database Indexing Strategy
- Users: email (unique)
- Projects: createdBy, teamMembers
- Tasks: project, assignedTo, status, dueDate
- Compound indexes for common queries (project + status, assignedTo + status)

## Setup Instructions (for README)

### Prerequisites
- Node.js v18+ installed
- MongoDB installed locally or MongoDB Atlas account
- npm or yarn package manager
- Git for version control

### Local Development Setup

1. Clone repository
   ```bash
   git clone <repo-url>
   cd ethira_ai
   ```

2. Backend setup:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm run dev
   ```
   Backend runs at `http://localhost:5000`

3. Frontend setup (new terminal):
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```
   Frontend runs at `http://localhost:5173`

4. Access app at `http://localhost:5173`
5. Create first admin user via signup
6. Start managing projects and tasks!

### Environment Variables

**Backend (.env)**
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string (local or Atlas)
- `JWT_SECRET`: Secret key for JWT tokens (change in production!)
- `JWT_EXPIRE`: Token expiry time (default: 7d)
- `NODE_ENV`: development or production
- `CORS_ORIGIN`: Frontend URL for CORS (default: http://localhost:5173)
- `RATE_LIMIT_WINDOW`: Rate limit window in minutes (default: 15)
- `RATE_LIMIT_MAX`: Max requests per window (default: 100)

**Frontend (.env)**
- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api)
- `VITE_APP_NAME`: App display name (default: TaskFlow)

## Production Deployment on Railway

### Backend Deployment
1. Push code to GitHub repository
2. Go to Railway dashboard (railway.app) and create new project
3. Add service from GitHub repo, select `/backend` directory
4. Add MongoDB plugin or set `MONGODB_URI` to MongoDB Atlas connection string
5. Set environment variables in Railway dashboard:
   - `JWT_SECRET` (use a strong random string, e.g., from `openssl rand -base64 32`)
   - `NODE_ENV=production`
   - `CORS_ORIGIN=<frontend-railway-url>`
   - `MONGODB_URI` (if not using Railway MongoDB plugin)
6. Deploy and note the Railway backend URL

### Frontend Deployment
1. Add another service from same repo, select `/frontend` directory
2. Set environment variable:
   - `VITE_API_URL=<backend-railway-url>/api`
3. Deploy and note the Railway frontend URL
4. Update backend `CORS_ORIGIN` to match frontend URL

### Post-Deployment Checklist
1. Test signup/login flow on production
2. Verify all API endpoints work (test with browser dev tools)
3. Check CORS configuration (no console errors)
4. Test on mobile devices
5. Monitor logs in Railway dashboard for errors
6. Test role-based access control
7. Verify environment variables are set correctly
8. Check that JWT_SECRET is strong and unique
9. Test database connection and queries
10. Verify all features work as expected

## File Count Estimate
- Backend: ~20 files
- Frontend: ~35 files
- Total: ~55 files
- Lines of code: ~8,000-10,000

## Technical Highlights
- Modern React 18 with hooks and context API for state management
- Framer Motion for smooth, professional animations and transitions
- Recharts for interactive data visualization (task trends, status distribution)
- Glassmorphism and neon design trends for premium SaaS aesthetic
- JWT-based stateless authentication with secure password hashing
- Role-based authorization middleware for access control
- MongoDB aggregation pipelines for analytics and insights
- Express validator for robust input validation and sanitization
- Responsive design with mobile-first approach and Tailwind CSS
- Production-ready error handling and logging
- Environment-based configuration for dev/prod parity
- Railway deployment ready with optimized build configuration
- Code splitting and lazy loading for optimal performance
- Accessible UI components with proper ARIA attributes
