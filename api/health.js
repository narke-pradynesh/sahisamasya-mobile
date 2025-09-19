import { corsHandler, securityHeaders } from './_lib/cors.js';

export default async function handler(req, res) {
  // Handle CORS
  if (corsHandler(req, res)) return;
  
  // Add security headers
  securityHeaders(res);

  if (req.method === 'GET') {
    res.json({
      success: true,
      message: 'SahiSamasya API is running on Vercel',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
