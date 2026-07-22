import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'

export default function ConfirmDialog({ open, onClose, onConfirm, title = 'Confirm', message, confirmLabel = 'Confirm', danger = true, loading }) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center py-2">
        <div className={`flex h-14 w-14 items-center justify-center rounded-full ${danger ? 'bg-danger-100 dark:bg-danger-900/40' : 'bg-warning-100 dark:bg-warning-900/40'}`}>
          <AlertTriangle size={26} className={danger ? 'text-danger-600 dark:text-danger-400' : 'text-warning-600 dark:text-warning-400'} />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        {message && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{message}</p>}
      </div>
      <div className="mt-6 flex justify-center gap-3">
        <button onClick={onClose} className="btn-secondary">Cancel</button>
        <button onClick={onConfirm} disabled={loading} className={danger ? 'btn-danger' : 'btn-primary'}>
          {loading ? 'Processing...' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
