'use client'

import { useState, useEffect, ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister'
import { SchemaMarkup } from '@/components/SchemaMarkup'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jdcalc.com'

export function ClientLocaleWrapper({ children, initialMessages }: { children: ReactNode, initialMessages: Record<string, any> }) {
  const [locale, setLocale] = useState('en')
  const [messages, setMessages] = useState(initialMessages)
  const [dir, setDir] = useState('ltr')

  useEffect(() => {
    const locales = ['en', 'es', 'fr', 'de', 'pt', 'ru', 'ar', 'hi', 'ja', 'zh-CN']

    const pathLocale = window.location.pathname.split('/')[1]
    const fromUrl = locales.includes(pathLocale) ? pathLocale : null

    const cookieMatch = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]*)/)
    const fromCookie = cookieMatch?.[1]

    const fromBrowser = navigator.language?.split('-')[0]

    const resolved = fromUrl || fromCookie || fromBrowser || 'en'
    setLocale(resolved)
    document.documentElement.lang = resolved
    const isRtl = resolved === 'ar'
    setDir(isRtl ? 'rtl' : 'ltr')
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr'

    if (resolved !== 'en') {
      import(`../i18n/messages/${resolved}.json`).then(mod => setMessages(mod.default)).catch(() => {})
    }
  }, [])

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
      <ServiceWorkerRegister />
      <SchemaMarkup type="WebSite" locale={locale} data={{
        name: 'JDCALC',
        url: siteUrl,
        description: 'Precision calculators for finance, health, math, science, and everyday life. Free, fast, and beautifully designed.',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }} />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-grow" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </NextIntlClientProvider>
  )
}
