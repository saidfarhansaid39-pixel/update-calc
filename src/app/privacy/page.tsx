import { getLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { Link } from '@/lib/navigation'
import { SchemaMarkup, breadcrumbListSchema } from '@/components/SchemaMarkup'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jdcalc.com'

export const dynamic = 'force-static'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations('pages.privacy')
  const title = t('metaTitle')
  const description = t('metaDescription')
  const path = '/privacy'
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

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-gray-700 dark:text-gray-200">Privacy Policy</li>
        </ol>
      </nav>
      <SchemaMarkup type="BreadcrumbList" data={breadcrumbListSchema([
        { name: 'Home', url: siteUrl },
        { name: 'Privacy Policy', url: `${siteUrl}/privacy` },
      ])} />
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <p>Last updated: January 2025</p>
        <h2 className="text-xl font-semibold mt-8">Information We Collect</h2>
        <p>JDCALC does not collect any personal information. We use minimal cookies for essential functionality such as theme preference (dark/light mode) and language selection.</p>
        <h2 className="text-xl font-semibold mt-8">Analytics</h2>
        <p>We may use anonymous usage analytics to improve our services. No personally identifiable information is tracked.</p>
        <h2 className="text-xl font-semibold mt-8">Third-Party Services</h2>
        <p>We do not share any data with third parties. All calculations are performed entirely in your browser or on our servers without storing your input values.</p>
        <h2 className="text-xl font-semibold mt-8">Contact</h2>
        <p>For privacy-related inquiries, contact us at support@jdcalc.com.</p>
      </div>
    </div>
  )
}
