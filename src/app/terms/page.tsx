import { getLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { Link } from '@/lib/navigation'
import { SchemaMarkup, breadcrumbListSchema } from '@/components/SchemaMarkup'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jdcalc.com'

export const dynamic = 'force-static'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations('pages.terms')
  const title = t('metaTitle')
  const description = t('metaDescription')
  const path = '/terms'
  const canonical = locale === 'en' ? `${siteUrl}${path}` : `${siteUrl}/${locale}${path}`
  const languages: Record<string, string> = { 'x-default': `${siteUrl}${path}` }
  for (const l of routing.locales) {
    languages[l] = l === 'en' ? `${siteUrl}${path}` : `${siteUrl}/${l}${path}`
  }
  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: { title, description, url: canonical, siteName: 'JDCALC', type: 'website', images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-gray-700 dark:text-gray-200">Terms of Service</li>
        </ol>
      </nav>
      <SchemaMarkup type="BreadcrumbList" data={breadcrumbListSchema([
        { name: 'Home', url: siteUrl },
        { name: 'Terms of Service', url: `${siteUrl}/terms` },
      ])} />
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <p>Last updated: January 2025</p>
        <h2 className="text-xl font-semibold mt-8">Use of Service</h2>
        <p>JDCALC provides free online calculators for informational purposes. While we strive for accuracy, results should not replace professional advice for financial, medical, or legal decisions.</p>
        <h2 className="text-xl font-semibold mt-8">Accuracy</h2>
        <p>We make every effort to ensure calculation accuracy. However, we cannot guarantee 100% error-free results. Users should verify critical calculations independently.</p>
        <h2 className="text-xl font-semibold mt-8">Limitation of Liability</h2>
        <p>JDCALC and its operators are not liable for any damages arising from the use of our calculators or reliance on their results.</p>
      </div>
    </div>
  )
}
