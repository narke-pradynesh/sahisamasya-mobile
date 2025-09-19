// CORS middleware for Vercel API routes
export function corsHandler(req, res) {
  // Get the origin from the request
  const origin = req.headers.origin;
  
  // Define allowed origins
  const allowedOrigins = [
    'https://sahisamasya-mobile.vercel.app',
    'https://sahisamasya-mobile-git-main.vercel.app',
    'https://localhost:5173',
    'https://localhost:5174',
    'https://localhost:5175',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    process.env.FRONTEND_URL
  ].filter(Boolean);

  // Check if origin is allowed
  const isAllowed = !origin || allowedOrigins.includes(origin) || 
    /^https:\/\/.*\.vercel\.app$/.test(origin) ||
    /^https?:\/\/(localhost|127\.0\.0\.1):(517[3-9]|518[0])$/.test(origin);

  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }

  return false;
}

// Security headers middleware
export function securityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
}
