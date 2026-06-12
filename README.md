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

### Security & Authentication
- JWT-based authentication
- Role-based access control (Super Admin, Admin, HR Manager, Manager, Employee)
- Secure password hashing with bcrypt
- Session management
- Audit logging for all actions

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
│   │   │   ├── controllers/ # Business logic
│   │   │   ├── middleware/ # Auth, validation, etc.
│   │   │   ├── routes/   # API routes
│   │   │   ├── app.js    # Express app setup
│   │   │   └── server.js # Server entry point
│   │   └── package.json
│   ├── web/              # Frontend (React + Vite)
│   │   ├── src/
│   │   │   ├── components/ # React components
│   │   │   ├── contexts/  # React contexts (Auth)
│   │   │   ├── lib/       # Utilities
│   │   │   ├── pages/     # Page components
│   │   │   ├── App.jsx    # Main app with routing
│   │   │   └── main.jsx   # Entry point
│   │   └── package.json
│   └── mobile/           # Mobile app (React Native - Coming Soon)
├── packages/
│   └── db/               # Database schema (Prisma)
│       └── schema.prisma
├── docker-compose.yml    # Docker configuration
├── .env.example          # Environment variables template
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee (Admin/HR)
- `PUT /api/employees/:id` - Update employee (Admin/HR)
- `DELETE /api/employees/:id` - Delete employee (Admin)
- `GET /api/employees/stats` - Get employee statistics

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID
- `POST /api/departments` - Create department (Admin/HR)
- `PUT /api/departments/:id` - Update department (Admin/HR)
- `DELETE /api/departments/:id` - Delete department (Admin)

### Positions
- `GET /api/positions` - Get all positions
- `GET /api/positions/:id` - Get position by ID
- `POST /api/positions` - Create position (Admin/HR)
- `PUT /api/positions/:id` - Update position (Admin/HR)
- `DELETE /api/positions/:id` - Delete position (Admin)

### Attendance
- `GET /api/attendance` - Get attendance records
- `GET /api/attendance/:id` - Get attendance by ID
- `POST /api/attendance/check-in` - Check in
- `POST /api/attendance/check-out` - Check out
- `GET /api/attendance/stats` - Get attendance statistics

### Leave Management
- `GET /api/leaves` - Get all leave requests
- `GET /api/leaves/:id` - Get leave by ID
- `POST /api/leaves` - Create leave request
- `PUT /api/leaves/:id/approve` - Approve leave (Manager)
- `PUT /api/leaves/:id/reject` - Reject leave (Manager)
- `GET /api/leaves/stats` - Get leave statistics

## 👥 User Roles

1. **SUPER_ADMIN** - Full system access
2. **ADMIN** - Administrative access
3. **HR_MANAGER** - HR operations access
4. **MANAGER** - Department management access
5. **EMPLOYEE** - Basic employee access

## 🧪 Testing

```bash
# API tests
cd apps/api
npm test

# Web tests
cd apps/web
npm test
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

## 📊 Database Schema

The system uses Prisma ORM with PostgreSQL. Key models:
- User (Authentication)
- Employee (Staff information)
- Department (Organizational structure)
- Position (Job roles)
- Attendance (Check-in/out records)
- Leave (Leave requests)
- PerformanceReview (Performance tracking)
- Document (File management)
- AuditLog (Activity tracking)

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

## 🎯 Roadmap

### Phase 2 (In Progress)
- [ ] Payroll management
- [ ] Advanced reporting
- [ ] Document management
- [ ] Notification system
- [ ] Mobile app (React Native)

### Phase 3 (Planned)
- [ ] Biometric integration
- [ ] AI-powered insights
- [ ] Advanced analytics
- [ ] Integration with payment gateways
- [ ] Multi-tenant support

## 🙏 Acknowledgments

Built with ❤️ for Kenyan businesses
