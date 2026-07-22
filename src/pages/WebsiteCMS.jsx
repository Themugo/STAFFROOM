import { useState, useEffect, useCallback } from 'react'
import {
  LayoutDashboard,
  Sparkles,
  CreditCard,
  MessageSquare,
  HelpCircle,
  Megaphone,
  Settings,
  Plus,
  Pencil,
  Trash2,
  Save,
  Star,
  Eye,
  EyeOff,
  Package,
} from 'lucide-react'

import PageHeader from '../components/ui/PageHeader'
import Tabs from '../components/ui/Tabs'
import Modal from '../components/ui/Modal'
import StatCard from '../components/ui/StatCard'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import DataTable from '../components/ui/DataTable'
import { useNotifications } from '../contexts/NotificationContext'
import { websiteService } from '../services/website'

/* ------------------------------------------------------------------ */
/*  Shared field components                                            */
/* ------------------------------------------------------------------ */

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500'

const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300'

function Field({ label, children, hint }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{hint}</p>}
    </div>
  )
}

function TextInput(props) {
  return <input {...props} className={`${inputClass} ${props.className || ''}`} />
}

function TextArea(props) {
  return <textarea {...props} className={`${inputClass} ${props.className || ''}`} />
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          checked ? 'bg-brand-600' : 'bg-gray-300 dark:bg-gray-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
    </label>
  )
}

function SaveButton({ loading, label = 'Save Changes' }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
    >
      {loading ? <Spinner size="sm" className="!h-4 !w-4" /> : <Save size={16} />}
      {label}
    </button>
  )
}

function CancelButton({ onClick, label = 'Cancel' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
    >
      {label}
    </button>
  )
}

function DeleteButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg p-2 text-gray-400 transition hover:bg-danger-50 hover:text-danger-600 dark:hover:bg-danger-900/30 dark:hover:text-danger-400"
      aria-label="Delete"
    >
      <Trash2 size={16} />
    </button>
  )
}

function EditButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg p-2 text-gray-400 transition hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/30 dark:hover:text-brand-400"
      aria-label="Edit"
    >
      <Pencil size={16} />
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Badge / pill helpers                                              */
/* ------------------------------------------------------------------ */

function Badge({ children, color = 'gray' }) {
  const colors = {
    gray: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    green: 'bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-400',
    yellow: 'bg-warning-100 text-warning-700 dark:bg-warning-900/40 dark:text-warning-400',
    brand: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  )
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          className={n <= rating ? 'fill-warning-400 text-warning-400' : 'text-gray-300 dark:text-gray-600'}
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page                                                         */
/* ------------------------------------------------------------------ */

const TABS = [
  { id: 'hero', label: 'Hero', icon: LayoutDashboard },
  { id: 'features', label: 'Features', icon: Sparkles },
  { id: 'pricing', label: 'Pricing', icon: CreditCard },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
  { id: 'cta', label: 'CTA', icon: Megaphone },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function WebsiteCMS() {
  const { success, error } = useNotifications()
  const [activeTab, setActiveTab] = useState('hero')

  // Counts for tab badges
  const [counts, setCounts] = useState({})

  const refreshCounts = useCallback(async () => {
    try {
      const [features, plans, testimonials, faq] = await Promise.all([
        websiteService.getFeatures('features').catch(() => []),
        websiteService.getPricingPlans().catch(() => []),
        websiteService.getTestimonials().catch(() => []),
        websiteService.getFAQ().catch(() => []),
      ])
      setCounts({
        features: features.length,
        pricing: plans.length,
        testimonials: testimonials.length,
        faq: faq.length,
      })
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    refreshCounts()
  }, [refreshCounts])

  const tabsWithCounts = TABS.map((t) => ({
    ...t,
    count: counts[t.id],
  }))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Website CMS"
        description="Manage all public-facing website content — hero, features, pricing, testimonials, FAQ, CTA, and global settings."
        icon={LayoutDashboard}
      />

      {/* Stat overview */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Sparkles} label="Features" value={counts.features ?? '—'} color="brand" />
        <StatCard icon={CreditCard} label="Pricing Plans" value={counts.pricing ?? '—'} color="green" />
        <StatCard icon={MessageSquare} label="Testimonials" value={counts.testimonials ?? '—'} color="purple" />
        <StatCard icon={HelpCircle} label="FAQ Items" value={counts.faq ?? '—'} color="yellow" />
      </div>

      <div className="mb-6">
        <Tabs tabs={tabsWithCounts} active={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'hero' && <HeroTab onToast={success} onError={error} />}
      {activeTab === 'features' && <FeaturesTab onToast={success} onError={error} onChanged={refreshCounts} />}
      {activeTab === 'pricing' && <PricingTab onToast={success} onError={error} onChanged={refreshCounts} />}
      {activeTab === 'testimonials' && <TestimonialsTab onToast={success} onError={error} onChanged={refreshCounts} />}
      {activeTab === 'faq' && <FAQTab onToast={success} onError={error} onChanged={refreshCounts} />}
      {activeTab === 'cta' && <CTATab onToast={success} onError={error} />}
      {activeTab === 'settings' && <SettingsTab onToast={success} onError={error} />}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  1. Hero Tab                                                       */
/* ------------------------------------------------------------------ */

const HERO_FIELDS = [
  { key: 'badge_text', label: 'Badge Text' },
  { key: 'badge_icon', label: 'Badge Icon' },
  { key: 'headline', label: 'Headline' },
  { key: 'headline_highlight', label: 'Headline Highlight' },
  { key: 'subheadline', label: 'Subheadline', textarea: true },
  { key: 'primary_cta_label', label: 'Primary CTA Label' },
  { key: 'primary_cta_url', label: 'Primary CTA URL' },
  { key: 'secondary_cta_label', label: 'Secondary CTA Label' },
  { key: 'secondary_cta_url', label: 'Secondary CTA URL' },
  { key: 'secondary_cta_icon', label: 'Secondary CTA Icon' },
]

function HeroTab({ onToast, onError }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const hero = await websiteService.getHero('home')
      setData(hero || {})
    } catch (e) {
      onError('Failed to load hero content')
      setData({})
    } finally {
      setLoading(false)
    }
  }, [onError])

  useEffect(() => {
    load()
  }, [load])

  const handleChange = (key, value) => setData((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await websiteService.upsertHero(data)
      onToast('Hero content saved successfully')
    } catch (e) {
      onError('Failed to save hero content')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="card flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hero Section</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          The main banner shown at the top of the homepage.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {HERO_FIELDS.map((field) => (
          <div key={field.key} className={field.textarea ? 'sm:col-span-2' : ''}>
            <Field label={field.label}>
              {field.textarea ? (
                <TextArea
                  rows={3}
                  value={data[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.label}
                />
              ) : (
                <TextInput
                  value={data[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.label}
                />
              )}
            </Field>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <SaveButton loading={saving} label="Save Hero" />
      </div>
    </form>
  )
}

/* ------------------------------------------------------------------ */
/*  2. Features Tab                                                   */
/* ------------------------------------------------------------------ */

const FEATURE_CATEGORIES = ['Product', 'Integration', 'Security', 'Performance', 'Support', 'Other']

function FeaturesTab({ onToast, onError, onChanged }) {
  const [features, setFeatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyFeature())
  const [saving, setSaving] = useState(false)

  function emptyFeature() {
    return {
      icon: '',
      title: '',
      description: '',
      color_gradient: '',
      category: 'Product',
      display_order: 0,
      is_visible: true,
    }
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await websiteService.getFeatures('features')
      setFeatures(data || [])
    } catch (e) {
      onError('Failed to load features')
      setFeatures([])
    } finally {
      setLoading(false)
    }
  }, [onError])

  useEffect(() => {
    load()
  }, [load])

  const openNew = () => {
    setEditing(null)
    setForm(emptyFeature())
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditing(row)
    setForm({ ...emptyFeature(), ...row })
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await websiteService.upsertFeature({ ...form, ...(editing ? { id: editing.id } : {}) })
      onToast(editing ? 'Feature updated' : 'Feature created')
      setModalOpen(false)
      await load()
      onChanged()
    } catch (e) {
      onError('Failed to save feature')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete feature "${row.title}"?`)) return
    try {
      await websiteService.deleteFeature(row.id)
      onToast('Feature deleted')
      await load()
      onChanged()
    } catch (e) {
      onError('Failed to delete feature')
    }
  }

  const columns = [
    {
      key: 'icon',
      header: 'Icon',
      width: '60px',
      render: (row) => (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
          <span className="text-sm">{row.icon || '✨'}</span>
        </div>
      ),
    },
    { key: 'title', header: 'Title', render: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.title}</span> },
    { key: 'category', header: 'Category', render: (row) => <Badge color="brand">{row.category}</Badge> },
    {
      key: 'is_visible',
      header: 'Visible',
      width: '100px',
      render: (row) =>
        row.is_visible ? (
          <Badge color="green">
            <Eye size={12} className="mr-1 inline" /> Visible
          </Badge>
        ) : (
          <Badge color="gray">
            <EyeOff size={12} className="mr-1 inline" /> Hidden
          </Badge>
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '100px',
      render: (row) => (
        <div className="flex items-center gap-1">
          <EditButton onClick={() => openEdit(row)} />
          <DeleteButton onClick={() => handleDelete(row)} />
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Features</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage the feature cards displayed on the homepage.</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
        >
          <Plus size={16} /> New Feature
        </button>
      </div>

      <DataTable
        columns={columns}
        data={features}
        loading={loading}
        keyField="id"
        emptyTitle="No features yet"
        emptyDescription="Add your first feature to showcase on the homepage."
        emptyIcon={Sparkles}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Feature' : 'New Feature'}
        description="Feature cards appear in the features section of the homepage."
        size="lg"
        footer={
          <>
            <CancelButton onClick={() => setModalOpen(false)} />
            <SaveButton loading={saving} label={editing ? 'Update Feature' : 'Create Feature'} />
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Icon" hint="Emoji or short text (e.g. ⚡, 🚀)">
              <TextInput value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="⚡" />
            </Field>
            <Field label="Title">
              <TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Lightning Fast" required />
            </Field>
          </div>
          <Field label="Description">
            <TextArea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the feature..." required />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Color Gradient" hint="Tailwind gradient classes (e.g. from-brand-500 to-purple-500)">
              <TextInput value={form.color_gradient} onChange={(e) => setForm({ ...form, color_gradient: e.target.value })} placeholder="from-brand-500 to-purple-500" />
            </Field>
            <Field label="Category">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                {FEATURE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Display Order" hint="Lower numbers appear first">
              <TextInput
                type="number"
                value={form.display_order ?? 0}
                onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value, 10) || 0 })}
              />
            </Field>
            <div className="flex items-end pb-2">
              <Toggle checked={!!form.is_visible} onChange={(v) => setForm({ ...form, is_visible: v })} label="Visible on site" />
            </div>
          </div>
          <button type="submit" className="hidden" />
        </form>
      </Modal>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  3. Pricing Tab                                                    */
/* ------------------------------------------------------------------ */

function PricingTab({ onToast, onError, onChanged }) {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyPlan())
  const [saving, setSaving] = useState(false)

  function emptyPlan() {
    return {
      name: '',
      price: '',
      currency: 'USD',
      period: 'month',
      description: '',
      is_popular: false,
      featuresText: '',
      cta_label: 'Get Started',
      cta_url: '/signup',
    }
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await websiteService.getPricingPlans()
      setPlans(data || [])
    } catch (e) {
      onError('Failed to load pricing plans')
      setPlans([])
    } finally {
      setLoading(false)
    }
  }, [onError])

  useEffect(() => {
    load()
  }, [load])

  const openNew = () => {
    setEditing(null)
    setForm(emptyPlan())
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditing(row)
    setForm({
      ...emptyPlan(),
      ...row,
      featuresText: Array.isArray(row.features) ? row.features.join('\n') : '',
    })
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const features = form.featuresText
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean)
      const payload = {
        name: form.name,
        price: form.price,
        currency: form.currency,
        period: form.period,
        description: form.description,
        is_popular: form.is_popular,
        features,
        cta_label: form.cta_label,
        cta_url: form.cta_url,
        ...(editing ? { id: editing.id } : {}),
      }
      await websiteService.upsertPricingPlan(payload)
      onToast(editing ? 'Pricing plan updated' : 'Pricing plan created')
      setModalOpen(false)
      await load()
      onChanged()
    } catch (e) {
      onError('Failed to save pricing plan')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete plan "${row.name}"?`)) return
    try {
      await websiteService.deletePricingPlan(row.id)
      onToast('Pricing plan deleted')
      await load()
      onChanged()
    } catch (e) {
      onError('Failed to delete pricing plan')
    }
  }

  const columns = [
    { key: 'name', header: 'Plan', render: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.name}</span> },
    {
      key: 'price',
      header: 'Price',
      render: (row) => (
        <span className="text-gray-900 dark:text-white">
          {row.currency === 'USD' ? '$' : row.currency} {row.price}
          <span className="text-xs text-gray-400">/{row.period}</span>
        </span>
      ),
    },
    { key: 'period', header: 'Period', render: (row) => <Badge>{row.period}</Badge> },
    {
      key: 'is_popular',
      header: 'Popular',
      width: '100px',
      render: (row) => (row.is_popular ? <Badge color="yellow">★ Popular</Badge> : <Badge>—</Badge>),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '100px',
      render: (row) => (
        <div className="flex items-center gap-1">
          <EditButton onClick={() => openEdit(row)} />
          <DeleteButton onClick={() => handleDelete(row)} />
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pricing Plans</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage the pricing tiers shown on the pricing section.</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
        >
          <Plus size={16} /> New Plan
        </button>
      </div>

      <DataTable
        columns={columns}
        data={plans}
        loading={loading}
        keyField="id"
        emptyTitle="No pricing plans yet"
        emptyDescription="Add your first pricing plan to display on the site."
        emptyIcon={CreditCard}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Plan' : 'New Plan'}
        description="Pricing plans are displayed in the pricing section."
        size="lg"
        footer={
          <>
            <CancelButton onClick={() => setModalOpen(false)} />
            <SaveButton loading={saving} label={editing ? 'Update Plan' : 'Create Plan'} />
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Plan Name">
              <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Pro" required />
            </Field>
            <Field label="Price">
              <TextInput value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="49" required />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Currency">
              <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className={inputClass}>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </Field>
            <Field label="Period">
              <select value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} className={inputClass}>
                <option value="month">month</option>
                <option value="year">year</option>
                <option value="quarter">quarter</option>
                <option value="one-time">one-time</option>
              </select>
            </Field>
            <div className="flex items-end pb-2">
              <Toggle checked={!!form.is_popular} onChange={(v) => setForm({ ...form, is_popular: v })} label="Mark as popular" />
            </div>
          </div>
          <Field label="Description">
            <TextArea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Best for growing teams..." />
          </Field>
          <Field label="Features" hint="One feature per line. These will be stored as a list.">
            <TextArea
              rows={6}
              value={form.featuresText}
              onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
              placeholder={'Unlimited projects\nPriority support\nAdvanced analytics'}
            />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="CTA Label">
              <TextInput value={form.cta_label} onChange={(e) => setForm({ ...form, cta_label: e.target.value })} placeholder="Get Started" />
            </Field>
            <Field label="CTA URL">
              <TextInput value={form.cta_url} onChange={(e) => setForm({ ...form, cta_url: e.target.value })} placeholder="/signup" />
            </Field>
          </div>
          <button type="submit" className="hidden" />
        </form>
      </Modal>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  4. Testimonials Tab                                               */
/* ------------------------------------------------------------------ */

function TestimonialsTab({ onToast, onError, onChanged }) {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyTestimonial())
  const [saving, setSaving] = useState(false)

  function emptyTestimonial() {
    return { name: '', role: '', company: '', quote: '', avatar: '', rating: 5 }
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await websiteService.getTestimonials()
      setTestimonials(data || [])
    } catch (e) {
      onError('Failed to load testimonials')
      setTestimonials([])
    } finally {
      setLoading(false)
    }
  }, [onError])

  useEffect(() => {
    load()
  }, [load])

  const openNew = () => {
    setEditing(null)
    setForm(emptyTestimonial())
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditing(row)
    setForm({ ...emptyTestimonial(), ...row })
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, rating: Number(form.rating), ...(editing ? { id: editing.id } : {}) }
      await websiteService.upsertTestimonial(payload)
      onToast(editing ? 'Testimonial updated' : 'Testimonial created')
      setModalOpen(false)
      await load()
      onChanged()
    } catch (e) {
      onError('Failed to save testimonial')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete testimonial from "${row.name}"?`)) return
    try {
      await websiteService.deleteTestimonial(row.id)
      onToast('Testimonial deleted')
      await load()
      onChanged()
    } catch (e) {
      onError('Failed to delete testimonial')
    }
  }

  const columns = [
    {
      key: 'avatar',
      header: 'Avatar',
      width: '60px',
      render: (row) =>
        row.avatar ? (
          <img src={row.avatar} alt={row.name} className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
            {(row.name || '?').charAt(0).toUpperCase()}
          </div>
        ),
    },
    { key: 'name', header: 'Name', render: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.name}</span> },
    { key: 'role', header: 'Role', render: (row) => <span className="text-gray-500 dark:text-gray-400">{row.role}</span> },
    { key: 'company', header: 'Company', render: (row) => <span className="text-gray-500 dark:text-gray-400">{row.company}</span> },
    { key: 'rating', header: 'Rating', render: (row) => <StarRating rating={row.rating} /> },
    {
      key: 'actions',
      header: 'Actions',
      width: '100px',
      render: (row) => (
        <div className="flex items-center gap-1">
          <EditButton onClick={() => openEdit(row)} />
          <DeleteButton onClick={() => handleDelete(row)} />
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Testimonials</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Customer quotes displayed as social proof.</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
        >
          <Plus size={16} /> New Testimonial
        </button>
      </div>

      <DataTable
        columns={columns}
        data={testimonials}
        loading={loading}
        keyField="id"
        emptyTitle="No testimonials yet"
        emptyDescription="Add your first testimonial to build social proof."
        emptyIcon={MessageSquare}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Testimonial' : 'New Testimonial'}
        description="Testimonials are displayed in the testimonials section."
        size="lg"
        footer={
          <>
            <CancelButton onClick={() => setModalOpen(false)} />
            <SaveButton loading={saving} label={editing ? 'Update Testimonial' : 'Create Testimonial'} />
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Name">
              <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" required />
            </Field>
            <Field label="Role">
              <TextInput value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="CTO" />
            </Field>
            <Field label="Company">
              <TextInput value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Acme Inc." />
            </Field>
          </div>
          <Field label="Quote">
            <TextArea rows={4} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} placeholder="This product changed how we work..." required />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Avatar URL" hint="Leave empty to use initials">
              <TextInput value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} placeholder="https://..." />
            </Field>
            <Field label="Rating">
              <select value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value, 10) })} className={inputClass}>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} star{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <button type="submit" className="hidden" />
        </form>
      </Modal>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  5. FAQ Tab                                                        */
/* ------------------------------------------------------------------ */

const FAQ_CATEGORIES = ['General', 'Pricing', 'Product', 'Support', 'Security', 'Other']

function FAQTab({ onToast, onError, onChanged }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyFAQ())
  const [saving, setSaving] = useState(false)

  function emptyFAQ() {
    return { question: '', answer: '', category: 'General', display_order: 0 }
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await websiteService.getFAQ()
      setItems(data || [])
    } catch (e) {
      onError('Failed to load FAQ items')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [onError])

  useEffect(() => {
    load()
  }, [load])

  const openNew = () => {
    setEditing(null)
    setForm(emptyFAQ())
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditing(row)
    setForm({ ...emptyFAQ(), ...row })
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await websiteService.upsertFAQ({ ...form, ...(editing ? { id: editing.id } : {}) })
      onToast(editing ? 'FAQ item updated' : 'FAQ item created')
      setModalOpen(false)
      await load()
      onChanged()
    } catch (e) {
      onError('Failed to save FAQ item')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (row) => {
    if (!window.confirm('Delete this FAQ item?')) return
    try {
      await websiteService.deleteFAQ(row.id)
      onToast('FAQ item deleted')
      await load()
      onChanged()
    } catch (e) {
      onError('Failed to delete FAQ item')
    }
  }

  const columns = [
    { key: 'question', header: 'Question', render: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.question}</span> },
    { key: 'category', header: 'Category', render: (row) => <Badge color="brand">{row.category}</Badge> },
    { key: 'display_order', header: 'Order', width: '80px', render: (row) => <span className="text-gray-500 dark:text-gray-400">{row.display_order ?? 0}</span> },
    {
      key: 'actions',
      header: 'Actions',
      width: '100px',
      render: (row) => (
        <div className="flex items-center gap-1">
          <EditButton onClick={() => openEdit(row)} />
          <DeleteButton onClick={() => handleDelete(row)} />
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">FAQ Items</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Frequently asked questions shown on the site.</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
        >
          <Plus size={16} /> New FAQ
        </button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        keyField="id"
        emptyTitle="No FAQ items yet"
        emptyDescription="Add your first FAQ to help answer common questions."
        emptyIcon={HelpCircle}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit FAQ' : 'New FAQ'}
        description="FAQ items appear in the FAQ section of the site."
        size="lg"
        footer={
          <>
            <CancelButton onClick={() => setModalOpen(false)} />
            <SaveButton loading={saving} label={editing ? 'Update FAQ' : 'Create FAQ'} />
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Field label="Question">
            <TextInput value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="How does this work?" required />
          </Field>
          <Field label="Answer">
            <TextArea rows={4} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} placeholder="Provide a clear answer..." required />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Category">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                {FAQ_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Display Order" hint="Lower numbers appear first">
              <TextInput
                type="number"
                value={form.display_order ?? 0}
                onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value, 10) || 0 })}
              />
            </Field>
          </div>
          <button type="submit" className="hidden" />
        </form>
      </Modal>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  6. CTA Tab                                                        */
/* ------------------------------------------------------------------ */

const CTA_FIELDS = [
  { key: 'headline', label: 'Headline' },
  { key: 'subheadline', label: 'Subheadline', textarea: true },
  { key: 'primary_cta_label', label: 'Primary CTA Label' },
  { key: 'primary_cta_url', label: 'Primary CTA URL' },
  { key: 'secondary_cta_label', label: 'Secondary CTA Label' },
  { key: 'secondary_cta_url', label: 'Secondary CTA URL' },
]

function CTATab({ onToast, onError }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const cta = await websiteService.getCTA('final_cta')
      setData(cta || {})
    } catch (e) {
      onError('Failed to load CTA content')
      setData({})
    } finally {
      setLoading(false)
    }
  }, [onError])

  useEffect(() => {
    load()
  }, [load])

  const handleChange = (key, value) => setData((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await websiteService.upsertCTA(data)
      onToast('CTA content saved successfully')
    } catch (e) {
      onError('Failed to save CTA content')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="card flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Final CTA Section</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">The call-to-action banner shown near the bottom of the homepage.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {CTA_FIELDS.map((field) => (
          <div key={field.key} className={field.textarea ? 'sm:col-span-2' : ''}>
            <Field label={field.label}>
              {field.textarea ? (
                <TextArea rows={3} value={data[field.key] || ''} onChange={(e) => handleChange(field.key, e.target.value)} placeholder={field.label} />
              ) : (
                <TextInput value={data[field.key] || ''} onChange={(e) => handleChange(field.key, e.target.value)} placeholder={field.label} />
              )}
            </Field>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <SaveButton loading={saving} label="Save CTA" />
      </div>
    </form>
  )
}

/* ------------------------------------------------------------------ */
/*  7. Settings Tab                                                   */
/* ------------------------------------------------------------------ */

function SettingsTab({ onToast, onError }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const settings = await websiteService.getSettings()
      setData(settings || {})
    } catch (e) {
      onError('Failed to load settings')
      setData({})
    } finally {
      setLoading(false)
    }
  }, [onError])

  useEffect(() => {
    load()
  }, [load])

  const handleChange = (key, value) => setData((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await websiteService.updateSettings(data)
      onToast('Settings saved successfully')
    } catch (e) {
      onError('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="card flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Global Settings</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Site-wide configuration including branding and announcement bar.</p>
      </div>

      {/* Branding */}
      <div className="mb-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Branding</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Site Name">
            <TextInput value={data.site_name || ''} onChange={(e) => handleChange('site_name', e.target.value)} placeholder="Acme" />
          </Field>
          <Field label="Site Tagline">
            <TextInput value={data.site_tagline || ''} onChange={(e) => handleChange('site_tagline', e.target.value)} placeholder="Build better apps" />
          </Field>
          <Field label="Logo Text">
            <TextInput value={data.logo_text || ''} onChange={(e) => handleChange('logo_text', e.target.value)} placeholder="Acme" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Primary Color" hint="Hex color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data.primary_color || '#6366f1'}
                  onChange={(e) => handleChange('primary_color', e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-700"
                />
                <TextInput value={data.primary_color || ''} onChange={(e) => handleChange('primary_color', e.target.value)} placeholder="#6366f1" />
              </div>
            </Field>
            <Field label="Secondary Color" hint="Hex color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data.secondary_color || '#8b5cf6'}
                  onChange={(e) => handleChange('secondary_color', e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-700"
                />
                <TextInput value={data.secondary_color || ''} onChange={(e) => handleChange('secondary_color', e.target.value)} placeholder="#8b5cf6" />
              </div>
            </Field>
          </div>
        </div>
      </div>

      {/* Announcement Bar */}
      <div className="mb-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Announcement Bar</h3>
        <div className="grid grid-cols-1 gap-5">
          <div className="flex items-center">
            <Toggle
              checked={!!data.announcement_bar_active}
              onChange={(v) => handleChange('announcement_bar_active', v)}
              label="Announcement bar active"
            />
          </div>
          <Field label="Announcement Bar Text">
            <TextInput
              value={data.announcement_bar_text || ''}
              onChange={(e) => handleChange('announcement_bar_text', e.target.value)}
              placeholder="🎉 We just launched a new feature!"
            />
          </Field>
          <Field label="Announcement Bar Link" hint="Where clicking the bar takes the user">
            <TextInput
              value={data.announcement_bar_link || ''}
              onChange={(e) => handleChange('announcement_bar_link', e.target.value)}
              placeholder="/blog/new-feature"
            />
          </Field>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <SaveButton loading={saving} label="Save Settings" />
      </div>
    </form>
  )
}
