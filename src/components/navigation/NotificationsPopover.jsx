import { useState } from 'react';
import { Bell, Check, Clock, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const INITIAL_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Leave Request Pending Approval',
    message: 'David Miller submitted 3 days of Annual Leave for next week.',
    time: '10m ago',
    type: 'warning',
    page: 'Leave',
    read: false,
  },
  {
    id: '2',
    title: 'Payroll Approval Due',
    message: 'July Payroll draft is ready for final executive signature.',
    time: '1h ago',
    type: 'action',
    page: 'Payroll',
    read: false,
  },
  {
    id: '3',
    title: 'Performance Cycle Launched',
    message: 'Q3 360-Degree Feedback cycle has been dispatched to 24 team members.',
    time: '3h ago',
    type: 'info',
    page: 'Performance',
    read: true,
  },
  {
    id: '4',
    title: 'New Document Signed',
    message: 'NDA signed by Marcus Vance.',
    time: '1d ago',
    type: 'success',
    page: 'Signatures',
    read: true,
  },
];

export default function NotificationsPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 z-50 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Activity & Alerts</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* List */}
            <div className="mt-3 space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    !n.read
                      ? 'bg-indigo-50/40 border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/40'
                      : 'bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
                      {n.type === 'action' && <Clock className="w-4 h-4 text-indigo-500 shrink-0" />}
                      {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                      {n.type === 'info' && <Bell className="w-4 h-4 text-sky-500 shrink-0" />}
                      <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">{n.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-6">{n.message}</p>
                  <div className="flex items-center justify-between mt-2 pl-6">
                    <Link
                      to={createPageUrl(n.page)}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                      View details <ArrowRight className="w-3 h-3" />
                    </Link>
                    <button
                      onClick={() => toggleRead(n.id)}
                      className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {n.read ? 'Mark unread' : 'Mark read'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-3 text-center">
              <Link
                to={createPageUrl('Reports')}
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              >
                View all audit logs & activity
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
