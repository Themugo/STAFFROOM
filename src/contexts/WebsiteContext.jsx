import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { websiteService } from '../services/website'
import { websiteCache } from '../services/website'

const WebsiteContext = createContext(null)

export function WebsiteProvider({ children }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadLandingData = useCallback(async (useCache = true) => {
    setLoading(true)
    setError(null)
    try {
      let result
      if (useCache) {
        result = await websiteCache.getOrSet('landing_data', () => websiteService.getLandingData())
      } else {
        websiteCache.invalidate('landing_data')
        result = await websiteService.getLandingData()
      }
      setData(result)
    } catch (err) {
      console.error('Website data load error:', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadLandingData()
  }, [loadLandingData])

  const refresh = useCallback(() => {
    loadLandingData(false)
  }, [loadLandingData])

  const value = {
    ...data,
    loading,
    error,
    refresh,
  }

  return <WebsiteContext.Provider value={value}>{children}</WebsiteContext.Provider>
}

export function useWebsite() {
  const ctx = useContext(WebsiteContext)
  if (!ctx) throw new Error('useWebsite must be used inside WebsiteProvider')
  return ctx
}
