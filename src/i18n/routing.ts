import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'es', 'fr', 'de', 'pt', 'ru', 'ar', 'hi', 'ja', 'zh-CN'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: true,
})

export type Locale = (typeof routing.locales)[number]

export const isRtl = (locale: Locale) => locale === 'ar'

// Maps each app locale to its BCP-47 hreflang code used in sitemaps and
// <link rel="alternate" hreflang="..."> tags.
export const isoLangs: Record<Locale, string> = {
  'en': 'en',
  'es': 'es',
  'fr': 'fr',
  'de': 'de',
  'pt': 'pt',
  'ru': 'ru',
  'ar': 'ar',
  'hi': 'hi',
  'ja': 'ja',
  'zh-CN': 'zh-CN',
}

export const localeNames: Record<Locale, string> = {
  'en': 'English',
  'es': 'Español',
  'fr': 'Français',
  'de': 'Deutsch',
  'pt': 'Português',
  'ru': 'Русский',
  'ar': 'العربية',
  'hi': 'हिन्दी',
  'ja': '日本語',
  'zh-CN': '简体中文',
}
