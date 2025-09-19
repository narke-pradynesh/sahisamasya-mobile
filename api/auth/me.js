import connectDB from '../_lib/db.js';
import { authenticateToken } from '../_lib/auth.js';
import { corsHandler, securityHeaders } from '../_lib/cors.js';

export default async function handler(req, res) {
  // Handle CORS
  if (corsHandler(req, res)) return;
  
  // Add security headers
  securityHeaders(res);

  // Connect to database
  await connectDB();

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const authResult = await authenticateToken(req);
    
    if (authResult.error) {
      return res.status(authResult.status).json({
        success: false,
        message: authResult.error
      });
    }

    res.json({
      success: true,
      user: authResult.user.toJSON()
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
}
