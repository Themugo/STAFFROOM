const COLOR_MAP = {
  blue: 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400',
  green: 'bg-success-100 text-success-600 dark:bg-success-900/40 dark:text-success-400',
  yellow: 'bg-warning-100 text-warning-600 dark:bg-warning-900/40 dark:text-warning-400',
  red: 'bg-danger-100 text-danger-600 dark:bg-danger-900/40 dark:text-danger-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
  cyan: 'bg-accent-100 text-accent-600 dark:bg-accent-900/40 dark:text-accent-400',
  gray: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

export default function StatCard({ icon: Icon, label, value, sublabel, color = 'blue', trend, loading }) {
  if (loading) {
    return (
      <div className="card p-5">
        <div className="skeleton h-12 w-12 rounded-xl mb-3" />
        <div className="skeleton h-4 w-20 mb-2" />
        <div className="skeleton h-6 w-16" />
      </div>
    )
  }

  return (
    <div className="card-hover p-5">
      <div className="flex items-center justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${COLOR_MAP[color]}`}>
          <Icon size={22} />
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trend > 0 ? 'text-success-600' : 'text-danger-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      {sublabel && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{sublabel}</p>}
    </div>
  )
}
