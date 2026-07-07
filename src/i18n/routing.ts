import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'es', 'fr', 'de', 'pt', 'ru', 'ar', 'hi', 'ja', 'zh-CN'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: true,
})

export type Locale = (typeof routing.locales)[number]

export const isRtl = (locale: Locale) => locale === 'ar'

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
