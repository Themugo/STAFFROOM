import { useState } from 'react';
import { Bell, Clock, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
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
        className="relative p-2 rounded-xl bg-[#F6F9FD] hover:bg-[#EAF3FF] border border-[#DCE6F2] text-[#52677F] hover:text-[#2563EB] transition-colors cursor-pointer"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#D94B61] rounded-full ring-2 ring-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 z-50 w-80 sm:w-96 bg-white rounded-2xl border border-[#DCE6F2] shadow-xl p-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE6F2]">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#102A43] text-xs uppercase tracking-wider">Activity & Alerts</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-[#D94B61]">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] cursor-pointer"
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
                  className={`p-3 rounded-xl border transition-all ${
                    !n.read
                      ? 'bg-[#EAF3FF]/60 border-[#2563EB]/20'
                      : 'bg-white border-[#DCE6F2]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-[#D98B00] shrink-0" />}
                      {n.type === 'action' && <Clock className="w-4 h-4 text-[#2563EB] shrink-0" />}
                      {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#159A68] shrink-0" />}
                      {n.type === 'info' && <Bell className="w-4 h-4 text-[#2563EB] shrink-0" />}
                      <span className="font-semibold text-xs text-[#102A43]">{n.title}</span>
                    </div>
                    <span className="text-[10px] text-[#7890A8] shrink-0">{n.time}</span>
                  </div>
                  <p className="text-xs text-[#52677F] mt-1 pl-6">{n.message}</p>
                  <div className="flex items-center justify-between mt-2 pl-6">
                    <Link
                      to={createPageUrl(n.page)}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2563EB] hover:text-[#1D4ED8]"
                    >
                      View details <ArrowRight className="w-3 h-3" />
                    </Link>
                    <button
                      onClick={() => toggleRead(n.id)}
                      className="text-[10px] text-[#7890A8] hover:text-[#102A43] cursor-pointer"
                    >
                      {n.read ? 'Mark unread' : 'Mark read'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-[#DCE6F2] mt-3 text-center">
              <Link
                to={createPageUrl('Reports')}
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-[#52677F] hover:text-[#102A43]"
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
