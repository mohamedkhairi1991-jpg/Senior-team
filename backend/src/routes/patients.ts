import express, { Request, Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';

const router = express.Router();

// Mock patient data
const mockPatients = [
  { id: 1, name: "John Doe", age: 45 }
];

/**
 * Get all patients
 * Protected route - requires authentication and either "Senior" or "Resident" role
 * 
 * @route GET /patients
 * @returns {Array} List of patients
 */
router.get('/', requireAuth, requireRole("Senior", "Resident"), (req: Request, res: Response) => {
  // In a real application, this would fetch data from a database
  // For this mock implementation, we're returning hardcoded data
  
  return res.status(200).json(mockPatients);
});

export default router;
