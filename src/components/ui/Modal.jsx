import { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

const SIZES = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }

// Selector for all focusable elements within the modal
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export default function Modal({ open, onClose, title, description, size = 'md', children, footer }) {
  const ref = useRef(null)
  const previouslyFocused = useRef(null)

  // Get all focusable elements inside the modal, sorted by DOM order
  const getFocusableElements = useCallback(() => {
    if (!ref.current) return []
    const nodes = Array.from(ref.current.querySelectorAll(FOCUSABLE_SELECTOR))
    // Filter out elements that are not visible
    return nodes.filter((el) => {
      if (el.hasAttribute('disabled') || el.getAttribute('aria-hidden') === 'true') return false
      const style = window.getComputedStyle(el)
      return style.display !== 'none' && style.visibility !== 'hidden'
    })
  }, [])

  useEffect(() => {
    if (!open) return

    // Store the currently focused element so we can restore it on close
    previouslyFocused.current = document.activeElement

    // Focus the first focusable element in the modal once it mounts
    const focusFirst = () => {
      const focusable = getFocusableElements()
      if (focusable.length > 0) {
        focusable[0].focus()
      } else if (ref.current) {
        // Fallback: focus the modal container itself
        ref.current.focus()
      }
    }
    // Defer until the portal content is in the DOM
    const rafId = requestAnimationFrame(focusFirst)

    const handleEsc = (e) => { if (e.key === 'Escape') onClose?.() }

    // Focus trap: wrap Tab/Shift+Tab at the boundaries
    const handleTab = (e) => {
      if (e.key !== 'Tab') return
      const focusable = getFocusableElements()
      if (focusable.length === 0) {
        e.preventDefault()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (e.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (active === first || !ref.current?.contains(active)) {
          e.preventDefault()
          last.focus()
        }
      } else {
        // Tab: if on last element, wrap to first
        if (active === last || !ref.current?.contains(active)) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleEsc)
    document.addEventListener('keydown', handleTab)
    document.body.style.overflow = 'hidden'

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('keydown', handleEsc)
      document.removeEventListener('keydown', handleTab)
      document.body.style.overflow = ''
      // Restore focus to the element that had it before the modal opened
      if (previouslyFocused.current && typeof previouslyFocused.current.focus === 'function') {
        previouslyFocused.current.focus()
      }
    }
  }, [open, onClose, getFocusableElements])

  if (!open) return null

  // Stable id for the title so aria-labelledby can reference it
  const titleId = 'modal-title'

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={`relative w-full ${SIZES[size]} max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl animate-scale-in outline-none dark:bg-gray-900 dark:border dark:border-gray-800`}
      >
        {(title || onClose) && (
          <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <div>
              {title && <h3 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>}
              {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                <X size={20} aria-hidden="true" />
              </button>
            )}
          </div>
        )}
        <div className="max-h-[calc(90vh-8rem)] overflow-y-auto px-6 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/50">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
