/**
 * CSV export utility — converts array of objects to CSV and triggers download.
 * @param {Array<Object>} data — Array of records to export
 * @param {Array<{key: string, label: string}>} columns — Column definitions
 * @param {string} filename — Output file name
 */
export function exportToCSV(data, columns, filename = 'export.csv') {
  if (!data || data.length === 0) return

  const headers = columns.map((c) => `"${c.label}"`).join(',')
  const rows = data.map((row) =>
    columns
      .map((c) => {
        const val = c.key.split('.').reduce((obj, k) => obj?.[k], row)
        const str = val == null ? '' : String(val).replace(/"/g, '""')
        return `"${str}"`
      })
      .join(',')
  )

  const csv = [headers, ...rows].join('\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Generic data export to a downloadable file.
 * @param {string} content — File content
 * @param {string} filename — Output file name
 * @param {string} mimeType — MIME type
 */
export function downloadFile(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
