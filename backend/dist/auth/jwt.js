"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.issueToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Issues a JWT token with the provided payload
 * @param payload User information to encode in the token
 * @returns JWT token string
 */
const issueToken = (payload) => {
    const secret = process.env.JWT_SECRET || 'default_secret_replace_in_production';
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '24h' });
};
exports.issueToken = issueToken;
/**
 * Verifies and decodes a JWT token
 * @param token JWT token to verify
 * @returns Decoded token payload or throws an error
 */
const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET || 'default_secret_replace_in_production';
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        throw new Error('Invalid or expired token');
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt.js.map