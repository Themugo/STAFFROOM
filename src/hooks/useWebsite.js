import { useWebsite } from '../contexts/WebsiteContext'

export function useLanding() {
  const { loading, error, refresh } = useWebsite()
  return { loading, error, refresh }
}

export function useHero() {
  const { hero } = useWebsite()
  return hero
}

export function useFeatures() {
  const { features } = useWebsite()
  return features || []
}

export function usePricing() {
  const { pricingPlans } = useWebsite()
  return pricingPlans || []
}

export function useFaq() {
  const { faq } = useWebsite()
  return faq || []
}

export function useTestimonials() {
  const { testimonials } = useWebsite()
  return testimonials || []
}

export function useSettings() {
  const { settings } = useWebsite()
  return settings
}

export function useNavigation() {
  const { navHeader, navAuth } = useWebsite()
  return { navHeader: navHeader || [], navAuth: navAuth || [] }
}

export function useFooter() {
  const { footer, social } = useWebsite()
  return { footer: footer || [], social: social || [] }
}

export function useCTA() {
  const { cta } = useWebsite()
  return cta
}

export function useStatistics() {
  const { statistics } = useWebsite()
  return statistics || []
}

export function useIntegrations() {
  const { integrations } = useWebsite()
  return integrations || []
}

export function useSEO() {
  const { seo } = useWebsite()
  return seo
}
