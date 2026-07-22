import { useState, useEffect } from 'react'
import { Building2, MapPin, Palette, Users, CreditCard, Shield, Bell } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useOrganization } from '../contexts/OrganizationContext'
import { useNotifications } from '../contexts/NotificationContext'
import PageHeader from '../components/ui/PageHeader'
import Tabs from '../components/ui/Tabs'
import StatusBadge from '../components/ui/StatusBadge'

// Tabs component renders text-only buttons (no icon support), so we keep a
// separate icon map for the page header / sidebar context if needed and pass
// the {id, label} shape that <Tabs> expects.
const TABS = [
  { id: 'general', label: 'General' },
  { id: 'locations', label: 'Locations' },
  { id: 'branding', label: 'Branding' },
  { id: 'payroll', label: 'Payroll' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'security', label: 'Security' },
]

const BRAND_COLORS = ['#0EA5E9', '#3B82F6', '#10B981', '#F97316', '#8B5CF6', '#F43F5E']

export default function OrganizationSettings() {
  const { organization } = useOrganization()
  const { success: showSuccess, error: showError } = useNotifications()
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    country: 'KE',
    currency: 'KES',
    timezone: 'Africa/Nairobi',
    primary_color: '#0EA5E9',
  })
  const [branches, setBranches] = useState([])

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || '',
        slug: organization.slug || '',
        country: organization.country || 'KE',
        currency: organization.currency || 'KES',
        timezone: organization.timezone || 'Africa/Nairobi',
        primary_color: organization.primary_color || '#0EA5E9',
      })
      fetchBranches()
    }
  }, [organization])

  const fetchBranches = async () => {
    if (!organization) return
    const { data } = await supabase
      .from('branches')
      .select('*')
      .eq('organization_id', organization.id)
      .order('created_at')
    if (data) setBranches(data)
  }

  const handleSaveGeneral = async () => {
    setLoading(true)
    const { error } = await supabase
      .from('organizations')
      .update({ ...formData, updated_at: new Date().toISOString() })
      .eq('id', organization.id)

    if (error) {
      showError('Failed to update organization')
    } else {
      showSuccess('Organization updated successfully')
    }
    setLoading(false)
  }

  const handleAddBranch = async () => {
    const { error } = await supabase
      .from('branches')
      .insert({
        organization_id: organization.id,
        name: 'New Branch',
        country: formData.country,
      })

    if (!error) {
      showSuccess('Branch added')
      fetchBranches()
    }
  }

  const handleUpdateBranch = async (id, updates) => {
    await supabase
      .from('branches')
      .update(updates)
      .eq('id', id)
    fetchBranches()
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen dark:bg-gray-950 transition-colors">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Organization Settings"
          description="Configure your organization's profile and preferences"
          icon={Building2}
        />

        <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

        <div className="card p-6 mt-6">
          {activeTab === 'general' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">General Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Organization Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">URL Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Country</label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="input"
                    >
                      <option value="KE">Kenya</option>
                      <option value="UG">Uganda</option>
                      <option value="TZ">Tanzania</option>
                      <option value="RW">Rwanda</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="input"
                    >
                      <option value="KES">KES - Kenyan Shilling</option>
                      <option value="UGX">UGX - Ugandan Shilling</option>
                      <option value="TZS">TZS - Tanzanian Shilling</option>
                      <option value="RWF">RWF - Rwandan Franc</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleSaveGeneral}
                  disabled={loading}
                  className="btn-primary mt-6"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'locations' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Branches & Locations</h2>
                <button onClick={handleAddBranch} className="btn-primary">
                  Add Branch
                </button>
              </div>
              <div className="space-y-3">
                {branches.map((branch) => (
                  <div
                    key={branch.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${branch.is_headquarters ? 'bg-yellow-500' : 'bg-green-500'}`} />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{branch.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {branch.city || 'No city set'} • {branch.country}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={branch.status} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Branding</h2>
              <div className="space-y-6">
                <div>
                  <label className="label mb-3">Primary Color</label>
                  <div className="flex gap-3">
                    {BRAND_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setFormData({ ...formData, primary_color: color })}
                        className={`w-10 h-10 rounded-lg transition ${formData.primary_color === color ? 'ring-2 ring-gray-900 dark:ring-white' : ''}`}
                        style={{ backgroundColor: color }}
                        aria-label={`Primary color ${color}`}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleSaveGeneral}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Saving...' : 'Save Branding'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'payroll' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Payroll Configuration</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Configure your payroll settings, tax jurisdictions, and payment schedules.
              </p>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Notification Settings</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Configure email and in-app notification preferences.
              </p>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Security Settings</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Manage two-factor authentication, session settings, and access controls.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
