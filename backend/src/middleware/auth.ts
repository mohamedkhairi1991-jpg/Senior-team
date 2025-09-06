import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../auth/jwt';

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware to check if the request has a valid JWT token
 * Extracts token from Authorization header and verifies it
 * Attaches the decoded user information to the request object
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }
    
    // Extract token from header (remove 'Bearer ' prefix)
    const token = authHeader.split(' ')[1];
    
    // Verify token and attach user info to request
    const decoded = verifyToken(token);
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

/**
 * Middleware to check if the authenticated user has one of the required roles
 * Must be used after requireAuth middleware
 * @param roles Array of allowed roles for the endpoint
 */
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized - Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
    }
    
    next();
  };
};
