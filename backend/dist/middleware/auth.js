"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.requireAuth = void 0;
const jwt_1 = require("../auth/jwt");
/**
 * Middleware to check if the request has a valid JWT token
 * Extracts token from Authorization header and verifies it
 * Attaches the decoded user information to the request object
 */
const requireAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized - No token provided' });
        }
        // Extract token from header (remove 'Bearer ' prefix)
        const token = authHeader.split(' ')[1];
        // Verify token and attach user info to request
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};
exports.requireAuth = requireAuth;
/**
 * Middleware to check if the authenticated user has one of the required roles
 * Must be used after requireAuth middleware
 * @param roles Array of allowed roles for the endpoint
 */
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized - Authentication required' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=auth.js.map