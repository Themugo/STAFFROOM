import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'

export default function ConfirmDialog({ open, onClose, onConfirm, title = 'Confirm Action', message, confirmLabel = 'Confirm', danger = true, loading }) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center py-2">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${danger ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-[#EAF3FF] text-[#2563EB] border border-[#2563EB]/20'}`}>
          <AlertTriangle size={22} />
        </div>
        <h3 className="mt-4 text-lg font-black tracking-tight text-[#102A43]">{title}</h3>
        {message && <p className="mt-1 text-xs font-medium text-[#52677F] leading-relaxed">{message}</p>}
      </div>
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-xs font-bold border border-[#DCE6F2] text-[#52677F] hover:bg-[#F6F9FD] cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-2xs transition-all cursor-pointer ${
            danger
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-[#2563EB] hover:bg-[#1D4ED8]'
          }`}
        >
          {loading ? 'Processing...' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
