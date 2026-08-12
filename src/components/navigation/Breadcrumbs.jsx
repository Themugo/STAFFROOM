import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const MODULE_GROUPS = {
  Dashboard: 'Overview',
  Staff: 'People & Staff',
  Payroll: 'Finance & Compensation',
  Attendance: 'Time & Operations',
  Leave: 'Time & Operations',
  DutyRoster: 'Time & Operations',
  Documents: 'Workflows & Docs',
  Benefits: 'Talent & Perks',
  Performance: 'Talent & Growth',
  Budget: 'Finance',
  Procurement: 'Finance',
  Onboarding: 'People & Staff',
  SelfService: 'My Work',
  AICopilot: 'Intelligence',
  WorkforceAnalytics: 'Intelligence',
  Reports: 'Governance & Audit',
  Settings: 'Administration',
};

export default function Breadcrumbs({ currentPageName }) {
  const group = MODULE_GROUPS[currentPageName] || 'Enterprise OS';

  return (
    <nav className="hidden md:flex items-center gap-1.5 text-xs font-medium text-[#52677F]">
      <Link
        to={createPageUrl('Dashboard')}
        className="flex items-center gap-1 hover:text-[#2563EB] transition-colors"
      >
        <Home className="w-3.5 h-3.5 text-[#2563EB]" />
        <span>StaffRoom</span>
      </Link>
      <ChevronRight className="w-3.5 h-3.5 text-[#7890A8]" />
      <span className="text-[#52677F]">{group}</span>
      <ChevronRight className="w-3.5 h-3.5 text-[#7890A8]" />
      <span className="font-bold text-[#102A43]">{currentPageName}</span>
    </nav>
  );
}
