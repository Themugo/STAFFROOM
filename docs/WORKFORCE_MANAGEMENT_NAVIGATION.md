# Workforce Management Module - Frontend Navigation Structure

## Overview

This document defines the frontend navigation structure for the Workforce Management module, including menu hierarchy, route paths, and role-based access control.

## Navigation Hierarchy

```
Workforce Management
├── Shift Management
│   ├── Shift Templates
│   ├── Shift Assignments
│   └── Rotation Patterns
├── Duty Rosters
│   ├── Roster Builder
│   ├── Roster Assignments
│   └── Roster Calendar
├── Shift Swaps
│   ├── My Swap Requests
│   ├── Pending Approvals
│   └── Swap History
├── Compensation
│   ├── Compensation Calendar
│   ├── Compensation Rules
│   └── Compensation Credits
├── Time Bank
│   ├── My Time Bank
│   ├── Time Transactions
│   └── Time Balance
├── Hours & Days Owed
│   ├── Hours Owed
│   ├── Days Owed
│   └── Debt Repayment
├── Workforce Planning
│   ├── Workforce Forecasts
│   ├── Gap Analysis
│   └── Skill Requirements
├── Coverage Analysis
│   ├── Coverage Warnings
│   ├── Critical Skills
│   └── Resolution Tracking
├── Department Hub
│   ├── Department Posts
│   ├── Announcements
│   ├── Department Files
│   └── Meeting Notes
├── HOD Dashboard
│   ├── Team Overview
│   ├── Attendance Summary
│   ├── Pending Approvals
│   └── Roster Coverage
└── Workforce Analytics
    ├── Workforce Trends
    ├── Attendance Patterns
    ├── Risk Predictions
    └── Performance Analytics
```

## Route Configuration

### Base Route
`/workforce-management`

### Sub-Routes

#### Shift Management

| Route | Path | Component | Permissions |
|-------|------|-----------|-------------|
| Shift Templates | `/workforce-management/shift-templates` | ShiftTemplates | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER, EMPLOYEE |
| Shift Assignments | `/workforce-management/shift-assignments` | ShiftAssignments | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER, EMPLOYEE |
| Rotation Patterns | `/workforce-management/rotation-patterns` | RotationPatterns | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER, EMPLOYEE |

#### Duty Rosters

| Route | Path | Component | Permissions |
|-------|------|-----------|-------------|
| Roster Builder | `/workforce-management/roster-builder` | RosterBuilder | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER |
| Roster Assignments | `/workforce-management/roster-assignments` | RosterAssignments | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER, EMPLOYEE |
| Roster Calendar | `/workforce-management/roster-calendar` | RosterCalendar | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER, EMPLOYEE |

#### Shift Swaps

| Route | Path | Component | Permissions |
|-------|------|-----------|-------------|
| My Swap Requests | `/workforce-management/my-swaps` | MySwaps | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER, EMPLOYEE |
| Pending Approvals | `/workforce-management/pending-swaps` | PendingSwaps | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER |
| Swap History | `/workforce-management/swap-history` | SwapHistory | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER, EMPLOYEE |

#### Compensation

| Route | Path | Component | Permissions |
|-------|------|-----------|-------------|
| Compensation Calendar | `/workforce-management/compensation-calendar` | CompensationCalendar | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER, EMPLOYEE |
| Compensation Rules | `/workforce-management/compensation-rules` | CompensationRules | SUPER_ADMIN, ADMIN, HR_MANAGER |
| Compensation Credits | `/workforce-management/compensation-credits` | CompensationCredits | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER, EMPLOYEE |

#### Time Bank

| Route | Path | Component | Permissions |
|-------|------|-----------|-------------|
| My Time Bank | `/workforce-management/my-time-bank` | MyTimeBank | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER, EMPLOYEE |
| Time Transactions | `/workforce-management/time-transactions` | TimeTransactions | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER, EMPLOYEE |
| Time Balance | `/workforce-management/time-balance` | TimeBalance | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER, EMPLOYEE |

#### Hours & Days Owed

| Route | Path | Component | Permissions |
|-------|------|-----------|-------------|
| Hours Owed | `/workforce-management/hours-owed` | HoursOwed | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER, EMPLOYEE |
| Days Owed | `/workforce-management/days-owed` | DaysOwed | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER, EMPLOYEE |
| Debt Repayment | `/workforce-management/debt-repayment` | DebtRepayment | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER |

#### Workforce Planning

| Route | Path | Component | Permissions |
|-------|------|-----------|-------------|
| Workforce Forecasts | `/workforce-management/workforce-forecasts` | WorkforceForecasts | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER |
| Gap Analysis | `/workforce-management/gap-analysis` | GapAnalysis | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER |
| Skill Requirements | `/workforce-management/skill-requirements` | SkillRequirements | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER |

#### Coverage Analysis

| Route | Path | Component | Permissions |
|-------|------|-----------|-------------|
| Coverage Warnings | `/workforce-management/coverage-warnings` | CoverageWarnings | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER, EMPLOYEE |
| Critical Skills | `/workforce-management/critical-skills` | CriticalSkills | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER, EMPLOYEE |
| Resolution Tracking | `/workforce-management/resolution-tracking` | ResolutionTracking | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER |

#### Department Hub

| Route | Path | Component | Permissions |
|-------|------|-----------|-------------|
| Department Posts | `/workforce-management/department-posts` | DepartmentPosts | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER, EMPLOYEE |
| Announcements | `/workforce-management/announcements` | Announcements | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER, EMPLOYEE |
| Department Files | `/workforce-management/department-files` | DepartmentFiles | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER, EMPLOYEE |
| Meeting Notes | `/workforce-management/meeting-notes` | MeetingNotes | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER, EMPLOYEE |

#### HOD Dashboard

| Route | Path | Component | Permissions |
|-------|------|-----------|-------------|
| Team Overview | `/workforce-management/team-overview` | TeamOverview | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER |
| Attendance Summary | `/workforce-management/attendance-summary` | AttendanceSummary | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER |
| Pending Approvals | `/workforce-management/hod-pending-approvals` | HODPendingApprovals | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER |
| Roster Coverage | `/workforce-management/roster-coverage` | RosterCoverage | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER |

#### Workforce Analytics

| Route | Path | Component | Permissions |
|-------|------|-----------|-------------|
| Workforce Trends | `/workforce-management/workforce-trends` | WorkforceTrends | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER |
| Attendance Patterns | `/workforce-management/attendance-patterns` | AttendancePatterns | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER |
| Risk Predictions | `/workforce-management/risk-predictions` | RiskPredictions | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER |
| Performance Analytics | `/workforce-management/performance-analytics` | PerformanceAnalytics | SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER |

## Navigation Configuration (React Router)

```javascript
// workforceManagementRoutes.js
import { Route } from 'react-router-dom';
import ShiftTemplates from './ShiftTemplates';
import ShiftAssignments from './ShiftAssignments';
import RotationPatterns from './RotationPatterns';
import RosterBuilder from './RosterBuilder';
import RosterAssignments from './RosterAssignments';
import RosterCalendar from './RosterCalendar';
import MySwaps from './MySwaps';
import PendingSwaps from './PendingSwaps';
import SwapHistory from './SwapHistory';
import CompensationCalendar from './CompensationCalendar';
import CompensationRules from './CompensationRules';
import CompensationCredits from './CompensationCredits';
import MyTimeBank from './MyTimeBank';
import TimeTransactions from './TimeTransactions';
import TimeBalance from './TimeBalance';
import HoursOwed from './HoursOwed';
import DaysOwed from './DaysOwed';
import DebtRepayment from './DebtRepayment';
import WorkforceForecasts from './WorkforceForecasts';
import GapAnalysis from './GapAnalysis';
import SkillRequirements from './SkillRequirements';
import CoverageWarnings from './CoverageWarnings';
import CriticalSkills from './CriticalSkills';
import ResolutionTracking from './ResolutionTracking';
import DepartmentPosts from './DepartmentPosts';
import Announcements from './Announcements';
import DepartmentFiles from './DepartmentFiles';
import MeetingNotes from './MeetingNotes';
import TeamOverview from './TeamOverview';
import AttendanceSummary from './AttendanceSummary';
import HODPendingApprovals from './HODPendingApprovals';
import RosterCoverage from './RosterCoverage';
import WorkforceTrends from './WorkforceTrends';
import AttendancePatterns from './AttendancePatterns';
import RiskPredictions from './RiskPredictions';
import PerformanceAnalytics from './PerformanceAnalytics';

const workforceManagementRoutes = [
  // Shift Management
  <Route key="shift-templates" path="/workforce-management/shift-templates" element={<ShiftTemplates />} />,
  <Route key="shift-assignments" path="/workforce-management/shift-assignments" element={<ShiftAssignments />} />,
  <Route key="rotation-patterns" path="/workforce-management/rotation-patterns" element={<RotationPatterns />} />,
  
  // Duty Rosters
  <Route key="roster-builder" path="/workforce-management/roster-builder" element={<RosterBuilder />} />,
  <Route key="roster-assignments" path="/workforce-management/roster-assignments" element={<RosterAssignments />} />,
  <Route key="roster-calendar" path="/workforce-management/roster-calendar" element={<RosterCalendar />} />,
  
  // Shift Swaps
  <Route key="my-swaps" path="/workforce-management/my-swaps" element={<MySwaps />} />,
  <Route key="pending-swaps" path="/workforce-management/pending-swaps" element={<PendingSwaps />} />,
  <Route key="swap-history" path="/workforce-management/swap-history" element={<SwapHistory />} />,
  
  // Compensation
  <Route key="compensation-calendar" path="/workforce-management/compensation-calendar" element={<CompensationCalendar />} />,
  <Route key="compensation-rules" path="/workforce-management/compensation-rules" element={<CompensationRules />} />,
  <Route key="compensation-credits" path="/workforce-management/compensation-credits" element={<CompensationCredits />} />,
  
  // Time Bank
  <Route key="my-time-bank" path="/workforce-management/my-time-bank" element={<MyTimeBank />} />,
  <Route key="time-transactions" path="/workforce-management/time-transactions" element={<TimeTransactions />} />,
  <Route key="time-balance" path="/workforce-management/time-balance" element={<TimeBalance />} />,
  
  // Hours & Days Owed
  <Route key="hours-owed" path="/workforce-management/hours-owed" element={<HoursOwed />} />,
  <Route key="days-owed" path="/workforce-management/days-owed" element={<DaysOwed />} />,
  <Route key="debt-repayment" path="/workforce-management/debt-repayment" element={<DebtRepayment />} />,
  
  // Workforce Planning
  <Route key="workforce-forecasts" path="/workforce-management/workforce-forecasts" element={<WorkforceForecasts />} />,
  <Route key="gap-analysis" path="/workforce-management/gap-analysis" element={<GapAnalysis />} />,
  <Route key="skill-requirements" path="/workforce-management/skill-requirements" element={<SkillRequirements />} />,
  
  // Coverage Analysis
  <Route key="coverage-warnings" path="/workforce-management/coverage-warnings" element={<CoverageWarnings />} />,
  <Route key="critical-skills" path="/workforce-management/critical-skills" element={<CriticalSkills />} />,
  <Route key="resolution-tracking" path="/workforce-management/resolution-tracking" element={<ResolutionTracking />} />,
  
  // Department Hub
  <Route key="department-posts" path="/workforce-management/department-posts" element={<DepartmentPosts />} />,
  <Route key="announcements" path="/workforce-management/announcements" element={<Announcements />} />,
  <Route key="department-files" path="/workforce-management/department-files" element={<DepartmentFiles />} />,
  <Route key="meeting-notes" path="/workforce-management/meeting-notes" element={<MeetingNotes />} />,
  
  // HOD Dashboard
  <Route key="team-overview" path="/workforce-management/team-overview" element={<TeamOverview />} />,
  <Route key="attendance-summary" path="/workforce-management/attendance-summary" element={<AttendanceSummary />} />,
  <Route key="hod-pending-approvals" path="/workforce-management/hod-pending-approvals" element={<HODPendingApprovals />} />,
  <Route key="roster-coverage" path="/workforce-management/roster-coverage" element={<RosterCoverage />} />,
  
  // Workforce Analytics
  <Route key="workforce-trends" path="/workforce-management/workforce-trends" element={<WorkforceTrends />} />,
  <Route key="attendance-patterns" path="/workforce-management/attendance-patterns" element={<AttendancePatterns />} />,
  <Route key="risk-predictions" path="/workforce-management/risk-predictions" element={<RiskPredictions />} />,
  <Route key="performance-analytics" path="/workforce-management/performance-analytics" element={<PerformanceAnalytics />} />,
];

export default workforceManagementRoutes;
```

## Menu Configuration (Sidebar)

```javascript
// workforceManagementMenu.js
export const workforceManagementMenu = [
  {
    title: 'Shift Management',
    icon: 'Clock',
    permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE'],
    items: [
      {
        title: 'Shift Templates',
        path: '/workforce-management/shift-templates',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']
      },
      {
        title: 'Shift Assignments',
        path: '/workforce-management/shift-assignments',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']
      },
      {
        title: 'Rotation Patterns',
        path: '/workforce-management/rotation-patterns',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']
      }
    ]
  },
  {
    title: 'Duty Rosters',
    icon: 'Calendar',
    permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE'],
    items: [
      {
        title: 'Roster Builder',
        path: '/workforce-management/roster-builder',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']
      },
      {
        title: 'Roster Assignments',
        path: '/workforce-management/roster-assignments',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']
      },
      {
        title: 'Roster Calendar',
        path: '/workforce-management/roster-calendar',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']
      }
    ]
  },
  {
    title: 'Shift Swaps',
    icon: 'SwapHorizontal',
    permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE'],
    items: [
      {
        title: 'My Swap Requests',
        path: '/workforce-management/my-swaps',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']
      },
      {
        title: 'Pending Approvals',
        path: '/workforce-management/pending-swaps',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']
      },
      {
        title: 'Swap History',
        path: '/workforce-management/swap-history',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']
      }
    ]
  },
  {
    title: 'Compensation',
    icon: 'DollarSign',
    permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE'],
    items: [
      {
        title: 'Compensation Calendar',
        path: '/workforce-management/compensation-calendar',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']
      },
      {
        title: 'Compensation Rules',
        path: '/workforce-management/compensation-rules',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']
      },
      {
        title: 'Compensation Credits',
        path: '/workforce-management/compensation-credits',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']
      }
    ]
  },
  {
    title: 'Time Bank',
    icon: 'Bank',
    permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE'],
    items: [
      {
        title: 'My Time Bank',
        path: '/workforce-management/my-time-bank',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']
      },
      {
        title: 'Time Transactions',
        path: '/workforce-management/time-transactions',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']
      },
      {
        title: 'Time Balance',
        path: '/workforce-management/time-balance',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']
      }
    ]
  },
  {
    title: 'Hours & Days Owed',
    icon: 'AlertCircle',
    permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE'],
    items: [
      {
        title: 'Hours Owed',
        path: '/workforce-management/hours-owed',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']
      },
      {
        title: 'Days Owed',
        path: '/workforce-management/days-owed',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']
      },
      {
        title: 'Debt Repayment',
        path: '/workforce-management/debt-repayment',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']
      }
    ]
  },
  {
    title: 'Workforce Planning',
    icon: 'TrendingUp',
    permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER'],
    items: [
      {
        title: 'Workforce Forecasts',
        path: '/workforce-management/workforce-forecasts',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']
      },
      {
        title: 'Gap Analysis',
        path: '/workforce-management/gap-analysis',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']
      },
      {
        title: 'Skill Requirements',
        path: '/workforce-management/skill-requirements',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']
      }
    ]
  },
  {
    title: 'Coverage Analysis',
    icon: 'Shield',
    permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE'],
    items: [
      {
        title: 'Coverage Warnings',
        path: '/workforce-management/coverage-warnings',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']
      },
      {
        title: 'Critical Skills',
        path: '/workforce-management/critical-skills',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']
      },
      {
        title: 'Resolution Tracking',
        path: '/workforce-management/resolution-tracking',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']
      }
    ]
  },
  {
    title: 'Department Hub',
    icon: 'Users',
    permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE'],
    items: [
      {
        title: 'Department Posts',
        path: '/workforce-management/department-posts',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']
      },
      {
        title: 'Announcements',
        path: '/workforce-management/announcements',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']
      },
      {
        title: 'Department Files',
        path: '/workforce-management/department-files',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']
      },
      {
        title: 'Meeting Notes',
        path: '/workforce-management/meeting-notes',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE']
      }
    ]
  },
  {
    title: 'HOD Dashboard',
    icon: 'LayoutDashboard',
    permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER'],
    items: [
      {
        title: 'Team Overview',
        path: '/workforce-management/team-overview',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']
      },
      {
        title: 'Attendance Summary',
        path: '/workforce-management/attendance-summary',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']
      },
      {
        title: 'Pending Approvals',
        path: '/workforce-management/hod-pending-approvals',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']
      },
      {
        title: 'Roster Coverage',
        path: '/workforce-management/roster-coverage',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']
      }
    ]
  },
  {
    title: 'Workforce Analytics',
    icon: 'BarChart',
    permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER'],
    items: [
      {
        title: 'Workforce Trends',
        path: '/workforce-management/workforce-trends',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']
      },
      {
        title: 'Attendance Patterns',
        path: '/workforce-management/attendance-patterns',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']
      },
      {
        title: 'Risk Predictions',
        path: '/workforce-management/risk-predictions',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']
      },
      {
        title: 'Performance Analytics',
        path: '/workforce-management/performance-analytics',
        permissions: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'MANAGER']
      }
    ]
  }
];
```

## Permission Guard Component

```javascript
// PermissionGuard.js
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

const PermissionGuard = ({ children, requiredPermissions }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!requiredPermissions.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default PermissionGuard;
```

## Breadcrumb Configuration

```javascript
// workforceManagementBreadcrumbs.js
export const workforceManagementBreadcrumbs = {
  '/workforce-management/shift-templates': ['Workforce Management', 'Shift Management', 'Shift Templates'],
  '/workforce-management/shift-assignments': ['Workforce Management', 'Shift Management', 'Shift Assignments'],
  '/workforce-management/rotation-patterns': ['Workforce Management', 'Shift Management', 'Rotation Patterns'],
  '/workforce-management/roster-builder': ['Workforce Management', 'Duty Rosters', 'Roster Builder'],
  '/workforce-management/roster-assignments': ['Workforce Management', 'Duty Rosters', 'Roster Assignments'],
  '/workforce-management/roster-calendar': ['Workforce Management', 'Duty Rosters', 'Roster Calendar'],
  '/workforce-management/my-swaps': ['Workforce Management', 'Shift Swaps', 'My Swap Requests'],
  '/workforce-management/pending-swaps': ['Workforce Management', 'Shift Swaps', 'Pending Approvals'],
  '/workforce-management/swap-history': ['Workforce Management', 'Shift Swaps', 'Swap History'],
  '/workforce-management/compensation-calendar': ['Workforce Management', 'Compensation', 'Compensation Calendar'],
  '/workforce-management/compensation-rules': ['Workforce Management', 'Compensation', 'Compensation Rules'],
  '/workforce-management/compensation-credits': ['Workforce Management', 'Compensation', 'Compensation Credits'],
  '/workforce-management/my-time-bank': ['Workforce Management', 'Time Bank', 'My Time Bank'],
  '/workforce-management/time-transactions': ['Workforce Management', 'Time Bank', 'Time Transactions'],
  '/workforce-management/time-balance': ['Workforce Management', 'Time Bank', 'Time Balance'],
  '/workforce-management/hours-owed': ['Workforce Management', 'Hours & Days Owed', 'Hours Owed'],
  '/workforce-management/days-owed': ['Workforce Management', 'Hours & Days Owed', 'Days Owed'],
  '/workforce-management/debt-repayment': ['Workforce Management', 'Hours & Days Owed', 'Debt Repayment'],
  '/workforce-management/workforce-forecasts': ['Workforce Management', 'Workforce Planning', 'Workforce Forecasts'],
  '/workforce-management/gap-analysis': ['Workforce Management', 'Workforce Planning', 'Gap Analysis'],
  '/workforce-management/skill-requirements': ['Workforce Management', 'Workforce Planning', 'Skill Requirements'],
  '/workforce-management/coverage-warnings': ['Workforce Management', 'Coverage Analysis', 'Coverage Warnings'],
  '/workforce-management/critical-skills': ['Workforce Management', 'Coverage Analysis', 'Critical Skills'],
  '/workforce-management/resolution-tracking': ['Workforce Management', 'Coverage Analysis', 'Resolution Tracking'],
  '/workforce-management/department-posts': ['Workforce Management', 'Department Hub', 'Department Posts'],
  '/workforce-management/announcements': ['Workforce Management', 'Department Hub', 'Announcements'],
  '/workforce-management/department-files': ['Workforce Management', 'Department Hub', 'Department Files'],
  '/workforce-management/meeting-notes': ['Workforce Management', 'Department Hub', 'Meeting Notes'],
  '/workforce-management/team-overview': ['Workforce Management', 'HOD Dashboard', 'Team Overview'],
  '/workforce-management/attendance-summary': ['Workforce Management', 'HOD Dashboard', 'Attendance Summary'],
  '/workforce-management/hod-pending-approvals': ['Workforce Management', 'HOD Dashboard', 'Pending Approvals'],
  '/workforce-management/roster-coverage': ['Workforce Management', 'HOD Dashboard', 'Roster Coverage'],
  '/workforce-management/workforce-trends': ['Workforce Management', 'Workforce Analytics', 'Workforce Trends'],
  '/workforce-management/attendance-patterns': ['Workforce Management', 'Workforce Analytics', 'Attendance Patterns'],
  '/workforce-management/risk-predictions': ['Workforce Management', 'Workforce Analytics', 'Risk Predictions'],
  '/workforce-management/performance-analytics': ['Workforce Management', 'Workforce Analytics', 'Performance Analytics']
};
```

## Default Route

**Default Route:** `/workforce-management/shift-templates`

**Redirect Logic:**
- If user is EMPLOYEE: Redirect to `/workforce-management/my-swaps`
- If user is MANAGER: Redirect to `/workforce-management/team-overview`
- If user is HR_MANAGER or above: Redirect to `/workforce-management/shift-templates`

## Mobile Navigation

For mobile devices, the navigation should be collapsed into a hamburger menu with the same structure but optimized for touch interaction.

## Accessibility

- All navigation items should have proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

---

**Version:** 1.0.0  
**Last Updated:** June 12, 2026  
**Status:** Production Ready
