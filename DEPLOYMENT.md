# StaffRoom SaaS Deployment Guide

This guide covers deploying the StaffRoom HR Management System to production with Railway (API) and Vercel (Frontend), including performance optimizations.

## Prerequisites

- Railway account (for API deployment)
- Vercel account (for frontend deployment)
- PostgreSQL database (Railway provides this)
- Redis instance (Railway provides this)
- Cloudflare account (for CDN)
- GitHub repository with the code

## Environment Variables

### Required Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/staffroom
DATABASE_DIRECT_URL=postgresql://user:pass@host:5432/staffroom
DB_POOL_SIZE=10
DB_STATEMENT_TIMEOUT=30000
DB_IDLE_TIMEOUT=300000
DB_MAX_LIFETIME=3600000

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=30d

# Frontend URL
FRONTEND_URL=https://staffroom.ke

# Environment
NODE_ENV=production
PORT=3000

# Redis
REDIS_URL=redis://host:6379
REDISCLOUD_URL=redis://host:6379

# SSL/TLS
SSL_ENABLED=true
SSL_KEY_PATH=/path/to/key.pem
SSL_CERT_PATH=/path/to/cert.pem
SSL_CA_PATH=/path/to/ca.pem

# Monitoring
SENTRY_DSN=your_sentry_dsn
SENTRY_ENVIRONMENT=production
```

## API Deployment (Railway)

### Step 1: Create Railway Project

1. Log in to [Railway](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose the StaffRoom repository

### Step 2: Add PostgreSQL Database

1. In Railway project, click "New Service"
2. Select "PostgreSQL"
3. Railway will create a database instance
4. Copy the DATABASE_URL from the database service

### Step 3: Add Redis

1. In Railway project, click "New Service"
2. Select "Redis"
3. Railway will create a Redis instance
4. Copy the REDIS_URL from the Redis service

### Step 4: Configure API Service

1. Click "New Service" and select "Deploy from GitHub repo"
2. Select the StaffRoom repository
3. Configure the service:
   - **Root Directory**: `apps/api`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add environment variables from the "Environment Variables" section above
5. Set `DATABASE_URL` and `REDIS_URL` from the services created in steps 2 and 3

### Step 5: Deploy

1. Click "Deploy"
2. Railway will build and deploy the API
3. Wait for deployment to complete
4. Copy the API URL (e.g., `https://staffroom-api.railway.app`)

## Frontend Deployment (Vercel)

### Step 1: Create Vercel Project

1. Log in to [Vercel](https://vercel.com)
2. Click "Add New Project"
3. Select the StaffRoom repository
4. Configure the project:
   - **Root Directory**: `apps/web`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 2: Configure Environment Variables

1. In Vercel project settings, go to "Environment Variables"
2. Add the following variables:
   - `VITE_API_URL`: Your Railway API URL (e.g., `https://staffroom-api.railway.app`)

### Step 3: Deploy

1. Click "Deploy"
2. Vercel will build and deploy the frontend
3. Wait for deployment to complete
4. Copy the frontend URL (e.g., `https://staffroom.ke`)

## Cloudflare CDN Configuration

### Step 1: Add Domain to Cloudflare

1. Log in to [Cloudflare](https://cloudflare.com)
2. Add your domain (e.g., `staffroom.ke`)
3. Follow the DNS setup instructions

### Step 2: Configure DNS Records

```
A Record: staffroom.ke → Vercel IP
CNAME Record: api.staffroom.ke → Railway API URL
```

### Step 3: Configure Page Rules

1. Go to "Rules" → "Page Rules"
2. Add rules for caching:
   - Pattern: `staffroom.ke/static/*`
   - Settings: Cache Level: Cache Everything, Edge Cache TTL: 1 day
   - Pattern: `staffroom.ke/api/dashboard/*`
   - Settings: Cache Level: Standard, Edge Cache TTL: 5 minutes

### Step 4: Enable SSL/TLS

1. Go to "SSL/TLS" settings
2. Set mode to "Full (strict)"
3. Enable "Always Use HTTPS"
4. Enable "Automatic HTTPS Rewrites"

## Performance Optimization

### Database Connection Pooling

The application uses Prisma connection pooling configured in `apps/api/src/config/database.js`:

- **Connection Limit**: 10 (configurable via `DB_POOL_SIZE`)
- **Statement Timeout**: 30 seconds
- **Idle Timeout**: 5 minutes
- **Max Lifetime**: 1 hour

### Redis Caching

Redis caching is implemented in `apps/api/src/config/redis.js` and `apps/api/src/middleware/cache.js`:

- **Cache Middleware**: Automatically caches GET responses
- **TTL**: Default 5 minutes (configurable per endpoint)
- **Cache Invalidation**: Automatic on POST/PUT/DELETE

### Query Optimization

Query optimization utilities are in `apps/api/src/utils/queryOptimizer.js`:

- **Field Selection**: Only select required fields
- **Pagination**: Efficient cursor-based pagination
- **Batch Queries**: Parallel execution of related queries
- **Cached Counts**: Cache count queries to reduce database load

### SSL/TLS Configuration

SSL/TLS is configured in `apps/api/src/config/ssl.js`:

- **TLS Version**: 1.2 minimum, 1.3 maximum
- **Cipher Suites**: Modern, secure ciphers
- **HSTS**: Enabled with 1-year max age
- **Session Resumption**: Enabled

## Monitoring and Logging

### Sentry Integration

Sentry is configured for error tracking:

1. Set `SENTRY_DSN` environment variable
2. Set `SENTRY_ENVIRONMENT` to `production`
3. Errors will be automatically reported to Sentry

### Application Logs

- **Development**: Full query logging enabled
- **Production**: Only error logging enabled
- **Log Level**: Configurable via `LOG_LEVEL` environment variable

## Health Checks

The API includes a health check endpoint:

```
GET /health
```

Returns:
```json
{
  "status": "healthy",
  "database": "connected",
  "redis": "connected",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Scaling Considerations

### Horizontal Scaling

- Railway automatically scales based on load
- Configure minimum/maximum instances in Railway settings
- Use Redis for shared session storage

### Database Scaling

- Railway PostgreSQL automatically scales storage
- Connection pooling handles increased load
- Consider read replicas for high-traffic scenarios

### CDN Scaling

- Cloudflare automatically handles CDN scaling
- Configure cache rules for optimal performance
- Use Cloudflare Workers for edge computing

## Backup Strategy

### Database Backups

- Railway provides automated daily backups
- Configure backup retention in Railway settings
- Export backups manually if needed

### Application Backups

- Code is stored in GitHub
- Environment variables stored in Railway/Vercel
- Document any manual configurations

## Security Checklist

- [ ] All environment variables are set
- [ ] SSL/TLS is enabled and configured
- [ ] CORS is configured for production domains
- [ ] Rate limiting is enabled
- [ ] JWT secrets are strong and unique
- [ ] Database credentials are secure
- [ ] Redis authentication is enabled
- [ ] Sentry is configured for error tracking
- [ ] Cloudflare SSL is set to "Full (strict)"
- [ ] HSTS is enabled
- [ ] Security headers are configured

## Troubleshooting

### Common Issues

**API won't start**
- Check environment variables are correctly set
- Verify database connection string is valid
- Check Railway logs for error messages

**Frontend can't connect to API**
- Verify `VITE_API_URL` is correct
- Check CORS configuration
- Ensure API is deployed and accessible

**Cache not working**
- Verify Redis connection string
- Check Redis service is running
- Review cache middleware logs

**Database connection errors**
- Check connection pool configuration
- Verify database is accessible
- Review database logs

## Rollback Procedure

### API Rollback

1. Go to Railway project
2. Click on the API service
3. Click "Deployments"
4. Select previous deployment
5. Click "Redeploy"

### Frontend Rollback

1. Go to Vercel project
2. Click "Deployments"
3. Select previous deployment
4. Click "Redeploy"

## Maintenance

### Regular Tasks

- Monitor Sentry for errors
- Review application logs
- Check database performance
- Update dependencies regularly
- Review security advisories

### Database Maintenance

- Run `prisma migrate deploy` for schema updates
- Monitor database size and performance
- Archive old data if needed
- Update statistics regularly

## Support

For deployment issues:
- Railway: https://docs.railway.app
- Vercel: https://vercel.com/docs
- Cloudflare: https://developers.cloudflare.com
- Prisma: https://www.prisma.io/docs

## Next Steps

After deployment:

1. Test all critical user flows
2. Monitor performance metrics
3. Set up alerts for errors
4. Configure backup schedules
5. Document any custom configurations
6. Train team on deployment process
