import { Inter, Noto_Sans_Arabic, Noto_Sans_JP, Noto_Sans_SC, Noto_Sans_Devanagari } from 'next/font/google'
import '../styles/globals.css'
import { ClientLocaleWrapper } from '@/components/ClientLocaleWrapper'
import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { isRtl, routing, type Locale } from '@/i18n/routing'
import { SchemaMarkup, websiteSchema } from '@/components/SchemaMarkup'
import { Analytics } from '@/components/analytics/Analytics'
import { WebVitals } from '@/components/analytics/WebVitals'
import { CookieConsent } from '@/components/CookieConsent'
import { Suspense } from 'react'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  fallback: ['system-ui', 'arial', 'sans-serif'],
  adjustFontFallback: true,
})

const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  display: 'swap',
  preload: false,
  variable: '--font-arabic',
})

const notoJapanese = Noto_Sans_JP({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-japanese',
})

const notoChinese = Noto_Sans_SC({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-chinese',
})

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-devanagari',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jdcalc.com'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    metadataBase: new URL(siteUrl),
    title: 'JDCALC - Precision Calculators & Unit Converters',
    description: 'Free online calculators for finance, health, math, science, conversion, and everyday life. Fast, accurate, and beautifully designed.',
    keywords: ['calculator', 'online calculator', 'free calculator', 'financial calculator', 'health calculator', 'math calculator', 'unit converter', 'JDCALC'],
    openGraph: {
      type: 'website',
      url: siteUrl,
      siteName: 'JDCALC',
      title: 'JDCALC - Precision Calculators & Unit Converters',
      description: 'Free online calculators for finance, health, math, science, conversion, and everyday life.',
      locale: locale === 'en' ? 'en_US' : locale === 'zh-CN' ? 'zh_CN' : `${locale}_${locale.toUpperCase()}`,
      images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'JDCALC',
      description: 'Free online calculators for finance, health, math, science, conversion, and everyday life.',
    },
    icons: { icon: '/favicon.svg' },
    robots: { index: true, follow: true },
    alternates: {
      languages: {
        'x-default': siteUrl,
        ...Object.fromEntries(
          routing.locales.map(l => [l, l === routing.defaultLocale ? siteUrl : `${siteUrl}/${l}`])
        ),
      },
    },
  }
}

const fontVariables = `${inter.variable} ${notoArabic.variable} ${notoJapanese.variable} ${notoChinese.variable} ${notoDevanagari.variable}`

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = (await import(`../i18n/messages/${locale}.json`)).default
  return (
    <html lang={locale} dir={isRtl(locale as Locale) ? 'rtl' : 'ltr'} className={`no-js ${fontVariables}`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://i.pravatar.cc" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://open.er-api.com" />
        <link rel="dns-prefetch" href="https://financialmodelingprep.com" />
        <meta name="theme-color" content="#1a3a8a" />
        {process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION && (
          <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION} />
        )}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.classList.remove("no-js")' }} />
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const theme = localStorage.getItem('theme');
              if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              }
            } catch (e) {}
          `
        }} />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300`}>
        <SchemaMarkup type="WebSite" data={websiteSchema(locale)} />
        <ClientLocaleWrapper initialMessages={messages}>
          {children}
        </ClientLocaleWrapper>
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <CookieConsent />
        <WebVitals />
      </body>
    </html>
  )
}
