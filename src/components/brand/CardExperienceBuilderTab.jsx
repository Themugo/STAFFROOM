import React, { useState } from 'react'
import { useBrand } from '@/contexts/BrandContext'
import {
  Layers,
  Layout,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Edit3,
  CheckCircle2,
  FileText,
  Sliders,
  Sparkles,
  Plus,
  Compass,
  Grid
} from 'lucide-react'

export default function CardExperienceBuilderTab({ onNotify }) {
  const { brandConfig, updateDraftConfig, getNavConfig, getCardConfig, getPageContent } = useBrand()
  const [activeSection, setActiveSection] = useState('cards') // cards, nav, pages

  // Local editable cards state derived from config
  const [editingCardId, setEditingCardId] = useState(null)
  const [cardForm, setCardForm] = useState({ label: '', description: '', section: '', visible: true })

  const cardsList = Object.entries(brandConfig.cardConfig || {}).map(([id, cfg]) => ({ id, ...cfg }))
  const navList = Object.entries(brandConfig.navConfig || {}).map(([id, cfg]) => ({ id, ...cfg }))
  const pageList = Object.entries(brandConfig.pageContentConfig || {}).map(([id, cfg]) => ({ id, ...cfg }))

  // Toggle Card Visibility
  const toggleCardVisibility = (cardId) => {
    const curr = brandConfig.cardConfig[cardId] || {}
    updateDraftConfig({
      cardConfig: {
        [cardId]: { ...curr, visible: !curr.visible }
      }
    })
    if (onNotify) onNotify(`Toggled visibility for card "${curr.label || cardId}"`)
  }

  // Toggle Navigation Item Visibility
  const toggleNavVisibility = (navId) => {
    const curr = brandConfig.navConfig[navId] || {}
    updateDraftConfig({
      navConfig: {
        [navId]: { ...curr, visible: !curr.visible }
      }
    })
    if (onNotify) onNotify(`Toggled navigation item "${curr.label || navId}"`)
  }

  // Handle Card Edit Save
  const handleSaveCardEdit = (e) => {
    e.preventDefault()
    if (!editingCardId) return
    const curr = brandConfig.cardConfig[editingCardId] || {}
    updateDraftConfig({
      cardConfig: {
        [editingCardId]: {
          ...curr,
          label: cardForm.label,
          description: cardForm.description,
          section: cardForm.section,
          visible: cardForm.visible
        }
      }
    })
    setEditingCardId(null)
    if (onNotify) onNotify(`Updated configuration for card "${cardForm.label}"`)
  }

  // Handle Nav Label Update
  const handleUpdateNavLabel = (navId, newLabel) => {
    const curr = brandConfig.navConfig[navId] || {}
    updateDraftConfig({
      navConfig: {
        [navId]: { ...curr, label: newLabel }
      }
    })
  }

  // Handle Page Title & Subtitle Update
  const handleUpdatePageContent = (pageId, field, val) => {
    const curr = brandConfig.pageContentConfig[pageId] || { title: pageId, subtitle: '' }
    updateDraftConfig({
      pageContentConfig: {
        [pageId]: { ...curr, [field]: val }
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/80 text-indigo-300 border border-indigo-700 text-[11px] font-mono font-bold">
            <Layers size={13} className="text-cyan-400" />
            Page Section, Card & Navigation Experience Studio
          </div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            Configure Cards, Dashboard Layouts & Navigation Visibility
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Reorder and customize card labels, descriptions, and visibility across dashboard widgets, page sections, navigation links, and header banners.
          </p>
        </div>
      </div>

      {/* SECTION SWITCHER */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold">
        {[
          { id: 'cards', label: 'Dashboard & Page Cards', icon: Grid },
          { id: 'nav', label: 'Navigation Menu Items', icon: Compass },
          { id: 'pages', label: 'Page Titles & Subtitles', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeSection === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-2 rounded-2xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* 1. DASHBOARD & PAGE CARDS BUILDER */}
      {activeSection === 'cards' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Grid size={16} className="text-indigo-600" />
              Configured Dashboard & Section Cards ({cardsList.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cardsList.map((card) => (
              <div
                key={card.id}
                className={`p-5 rounded-3xl border transition-all text-xs flex flex-col justify-between space-y-3 ${
                  card.visible
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-mono">
                      {card.section || 'General'}
                    </span>
                    <button
                      onClick={() => toggleCardVisibility(card.id)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                        card.visible
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {card.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                      {card.visible ? 'VISIBLE' : 'HIDDEN'}
                    </button>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{card.label}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">{card.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">ID: {card.id}</span>
                  <button
                    onClick={() => {
                      setEditingCardId(card.id)
                      setCardForm({
                        label: card.label,
                        description: card.description || '',
                        section: card.section || 'General',
                        visible: card.visible !== false
                      })
                    }}
                    className="btn-secondary text-[11px] py-1 px-3 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 size={12} /> Customize
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. NAVIGATION MENU ITEMS CONFIGURATION */}
      {activeSection === 'nav' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass size={16} className="text-indigo-600" />
            Navigation Items Custom Labels & Visibility
          </h3>

          <div className="space-y-2">
            {navList.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleNavVisibility(item.id)}
                    className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 ${
                      item.visible
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                    }`}
                  >
                    {item.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <span className="font-mono text-slate-400 text-[11px] w-24 shrink-0">{item.id}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleUpdateNavLabel(item.id, e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SELECTED PAGE TITLES & SUBTITLES */}
      {activeSection === 'pages' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText size={16} className="text-indigo-600" />
            Custom Page Headers & Subtitles
          </h3>

          <div className="space-y-4 text-xs">
            {pageList.map((page) => (
              <div key={page.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-mono">
                    Page: {page.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Header Title</label>
                    <input
                      type="text"
                      value={page.title || ''}
                      onChange={(e) => handleUpdatePageContent(page.id, 'title', e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Header Subtitle</label>
                    <input
                      type="text"
                      value={page.subtitle || ''}
                      onChange={(e) => handleUpdatePageContent(page.id, 'subtitle', e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CARD EDIT MODAL */}
      {editingCardId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Customize Card Experience</h3>
            <form onSubmit={handleSaveCardEdit} className="space-y-3">
              <div>
                <label className="label">Card Title Label *</label>
                <input
                  type="text"
                  value={cardForm.label}
                  onChange={(e) => setCardForm({ ...cardForm, label: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Description / Subtitle</label>
                <textarea
                  rows={2}
                  value={cardForm.description}
                  onChange={(e) => setCardForm({ ...cardForm, description: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Section Group</label>
                <input
                  type="text"
                  value={cardForm.section}
                  onChange={(e) => setCardForm({ ...cardForm, section: e.target.value })}
                  className="input"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingCardId(null)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
