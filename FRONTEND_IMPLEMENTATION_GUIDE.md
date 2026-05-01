# TaskFlow Frontend Implementation Guide

This guide provides ready-to-use code for completing the frontend. All components follow the premium dark SaaS design with glassmorphism, neon accents, and Framer Motion animations.

---

## 1. Login Page (`frontend/src/pages/Login.jsx`)

```jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiLoader } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-4"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <span className="text-white font-bold text-3xl">T</span>
            </motion.div>
            <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-text-secondary mt-2">Sign in to your TaskFlow account</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-xl mb-6"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-background-light border border-glass-border 
                    rounded-xl text-text-primary placeholder-text-muted input-focus"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-background-light border border-glass-border 
                    rounded-xl text-text-primary placeholder-text-muted input-focus"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-center text-text-secondary mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:text-primary-light font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
```

---

## 2. Stat Card Component (`frontend/src/components/ui/StatCard.jsx`)

```jsx
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses = {
    primary: 'from-primary to-primary-dark',
    secondary: 'from-secondary to-secondary-dark',
    success: 'from-success to-success-dark',
    warning: 'from-warning to-warning-dark',
    danger: 'from-danger to-danger-dark'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="glass-card p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-secondary text-sm font-medium">{title}</p>
          <motion.h3
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-3xl font-bold text-text-primary mt-2"
          >
            {value}
          </motion.h3>
          {trend && (
            <p className={`text-sm mt-2 ${trend > 0 ? 'text-success' : 'text-danger'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
```

---

## 3. Modal Component (`frontend/src/components/ui/Modal.jsx`)

```jsx
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between p-6 border-b border-glass-border">
                <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-background-lighter transition-colors"
                >
                  <FiX size={20} className="text-text-secondary" />
                </button>
              </div>
              <div className="p-6">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
```

---

## 4. Task Chart Component (`frontend/src/components/charts/TaskChart.jsx`)

```jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const TaskChart = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3">
          <p className="text-text-primary font-semibold">{payload[0].payload.date}</p>
          <p className="text-primary">Tasks: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold text-text-primary mb-4">Task Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="date" 
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af' }}
          />
          <YAxis 
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="tasks"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#06b6d4' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskChart;
```

---

## 5. Progress Chart Component (`frontend/src/components/charts/ProgressChart.jsx`)

```jsx
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const ProgressChart = ({ data }) => {
  const COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3">
          <p className="text-text-primary font-semibold">{payload[0].name}</p>
          <p className="text-text-secondary">Count: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold text-text-primary mb-4">Task Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ color: '#9ca3af' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
```

---

## 6. Activity Feed Widget (`frontend/src/components/widgets/ActivityFeed.jsx`)

```jsx
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const ActivityFeed = ({ activities }) => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold text-text-primary mb-4">Recent Activity</h3>
      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-3 p-3 rounded-xl hover:bg-background-light/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold">
                {activity.user?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-text-primary text-sm">
                <span className="font-semibold">{activity.user}</span>
                {' '}{activity.action}{' '}
                <span className="text-primary font-medium">{activity.taskTitle}</span>
              </p>
              <p className="text-text-secondary text-xs mt-1">{activity.projectName}</p>
              <p className="text-text-muted text-xs mt-1">
                {formatDistanceToNow(new Date(activity.timestamp))} ago
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
```

---

## 7. Protected Route Component (`frontend/src/components/ProtectedRoute.jsx`)

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

---

## 8. Main App Component (`frontend/src/App.jsx`)

```jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';

// Dashboard Layout Wrapper
const DashboardLayout = ({ children }) => (
  <div className="min-h-screen gradient-bg">
    <Sidebar />
    <div className="lg:ml-[260px] min-h-screen">
      <main className="p-6 lg:p-8">
        {children}
      </main>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Projects />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Tasks />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
```

---

## 9. Main Entry Point (`frontend/src/main.jsx`)

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 10. Dashboard Page (`frontend/src/pages/Dashboard.jsx`)

```jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import StatCard from '../components/ui/StatCard';
import TaskChart from '../components/charts/TaskChart';
import ProgressChart from '../components/charts/ProgressChart';
import ActivityFeed from '../components/widgets/ActivityFeed';
import { FiBriefcase, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/activity')
      ]);
      setStats(statsRes.data.data);
      setActivities(activityRes.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-1">Welcome back! Here's your project overview.</p>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={{
          container: { transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Projects"
          value={stats?.totalProjects || 0}
          icon={FiBriefcase}
          color="primary"
        />
        <StatCard
          title="Completed Tasks"
          value={stats?.completedTasks || 0}
          icon={FiCheckCircle}
          color="success"
        />
        <StatCard
          title="In Progress"
          value={stats?.inProgressTasks || 0}
          icon={FiClock}
          color="secondary"
        />
        <StatCard
          title="Overdue Tasks"
          value={stats?.overdueTasks || 0}
          icon={FiAlertCircle}
          color="danger"
        />
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskChart data={[]} /> {/* Pass actual trend data */}
        <ProgressChart data={[]} /> {/* Pass actual distribution data */}
      </div>

      {/* Activity Feed */}
      <ActivityFeed activities={activities} />
    </motion.div>
  );
};

export default Dashboard;
```

---

## Quick Implementation Checklist

1. ✅ Create `Login.jsx` and `Signup.jsx` in `frontend/src/pages/`
2. ✅ Create UI components in `frontend/src/components/ui/`
3. ✅ Create chart components in `frontend/src/components/charts/`
4. ✅ Create widget components in `frontend/src/components/widgets/`
5. ✅ Create `ProtectedRoute.jsx` in `frontend/src/components/`
6. ✅ Update `App.jsx` with routing
7. ✅ Update `main.jsx` entry point
8. ✅ Create placeholder pages for Dashboard, Projects, Tasks

## Running the App

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

Visit: http://localhost:5173

---

**All components use the premium dark theme with glassmorphism, neon accents, and smooth Framer Motion animations!**
