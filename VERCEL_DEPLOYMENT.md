# Vercel Deployment Guide

This guide explains how to deploy the SahiSamasya application to Vercel with full-stack functionality.

## 🚀 Quick Deployment

### 1. Prerequisites

- GitHub account with your project repository
- Vercel account (free tier available)
- MongoDB Atlas cluster (or any MongoDB instance accessible from the internet)

### 2. Deploy to Vercel

#### Option A: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/narke-pradynesh/sahisamasya-mobile)

#### Option B: Manual Deployment

1. **Connect GitHub Repository**
   ```bash
   # Push your code to GitHub first
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the framework (Vite)

3. **Configure Environment Variables**
   In your Vercel dashboard, go to Project Settings → Environment Variables and add:

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sahisamasya
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-app.vercel.app`

## 🔧 Configuration Details

### Project Structure for Vercel

```
sahisamasya-mobile/
├── api/                    # Vercel API Routes (Serverless Functions)
│   ├── _lib/              # Shared utilities
│   │   ├── auth.js        # Authentication helpers
│   │   ├── cors.js        # CORS configuration
│   │   ├── db.js          # Database connection
│   │   └── models.js      # Model exports
│   ├── auth/              # Authentication endpoints
│   │   ├── login.js       # POST /api/auth/login
│   │   ├── register.js    # POST /api/auth/register
│   │   ├── me.js          # GET /api/auth/me
│   │   └── logout.js      # POST /api/auth/logout
│   ├── complaints/        # Complaint endpoints
│   │   ├── index.js       # GET/POST /api/complaints
│   │   └── [id].js        # GET/PUT/DELETE /api/complaints/:id
│   ├── upvotes/           # Upvote endpoints
│   │   ├── index.js       # GET/POST /api/upvotes
│   │   ├── [id].js        # DELETE /api/upvotes/:id
│   │   ├── complaint/[complaintId].js  # GET /api/upvotes/complaint/:id
│   │   └── check/[complaintId].js      # GET /api/upvotes/check/:id
│   └── health.js          # GET /api/health
├── public/                # Static assets
├── src/                   # React frontend source
├── dist/                  # Built frontend (auto-generated)
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies and scripts
```

### API Endpoints

All API endpoints are available at `https://your-app.vercel.app/api/`:

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

#### Complaints
- `GET /api/complaints` - Get all complaints (with pagination)
- `POST /api/complaints` - Create new complaint (auth required)
- `GET /api/complaints/:id` - Get specific complaint
- `PUT /api/complaints/:id` - Update complaint (admin only)
- `DELETE /api/complaints/:id` - Delete complaint (admin only)

#### Upvotes
- `GET /api/upvotes` - Get all upvotes
- `POST /api/upvotes` - Create upvote (auth required)
- `DELETE /api/upvotes/:id` - Remove upvote (auth required)
- `GET /api/upvotes/complaint/:id` - Get upvotes for complaint
- `GET /api/upvotes/check/:id` - Check if user upvoted complaint

#### Health Check
- `GET /api/health` - API health status

## 🔒 Security Features

### Production Security
- **HTTPS Only**: All traffic encrypted with TLS
- **CORS Protection**: Configured for Vercel domains
- **Security Headers**: CSP, HSTS, X-Frame-Options, etc.
- **Secure Cookies**: HttpOnly, Secure, SameSite protection
- **JWT Authentication**: Secure token-based auth

### Environment Variables
Set these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` |
| `NODE_ENV` | Environment | `production` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-app.vercel.app` |

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create Atlas Account**
   - Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Create free account

2. **Create Cluster**
   - Choose free tier (M0)
   - Select region close to your users

3. **Configure Access**
   - Add database user
   - Allow access from anywhere (`0.0.0.0/0`) for Vercel
   - Get connection string

4. **Set Environment Variable**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sahisamasya
   ```

### Alternative: Other MongoDB Providers
- [MongoDB Cloud](https://www.mongodb.com/cloud)
- [DigitalOcean Managed MongoDB](https://www.digitalocean.com/products/managed-databases/)
- [AWS DocumentDB](https://aws.amazon.com/documentdb/)

## 🚀 Deployment Process

### Automatic Deployments
- **Git Integration**: Automatic deployments on git push
- **Preview Deployments**: Every PR gets a preview URL
- **Production Deployments**: Main branch deploys to production

### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## 🔍 Monitoring & Debugging

### Vercel Dashboard Features
- **Function Logs**: View serverless function logs
- **Analytics**: Traffic and performance metrics
- **Deployments**: History and rollback options

### Common Issues

#### 1. Environment Variables Not Set
**Error**: Database connection failures
**Solution**: Set all required environment variables in Vercel dashboard

#### 2. CORS Issues
**Error**: Cross-origin request blocked
**Solution**: Check CORS configuration in `api/_lib/cors.js`

#### 3. API Route 404
**Error**: API endpoints not found
**Solution**: Verify file naming convention matches Vercel API routes

#### 4. Build Failures
**Error**: Build process fails
**Solution**: Check build logs and ensure all dependencies are in `package.json`

### Debugging Tips
```bash
# Check function logs in Vercel dashboard
# Enable debug mode in environment variables
DEBUG=true

# Test API endpoints
curl https://your-app.vercel.app/api/health
```

## 🔄 Updates & Maintenance

### Updating Your App
1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. Vercel automatically deploys

### Rolling Back
1. Go to Vercel Dashboard
2. Select previous deployment
3. Click "Promote to Production"

### Domain Configuration
1. **Custom Domain**: Add in Vercel Dashboard → Domains
2. **SSL Certificate**: Automatically provided by Vercel
3. **DNS Configuration**: Point domain to Vercel

## 📊 Performance Optimization

### Vercel Features
- **Edge Network**: Global CDN for fast loading
- **Serverless Functions**: Auto-scaling API endpoints
- **Image Optimization**: Built-in image optimization
- **Static Generation**: Pre-built pages for speed

### Best Practices
- Use environment variables for configuration
- Implement proper error handling
- Monitor function execution time
- Optimize database queries
- Use connection pooling for database

## 🆘 Support & Troubleshooting

### Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

### Getting Help
1. Check Vercel function logs
2. Review environment variables
3. Test API endpoints individually
4. Check MongoDB Atlas connection
5. Review CORS configuration

### Common Solutions
```bash
# Clear Vercel cache
vercel --prod --force

# Check environment variables
vercel env ls

# View function logs
vercel logs your-function-name
```

---

## 🎉 Success!

Once deployed, your SahiSamasya application will be:
- ✅ Fully functional with all features
- ✅ Automatically scaled and managed
- ✅ Secured with HTTPS and security headers
- ✅ Backed by MongoDB for data persistence
- ✅ Accessible globally via Vercel's edge network

Your app is now ready for production use! 🚀
