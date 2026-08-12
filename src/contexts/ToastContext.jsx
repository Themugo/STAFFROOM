import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react'

const ToastContext = createContext(null)

let toastId = 0

const TOAST_STYLES = {
  success: { icon: CheckCircle, bg: 'bg-white', border: 'border-emerald-200 shadow-lg shadow-emerald-500/5', text: 'text-[#102A43]', iconColor: 'text-emerald-500' },
  error: { icon: AlertCircle, bg: 'bg-white', border: 'border-red-200 shadow-lg shadow-red-500/5', text: 'text-[#102A43]', iconColor: 'text-red-500' },
  warning: { icon: AlertTriangle, bg: 'bg-white', border: 'border-amber-200 shadow-lg shadow-amber-500/5', text: 'text-[#102A43]', iconColor: 'text-amber-500' },
  info: { icon: Info, bg: 'bg-white', border: 'border-[#2563EB]/20 shadow-lg shadow-[#2563EB]/5', text: 'text-[#102A43]', iconColor: 'text-[#2563EB]' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const show = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration)
    }
    return id
  }, [dismiss])

  const toast = useMemo(() => ({
    success: (msg, d) => show(msg, 'success', d),
    error: (msg, d) => show(msg, 'error', d),
    warning: (msg, d) => show(msg, 'warning', d),
    info: (msg, d) => show(msg, 'info', d),
    dismiss,
  }), [show, dismiss])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => {
        const style = TOAST_STYLES[t.type] || TOAST_STYLES.info
        const Icon = style.icon
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border ${style.bg} ${style.border} px-4 py-3.5 shadow-xl animate-fade-in-up sm:max-w-md w-full`}
            role="alert"
          >
            <Icon size={18} className={`mt-0.5 shrink-0 ${style.iconColor}`} />
            <p className={`flex-1 text-xs sm:text-sm font-semibold ${style.text}`}>{t.message}</p>
            <button
              onClick={() => onDismiss(t.id)}
              className={`shrink-0 rounded-lg p-1 hover:bg-slate-100 ${style.text} cursor-pointer`}
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
