import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import roleDemoRoutes from './routes/roleDemoRoutes.js';
import learnerRoutes from './routes/learnerRoutes.js';
import instructorRoutes from './routes/instructorRoutes.js';

const app = express();

// Parse configured origins from CLIENT_URL (supports comma-separated list, strips trailing slashes)
const configuredOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  // Allow requests with no origin (like mobile apps, curl, or server-to-server)
  if (!origin) return true;
  const cleanOrigin = origin.replace(/\/$/, '');

  // 1. Matches configured CLIENT_URL list
  if (configuredOrigins.includes(cleanOrigin)) return true;

  // 2. Allow any localhost / 127.0.0.1 port
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(cleanOrigin)) return true;

  // 3. Allow Vercel deployments (production domain & branch preview URLs)
  if (/^https:\/\/([a-zA-Z0-9_-]+\.)*vercel\.app$/.test(cleanOrigin)) return true;

  // 4. Non-production fallback
  if (process.env.NODE_ENV !== 'production') return true;

  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    console.warn(`[CORS] Blocked request from origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'quantum-server',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Quantum Learning Platform Server API',
    authSystem: 'JWT + Argon2id + HttpOnly Cookies + Resend OTP + 4-Tier RBAC',
  });
});

// Auth and RBAC routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/learner', learnerRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api', roleDemoRoutes);

// Global 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Central error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal server error occurred.',
  });
});

export default app;
