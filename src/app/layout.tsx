import { Inter, Noto_Sans_Arabic, Noto_Sans_JP, Noto_Sans_SC, Noto_Sans_Devanagari } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SchemaMarkup } from '@/components/SchemaMarkup'
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'
import { routing, isRtl, type Locale } from '@/i18n/routing'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  fallback: ['system-ui', 'arial', 'sans-serif'],
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

function buildHreflang(locale: string) {
  const map: Record<string, string> = { 'x-default': `${siteUrl}/en` }
  for (const l of routing.locales) {
    map[l] = `${siteUrl}/${l}`
  }
  return map
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'seo' })
  const localeStr = locale === 'en' ? 'en_US' : locale === 'zh-CN' ? 'zh_CN' : `${locale}_${locale.toUpperCase()}`
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t('siteTitle'),
      template: t('titleTemplate'),
    },
    description: t('siteDescription'),
    keywords: ['calculator', 'online calculator', 'free calculator', 'financial calculator', 'health calculator', 'math calculator', 'unit converter', 'JDCALC'],
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: buildHreflang(locale),
    },
    openGraph: {
      type: 'website',
      url: siteUrl,
      siteName: t('siteName'),
      title: t('siteTitle'),
      description: t('siteDescription'),
      locale: localeStr,
      images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('siteName'),
      description: t('siteDescription'),
    },
    icons: {
      icon: '/favicon.svg',
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

const fontVariables = `${inter.variable} ${notoArabic.variable} ${notoJapanese.variable} ${notoChinese.variable} ${notoDevanagari.variable}`

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale() as Locale
  const messages = await getMessages()
  const dir = isRtl(locale) ? 'rtl' : 'ltr'
  const t = await getTranslations({ locale, namespace: 'common' })

  return (
    <html lang={locale} dir={dir} className={`no-js ${fontVariables}`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a3a8a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
        >
          {t('skipToContent')}
        </a>
        <ServiceWorkerRegister />
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main id="main-content" className="flex-grow" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
