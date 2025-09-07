"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwt_1 = require("../auth/jwt");
const uuid_1 = require("uuid");
const router = express_1.default.Router();
/**
 * Login endpoint - generates a JWT token based on email
 *
 * @route POST /auth/login
 * @param {string} email - User's email
 * @param {string} password - User's password (not validated in this mock implementation)
 * @returns {Object} Token and user role
 */
router.post('/login', (req, res) => {
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
    const userId = (0, uuid_1.v4)();
    try {
        // Issue JWT token
        const token = (0, jwt_1.issueToken)({ userId, role });
        // Return token and role
        return res.status(200).json({
            token,
            role
        });
    }
    catch (error) {
        console.error('Error generating token:', error);
        return res.status(500).json({ error: 'Error generating authentication token' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map