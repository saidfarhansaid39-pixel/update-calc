import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/lib/navigation'
import { SchemaMarkup, breadcrumbListSchema } from '@/components/SchemaMarkup'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculat.online'

export const dynamic = 'force-static'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations('pages.editorialPolicy')
  const title = t('metaTitle')
  const description = t('metaDescription')
  const path = '/editorial-policy'
  const canonical = locale === 'en' ? `${siteUrl}${path}` : `${siteUrl}/${locale}${path}`
  const languages: Record<string, string> = { 'x-default': `${siteUrl}${path}`, en: `${siteUrl}${path}` }
  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: { title, description, url: canonical, siteName: 'Calculat', type: 'website', images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function EditorialPolicyPage() {
  const locale = await getLocale()
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-gray-700 dark:text-gray-200">Editorial Policy</li>
        </ol>
      </nav>
      <SchemaMarkup type="BreadcrumbList" data={breadcrumbListSchema([
        { name: 'Home', url: siteUrl },
        { name: 'Editorial Policy', url: `${siteUrl}/editorial-policy` },
      ])} />
      <SchemaMarkup
        type="WebApplication"
        locale={locale}
        data={{
          '@type': 'WebPage',
          name: 'Editorial Policy',
          description: 'Our commitment to accuracy, transparency, and editorial independence at Calculat.',
          url: `${siteUrl}/editorial-policy`,
          isPartOf: { '@type': 'WebSite', name: 'Calculat', url: siteUrl },
        }}
      />
      <h1 className="text-3xl font-bold mb-6">Editorial Policy</h1>
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <p>Our commitment to accuracy, transparency, and editorial independence.</p>

        <h2 className="text-xl font-semibold mt-8">Accuracy & Fact-Checking</h2>
        <p>All calculators on Calculat are built using verified mathematical formulas and reviewed by domain experts. Our editorial team fact-checks every calculator against authoritative sources, including academic textbooks, industry standards, and government publications.</p>

        <h2 className="text-xl font-semibold mt-8">Editorial Independence</h2>
        <p>Calculat maintains strict editorial independence. Our calculator content, guides, and articles are created without influence from advertisers, partners, or external stakeholders. We clearly distinguish between editorial content and sponsored material.</p>

        <h2 className="text-xl font-semibold mt-8">Source Attribution</h2>
        <p>Every calculator page includes citations to the formulas, data sources, and methodologies used. We link directly to primary sources, peer-reviewed research, and official publications wherever possible.</p>

        <h2 className="text-xl font-semibold mt-8">Updates & Corrections</h2>
        <p>Our content team regularly reviews and updates calculators to reflect changes in regulations, tax codes, interest rates, and best practices. If you notice an error, please contact us so we can correct it promptly.</p>

        <h2 className="text-xl font-semibold mt-8">Review Process</h2>
        <p>High-importance calculators (financial, medical, construction) undergo a formal review by subject-matter experts before publication. Each reviewed calculator displays a &ldquo;Reviewed by&rdquo; badge with the date and reviewer credentials.</p>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Link href="/" className="text-primary hover:underline">Back to Home</Link>
      </div>
    </div>
  )
}
