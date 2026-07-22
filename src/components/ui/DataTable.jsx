import EmptyState from './EmptyState'
import Spinner from './Spinner'

export default function DataTable({ columns, data, loading, emptyTitle, emptyDescription, emptyIcon, onRowClick, keyField = 'id' }) {
  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="card">
        <EmptyState icon={emptyIcon} title={emptyTitle || 'No data found'} description={emptyDescription} />
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto scrollbar-hide">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={`table-header ${col.className || ''}`} style={col.width ? { width: col.width } : {}}>
                  {typeof col.header === 'function' ? col.header() : col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900">
            {data.map((row) => (
              <tr
                key={row[keyField]}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`table-cell ${col.cellClassName || ''}`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
