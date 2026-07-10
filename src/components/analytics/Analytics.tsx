'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const ANALYTICS_URL = process.env.NEXT_PUBLIC_ANALYTICS_URL
const ANALYTICS_ID = process.env.NEXT_PUBLIC_ANALYTICS_ID
const PROVIDER = (process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER || 'plausible').toLowerCase()

export function respectsDoNotTrack(): boolean {
  if (typeof navigator === 'undefined') return false
  const dnt =
    navigator.doNotTrack ||
    (window as unknown as { doNotTrack?: string }).doNotTrack ||
    (navigator as unknown as { msDoNotTrack?: string }).msDoNotTrack
  if (dnt === '1' || dnt === 'yes') return true
  if ((navigator as unknown as { globalPrivacyControl?: boolean }).globalPrivacyControl) return true
  return false
}

function getCookieConsent(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem('cookie-consent')
  } catch {
    return null
  }
}

export function trackEvent(name: string, props?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  if (!ANALYTICS_URL || !ANALYTICS_ID) return
  if (respectsDoNotTrack()) return
  if (getCookieConsent() !== 'accepted') return

  const w = window as unknown as {
    plausible?: (event: string, opts?: { props?: Record<string, unknown> }) => void
    umami?: { track: (event: string, data?: Record<string, unknown>) => void; trackView: (url: string) => void }
  }

  try {
    if (name === 'pageview') {
      if (PROVIDER === 'umami' && w.umami) {
        w.umami.trackView(window.location.pathname + window.location.search)
        return
      }
      if (w.plausible) {
        w.plausible('pageview')
        return
      }
    } else {
      if (PROVIDER === 'umami' && w.umami) {
        w.umami.track(name, props)
        return
      }
      if (w.plausible) {
        w.plausible(name, { props })
        return
      }
    }

    // Generic cookie-free beacon fallback (Plausible-compatible /api/event).
    const body = JSON.stringify({
      name,
      domain: ANALYTICS_ID,
      url: window.location.href,
      ...props,
    })
    navigator.sendBeacon(`${ANALYTICS_URL}/api/event`, body)
  } catch {
    /* no-op */
  }
}

function isAnalyticsAllowed(): boolean {
  if (typeof window === 'undefined') return true
  if (respectsDoNotTrack()) return false
  try {
    const consent = localStorage.getItem('cookie-consent')
    if (consent === 'declined') return false
    if (consent === 'accepted') return true
    return false
  } catch {
    return false
  }
}

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    setAllowed(isAnalyticsAllowed())
  }, [])

  useEffect(() => {
    if (!allowed) return
    if (!ANALYTICS_URL || !ANALYTICS_ID) return
    trackEvent('pageview', {
      path: pathname + (searchParams?.toString() ? `?${searchParams}` : ''),
    })
  }, [pathname, searchParams, allowed])

  if (!ANALYTICS_URL || !ANALYTICS_ID) return null
  if (!allowed) return null

  if (PROVIDER === 'umami') {
    return (
      <Script
        src={`${ANALYTICS_URL}/script.js`}
        data-website-id={ANALYTICS_ID}
        strategy="afterInteractive"
        defer
      />
    )
  }

  return (
    <Script
      src={`${ANALYTICS_URL}/js/script.js`}
      data-domain={ANALYTICS_ID}
      strategy="afterInteractive"
      defer
    />
  )
}

export default Analytics
