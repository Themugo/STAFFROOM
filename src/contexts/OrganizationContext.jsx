import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const OrganizationContext = createContext(undefined)

export function OrganizationProvider({ children }) {
  const { user } = useAuth()
  const [organization, setOrganization] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchOrganization()
    } else {
      setOrganization(null)
      setLoading(false)
    }
  }, [user])

  const fetchOrganization = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      // SYSTEM_OWNER has no organization — they operate at platform level
      if (profile?.role === 'SYSTEM_OWNER') {
        setOrganization(null)
        return
      }

      // Use profile's organization_id directly
      const orgId = profile?.organization_id

      if (orgId) {
        const { data: org } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', orgId)
          .maybeSingle()

        setOrganization(org)

        if (org) {
          await supabase.rpc('set_organization_context', { org_id: org.id })
        }
      }
    } catch (error) {
      console.error('Error fetching organization:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrganization = async (updates) => {
    if (!organization) return

    const { data, error } = await supabase
      .from('organizations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', organization.id)
      .select()
      .single()

    if (!error) {
      setOrganization(data)
    }
    return { data, error }
  }

  const value = {
    organization,
    loading,
    updateOrganization,
    fetchOrganization,
  }

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider')
  }
  return context
}