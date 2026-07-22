# Production Deployment Guide

This guide covers setting up a production environment for StaffRoom SaaS.

## Database Setup

### Option 1: Railway (Recommended for simplicity)

1. **Create a Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up and create a new project

2. **Add PostgreSQL Database**
   - Click "New Service" → "Database" → "PostgreSQL"
   - Railway will create a PostgreSQL instance

3. **Get Database Connection String**
   - Click on your PostgreSQL service
   - Go to "Variables" tab
   - Copy the `DATABASE_URL` value

4. **Update Environment Variables**
   - Add `DATABASE_URL` to your production environment
   - Example: `postgresql://postgres:password@containers.railway.app:5432/railway`

### Option 2: AWS RDS (Recommended for scale)

1. **Create AWS Account**
   - Go to [aws.amazon.com](https://aws.amazon.com)
   - Sign up for an account

2. **Create RDS Instance**
   - Go to RDS service in AWS Console
   - Click "Create database"
   - Select "PostgreSQL"
   - Choose engine version (15 or later)
   - Set instance class (e.g., db.t3.micro for dev, db.t3.medium for production)
   - Set storage (20GB minimum for production)
   - Configure master username and password
   - Set VPC and security groups
   - Click "Create database"

3. **Get Database Connection String**
   - Go to your RDS instance
   - Copy the endpoint
   - Format: `postgresql://username:password@endpoint:5432/database`

4. **Configure Security Groups**
   - Allow inbound traffic on port 5432
   - Restrict to your application's IP or security group

### Option 3: Render (Alternative)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up and create a new project

2. **Add PostgreSQL Database**
   - Click "New" → "PostgreSQL"
   - Choose a plan (Free for dev, paid for production)
   - Click "Create Database"

3. **Get Database Connection String**
   - Go to your PostgreSQL service
   - Copy the internal database URL

## Database Migration

Once your production database is set up, run migrations:

```bash
cd packages/db
npx prisma generate
npx prisma db push
```

Or use migration files for production:

```bash
npx prisma migrate deploy
```

## API Deployment

### Option 1: Railway

1. **Connect GitHub Repository**
   - In Railway, click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Select the branch (main)

2. **Configure Environment Variables**
   - Add all variables from `.env.example`
   - Set `NODE_ENV=production`
   - Add your production `DATABASE_URL`
   - Add `JWT_SECRET` (generate a secure random string)
   - Add `SENTRY_DSN` (if using Sentry)

3. **Deploy**
   - Railway will automatically build and deploy
   - Monitor the build logs

### Option 2: AWS EC2

1. **Launch EC2 Instance**
   - Go to EC2 in AWS Console
   - Click "Launch Instance"
   - Choose AMI (Ubuntu 22.04 LTS)
   - Choose instance type (t3.micro or larger)
   - Configure security groups (allow ports 22, 80, 443)
   - Launch and connect via SSH

2. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm postgresql-client
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

3. **Clone Repository**
   ```bash
   git clone https://github.com/Themugo/simtrace-FINAL.git
   cd staffroom-saas-production-v2
   ```

4. **Install Dependencies**
   ```bash
   cd apps/api
   npm install --production
   cd ../..
   cd packages/db
   npx prisma generate
   ```

5. **Set Environment Variables**
   ```bash
   sudo nano /etc/environment
   # Add your production environment variables
   ```

6. **Run with PM2**
   ```bash
   npm install -g pm2
   cd apps/api
   pm2 start src/server.js --name staffroom-api
   pm2 save
   pm2 startup
   ```

### Option 3: Render

1. **Connect GitHub Repository**
   - In Render, click "New" → "Web Service"
   - Select your repository
   - Select the branch (main)

2. **Configure Build Settings**
   - Root directory: `apps/api`
   - Build command: `npm install`
   - Start command: `node src/server.js`

3. **Add Environment Variables**
   - Add all variables from `.env.example`
   - Set `NODE_ENV=production`

4. **Deploy**
   - Render will automatically build and deploy

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Connect GitHub Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your repository
   - Select the branch (main)

2. **Configure Build Settings**
   - Root directory: `apps/web`
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Add Environment Variables**
   - `VITE_API_URL`: Your production API URL

4. **Deploy**
   - Vercel will automatically build and deploy

### Option 2: Netlify

1. **Connect GitHub Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select your repository

2. **Configure Build Settings**
   - Build command: `cd apps/web && npm run build`
   - Publish directory: `apps/web/dist`

3. **Add Environment Variables**
   - `VITE_API_URL`: Your production API URL

4. **Deploy**
   - Netlify will automatically build and deploy

## Monitoring Setup

### Sentry Integration

1. **Create Sentry Project**
   - Go to [sentry.io](https://sentry.io)
   - Create a new project
   - Select "Node.js" as the platform

2. **Get DSN**
   - Copy the DSN from your project settings

3. **Add to Environment Variables**
   - Add `SENTRY_DSN` to your production environment
   - Add `SENTRY_ENVIRONMENT=production`

## Security Checklist

Before going to production, ensure:

- [ ] Change all default passwords
- [ ] Use strong `JWT_SECRET` (minimum 32 characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Enable audit logging
- [ ] Configure rate limiting
- [ ] Set up CORS correctly
- [ ] Enable security headers (Helmet)
- [ ] Review and update dependencies
- [ ] Set up monitoring and alerts
- [ ] Configure error tracking (Sentry)
- [ ] Test all critical flows
- [ ] Set up backup strategy

## Backup Strategy

### Database Backups

**Railway**: Automatic backups included
- Daily backups retained for 7 days
- Weekly backups retained for 4 weeks

**AWS RDS**: Configure automated backups
- Go to RDS instance → Modify
- Enable automated backups
- Set retention period (1-35 days)
- Enable point-in-time recovery

**Manual Backup**:
```bash
pg_dump $DATABASE_URL > backup.sql
```

### Application Backups

- Keep code in Git repository
- Tag releases
- Document configuration changes

## Scaling Considerations

### Database Scaling
- Use read replicas for high read traffic
- Implement connection pooling (PgBouncer)
- Monitor query performance
- Add indexes as needed

### API Scaling
- Use load balancer (AWS ALB, Nginx)
- Implement horizontal scaling
- Use Redis for caching
- Implement CDN for static assets

### Frontend Scaling
- Use CDN (Cloudflare, AWS CloudFront)
- Implement lazy loading
- Optimize bundle size
- Use service workers for offline support

## Troubleshooting

### Database Connection Issues
- Check security group rules
- Verify DATABASE_URL format
- Check database is accepting connections
- Review database logs

### Build Failures
- Check build logs
- Verify all dependencies are installed
- Check environment variables
- Review Node.js version compatibility

### Runtime Errors
- Check application logs
- Review Sentry error tracking
- Verify database migrations
- Check API endpoints

## Support

For deployment issues:
- Check documentation: [docs/](./)
- Open GitHub issue
- Email: support@staffroom.ke
