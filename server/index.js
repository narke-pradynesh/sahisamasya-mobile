import express from 'express';
import cors from 'cors';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import helmet from 'helmet';
import { connectDB } from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import complaintRoutes from './routes/complaints.js';
import upvoteRoutes from './routes/upvotes.js';

const app = express();
const PORT = process.env.PORT || 3001;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;
const HOST = process.env.HOST || 'localhost';
const ENABLE_HTTPS = process.env.ENABLE_HTTPS === 'true' || process.env.NODE_ENV === 'production';

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-eval'"], // unsafe-eval needed for React dev
      connectSrc: ["'self'", "ws:", "wss:"], // WebSocket support for dev
    },
  },
  hsts: ENABLE_HTTPS ? {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  } : false,
}));

// Middleware
import { networkInterfaces } from 'os';

// Get local IP addresses
const getLocalIPs = () => {
  const nets = networkInterfaces();
  const ips = [];
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        ips.push(net.address);
      }
    }
  }
  return ips;
};

const localIPs = getLocalIPs();
const allowedOrigins = [
  // HTTP origins (for development)
  'http://localhost:5173',
  'http://localhost:5174', 
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  // HTTPS origins (for production and secure development)
  'https://localhost:5173',
  'https://localhost:5174', 
  'https://localhost:5175',
  'https://127.0.0.1:5173',
  'https://127.0.0.1:5174',
  'https://127.0.0.1:5175',
  ...localIPs.flatMap(ip => [
    `http://${ip}:5173`,
    `http://${ip}:5174`,
    `http://${ip}:5175`,
    `https://${ip}:5173`,
    `https://${ip}:5174`,
    `https://${ip}:5175`
  ]),
  process.env.FRONTEND_URL
].filter(Boolean);

console.log('Allowed CORS origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin matches allowed patterns
    const isAllowed = allowedOrigins.indexOf(origin) !== -1 || 
      // Allow any localhost or local IP with ports 5173-5180 (both HTTP and HTTPS)
      /^https?:\/\/(localhost|127\.0\.0\.1|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(517[3-9]|518[0])$/.test(origin);
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SahiSamasya API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/upvotes', upvoteRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// SSL Configuration
const getSSLOptions = () => {
  try {
    const certPath = path.join(process.cwd(), 'certs', 'cert.pem');
    const keyPath = path.join(process.cwd(), 'certs', 'key.pem');
    
    if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
      return {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      };
    }
  } catch (error) {
    console.warn('SSL certificates not found or invalid:', error.message);
  }
  return null;
};

// Force HTTPS redirect middleware (only in production)
if (ENABLE_HTTPS && process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

// Start server
const sslOptions = getSSLOptions();

if (ENABLE_HTTPS && sslOptions) {
  // Start HTTPS server
  const httpsServer = https.createServer(sslOptions, app);
  httpsServer.listen(HTTPS_PORT, HOST, () => {
    console.log(`🔒 HTTPS Server running on ${HOST}:${HTTPS_PORT}`);
    console.log(`📊 Health check: https://${HOST}:${HTTPS_PORT}/health`);
    console.log(`🔗 API Base URL: https://${HOST}:${HTTPS_PORT}/api`);
    
    if (HOST === '0.0.0.0') {
      console.log(`🌐 Network HTTPS access available at: https://10.136.212.130:${HTTPS_PORT}`);
    }
  });
  
  // Also start HTTP server for redirect (in production) or fallback (in development)
  const httpServer = http.createServer(app);
  httpServer.listen(PORT, HOST, () => {
    if (process.env.NODE_ENV === 'production') {
      console.log(`🔄 HTTP Server running on ${HOST}:${PORT} (redirecting to HTTPS)`);
    } else {
      console.log(`🚀 HTTP Server running on ${HOST}:${PORT} (fallback)`);
      console.log(`📊 HTTP Health check: http://${HOST}:${PORT}/health`);
      console.log(`🔗 HTTP API Base URL: http://${HOST}:${PORT}/api`);
    }
  });
} else {
  // Start HTTP server only
  const httpServer = http.createServer(app);
  httpServer.listen(PORT, HOST, () => {
    console.log(`🚀 HTTP Server running on ${HOST}:${PORT}`);
    console.log(`📊 Health check: http://${HOST}:${PORT}/health`);
    console.log(`🔗 API Base URL: http://${HOST}:${PORT}/api`);
    
    if (HOST === '0.0.0.0') {
      console.log(`🌐 Network access available at: http://10.136.212.130:${PORT}`);
    }
    
    if (!sslOptions) {
      console.log('⚠️  HTTPS disabled: SSL certificates not found. Run with ENABLE_HTTPS=true after setting up certificates.');
    }
  });
}
