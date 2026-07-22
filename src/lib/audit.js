import { supabase } from './supabase'

export async function logAudit(action, entityType = null, entityId = null, oldValues = null, newValues = null) {
  try {
    await supabase.rpc('log_audit_action', {
      p_action: action,
      p_entity_type: entityType,
      p_entity_id: entityId,
      p_old_values: oldValues,
      p_new_values: newValues,
    })
  } catch (err) {
    console.error('Audit log error:', err)
  }
}

export const AUDIT_ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  EXPORT: 'EXPORT',
  BULK_ACTION: 'BULK_ACTION',
  PERMISSION_CHANGE: 'PERMISSION_CHANGE',
  SETTINGS_CHANGE: 'SETTINGS_CHANGE',
}
