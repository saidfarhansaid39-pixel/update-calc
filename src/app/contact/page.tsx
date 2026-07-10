import { getLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { Link } from '@/lib/navigation'
import { SchemaMarkup, breadcrumbListSchema } from '@/components/SchemaMarkup'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jdcalc.com'

export const dynamic = 'force-static'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations('pages.contact')
  const title = t('metaTitle')
  const description = t('metaDescription')
  const path = '/contact'
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

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-gray-700 dark:text-gray-200">Contact Us</li>
        </ol>
      </nav>
      <SchemaMarkup type="BreadcrumbList" data={breadcrumbListSchema([
        { name: 'Home', url: siteUrl },
        { name: 'Contact Us', url: `${siteUrl}/contact` },
      ])} />
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <p>Have a question, suggestion, or feedback? We&apos;d love to hear from you.</p>
        <p>Email us at: <a href="mailto:support@jdcalc.com" className="text-primary hover:underline">support@jdcalc.com</a></p>
        <p>We typically respond within 24-48 hours on business days.</p>
        <h2 className="text-xl font-semibold mt-8">Report an Issue</h2>
        <p>If you find a bug or calculation error, please include the calculator name and a description of the issue so we can fix it quickly.</p>
      </div>
    </div>
  )
}
