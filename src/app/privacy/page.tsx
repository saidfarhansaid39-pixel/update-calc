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
    title: t('privacy.metaTitle'),
    description: t('privacy.metaDescription'),
  }))
  return {
    ...base,
    alternates: {
      canonical: `${siteUrl}/${locale}/privacy`,
      languages: buildHreflang('/privacy'),
    },
  }
}

export default async function PrivacyPage() {
  const t = await getTranslations('pages')
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('privacy.title')}</h1>
        <div className="prose dark:prose-invert">
          <p>{t('privacy.intro')}</p>
          <h2>{t('privacy.dataCollectionTitle')}</h2>
          <p>{t('privacy.dataCollectionText')}</p>
          <h2>{t('privacy.cookiesTitle')}</h2>
          <p>{t('privacy.cookiesText')}</p>
          <h2>{t('privacy.thirdPartiesTitle')}</h2>
          <p>{t('privacy.thirdPartiesText')}</p>
          <h2>{t('privacy.contactTitle')}</h2>
          <p>{t('privacy.contactText')}</p>
        </div>
      </div>
    </main>
  );
}
