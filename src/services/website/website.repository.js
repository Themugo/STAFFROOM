import { supabase } from '../../lib/supabase'
import { WEBSITE_TABLES } from './website.types'

export const websiteRepository = {
  async getSettings() {
    const { data, error } = await supabase.from(WEBSITE_TABLES.SETTINGS).select('*').limit(1).maybeSingle()
    if (error) throw error
    return data
  },

  async getHero(pageSlug = 'home') {
    const { data, error } = await supabase.from(WEBSITE_TABLES.HERO).select('*').eq('page_slug', pageSlug).eq('is_visible', true).order('display_order').maybeSingle()
    if (error) throw error
    return data
  },

  async getFeatures(sectionKey = 'features') {
    const { data, error } = await supabase.from(WEBSITE_TABLES.FEATURES).select('*').eq('section_key', sectionKey).eq('is_visible', true).order('display_order')
    if (error) throw error
    return data || []
  },

  async getStatistics(sectionKey = 'hero') {
    const { data, error } = await supabase.from(WEBSITE_TABLES.STATISTICS).select('*').eq('section_key', sectionKey).eq('is_visible', true).order('display_order')
    if (error) throw error
    return data || []
  },

  async getPricingPlans() {
    const { data, error } = await supabase.from(WEBSITE_TABLES.PRICING).select('*').eq('is_visible', true).order('display_order')
    if (error) throw error
    return data || []
  },

  async getTestimonials() {
    const { data, error } = await supabase.from(WEBSITE_TABLES.TESTIMONIALS).select('*').eq('is_visible', true).order('display_order')
    if (error) throw error
    return data || []
  },

  async getFAQ() {
    const { data, error } = await supabase.from(WEBSITE_TABLES.FAQ).select('*').eq('is_visible', true).order('display_order')
    if (error) throw error
    return data || []
  },

  async getCTA(sectionKey = 'final_cta') {
    const { data, error } = await supabase.from(WEBSITE_TABLES.CTA).select('*').eq('section_key', sectionKey).eq('is_visible', true).maybeSingle()
    if (error) throw error
    return data
  },

  async getNavigation(navType = 'header') {
    const { data, error } = await supabase.from(WEBSITE_TABLES.NAVIGATION).select('*').eq('nav_type', navType).eq('is_visible', true).order('display_order')
    if (error) throw error
    return data || []
  },

  async getFooter() {
    const { data, error } = await supabase.from(WEBSITE_TABLES.FOOTER).select('*').eq('is_visible', true).order('display_order')
    if (error) throw error
    return data || []
  },

  async getSocialLinks() {
    const { data, error } = await supabase.from(WEBSITE_TABLES.SOCIAL).select('*').eq('is_visible', true).order('display_order')
    if (error) throw error
    return data || []
  },

  async getIntegrations() {
    const { data, error } = await supabase.from(WEBSITE_TABLES.INTEGRATIONS).select('*').eq('is_visible', true).order('display_order')
    if (error) throw error
    return data || []
  },

  async getLogos() {
    const { data, error } = await supabase.from(WEBSITE_TABLES.LOGOS).select('*').eq('is_visible', true).order('display_order')
    if (error) throw error
    return data || []
  },

  async getBlogPosts(limit = 10) {
    let query = supabase.from(WEBSITE_TABLES.BLOG_POSTS).select('*').eq('is_published', true).order('published_at', { ascending: false })
    if (limit) query = query.limit(limit)
    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async getBlogPost(slug) {
    const { data, error } = await supabase.from(WEBSITE_TABLES.BLOG_POSTS).select('*').eq('slug', slug).eq('is_published', true).maybeSingle()
    if (error) throw error
    return data
  },

  async getBlogCategories() {
    const { data, error } = await supabase.from(WEBSITE_TABLES.BLOG_CATEGORIES).select('*').eq('is_visible', true).order('display_order')
    if (error) throw error
    return data || []
  },

  async getSEO(pageSlug) {
    const { data, error } = await supabase.from(WEBSITE_TABLES.SEO).select('*').eq('page_slug', pageSlug).maybeSingle()
    if (error) throw error
    return data
  },

  async subscribeNewsletter(email, name = null) {
    const { data, error } = await supabase.from(WEBSITE_TABLES.NEWSLETTER).insert({ email, name }).select().single()
    if (error && error.code !== '23505') throw error // ignore duplicate email
    return data
  },

  async submitContact(payload) {
    const { data, error } = await supabase.from(WEBSITE_TABLES.CONTACT).insert(payload).select().single()
    if (error) throw error
    return data
  },

  // Admin operations
  async updateSettings(updates) {
    const { data, error } = await supabase.from(WEBSITE_TABLES.SETTINGS).update({ ...updates, updated_at: new Date().toISOString() }).select().maybeSingle()
    if (error) throw error
    return data
  },

  async upsertHero(data) {
    const { data: result, error } = await supabase.from(WEBSITE_TABLES.HERO).upsert({ ...data, updated_at: new Date().toISOString() }).select().single()
    if (error) throw error
    return result
  },

  async upsertFeature(data) {
    if (data.id) {
      const { data: result, error } = await supabase.from(WEBSITE_TABLES.FEATURES).update({ ...data, updated_at: new Date().toISOString() }).eq('id', data.id).select().single()
      if (error) throw error
      return result
    }
    const { data: result, error } = await supabase.from(WEBSITE_TABLES.FEATURES).insert(data).select().single()
    if (error) throw error
    return result
  },

  async deleteFeature(id) {
    const { error } = await supabase.from(WEBSITE_TABLES.FEATURES).delete().eq('id', id)
    if (error) throw error
  },

  async upsertPricingPlan(data) {
    if (data.id) {
      const { data: result, error } = await supabase.from(WEBSITE_TABLES.PRICING).update({ ...data, updated_at: new Date().toISOString() }).eq('id', data.id).select().single()
      if (error) throw error
      return result
    }
    const { data: result, error } = await supabase.from(WEBSITE_TABLES.PRICING).insert(data).select().single()
    if (error) throw error
    return result
  },

  async deletePricingPlan(id) {
    const { error } = await supabase.from(WEBSITE_TABLES.PRICING).delete().eq('id', id)
    if (error) throw error
  },

  async upsertTestimonial(data) {
    if (data.id) {
      const { data: result, error } = await supabase.from(WEBSITE_TABLES.TESTIMONIALS).update(data).eq('id', data.id).select().single()
      if (error) throw error
      return result
    }
    const { data: result, error } = await supabase.from(WEBSITE_TABLES.TESTIMONIALS).insert(data).select().single()
    if (error) throw error
    return result
  },

  async deleteTestimonial(id) {
    const { error } = await supabase.from(WEBSITE_TABLES.TESTIMONIALS).delete().eq('id', id)
    if (error) throw error
  },

  async upsertFAQ(data) {
    if (data.id) {
      const { data: result, error } = await supabase.from(WEBSITE_TABLES.FAQ).update({ ...data, updated_at: new Date().toISOString() }).eq('id', data.id).select().single()
      if (error) throw error
      return result
    }
    const { data: result, error } = await supabase.from(WEBSITE_TABLES.FAQ).insert(data).select().single()
    if (error) throw error
    return result
  },

  async deleteFAQ(id) {
    const { error } = await supabase.from(WEBSITE_TABLES.FAQ).delete().eq('id', id)
    if (error) throw error
  },

  async upsertCTA(data) {
    const { data: result, error } = await supabase.from(WEBSITE_TABLES.CTA).upsert({ ...data }).select().single()
    if (error) throw error
    return result
  },
}
