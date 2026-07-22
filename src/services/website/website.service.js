import { websiteRepository } from './website.repository'
import { websiteMapper } from './website.mapper'

export const websiteService = {
  async getSettings() {
    const raw = await websiteRepository.getSettings()
    return websiteMapper.mapSettings(raw)
  },

  async getHero(pageSlug = 'home') {
    const raw = await websiteRepository.getHero(pageSlug)
    return websiteMapper.mapHero(raw)
  },

  async getFeatures(sectionKey = 'features') {
    const raw = await websiteRepository.getFeatures(sectionKey)
    return (raw || []).map(websiteMapper.mapFeature)
  },

  async getStatistics(sectionKey = 'hero') {
    const raw = await websiteRepository.getStatistics(sectionKey)
    return (raw || []).map(websiteMapper.mapStatistic)
  },

  async getPricingPlans() {
    const raw = await websiteRepository.getPricingPlans()
    return (raw || []).map(websiteMapper.mapPricingPlan)
  },

  async getTestimonials() {
    const raw = await websiteRepository.getTestimonials()
    return (raw || []).map(websiteMapper.mapTestimonial)
  },

  async getFAQ() {
    const raw = await websiteRepository.getFAQ()
    return (raw || []).map(websiteMapper.mapFAQ)
  },

  async getCTA(sectionKey = 'final_cta') {
    const raw = await websiteRepository.getCTA(sectionKey)
    return websiteMapper.mapCTA(raw)
  },

  async getNavigation(navType = 'header') {
    const raw = await websiteRepository.getNavigation(navType)
    return (raw || []).map(websiteMapper.mapNavItem)
  },

  async getFooter() {
    const raw = await websiteRepository.getFooter()
    return (raw || []).map(websiteMapper.mapFooterLink)
  },

  async getSocialLinks() {
    const raw = await websiteRepository.getSocialLinks()
    return (raw || []).map(websiteMapper.mapSocialLink)
  },

  async getIntegrations() {
    const raw = await websiteRepository.getIntegrations()
    return (raw || []).map(websiteMapper.mapIntegration)
  },

  async getBlogPosts(limit = 10) {
    const raw = await websiteRepository.getBlogPosts(limit)
    return (raw || []).map(websiteMapper.mapBlogPost)
  },

  async getBlogPost(slug) {
    const raw = await websiteRepository.getBlogPost(slug)
    return raw ? websiteMapper.mapBlogPost(raw) : null
  },

  async getSEO(pageSlug) {
    const raw = await websiteRepository.getSEO(pageSlug)
    return websiteMapper.mapSEO(raw)
  },

  async subscribeNewsletter(email, name = null) {
    return await websiteRepository.subscribeNewsletter(email, name)
  },

  async submitContact(payload) {
    return await websiteRepository.submitContact(payload)
  },

  // Landing page bundle — fetch everything in parallel
  async getLandingData() {
    const [settings, hero, features, statistics, pricingPlans, testimonials, faq, cta, navHeader, navAuth, footer, social, integrations, seo] = await Promise.allSettled([
      this.getSettings(),
      this.getHero('home'),
      this.getFeatures('features'),
      this.getStatistics('hero'),
      this.getPricingPlans(),
      this.getTestimonials(),
      this.getFAQ(),
      this.getCTA('final_cta'),
      this.getNavigation('header'),
      this.getNavigation('header_auth'),
      this.getFooter(),
      this.getSocialLinks(),
      this.getIntegrations(),
      this.getSEO('home'),
    ])

    return {
      settings: settings.status === 'fulfilled' ? settings.value : null,
      hero: hero.status === 'fulfilled' ? hero.value : null,
      features: features.status === 'fulfilled' ? features.value : [],
      statistics: statistics.status === 'fulfilled' ? statistics.value : [],
      pricingPlans: pricingPlans.status === 'fulfilled' ? pricingPlans.value : [],
      testimonials: testimonials.status === 'fulfilled' ? testimonials.value : [],
      faq: faq.status === 'fulfilled' ? faq.value : [],
      cta: cta.status === 'fulfilled' ? cta.value : null,
      navHeader: navHeader.status === 'fulfilled' ? navHeader.value : [],
      navAuth: navAuth.status === 'fulfilled' ? navAuth.value : [],
      footer: footer.status === 'fulfilled' ? footer.value : [],
      social: social.status === 'fulfilled' ? social.value : [],
      integrations: integrations.status === 'fulfilled' ? integrations.value : [],
      seo: seo.status === 'fulfilled' ? seo.value : null,
    }
  },

  // Admin operations
  async updateSettings(updates) {
    const raw = await websiteRepository.updateSettings(updates)
    return websiteMapper.mapSettings(raw)
  },

  async upsertHero(data) {
    const raw = await websiteRepository.upsertHero(data)
    return websiteMapper.mapHero(raw)
  },

  async upsertFeature(data) {
    const raw = await websiteRepository.upsertFeature(data)
    return websiteMapper.mapFeature(raw)
  },

  async deleteFeature(id) {
    await websiteRepository.deleteFeature(id)
  },

  async upsertPricingPlan(data) {
    const raw = await websiteRepository.upsertPricingPlan(data)
    return websiteMapper.mapPricingPlan(raw)
  },

  async deletePricingPlan(id) {
    await websiteRepository.deletePricingPlan(id)
  },

  async upsertTestimonial(data) {
    const raw = await websiteRepository.upsertTestimonial(data)
    return websiteMapper.mapTestimonial(raw)
  },

  async deleteTestimonial(id) {
    await websiteRepository.deleteTestimonial(id)
  },

  async upsertFAQ(data) {
    const raw = await websiteRepository.upsertFAQ(data)
    return websiteMapper.mapFAQ(raw)
  },

  async deleteFAQ(id) {
    await websiteRepository.deleteFAQ(id)
  },

  async upsertCTA(data) {
    const raw = await websiteRepository.upsertCTA(data)
    return websiteMapper.mapCTA(raw)
  },
}
