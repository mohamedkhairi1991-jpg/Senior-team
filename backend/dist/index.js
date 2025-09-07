"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
// Import pino-http using require to avoid TypeScript issues
const pino = require('pino-http')();
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const patients_1 = __importDefault(require("./routes/patients"));
// Initialize express app
const app = (0, express_1.default)();
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
app.use((0, helmet_1.default)({
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
app.use((0, cors_1.default)({
    origin: true, // Allow all origins for development
    credentials: true
}));
app.use(pino);
app.use(express_1.default.json());
// Root endpoint
app.get('/', (req, res) => {
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
app.get('/healthz', (req, res) => {
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
app.use('/auth', auth_1.default);
app.use('/patients', patients_1.default);
// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path_1.default.join(__dirname, '../../web/dist');
    app.use(express_1.default.static(frontendPath));
    // Handle React Router (return index.html for all routes)
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(frontendPath, 'index.html'));
    });
}
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});
// Centralized error handler
app.use((err, req, res, _next) => {
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
    }
    catch (err) {
        console.warn('Failed to load .env file, using default environment variables');
    }
}
// Server setup
const PORT = process.env.PORT || 3001;
let server;
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
exports.default = app;
//# sourceMappingURL=index.js.map