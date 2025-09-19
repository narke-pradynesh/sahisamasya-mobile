import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

export const authenticateToken = async (req, res, next) => {
  try {
    console.log('Auth headers:', req.headers);
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    console.log('Extracted token:', token ? 'Token present' : 'No token');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  next();
};

export const generateToken = (userId) => {
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn });
};

// Cookie configuration helper
export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isHTTPS = process.env.ENABLE_HTTPS === 'true';
  
  return {
    httpOnly: true, // Prevent XSS attacks
    secure: isHTTPS || isProduction, // Only send over HTTPS in production
    sameSite: process.env.COOKIE_SAME_SITE || (isProduction ? 'strict' : 'lax'), // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: '/' // Cookie available for entire domain
  };
};
