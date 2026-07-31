const STATUS_MAP = {
  ACTIVE: 'green', APPROVED: 'green', PROCESSED: 'green', COMPLETED: 'green', ON_TIME: 'green', PRESENT: 'green', OPEN: 'green',
  PENDING: 'yellow', DRAFT: 'yellow', REVIEW: 'yellow', UNDER_REVIEW: 'yellow', PROBATION: 'yellow', SCHEDULED: 'blue',
  REJECTED: 'red', CANCELLED: 'red', OVERDUE: 'red', ABSENT: 'red', SUSPENDED: 'red', CLOSED: 'gray', INACTIVE: 'gray',
  APPLIED: 'blue', INTERVIEWED: 'purple', OFFERED: 'green', HIRED: 'green', REJECTED_CANDIDATE: 'red',
  LATE: 'yellow', ABSENT_LATE: 'red', EARLY_LEAVE: 'yellow',
  TRIAL: 'blue', ACTIVE_SUB: 'green', EXPIRED: 'red',
};

export default function StatusBadge({ status, label, className = '' }) {
  const normalized = (status || '').toUpperCase();
  const color = STATUS_MAP[normalized] || 'gray';

  const colorStyles = {
    green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40',
    red: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/40',
    yellow: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/40',
    blue: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-800/40',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200/60 dark:border-purple-800/40',
    gray: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  };

  const formattedText = label || status?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) || 'Unknown';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-wide whitespace-nowrap ${colorStyles[color]} ${className}`}
    >
      {formattedText}
    </span>
  );
}

