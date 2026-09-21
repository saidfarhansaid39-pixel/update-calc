'use client'

import { useState, useEffect, ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'

export function ClientLocaleWrapper({ children, initialMessages }: { children: ReactNode, initialMessages: Record<string, any> }) {
  const [locale, setLocale] = useState('en')
  const [messages, setMessages] = useState(initialMessages)

  useEffect(() => {
    const locales = ['en', 'es', 'fr', 'de', 'pt', 'ru', 'ar', 'hi', 'ja', 'zh-CN']
    const pathLocale = window.location.pathname.split('/')[1]
    const fromUrl = locales.includes(pathLocale) ? pathLocale : null
    const cookieMatch = document.cookie.match(/(?:^|;\\s*)NEXT_LOCALE=([^;]*)/)
    const fromCookie = cookieMatch?.[1]
    const fromBrowser = navigator.language?.split('-')[0]
    const resolved = fromUrl || fromCookie || fromBrowser || 'en'
    setLocale(resolved)
    document.documentElement.lang = resolved
    const isRtl = resolved === 'ar'
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr'
    if (resolved !== 'en') {
      import(`../i18n/messages/${resolved}.json`).then(mod => setMessages(mod.default)).catch(() => {})
    }
  }, [])

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
      {children}
    </NextIntlClientProvider>
  )
}
