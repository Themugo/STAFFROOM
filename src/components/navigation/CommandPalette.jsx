import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Search,
  LayoutDashboard,
  Users,
  DollarSign,
  CalendarCheck,
  Palmtree,
  FileText,
  Heart,
  TrendingUp,
  SlidersHorizontal,
  ArrowUpCircle,
  PieChart,
  Scale,
  ListChecks,
  GitBranch,
  FilePen,
  UserCircle,
  FileBarChart2,
  Settings,
  Plus,
  Clock,
  Sparkles,
  X
} from 'lucide-react';

const ALL_PAGES = [
  { label: 'Dashboard', page: 'Dashboard', icon: LayoutDashboard, group: 'Navigation' },
  { label: 'Staff Directory', page: 'Staff', icon: Users, group: 'Navigation' },
  { label: 'Payroll & Tasks', page: 'Payroll', icon: DollarSign, group: 'Navigation' },
  { label: 'Attendance', page: 'Attendance', icon: CalendarCheck, group: 'Navigation' },
  { label: 'Leave Planner', page: 'Leave', icon: Palmtree, group: 'Navigation' },
  { label: 'Documents', page: 'Documents', icon: FileText, group: 'Navigation' },
  { label: 'Benefits', page: 'Benefits', icon: Heart, group: 'Navigation' },
  { label: 'Performance', page: 'Performance', icon: TrendingUp, group: 'Navigation' },
  { label: 'Calibration', page: 'Calibration', icon: SlidersHorizontal, group: 'Navigation' },
  { label: 'Promotions', page: 'Promotions', icon: ArrowUpCircle, pageParam: 'Promotions', group: 'Navigation' },
  { label: 'Budget', page: 'Budget', icon: PieChart, group: 'Navigation' },
  { label: 'Benchmarking', page: 'Benchmarking', icon: Scale, group: 'Navigation' },
  { label: 'Onboarding', page: 'Onboarding', icon: ListChecks, group: 'Navigation' },
  { label: 'Org Chart', page: 'OrgChart', icon: GitBranch, group: 'Navigation' },
  { label: 'Signatures', page: 'Signatures', icon: FilePen, group: 'Navigation' },
  { label: 'Self-Service', page: 'SelfService', icon: UserCircle, group: 'Navigation' },
  { label: 'Reports', page: 'Reports', icon: FileBarChart2, group: 'Navigation' },
  { label: 'Settings', page: 'Settings', icon: Settings, group: 'Navigation' },
];

const QUICK_ACTIONS = [
  { label: 'Record Attendance / Clock In', page: 'Attendance', action: 'clock-in', icon: Clock, group: 'Actions' },
  { label: 'Request Time Off / Leave', page: 'Leave', action: 'new-leave', icon: Palmtree, group: 'Actions' },
  { label: 'Submit Expense Claim', page: 'SelfService', action: 'new-claim', icon: DollarSign, group: 'Actions' },
  { label: 'Add New Employee', page: 'Staff', action: 'new-staff', icon: Plus, group: 'Actions' },
  { label: 'Run Payroll Cycle', page: 'Payroll', action: 'run-payroll', icon: Sparkles, group: 'Actions' },
];

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredPages = ALL_PAGES.filter(p =>
    p.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredActions = QUICK_ACTIONS.filter(a =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (page) => {
    navigate(createPageUrl(page));
    onClose(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Type a command or search modules... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent border-none text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-0"
          />
          <button
            onClick={() => onClose(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-4 custom-scrollbar">
          {/* Quick Actions */}
          {filteredActions.length > 0 && (
            <div>
              <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">Quick Actions</p>
              <div className="space-y-1 mt-1">
                {filteredActions.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(item.page)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">Action</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Pages */}
          {filteredPages.length > 0 && (
            <div>
              <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">Modules & Views</p>
              <div className="space-y-1 mt-1">
                {filteredPages.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(item.page)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-slate-400" />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-xs text-slate-400">Jump to</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredPages.length === 0 && filteredActions.length === 0 && (
            <div className="py-8 text-center text-sm text-slate-400">
              No matching modules or actions found.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Navigation Shortcuts</span>
          <div className="flex items-center gap-2">
            <span className="bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">Esc</span> to close
          </div>
        </div>
      </div>
    </div>
  );
}
