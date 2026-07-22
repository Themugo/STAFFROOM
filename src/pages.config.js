/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
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
import OrgChart from './pages/OrgChart';
import SelfService from './pages/SelfService';
import Signatures from './pages/Signatures';
import Calibration from './pages/Calibration';
import Promotions from './pages/Promotions';
import Budget from './pages/Budget';
import Benchmarking from './pages/Benchmarking';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Attendance": Attendance,
    "Dashboard": Dashboard,
    "Leave": Leave,
    "Payroll": Payroll,
    "Reports": Reports,
    "Settings": Settings,
    "Staff": Staff,
    "Documents": Documents,
    "Benefits": Benefits,
    "Performance": Performance,
    "Onboarding": Onboarding,
    "OrgChart": OrgChart,
    "SelfService": SelfService,
    "Signatures": Signatures,
    "Calibration": Calibration,
    "Promotions": Promotions,
    "Budget": Budget,
    "Benchmarking": Benchmarking,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};