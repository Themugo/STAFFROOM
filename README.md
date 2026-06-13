# StaffRoom SaaS - Modern Staff Management System

A comprehensive, production-ready staff management system built for Kenyan businesses and beyond.

## 🚀 Features

### Core HR Management
- **Employee Management**: Complete employee profiles with personal details, positions, departments
- **Department Management**: Organizational structure with department hierarchy
- **Position Management**: Job roles with salary structures and requirements
- **Attendance Tracking**: Check-in/check-out system with location support
- **Leave Management**: Comprehensive leave requests with approval workflow
- **Performance Reviews**: Employee performance tracking and feedback

### Advanced HR Features
- **Payroll & Compliance Engine**: Full payroll processing with tax calculations
- **Attendance Intelligence**: Smart attendance tracking with biometric support
- **Recruitment Module**: Complete hiring workflow from application to onboarding
- **Universal Workflow Engine**: Customizable workflow automation
- **Corporate Dashboard**: Executive-level analytics and reporting
- **Security Hardening**: Advanced security measures and compliance
- **Multi-company SaaS**: Support for multiple companies/tenants
- **Mobile App**: Native mobile application for staff
- **Workforce Intelligence**: AI-powered workforce analytics
- **Performance Management Suite**: 360-degree feedback and appraisals
- **Learning & Development**: Training management and skill tracking
- **Asset & Resource Management**: Company asset tracking
- **Internal Communications**: Chat, announcements, events
- **Enterprise Integrations**: Third-party system integrations
- **Regional Compliance Layer**: Multi-region compliance support
- **Enterprise SaaS Architecture**: Scalable multi-tenant architecture
- **StaffRoom Ecosystem**: Integrated platform services
- **Executive Command Center**: C-level executive dashboards
- **Advanced Platform Features**: Advanced platform capabilities
- **Advanced Shift Management**: Complex shift scheduling
- **Duty Roster & Compensation Calendar**: Duty scheduling
- **Time Bank & Days Owed**: Time tracking and debt management
- **Workforce Balancing & Department Hub**: Department-level management
- **Shift Swap & Coverage Planning**: Shift exchange system
- **Attendance Reconciliation & Workforce Planning**: Attendance management
- **Governance Layer Architecture**: Governance and compliance
- **Gap Analysis Features**: High, medium, and low priority gap implementations

### Security & Authentication
- JWT-based authentication
- Role-based access control (Super Admin, Admin, HR Manager, Manager, Employee)
- Secure password hashing with bcrypt
- Session management
- Audit logging for all actions
- GDPR compliance features
- Fraud detection capabilities

### Modern UI/UX
- Responsive design (mobile, tablet, desktop)
- Real-time dashboard with statistics
- Intuitive navigation with sidebar
- Beautiful, modern interface with Tailwind CSS
- Fast loading with Vite

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 15+
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/Themugo/simtrace-FINAL.git
cd staffroom-saas-production-v2
```

### 2. Install dependencies

#### API
```bash
cd apps/api
npm install
```

#### Web
```bash
cd apps/web
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update the following variables:
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - Generate a secure random string
- `FRONTEND_URL` - Your frontend URL

### 4. Set up the database

```bash
cd packages/db
npx prisma generate
npx prisma db push
```

### 5. Run the application

#### Using Docker (Recommended)
```bash
docker-compose up
```

#### Manual Setup

**API:**
```bash
cd apps/api
npm run dev
```

**Web:**
```bash
cd apps/web
npm run dev
```

The API will run on `http://localhost:5000`
The Web app will run on `http://localhost:5173`

## 📁 Project Structure

```
staffroom-saas-production-v2/
├── apps/
│   ├── api/              # Backend API (Express.js)
│   │   ├── src/
│   │   │   ├── config/   # Database configuration
│   │   │   ├── controllers/ # Business logic (38 controllers)
│   │   │   ├── middleware/ # Auth, validation, etc.
│   │   │   ├── routes/   # API routes (39 routes)
│   │   │   ├── __tests__/ # Test files
│   │   │   ├── app.js    # Express app setup
│   │   │   └── server.js # Server entry point
│   │   ├── jest.config.js
│   │   ├── jest.setup.js
│   │   └── package.json
│   ├── web/              # Frontend (React + Vite)
│   │   ├── src/
│   │   │   ├── components/ # React components
│   │   │   ├── contexts/  # React contexts (Auth)
│   │   │   ├── lib/       # Utilities
│   │   │   ├── pages/     # Page components
│   │   │   ├── test/      # Test setup
│   │   │   ├── App.jsx    # Main app with routing
│   │   │   └── main.jsx   # Entry point
│   │   ├── vitest.config.js
│   │   └── package.json
│   └── mobile/           # Mobile app (React Native)
├── packages/
│   └── db/               # Database schema (Prisma)
│       └── schema.prisma # 200+ models, all 47 phases complete
├── docker-compose.yml    # Docker configuration
├── .env.example          # Environment variables template
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Core Features
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee (Admin/HR)
- `PUT /api/employees/:id` - Update employee (Admin/HR)
- `DELETE /api/employees/:id` - Delete employee (Admin)
- `GET /api/departments` - Get all departments
- `GET /api/positions` - Get all positions
- `GET /api/attendance` - Get attendance records
- `GET /api/leaves` - Get all leave requests

### Advanced Features (Phases 1-47)
- Payroll & Compliance: `/api/payroll/*`
- Leave Management 2.0: `/api/leave-management/*`
- Attendance Intelligence: `/api/attendance-intelligence/*`
- Recruitment: `/api/recruitment/*`
- Universal Workflow: `/api/universal-workflow/*`
- Corporate Dashboard: `/api/dashboard/*`
- Security: `/api/security/*`
- Multi-company: `/api/company/*`
- Mobile App: `/api/mobile/*`
- Workforce Intelligence: `/api/intelligence/*`
- Performance Management: `/api/performance/*`
- Learning & Development: `/api/lms/*`
- Asset Management: `/api/assets/*`
- Communications: `/api/communications/*`
- Enterprise Integrations: `/api/integrations/*`
- Regional Compliance: `/api/enterprise/*`
- Executive Command: `/api/executive/*`
- Platform Features: `/api/platform/*`
- Shift Management: `/api/shift-management/*`
- Roster & Compensation: `/api/roster-compensation/*`
- Time Bank: `/api/time-bank/*`
- Workforce Hub: `/api/workforce-hub/*`
- Shift Swap: `/api/shift-swap/*`
- Reconciliation: `/api/reconciliation/*`
- Governance: `/api/governance/*`
- Gap Analysis: `/api/high-priority-gaps/*`, `/api/medium-priority-gaps/*`, `/api/low-priority-gaps/*`
- Feature Implementations: `/api/high-priority-features/*`, `/api/medium-priority-features/*`, `/api/low-priority-features/*`

## 👥 User Roles

1. **SUPER_ADMIN** - Full system access
2. **ADMIN** - Administrative access
3. **HR_MANAGER** - HR operations access
4. **MANAGER** - Department management access
5. **EMPLOYEE** - Basic employee access

## 🧪 Testing

```bash
# API tests (Jest)
cd apps/api
npm test
npm run test:watch
npm run test:coverage

# Web tests (Vitest)
cd apps/web
npm test
npm run test:ui
npm run test:coverage
```

## 🚢 Deployment

### API Deployment (Railway/Render)
1. Connect your repository
2. Set environment variables
3. Deploy

### Web Deployment (Vercel/Netlify)
1. Connect your repository
2. Configure build settings
3. Deploy

### Database (PostgreSQL)
- Use Railway, Render, or AWS RDS for production database

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:5173` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `SENTRY_DSN` | Sentry error tracking DSN | - |
| `REDIS_HOST` | Redis server host | localhost |
| `REDIS_PORT` | Redis server port | 6379 |

See `.env.example` for all available environment variables.

## 📊 Database Schema

The system uses Prisma ORM with PostgreSQL. Comprehensive schema with 200+ models covering:
- User & Authentication
- Employee Management
- Department & Position Management
- Attendance & Leave Management
- Payroll & Compensation
- Performance Management
- Learning & Development
- Asset Management
- Internal Communications
- Enterprise Integrations
- Governance & Compliance
- All 47 implementation phases complete

## 🎯 Implementation Status

### ✅ Completed Phases (1-47)
- Phase 1: Employee 360 Profile
- Phase 2: Payroll & Compliance Engine
- Phase 2: Leave Management 2.0
- Phase 2: Attendance Intelligence
- Phase 2: Recruitment Module
- Phase 3: Universal Workflow Engine
- Phase 4: Corporate Dashboard
- Phase 5: Security Hardening
- Phase 6: Multi-company SaaS
- Phase 7: Mobile App
- Phase 8: Workforce Intelligence
- Phase 10: Performance Management Suite
- Phase 11: Learning & Development
- Phase 12: Asset & Resource Management
- Phase 13: Internal Communications
- Phase 14: Enterprise Integrations
- Phase 15: Regional Compliance Layer
- Phase 16: Enterprise SaaS Architecture
- Phase 17: StaffRoom Ecosystem
- Phase 18: Executive Command Center
- Phase 19: Advanced Platform Features
- Phase 20: Advanced Shift Management
- Phase 21: Duty Roster & Compensation Calendar
- Phase 22: Time Bank & Days Owed
- Phase 23: Workforce Balancing & Department Hub
- Phase 24: Shift Swap & Coverage Planning
- Phase 25: Attendance Reconciliation & Workforce Planning
- Phase 26: Governance Layer Architecture
- Phase 27-31: Gap Analysis
- Phase 32-36: High Priority Features
- Phase 37-41: Medium Priority Features
- Phase 42-47: Low Priority Features

### 🔄 In Progress
- Testing Infrastructure
- CI/CD Pipeline Setup
- Production Deployment Configuration
- Monitoring & Logging Setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@staffroom.ke or open an issue on GitHub.

## 🙏 Acknowledgments

Built with ❤️ for Kenyan businesses
