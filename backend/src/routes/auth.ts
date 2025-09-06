import express, { Request, Response } from 'express';
import { issueToken } from '../auth/jwt';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

/**
 * Login endpoint - generates a JWT token based on email
 * 
 * @route POST /auth/login
 * @param {string} email - User's email
 * @param {string} password - User's password (not validated in this mock implementation)
 * @returns {Object} Token and user role
 */
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  // Determine role based on email domain
  // If email ends with @example.com, assign "Senior" role, otherwise "Resident"
  const role = email.endsWith('@example.com') ? 'Senior' : 'Resident';
  
  // In a real application, you would verify credentials against a database
  // For this mock implementation, we'll generate a random userId
  const userId = uuidv4();
  
  try {
    // Issue JWT token
    const token = issueToken({ userId, role });
    
    // Return token and role
    return res.status(200).json({
      token,
      role
    });
  } catch (error) {
    console.error('Error generating token:', error);
    return res.status(500).json({ error: 'Error generating authentication token' });
  }
});

export default router;
