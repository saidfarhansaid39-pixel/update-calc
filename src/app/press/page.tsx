import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/lib/navigation'
import { SchemaMarkup, breadcrumbListSchema } from '@/components/SchemaMarkup'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculat.online'

export const dynamic = 'force-static'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations('pages.press')
  const title = t('metaTitle')
  const description = t('metaDescription')
  const path = '/press'
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

export default async function PressPage() {
  const locale = await getLocale()
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-gray-700 dark:text-gray-200">Press & Media</li>
        </ol>
      </nav>
      <SchemaMarkup type="BreadcrumbList" data={breadcrumbListSchema([
        { name: 'Home', url: siteUrl },
        { name: 'Press & Media', url: `${siteUrl}/press` },
      ])} />
      <SchemaMarkup
        type="WebApplication"
        locale={locale}
        data={{
          '@type': 'WebPage',
          name: 'Press & Media',
          description: 'Press releases, media assets, and brand resources for Calculat.',
          url: `${siteUrl}/press`,
          isPartOf: { '@type': 'WebSite', name: 'Calculat', url: siteUrl },
        }}
      />
      <h1 className="text-3xl font-bold mb-6">Press & Media</h1>
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <p>Press releases, media assets, and brand resources.</p>

        <h2 className="text-xl font-semibold mt-8">About Calculat</h2>
        <p>Calculat is the world&apos;s smartest calculator platform, offering over 2,500 precision calculators across 16 categories including finance, health, math, science, and everyday life. Our AI-powered tools are beautifully designed and completely free.</p>

        <h2 className="text-xl font-semibold mt-8">Media Kit</h2>
        <p>Journalists and content creators can use the Calculat logo and brand assets. Please do not alter the logo colors or proportions. For high-resolution assets, contact our press team.</p>

        <h2 className="text-xl font-semibold mt-8">Press Contact</h2>
        <p>For press inquiries, interview requests, or partnership opportunities, please email <a href="mailto:press@calculat.online" className="text-primary hover:underline">press@calculat.online</a>.</p>

        <h2 className="text-xl font-semibold mt-8">Brand Guidelines</h2>
        <p>When referencing Calculat in articles or publications, please use the full name &ldquo;Calculat&rdquo; on first reference. Subsequent references may use &ldquo;Calculat&rdquo; or &ldquo;the platform.&rdquo; Always capitalize the name as shown.</p>

        <h2 className="text-xl font-semibold mt-8">Recent Coverage</h2>
        <p>Calculat has been featured in leading technology and finance publications. Our platform is recognized for its engineering excellence, accessibility, and comprehensive calculator coverage.</p>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Link href="/" className="text-primary hover:underline">Back to Home</Link>
      </div>
    </div>
  )
}
