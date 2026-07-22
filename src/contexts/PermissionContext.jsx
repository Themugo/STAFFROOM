import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const PermissionContext = createContext(null)

// Role hierarchy for inheritance — higher level roles inherit lower role permissions
const ROLE_HIERARCHY = {
  SUPER_ADMIN: 100,
  ORG_OWNER: 90,
  AUDITOR: 85,
  HR_DIRECTOR: 80,
  HR_OFFICER: 70,
  IT_ADMIN: 75,
  PAYROLL_OFFICER: 70,
  FINANCE: 65,
  RECRUITER: 55,
  DEPT_MANAGER: 60,
  TEAM_LEAD: 50,
  EMPLOYEE: 10,
}

// Map old roles to new enterprise roles for backward compatibility
const ROLE_MAP = {
  SYSTEM_OWNER: 'SUPER_ADMIN',
  ADMIN: 'ORG_OWNER',
  DEPARTMENT_ADMIN: 'DEPT_MANAGER',
  EMPLOYEE: 'EMPLOYEE',
}

export function PermissionProvider({ children }) {
  const { profile, loading: authLoading } = useAuth()
  const [permissions, setPermissions] = useState(new Set())
  const [roleLevel, setRoleLevel] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!profile) {
      setPermissions(new Set())
      setRoleLevel(0)
      setLoading(false)
      return
    }

    async function loadPermissions() {
      try {
        const rawRole = profile.role || 'EMPLOYEE'
        const enterpriseRole = ROLE_MAP[rawRole] || rawRole
        const level = ROLE_HIERARCHY[enterpriseRole] ?? 0
        setRoleLevel(level)

        // Fetch role permissions from database
        const { data: rolePerms } = await supabase
          .from('role_permission_map')
          .select('permission_id, enterprise_permissions(module, feature, action)')
          .eq('role_name', enterpriseRole)

        // Fetch user-specific overrides
        const { data: overrides } = await supabase
          .from('user_role_overrides')
          .select('permission_id, override_type, enterprise_permissions(module, feature, action)')
          .eq('user_id', profile.id)

        const permSet = new Set()

        // Add role-based permissions
        if (rolePerms) {
          for (const rp of rolePerms) {
            const p = rp.enterprise_permissions
            if (p) permSet.add(`${p.module}:${p.feature}:${p.action}`)
          }
        }

        // Apply overrides
        if (overrides) {
          for (const ov of overrides) {
            const p = ov.enterprise_permissions
            if (!p) continue
            const key = `${p.module}:${p.feature}:${p.action}`
            if (ov.override_type === 'GRANT') {
              permSet.add(key)
            } else if (ov.override_type === 'DENY') {
              permSet.delete(key)
            }
          }
        }

        // SUPER_ADMIN and ORG_OWNER get everything
        if (level >= 90) {
          const { data: allPerms } = await supabase
            .from('enterprise_permissions')
            .select('module, feature, action')
          if (allPerms) {
            for (const p of allPerms) {
              permSet.add(`${p.module}:${p.feature}:${p.action}`)
            }
          }
        }

        setPermissions(permSet)
      } catch (err) {
        console.error('Permission load error:', err)
        // Fallback to old hardcoded permissions for backward compatibility
        const rawRole = profile.role || 'EMPLOYEE'
        const enterpriseRole = ROLE_MAP[rawRole] || rawRole
        const fallback = getFallbackPermissions(enterpriseRole)
        setPermissions(fallback)
      } finally {
        setLoading(false)
      }
    }

    loadPermissions()
  }, [profile, authLoading])

  const hasPermission = useCallback((module, feature, action = 'read') => {
    return permissions.has(`${module}:${feature}:${action}`)
  }, [permissions])

  const hasAnyPermission = useCallback((module, feature) => {
    for (const perm of permissions) {
      if (perm.startsWith(`${module}:${feature}:`)) return true
    }
    return false
  }, [permissions])

  const hasModuleAccess = useCallback((module) => {
    for (const perm of permissions) {
      if (perm.startsWith(`${module}:`)) return true
    }
    return false
  }, [permissions])

  const isRoleOrHigher = useCallback((roleName) => {
    const requiredLevel = ROLE_HIERARCHY[roleName] ?? 0
    return roleLevel >= requiredLevel
  }, [roleLevel])

  const value = useMemo(() => ({
    permissions,
    roleLevel,
    loading,
    hasPermission,
    hasAnyPermission,
    hasModuleAccess,
    isRoleOrHigher,
  }), [permissions, roleLevel, loading])

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  )
}

export function usePermissions() {
  const ctx = useContext(PermissionContext)
  if (!ctx) throw new Error('usePermissions must be used inside PermissionProvider')
  return ctx
}

// Fallback permissions for backward compatibility when DB is unavailable
function getFallbackPermissions(role) {
  const perms = {
    SUPER_ADMIN: ['dashboard:overview:read', 'employees:all:read', 'employees:all:create', 'employees:all:update', 'employees:all:delete', 'employees:all:export', 'departments:all:read', 'departments:all:create', 'departments:all:update', 'departments:all:delete', 'positions:all:read', 'positions:all:create', 'positions:all:update', 'positions:all:delete', 'attendance:all:read', 'attendance:all:export', 'leave:all:read', 'leave:all:approve', 'leave:policies:manage', 'leave:all:export', 'payroll:all:read', 'payroll:runs:create', 'payroll:runs:process', 'payroll:runs:approve', 'payroll:all:export', 'recruitment:all:read', 'recruitment:all:create', 'recruitment:all:update', 'recruitment:all:delete', 'recruitment:all:export', 'users:all:read', 'users:all:create', 'users:all:update', 'users:all:delete', 'security:center:read', 'security:policies:manage', 'security:audit:read', 'settings:organization:manage', 'settings:workflows:manage', 'communication:announcements:create', 'communication:announcements:read', 'communication:announcements:delete', 'communication:messages:send', 'communication:messages:read', 'expenses:all:read', 'expenses:all:approve', 'expenses:all:export', 'roster:all:read', 'roster:all:export', 'ai:copilot:use', 'dashboard:analytics:read', 'dashboard:executive:read'],
    ORG_OWNER: ['dashboard:overview:read', 'dashboard:analytics:read', 'dashboard:executive:read', 'employees:all:read', 'employees:all:create', 'employees:all:update', 'employees:all:export', 'departments:all:read', 'departments:all:create', 'departments:all:update', 'positions:all:read', 'positions:all:create', 'positions:all:update', 'attendance:all:read', 'attendance:all:export', 'leave:all:read', 'leave:all:approve', 'leave:policies:manage', 'leave:all:export', 'payroll:all:read', 'payroll:runs:create', 'payroll:runs:process', 'payroll:runs:approve', 'payroll:all:export', 'recruitment:all:read', 'recruitment:all:create', 'recruitment:all:update', 'recruitment:all:export', 'users:all:read', 'users:all:create', 'users:all:update', 'security:center:read', 'security:audit:read', 'settings:organization:manage', 'settings:workflows:manage', 'communication:announcements:create', 'communication:announcements:read', 'communication:announcements:delete', 'communication:messages:send', 'communication:messages:read', 'expenses:all:read', 'expenses:all:approve', 'expenses:all:export', 'roster:all:read', 'ai:copilot:use'],
    HR_DIRECTOR: ['dashboard:overview:read', 'dashboard:analytics:read', 'dashboard:executive:read', 'employees:all:read', 'employees:all:create', 'employees:all:update', 'employees:all:export', 'departments:all:read', 'departments:all:create', 'departments:all:update', 'positions:all:read', 'positions:all:create', 'positions:all:update', 'attendance:all:read', 'attendance:all:export', 'leave:all:read', 'leave:all:approve', 'leave:policies:manage', 'leave:all:export', 'recruitment:all:read', 'recruitment:all:create', 'recruitment:all:update', 'recruitment:all:export', 'users:all:read', 'users:all:create', 'users:all:update', 'security:center:read', 'security:audit:read', 'settings:organization:manage', 'settings:workflows:manage', 'communication:announcements:create', 'communication:announcements:read', 'communication:announcements:delete', 'communication:messages:send', 'communication:messages:read', 'ai:copilot:use'],
    HR_OFFICER: ['dashboard:overview:read', 'employees:all:read', 'employees:all:create', 'employees:all:update', 'employees:all:export', 'departments:all:read', 'positions:all:read', 'positions:all:create', 'positions:all:update', 'attendance:all:read', 'attendance:all:export', 'leave:all:read', 'leave:all:approve', 'leave:all:export', 'recruitment:all:read', 'recruitment:all:create', 'recruitment:all:update', 'recruitment:all:export', 'communication:announcements:create', 'communication:announcements:read', 'communication:messages:send', 'communication:messages:read', 'ai:copilot:use'],
    PAYROLL_OFFICER: ['dashboard:overview:read', 'payroll:all:read', 'payroll:runs:create', 'payroll:runs:process', 'payroll:runs:approve', 'payroll:all:export', 'employees:all:read'],
    FINANCE: ['dashboard:overview:read', 'dashboard:analytics:read', 'dashboard:executive:read', 'payroll:all:read', 'expenses:all:read', 'expenses:all:approve', 'expenses:all:export', 'employees:all:read'],
    DEPT_MANAGER: ['dashboard:overview:read', 'dashboard:analytics:read', 'employees:department:read', 'employees:department:update', 'attendance:department:read', 'leave:department:read', 'leave:department:approve', 'leave:self:read', 'leave:self:create', 'departments:own:read', 'positions:all:read', 'communication:announcements:create', 'communication:announcements:read', 'communication:messages:send', 'communication:messages:read', 'expenses:department:read', 'expenses:department:approve', 'roster:department:read', 'roster:department:create', 'roster:department:update', 'roster:self:read', 'ai:copilot:use'],
    TEAM_LEAD: ['dashboard:overview:read', 'employees:department:read', 'attendance:department:read', 'leave:department:read', 'leave:department:approve', 'leave:self:read', 'leave:self:create', 'communication:messages:send', 'communication:messages:read', 'roster:self:read', 'ai:copilot:use'],
    RECRUITER: ['dashboard:overview:read', 'recruitment:all:read', 'recruitment:all:create', 'recruitment:all:update', 'recruitment:all:export', 'employees:all:read', 'positions:all:read', 'departments:all:read', 'ai:copilot:use'],
    EMPLOYEE: ['dashboard:overview:read', 'employees:self:read', 'employees:self:update', 'attendance:self:read', 'attendance:self:create', 'leave:self:read', 'leave:self:create', 'payroll:self:read', 'communication:announcements:read', 'communication:messages:send', 'communication:messages:read', 'expenses:self:create', 'roster:self:read', 'ai:copilot:use'],
    AUDITOR: ['dashboard:overview:read', 'dashboard:analytics:read', 'dashboard:executive:read', 'employees:all:read', 'departments:all:read', 'positions:all:read', 'attendance:all:read', 'leave:all:read', 'payroll:all:read', 'recruitment:all:read', 'users:all:read', 'security:center:read', 'security:audit:read', 'expenses:all:read', 'roster:all:read'],
    IT_ADMIN: ['dashboard:overview:read', 'users:all:read', 'users:all:create', 'users:all:update', 'users:all:delete', 'security:center:read', 'security:policies:manage', 'security:audit:read', 'settings:organization:manage', 'settings:workflows:manage', 'employees:all:read'],
  }
  const list = perms[role] || perms.EMPLOYEE
  return new Set(list)
}
