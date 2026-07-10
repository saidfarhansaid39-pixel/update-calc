'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/components/analytics/Analytics'

type MetricName = 'LCP' | 'CLS' | 'INP' | 'FID' | 'FCP' | 'TTFB'

function sendMetric(name: MetricName, value: number, rating?: string) {
  trackEvent('web_vital', { metric: name, value: Math.round(value), rating })
}

export function WebVitals() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return

    // Largest Contentful Paint
    try {
      let lcpValue = 0
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const last = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number }
        lcpValue = last.renderTime || last.loadTime || 0
      })
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
      // Finalize LCP once the page is hidden / fully loaded.
      const reportLcp = () => {
        if (lcpValue > 0) sendMetric('LCP', lcpValue)
        lcpObserver.disconnect()
      }
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') reportLcp()
      })
      window.addEventListener('pagehide', reportLcp)
    } catch {
      /* no-op */
    }

    // Cumulative Layout Shift
    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as Array<PerformanceEntry & { hadRecentInput?: boolean; value?: number }>) {
          if (!entry.hadRecentInput && typeof entry.value === 'number') {
            clsValue += entry.value
          }
        }
      })
      clsObserver.observe({ type: 'layout-shift', buffered: true })
      const reportCls = () => {
        sendMetric('CLS', clsValue * 1000)
        clsObserver.disconnect()
      }
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') reportCls()
      })
      window.addEventListener('pagehide', reportCls)
    } catch {
      /* no-op */
    }

    // Interaction to Next Paint (INP), with FID fallback for older engines.
    try {
      let worstInteraction = 0
      const inpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as Array<PerformanceEntry & { processingEnd?: number; startTime?: number; duration?: number; interactionId?: number }>) {
          if (entry.interactionId) {
            const latency = entry.processingEnd && entry.startTime ? entry.processingEnd - entry.startTime : entry.duration || 0
            if (latency > worstInteraction) worstInteraction = latency
          }
        }
      })
      inpObserver.observe({ type: 'event', durationThreshold: 16, buffered: true } as unknown as PerformanceObserverInit)
      const reportInp = () => {
        if (worstInteraction > 0) sendMetric('INP', worstInteraction)
        inpObserver.disconnect()
      }
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') reportInp()
      })
      window.addEventListener('pagehide', reportInp)
    } catch {
      /* no-op */
    }
  }, [])

  return null
}

export default WebVitals
