import { seoFactory } from '@/lib/seo/seoFactory'
import { defaultSeoAdapter } from '@/lib/seo/defaultSeoAdapter'
import { getLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jdcalc.com'

function buildHreflang(path: string) {
  const map: Record<string, string> = { 'x-default': `${siteUrl}/en${path}` }
  for (const l of routing.locales) {
    map[l] = `${siteUrl}/${l}${path}`
  }
  return map
}

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations('pages')
  const base = seoFactory(defaultSeoAdapter({
    title: t('contact.metaTitle'),
    description: t('contact.metaDescription'),
  }))
  return {
    ...base,
    alternates: {
      canonical: `${siteUrl}/${locale}/contact`,
      languages: buildHreflang('/contact'),
    },
  }
}

export default async function ContactPage() {
  const t = await getTranslations('pages')
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('contact.title')}</h1>
        <div className="prose dark:prose-invert mb-8">
          <p>{t('contact.intro')}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <p className="text-gray-700 dark:text-gray-300">
            {t('contact.emailLabel')} <a href="mailto:support@jdcalc.com" className="text-[#06b6d4] hover:underline">{t('contact.emailAddress')}</a>
          </p>
        </div>
      </div>
    </main>
  );
}
