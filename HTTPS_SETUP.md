# HTTPS Setup Guide

This guide explains how to run the SahiSamasya application with HTTPS enabled for secure communication.

## Prerequisites

- SSL certificates are already generated in the `certs/` directory
- Node.js and npm installed
- MongoDB running

## Quick Start (HTTPS Development)

### 1. Run with HTTPS (Recommended)

```bash
# Run both frontend and backend with HTTPS
npm run dev:https:full

# Or run them separately
npm run server:https    # Backend with HTTPS on port 3443
npm run dev:https       # Frontend with HTTPS on port 5173
```

### 2. Run with Network Access (HTTPS)

```bash
# For network access with HTTPS
npm run dev:https:network
```

### 3. Environment Variables

Create a `.env` file in the project root (copy from `env.example`):

```bash
# Enable HTTPS
ENABLE_HTTPS=true

# Server ports
PORT=3001           # HTTP fallback port
HTTPS_PORT=3443     # HTTPS port

# MongoDB
MONGODB_URI=mongodb://localhost:27017/sahisamasya

# JWT Secret (change this!)
JWT_SECRET=your-super-secret-jwt-key-here

# Frontend URL for CORS
FRONTEND_URL=https://localhost:5173
```

## SSL Certificate Details

### Self-Signed Certificates (Development)

The application includes self-signed certificates for development:

- **Location**: `certs/key.pem` and `certs/cert.pem`
- **Valid for**: localhost, 127.0.0.1, and your local network IP
- **Expiry**: 365 days

### Browser Security Warnings

When using self-signed certificates, browsers will show security warnings:

1. **Chrome/Edge**: Click "Advanced" → "Proceed to localhost (unsafe)"
2. **Firefox**: Click "Advanced" → "Accept the Risk and Continue"
3. **Safari**: Click "Show Details" → "Visit this website"

### Production Certificates

For production, replace the self-signed certificates with certificates from a trusted CA:

1. Obtain certificates from Let's Encrypt, Cloudflare, or another CA
2. Replace `certs/key.pem` and `certs/cert.pem`
3. Set `NODE_ENV=production` and `ENABLE_HTTPS=true`

## Security Features

### 1. HTTPS Server
- Dual HTTP/HTTPS server setup
- Automatic HTTPS redirect in production
- Secure SSL/TLS configuration

### 2. Security Headers (Helmet.js)
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options
- And more...

### 3. Secure Cookies
- HttpOnly cookies (prevent XSS)
- Secure flag (HTTPS only)
- SameSite protection (CSRF prevention)
- Proper expiration handling

### 4. CORS Configuration
- HTTPS origins allowed
- Credentials support
- Network access support

## API Endpoints

### HTTP (Development Fallback)
- Health Check: `http://localhost:3001/health`
- API Base: `http://localhost:3001/api`

### HTTPS (Recommended)
- Health Check: `https://localhost:3443/health`
- API Base: `https://localhost:3443/api`

## Troubleshooting

### Certificate Issues

If you encounter certificate errors:

```bash
# Regenerate certificates
cd certs
rm *.pem
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost" -addext "subjectAltName=DNS:localhost,DNS:127.0.0.1,IP:127.0.0.1,IP:$(ipconfig getifaddr en0)"
```

### Port Conflicts

If ports are in use:

```bash
# Check what's using the ports
lsof -i :3443  # HTTPS port
lsof -i :3001  # HTTP port
lsof -i :5173  # Frontend port

# Kill processes if needed
kill -9 <PID>
```

### Network Access Issues

For network access, ensure your firewall allows:
- Port 3443 (HTTPS backend)
- Port 5173 (HTTPS frontend)

### Mixed Content Errors

If you see mixed content errors:
- Ensure both frontend and backend use HTTPS
- Check that API calls use `https://` URLs
- Verify CORS configuration includes HTTPS origins

## Development vs Production

### Development
- Self-signed certificates
- Both HTTP and HTTPS available
- Less strict security policies
- Debug logging enabled

### Production
- Trusted CA certificates
- HTTPS-only (HTTP redirects)
- Strict security headers
- Secure cookie settings
- HSTS enabled

## Additional Security Recommendations

1. **Use a reverse proxy** (nginx, Apache) in production
2. **Enable HTTP/2** for better performance
3. **Implement rate limiting** for API endpoints
4. **Use environment variables** for all sensitive data
5. **Regular security updates** for dependencies
6. **Monitor SSL certificate expiry**

## Support

For issues or questions:
1. Check the browser console for errors
2. Check server logs for backend issues
3. Verify certificate validity
4. Ensure environment variables are set correctly
