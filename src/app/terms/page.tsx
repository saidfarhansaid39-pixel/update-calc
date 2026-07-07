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
    title: t('terms.metaTitle'),
    description: t('terms.metaDescription'),
  }))
  return {
    ...base,
    alternates: {
      canonical: `${siteUrl}/${locale}/terms`,
      languages: buildHreflang('/terms'),
    },
  }
}

export default async function TermsPage() {
  const t = await getTranslations('pages')
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('terms.title')}</h1>
        <div className="prose dark:prose-invert">
          <p>{t('terms.intro')}</p>
          <h2>{t('terms.useOfServicesTitle')}</h2>
          <p>{t('terms.useOfServicesText')}</p>
          <h2>{t('terms.accuracyTitle')}</h2>
          <p>{t('terms.accuracyText')}</p>
          <h2>{t('terms.availabilityTitle')}</h2>
          <p>{t('terms.availabilityText')}</p>
        </div>
      </div>
    </main>
  );
}
