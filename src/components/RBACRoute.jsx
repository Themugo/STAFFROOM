import { Navigate } from 'react-router-dom'
import { usePermissions } from '../contexts/PermissionContext'
import { useAuth } from '../contexts/AuthContext'
import Spinner from './ui/Spinner'

// Backward-compatible permission map for old-style string permissions
// Maps old permission strings to new module:feature:action tuples
const LEGACY_PERMISSION_MAP = {
  dashboard: ['dashboard:overview:read'],
  users: ['users:all:read'],
  employees: ['employees:all:read', 'employees:department:read', 'employees:self:read'],
  departments: ['departments:all:read', 'departments:own:read'],
  positions: ['positions:all:read'],
  attendance: ['attendance:all:read', 'attendance:department:read', 'attendance:self:read'],
  leave: ['leave:all:read', 'leave:department:read', 'leave:self:read'],
  payroll: ['payroll:all:read', 'payroll:self:read'],
  recruitment: ['recruitment:all:read'],
  security: ['security:center:read'],
  settings: ['settings:organization:manage'],
  workflows: ['settings:workflows:manage'],
  announcements: ['communication:announcements:read'],
  expenses: ['expenses:all:read', 'expenses:department:read', 'expenses:self:create'],
  'ai-copilot': ['ai:copilot:use'],
}

export function hasPermission(role, permission) {
  // Legacy support: check if the old-style permission maps to any new permission
  const newPerms = LEGACY_PERMISSION_MAP[permission]
  if (!newPerms) return false
  // This is a simplified check — the real check happens via usePermissions hook
  return true
}

export function hasModulePermission(module, feature, action = 'read') {
  // This function is kept for backward compatibility but should not be used for real permission checks.
  // Use the usePermissions() hook inside React components instead.
  console.warn('hasModulePermission is deprecated. Use usePermissions() hook instead.')
  return false
}

export default function RBACRoute({ permission, module, feature, action = 'read', children }) {
  const { loading: authLoading } = useAuth()
  const { hasPermission: checkPerm, hasAnyPermission, hasModuleAccess, loading: permLoading } = usePermissions()

  if (authLoading || permLoading) {
    return (
      <div className="flex h-full items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  let allowed = false

  if (module && feature) {
    // New-style permission check: module:feature:action
    // Allow if the user has the exact permission, OR any permission for that module:feature,
    // OR (for feature='all') any read permission in the entire module
    allowed = checkPerm(module, feature, action) || hasAnyPermission(module, feature)
    if (!allowed && feature === 'all') {
      allowed = hasModuleAccess(module)
    }
  } else if (permission) {
    // Legacy-style permission check
    const newPerms = LEGACY_PERMISSION_MAP[permission]
    if (newPerms) {
      allowed = newPerms.some((p) => {
        const [m, f, a] = p.split(':')
        return checkPerm(m, f, a)
      })
    }
  }

  if (!allowed) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
