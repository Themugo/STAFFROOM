import Attendance from './pages/Attendance';
import Dashboard from './pages/Dashboard';
import Leave from './pages/Leave.jsx';
import Payroll from './pages/Payroll';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Staff from './pages/Staff';
import Documents from './pages/Documents.jsx';
import Benefits from './pages/Benefits';
import Performance from './pages/Performance';
import Onboarding from './pages/Onboarding';
import Recruitment from './pages/Recruitment';
import OrgChart from './pages/OrgChart';
import SelfService from './pages/SelfService';
import Signatures from './pages/Signatures';
import Calibration from './pages/Calibration';
import Promotions from './pages/Promotions';
import Budget from './pages/Budget';
import Benchmarking from './pages/Benchmarking';
import EmployeeProfile from './pages/EmployeeProfile';
import DutyRoster from './pages/DutyRoster.jsx';
import ApprovalCenter from './pages/ApprovalCenter.jsx';
import PolicyCenter from './pages/PolicyCenter.jsx';
import WorkflowBuilder from './pages/WorkflowBuilder.jsx';
import WorkforceAnalytics from './pages/WorkforceAnalytics.jsx';
import __Layout from './Layout.jsx';

export const PAGES = {
    "Attendance": Attendance,
    "Dashboard": Dashboard,
    "Leave": Leave,
    "Payroll": Payroll,
    "Reports": Reports,
    "Settings": Settings,
    "Staff": Staff,
    "EmployeeProfile": EmployeeProfile,
    "Documents": Documents,
    "Benefits": Benefits,
    "Performance": Performance,
    "Onboarding": Onboarding,
    "Recruitment": Recruitment,
    "OrgChart": OrgChart,
    "SelfService": SelfService,
    "Signatures": Signatures,
    "Calibration": Calibration,
    "Promotions": Promotions,
    "Budget": Budget,
    "Benchmarking": Benchmarking,
    "DutyRoster": DutyRoster,
    "ApprovalCenter": ApprovalCenter,
    "PolicyCenter": PolicyCenter,
    "WorkflowBuilder": WorkflowBuilder,
    "WorkforceAnalytics": WorkforceAnalytics,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};
