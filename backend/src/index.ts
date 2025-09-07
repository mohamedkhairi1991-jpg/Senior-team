import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { Server } from 'http';
import path from 'path';
// Import pino-http using require to avoid TypeScript issues
const pino = require('pino-http')();

// Import routes
import authRoutes from './routes/auth';
import patientRoutes from './routes/patients';

// Initialize express app
const app = express();
// Track server start time for uptime calculations
const startTime = Date.now();

// Define allowed origins
const allowedOrigins = [
  "http://localhost:5173", // Local development frontend (default Vite port)
  "http://localhost:5000", // Local development frontend (custom port)
  /\.app\.github\.dev$/ // GitHub Codespaces preview URLs
];

// Middleware
// Apply security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));
app.use(cors({
  origin: true, // Allow all origins for development
  credentials: true
}));
app.use(pino);
app.use(express.json());

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: '✅ Hospital Coordination Backend is running!',
    endpoints: {
      health: '/healthz',
      auth: '/auth',
      patients: '/patients'
    }
  });
});

// Health check endpoint
app.get('/healthz', (req: Request, res: Response) => {
  // Calculate uptime based on our startTime variable
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  res.status(200).json({
    status: 'ok',
    uptime,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.2.1'
  });
});

// Mount routes
app.use('/auth', authRoutes);
app.use('/patients', patientRoutes);

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../web/dist');
  app.use(express.static(frontendPath));
  
  // Handle React Router (return index.html for all routes)
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Centralized error handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
  });
});

// Load environment variables (if not already loaded elsewhere)
if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config();
  } catch (err) {
    console.warn('Failed to load .env file, using default environment variables');
  }
}

// Server setup
const PORT = process.env.PORT || 3001;
let server: Server;

const startServer = () => {
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server?.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Start server
startServer();

export default app;
