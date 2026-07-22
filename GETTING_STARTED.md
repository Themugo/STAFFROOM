# 🎯 STAFFROOM - Getting Started

## What is STAFFROOM?

Complete HR management system with all 13 critical workflow fixes implemented:
- Leave balance tracking
- Payroll variance detection  
- Auto-escalation
- Concurrent approvals
- And 9 more...

## Quick Start (5 minutes)

### Docker (Easiest)
```bash
docker-compose -f deployment/docker-compose.yml up
```

### Or Manual
```bash
# Terminal 1 - Backend
cd backend && npm install && npm run dev

# Terminal 2 - Frontend
cd frontend && npm install && npm run dev
```

## Access

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Demo Login: demo@staffroom.com / Demo123!

## What's Included

✅ Complete React frontend (all 13 fixes)
✅ Express.js backend with full API
✅ PostgreSQL database with seed data
✅ Docker setup for easy deployment
✅ Complete documentation
✅ 50+ test cases

## Next Steps

1. Read `documentation/INSTALLATION.md`
2. Start the system (Docker or manual)
3. Test the 13 fixes
4. Customize for your needs
5. Deploy to production

## Key Features to Test

1. **Leave Management** - Request leave, check balance
2. **Approvals** - Approve/reject requests, bulk operations
3. **Payroll** - Check variance detection, pay breakdown
4. **Analytics** - View dashboards and reports

## Need Help?

- Installation: `documentation/INSTALLATION.md`
- API: `documentation/API.md`
- Troubleshooting: `documentation/TROUBLESHOOTING.md`
- Deployment: `documentation/PRODUCTION_DEPLOYMENT.md`

---

Version 4.0 | All 13 Issues Fixed | Production Ready

Start with: `docker-compose -f deployment/docker-compose.yml up`
