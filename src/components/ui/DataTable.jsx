import EmptyState from './EmptyState'
import Spinner from './Spinner'

export default function DataTable({ columns, data, loading, emptyTitle, emptyDescription, emptyIcon, onRowClick, keyField = 'id' }) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-12 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
        <EmptyState icon={emptyIcon} title={emptyTitle || 'No records available'} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left">
          <thead className="bg-slate-50/80 dark:bg-slate-800/40">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${col.className || ''}`}
                  style={col.width ? { width: col.width } : {}}
                >
                  {typeof col.header === 'function' ? col.header() : col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
            {data.map((row) => (
              <tr
                key={row[keyField]}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`transition-colors text-sm text-slate-700 dark:text-slate-200 ${
                  onRowClick ? 'cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50' : 'hover:bg-slate-50/40 dark:hover:bg-slate-800/20'
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-6 py-4 whitespace-nowrap ${col.cellClassName || ''}`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

