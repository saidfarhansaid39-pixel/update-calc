'use client'

import { usePathname, useRouter } from '@/lib/navigation'
import { routing, localeNames, type Locale, isoLangs } from '@/i18n/routing'
import { useLocale, useTranslations } from 'next-intl'
import { Languages, ChevronDown, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

// Flag emojis for each locale
const localeFlags: Record<Locale, string> = {
  'en': '🇺🇸',
  'es': '🇪🇸',
  'fr': '🇫🇷',
  'de': '🇩🇪',
  'pt': '🇵🇹',
  'ru': '🇷🇺',
  'ar': '🇸🇦',
  'hi': '🇮🇳',
  'ja': '🇯🇵',
  'zh-CN': '🇨🇳',
}

export function LocaleSwitcher({ variant = 'dropdown' }: { variant?: 'dropdown' | 'minimal' }) {
  const pathname = usePathname()
  const router = useRouter()
  const currentLocale = useLocale() as Locale
  const tc = useTranslations('chrome')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const switchLocale = (locale: Locale) => {
    router.replace(pathname, { locale })
    setOpen(false)
  }

  if (variant === 'minimal') {
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          aria-label={tc('switchLanguage')}
          aria-expanded={open}
        >
          <span className="w-3.5 h-3.5">{localeFlags[currentLocale]}</span>
          <span className="hidden sm:inline">{tc(`locale.${currentLocale}`)}</span>
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg py-1 z-50 max-h-60 overflow-y-auto">
            {routing.locales.map((locale) => (
              <button
                key={locale}
                onClick={() => switchLocale(locale as Locale)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span className={locale === currentLocale ? 'text-[#1a3a8a] dark:text-[#06b6d4] font-medium' : ''}>
                  {localeFlags[locale]}{localeNames[locale as Locale]}
                </span>
                {locale === currentLocale && (
                  <Check className="w-3 h-3 text-[#1a3a8a] dark:text-[#06b6d4] ml-auto" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#1a3a8a] dark:hover:text-[#06b6d4] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        aria-label={tc('switchLanguage')}
        aria-expanded={open}
      >
        <span className="w-4 h-4">{localeFlags[currentLocale]}</span>
        <span className="hidden sm:inline">{tc(`locale.${currentLocale}`)}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg py-1 z-50 max-h-72 overflow-y-auto">
          {routing.locales.map((locale) => (
            <button
              key={locale}
              onClick={() => switchLocale(locale as Locale)}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className={`${locale === currentLocale ? 'text-[#1a3a8a] dark:text-[#06b6d4] font-semibold' : ''}`}>
                {localeFlags[locale]}{localeNames[locale as Locale]}
              </span>
              {locale === currentLocale && (
                <Check className="w-3.5 h-3.5 text-[#1a3a8a] dark:text-[#06b6d4] ml-auto" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}