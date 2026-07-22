import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random()
    const newNotification = { id, ...notification }
    setNotifications(prev => [...prev, newNotification])

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 5000)

    return id
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const success = useCallback((message, title = 'Success') => addNotification({ type: 'success', title, message }), [addNotification])
  const error = useCallback((message, title = 'Error') => addNotification({ type: 'error', title, message }), [addNotification])
  const warning = useCallback((message, title = 'Warning') => addNotification({ type: 'warning', title, message }), [addNotification])
  const info = useCallback((message, title = 'Info') => addNotification({ type: 'info', title, message }), [addNotification])

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, success, error, warning, info }}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider')
  return context
}

function NotificationContainer({ notifications, onRemove }) {
  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map(notification => (
        <Notification key={notification.id} notification={notification} onRemove={() => onRemove(notification.id)} />
      ))}
    </div>
  )
}

function Notification({ notification, onRemove }) {
  const config = {
    success: { icon: CheckCircle, bg: 'bg-success-50 dark:bg-success-900/30', border: 'border-success-200 dark:border-success-800', iconColor: 'text-success-500', titleColor: 'text-success-800 dark:text-success-300' },
    error: { icon: XCircle, bg: 'bg-danger-50 dark:bg-danger-900/30', border: 'border-danger-200 dark:border-danger-800', iconColor: 'text-danger-500', titleColor: 'text-danger-800 dark:text-danger-300' },
    warning: { icon: AlertCircle, bg: 'bg-warning-50 dark:bg-warning-900/30', border: 'border-warning-200 dark:border-warning-800', iconColor: 'text-warning-500', titleColor: 'text-warning-800 dark:text-warning-300' },
    info: { icon: Info, bg: 'bg-brand-50 dark:bg-brand-900/30', border: 'border-brand-200 dark:border-brand-800', iconColor: 'text-brand-500', titleColor: 'text-brand-800 dark:text-brand-300' },
  }

  const { icon: Icon, bg, border, iconColor, titleColor } = config[notification.type] || config.info

  return (
    <div className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-slide-in-right ${bg} ${border}`}>
      <Icon size={20} className={iconColor} />
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${titleColor}`}>{notification.title}</p>
        {notification.message && <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{notification.message}</p>}
      </div>
      <button onClick={onRemove} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition">
        <X size={14} className="text-gray-400" />
      </button>
    </div>
  )
}
