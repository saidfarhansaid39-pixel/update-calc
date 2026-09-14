import { routing } from '@/i18n/routing'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculat.online'

export function buildHreflang(path: string = '') {
  const clean = path === '/' ? '' : path
  const map: Record<string, string> = { 'x-default': `${siteUrl}${clean}` }
  for (const l of routing.locales) {
    map[l] = l === 'en' ? `${siteUrl}${clean}` : `${siteUrl}/${l}${clean}`
  }
  return map
}
