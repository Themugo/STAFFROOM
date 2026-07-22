const STATUS_MAP = {
  ACTIVE: 'green', APPROVED: 'green', PROCESSED: 'green', COMPLETED: 'green', ON_TIME: 'green', PRESENT: 'green', OPEN: 'green',
  PENDING: 'yellow', DRAFT: 'yellow', REVIEW: 'yellow', UNDER_REVIEW: 'yellow', PROBATION: 'yellow', SCHEDULED: 'blue',
  REJECTED: 'red', CANCELLED: 'red', OVERDUE: 'red', ABSENT: 'red', SUSPENDED: 'red', CLOSED: 'gray', INACTIVE: 'gray',
  APPLIED: 'blue', INTERVIEWED: 'purple', OFFERED: 'green', HIRED: 'green', REJECTED_CANDIDATE: 'red',
  LATE: 'yellow', ABSENT_LATE: 'red', EARLY_LEAVE: 'yellow',
  TRIAL: 'blue', ACTIVE_SUB: 'green', EXPIRED: 'red',
}

export default function StatusBadge({ status, label }) {
  const color = STATUS_MAP[status] || 'gray'
  const classes = {
    green: 'badge-green', red: 'badge-red', yellow: 'badge-yellow',
    blue: 'badge-blue', purple: 'badge-purple', gray: 'badge-gray',
  }
  return (
    <span className={classes[color]}>
      {label || status?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
    </span>
  )
}
