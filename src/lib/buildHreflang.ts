import { routing } from '@/i18n/routing'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jdcalc.com'

export function buildHreflang(path: string = '') {
  const map: Record<string, string> = { 'x-default': `${siteUrl}/en${path}` }
  for (const l of routing.locales) {
    map[l] = `${siteUrl}/${l}${path}`
  }
  return map
}
