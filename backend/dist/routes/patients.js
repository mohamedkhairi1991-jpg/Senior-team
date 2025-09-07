"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
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
router.get('/', auth_1.requireAuth, (0, auth_1.requireRole)("Senior", "Resident"), (req, res) => {
    // In a real application, this would fetch data from a database
    // For this mock implementation, we're returning hardcoded data
    return res.status(200).json(mockPatients);
});
exports.default = router;
//# sourceMappingURL=patients.js.map