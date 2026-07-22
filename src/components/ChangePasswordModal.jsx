import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Modal from './ui/Modal'

export default function ChangePasswordModal({ onClose, onSuccess }) {
  const { user } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  function validateFields() {
    const errors = {}

    if (!currentPassword) {
      errors.currentPassword = 'Current password is required'
    }

    if (newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters'
    } else if (!/[A-Z]/.test(newPassword)) {
      errors.newPassword = 'Password must contain at least one uppercase letter'
    } else if (!/[0-9]/.test(newPassword)) {
      errors.newPassword = 'Password must contain at least one number'
    }

    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    return errors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    const errors = validateFields()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)

    try {
      // 1. Verify the current password by signing in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      })

      if (signInError) {
        setError('Current password is incorrect')
        return
      }

      // 2. Proceed with the password update
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) throw updateError

      // Update profile to remove must_change_password flag
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ must_change_password: false })
        .eq('id', user.id)

      if (profileError) throw profileError

      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      size="sm"
      title="Change Your Password"
      description="For security reasons, you must change your password before accessing the system."
    >
      <div className="mb-6 flex justify-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="current-password">Current Password</label>
          <input
            id="current-password"
            type="password"
            className="input"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            required
            autoFocus
          />
          {fieldErrors.currentPassword && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.currentPassword}</p>
          )}
        </div>

        <div>
          <label className="label" htmlFor="new-password">New Password</label>
          <input
            id="new-password"
            type="password"
            className="input"
            placeholder="Enter new password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
          {fieldErrors.newPassword && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.newPassword}</p>
          )}
        </div>

        <div>
          <label className="label" htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            className="input"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          {fieldErrors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
          <p>Password requirements:</p>
          <ul className="list-inside list-disc space-y-0.5">
            <li>At least 8 characters</li>
            <li>At least one uppercase letter</li>
            <li>At least one number</li>
          </ul>
        </div>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/40 dark:text-red-400">
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary w-full justify-center py-2.5" disabled={loading}>
          {loading ? 'Updating…' : 'Update Password'}
        </button>
      </form>
    </Modal>
  )
}
