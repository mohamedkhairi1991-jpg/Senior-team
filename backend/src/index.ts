import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { Server } from 'http';
// Import pino-http using require to avoid TypeScript issues
const pino = require('pino-http')();

// Import routes
import authRoutes from './routes/auth';
import patientRoutes from './routes/patients';

// Initialize express app
const app = express();
const startTime = Date.now();

// Middleware
app.use(helmet());
app.use(cors());
app.use(pino);
app.use(express.json());

// Health check endpoint
app.get('/healthz', (req: Request, res: Response) => {
  const uptime = process.uptime();
  res.status(200).json({
    status: 'ok',
    uptime,
    timestamp: new Date().toISOString()
  });
});

// Mount routes
app.use('/auth', authRoutes);
app.use('/patients', patientRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Centralized error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
  });
});

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
