require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');

const { generalLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const aiRoutes = require('./routes/aiRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Trust proxy for rate limiters behind Vercel load balancer
app.set('trust proxy', 1);

// ─── Security Middleware ─────────────────────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.CLIENT_URL,
        'http://localhost:5173',
        'http://localhost:5000'
      ].filter(Boolean);
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Request Logging ─────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── MongoDB Injection Sanitization ──────────────────────────────────────────
app.use(mongoSanitize());

// ─── Database Connection Middleware (for Serverless Environments) ────────────
const mongoose = require('mongoose');
const connectDB = require('./config/db');

app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (err) {
      console.error('❌ Database connection failed in middleware:', err);
      return next(err);
    }
  }
  next();
});

// ─── Global Rate Limiter ──────────────────────────────────────────────────────
app.use(generalLimiter);

// ─── Static File Serving ──────────────────────────────────────────────────────
const uploadDir = process.env.VERCEL ? '/tmp' : (process.env.UPLOAD_DIR || 'uploads');
if (!process.env.VERCEL && !fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (err) {
    console.warn('⚠️ Failed to create uploads directory on startup:', err.message);
  }
}

if (!process.env.STORAGE_PROVIDER || process.env.STORAGE_PROVIDER === 'local') {
  app.use('/uploads', express.static(path.resolve(process.cwd(), uploadDir)));
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/user', userRoutes);

// ─── Serve Frontend or API Message ─────────────────────────────────────────────
const fs = require('fs');
let clientDistPath = path.join(__dirname, '../../client/dist');
if (!fs.existsSync(clientDistPath)) {
  clientDistPath = path.join(__dirname, '../../public');
}
if (!fs.existsSync(clientDistPath)) {
  clientDistPath = path.join(__dirname, '../../dist');
}

// Handle favicon.ico requests (even if client/dist doesn't have it, to avoid 404)
app.get('/favicon.ico', (req, res) => {
  const faviconPath = path.join(clientDistPath, 'favicon.ico');
  if (fs.existsSync(faviconPath)) {
    return res.sendFile(faviconPath);
  }
  return res.status(204).end(); // Respond with 204 No Content to silence console errors
});

if (fs.existsSync(clientDistPath)) {
  // Serve static assets from the client/dist folder
  app.use(express.static(clientDistPath));
  
  // Serve index.html for any other non-API/non-upload routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Helpful route for local development when client/dist isn't built
  app.get('/', (req, res) => {
    res.status(200).json({
      message: "AI Travel Planner API is running. The frontend build is not found. If developing, please run the frontend server on http://localhost:5173",
      frontendDevUrl: "http://localhost:5173"
    });
  });
}

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use(notFound);

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
