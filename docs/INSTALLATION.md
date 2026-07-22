# 🚀 STAFFROOM Installation Guide

## Prerequisites

- Docker & Docker Compose (easiest option)
- OR: Node.js 18+, PostgreSQL 15+, npm/yarn

## Option 1: Docker (Recommended)

```bash
# Navigate to project root
cd STAFFROOM_COMPLETE_SYSTEM

# Start all services
docker-compose -f deployment/docker-compose.yml up --build

# Wait for startup (2-3 minutes)
# Access at http://localhost:3000
```

Demo Credentials:
- Username: demo@staffroom.com
- Password: Demo123!

## Option 2: Manual Installation

### Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Create database
createdb staffroom

# Run migrations
npx prisma migrate deploy

# Seed data
npx prisma db seed

# Start server
npm run dev
# Backend runs on http://localhost:3001
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend runs on http://localhost:3000
```

## Verify Installation

1. Open http://localhost:3000
2. Login with demo credentials
3. Check all 13 fixes:
   - Leave balance validation
   - Payroll variance detection
   - Escalation logic
   - Bulk approvals
   - etc.

## Troubleshooting

See `documentation/TROUBLESHOOTING.md` for common issues.
