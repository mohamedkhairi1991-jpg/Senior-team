import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  role: string;
}

/**
 * Issues a JWT token with the provided payload
 * @param payload User information to encode in the token
 * @returns JWT token string
 */
export const issueToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET || 'default_secret_replace_in_production';
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  return jwt.sign(payload, secret, { expiresIn: '24h' });
};

/**
 * Verifies and decodes a JWT token
 * @param token JWT token to verify
 * @returns Decoded token payload or throws an error
 */
export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET || 'default_secret_replace_in_production';
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  try {
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
