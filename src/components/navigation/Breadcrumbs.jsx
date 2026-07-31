import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const MODULE_GROUPS = {
  Dashboard: 'Overview',
  Staff: 'Workforce',
  Payroll: 'Financials',
  Attendance: 'Time & Operations',
  Leave: 'Time & Operations',
  Documents: 'Governance & Docs',
  Benefits: 'Talent & Rewards',
  Performance: 'Talent & Growth',
  Calibration: 'Talent & Growth',
  Promotions: 'Talent & Growth',
  Budget: 'Financials',
  Benchmarking: 'Financials',
  Onboarding: 'Workforce',
  OrgChart: 'Workforce',
  Signatures: 'Governance & Docs',
  SelfService: 'Employee Portal',
  Reports: 'Analytics',
  Settings: 'System',
};

export default function Breadcrumbs({ currentPageName }) {
  const group = MODULE_GROUPS[currentPageName] || 'Enterprise';

  return (
    <nav className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-400">
      <Link
        to={createPageUrl('Dashboard')}
        className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
      >
        <Home className="w-3.5 h-3.5 text-slate-400" />
        <span>Staffroom</span>
      </Link>
      <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
      <span className="text-slate-400">{group}</span>
      <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
      <span className="font-semibold text-slate-900 dark:text-slate-100">{currentPageName}</span>
    </nav>
  );
}
