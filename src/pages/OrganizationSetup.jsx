import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, MapPin, Palette, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'

const COUNTRIES = [
  { code: 'KE', name: 'Kenya', currency: 'KES', dial: '+254' },
  { code: 'UG', name: 'Uganda', currency: 'UGX', dial: '+256' },
  { code: 'TZ', name: 'Tanzania', currency: 'TZS', dial: '+255' },
  { code: 'RW', name: 'Rwanda', currency: 'RWF', dial: '+250' },
]

const COLORS = [
  { name: 'Cyan', value: '#0EA5E9' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Emerald', value: '#10B981' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Rose', value: '#F43F5E' },
]

export default function OrganizationSetup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    country: 'KE',
    currency: 'KES',
    primary_color: '#0EA5E9',
    branches: [{ name: 'Headquarters', is_headquarters: true }],
  })

  const handleCreate = async () => {
    setSaving(true)
    try {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) throw new Error('Not authenticated')

      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: formData.name,
          slug: formData.slug,
          country: formData.country,
          currency: formData.currency,
          primary_color: formData.primary_color,
          subscription_tier: 'TRIAL',
          status: 'ACTIVE',
        })
        .select()
        .single()

      if (orgError) throw orgError

      // Create branches
      for (const branch of formData.branches) {
        await supabase.from('branches').insert({
          organization_id: org.id,
          name: branch.name,
          country: formData.country,
          is_headquarters: branch.is_headquarters,
        })
      }

      navigate('/dashboard')
    } catch (error) {
      console.error('Error creating organization:', error)
    } finally {
      setSaving(false)
    }
  }

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 50)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${step >= s ? 'bg-brand-600 text-white dark:bg-brand-500' : 'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                {step > s ? <Check size={20} /> : s}
              </div>
              {s < 3 && <div className={`w-16 h-1 ${step > s ? 'bg-brand-600 dark:bg-brand-500' : 'bg-gray-200 dark:bg-gray-800'}`} />}
            </div>
          ))}
        </div>

        {/* Steps */}
        {step === 1 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
            <Building2 className="w-12 h-12 text-brand-600 dark:text-brand-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Name your organization</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">This will be your organization's identity in StaffRoom</p>

            <label className="block mb-4">
              <span className="label">Organization Name</span>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) || formData.slug })}
                className="input"
                placeholder="e.g., Acme Corporation"
              />
            </label>

            <label className="block mb-6">
              <span className="label">URL Slug</span>
              <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-brand-500 focus-within:border-brand-500">
                <span className="px-3 text-gray-400 dark:text-gray-500">staffroom.ke/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.replace(/[^a-z0-9-]/g, '') })}
                  className="flex-1 bg-transparent border-none py-2 text-gray-900 dark:text-white focus:outline-none"
                />
              </div>
            </label>

            <div className="flex justify-end">
              <button onClick={() => setStep(2)} disabled={!formData.name.trim()} className="btn-primary btn-lg">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
            <MapPin className="w-12 h-12 text-brand-600 dark:text-brand-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Where are you located?</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">This helps us configure local tax and compliance rules</p>

            <label className="block mb-4">
              <span className="label mb-2">Country</span>
              <div className="grid grid-cols-2 gap-3">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setFormData({ ...formData, country: c.code, currency: c.currency })}
                    className={`p-4 rounded-lg border text-left transition-colors ${formData.country === c.code ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    <p className="text-gray-900 dark:text-white font-medium">{c.name}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{c.currency} • {c.dial}</p>
                  </button>
                ))}
              </div>
            </label>

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="btn-ghost btn-lg">
                Back
              </button>
              <button onClick={() => setStep(3)} className="btn-primary btn-lg">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
            <Palette className="w-12 h-12 text-brand-600 dark:text-brand-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Customize your brand</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Choose a primary color for your organization</p>

            <label className="block mb-8">
              <span className="label mb-3">Primary Color</span>
              <div className="flex gap-3">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setFormData({ ...formData, primary_color: color.value })}
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.primary_color === color.value ? 'ring-2 ring-gray-900 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-gray-900' : ''}`}
                    style={{ backgroundColor: color.value }}
                  >
                    {formData.primary_color === color.value && <Check size={20} className="text-white" />}
                  </button>
                ))}
              </div>
            </label>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Preview</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: formData.primary_color }} />
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">{formData.name || 'Organization Name'}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{formData.slug ? `staffroom.ke/${formData.slug}` : ''}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="btn-ghost btn-lg">
                Back
              </button>
              <button
                onClick={handleCreate}
                disabled={loading || !formData.name.trim()}
                className="btn-primary btn-lg"
              >
                {loading ? 'Creating...' : 'Create Organization'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
