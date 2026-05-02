const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const teamRoutes = require('./routes/teamRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

const buildAllowedOrigins = () => {
  const set = new Set([
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
  ]);

  const append = (value) => {
    if (!value || typeof value !== 'string') return;
    value
      .split(',')
      .map((s) => s.trim().replace(/\/$/, ''))
      .filter(Boolean)
      .forEach((o) => set.add(o));
  };

  append(process.env.CORS_ORIGIN);
  append(process.env.FRONTEND_URL);

  return set;
};

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  const allowed = buildAllowedOrigins();
  if (allowed.has(origin)) return true;

  // Railway frontend + API are different subdomains (cross-origin). Allow
  // HTTPS Railway app URLs in production unless explicitly disabled.
  if (process.env.CORS_STRICT === 'true') return false;
  if (process.env.NODE_ENV === 'production') {
    try {
      const { hostname, protocol } = new URL(origin);
      if (protocol === 'https:' && hostname.endsWith('.up.railway.app')) {
        return true;
      }
    } catch {
      return false;
    }
  }

  return false;
};

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (isOriginAllowed(origin)) return callback(null, true);
    console.warn('CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

/* ---------------- SECURITY ---------------- */
app.use(helmet());

/* ---------------- BODY PARSER ---------------- */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ---------------- CORS (before routes; supports preflight + cookies) ---------------- */
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

/* ---------------- RATE LIMIT ---------------- */
const isDev = process.env.NODE_ENV !== 'production';

const authLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: isDev ? 1000 : Number(process.env.RATE_LIMIT_MAX || 100),
  skip: (req) =>
    req.path.includes('/me') || req.path.includes('/logout'),
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
});

app.use('/api/auth', authLimiter);

/* ---------------- ROUTES ---------------- */
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

/* ---------------- HEALTH CHECK ---------------- */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TaskFlow API is running',
    timestamp: new Date().toISOString(),
  });
});

/* ---------------- 404 ---------------- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

/* ---------------- GLOBAL ERROR HANDLER ---------------- */
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err);

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ success: false, message: 'CORS policy blocked this origin' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate entry',
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access',
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

module.exports = app;
