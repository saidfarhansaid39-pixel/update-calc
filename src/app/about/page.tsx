import { getLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { Link } from '@/lib/navigation'
import { SchemaMarkup, breadcrumbListSchema } from '@/components/SchemaMarkup'
import { AUTHOR_LIST } from '@/lib/authors'
import { getHubMeta } from '@/lib/hub-data'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jdcalc.com'

export const dynamic = 'force-static'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations('pages.about')
  const title = t('metaTitle')
  const description = t('metaDescription')
  const path = '/about'
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

export default async function AboutPage() {
  const hubSlugs = Array.from(new Set(AUTHOR_LIST.flatMap(a => a.specialty)))
  const hubTitleMap: Record<string, string> = {}
  await Promise.all(
    hubSlugs.map(async (slug) => {
      const meta = await getHubMeta(slug)
      hubTitleMap[slug] = meta ? meta.title : slug
    })
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-gray-700 dark:text-gray-200">About JDCALC</li>
        </ol>
      </nav>
      <SchemaMarkup type="BreadcrumbList" data={breadcrumbListSchema([
        { name: 'Home', url: siteUrl },
        { name: 'About JDCALC', url: `${siteUrl}/about` },
      ])} />
      <h1 className="text-3xl font-bold mb-6">About JDCALC</h1>
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <p>JDCALC is a comprehensive collection of free online calculators covering finance, health, math, science, conversion, and everyday life. Our mission is to provide fast, accurate, and beautifully designed calculation tools for everyone.</p>
        <p>With 16 categories and thousands of calculators, we help students, professionals, and everyday users solve problems quickly and accurately.</p>
        <h2 className="text-xl font-semibold mt-8">Our Mission</h2>
        <p>To make complex calculations simple and accessible to everyone, regardless of their background or expertise.</p>
        <h2 className="text-xl font-semibold mt-8">Why JDCALC?</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Free & Accessible</strong> — All calculators are completely free to use</li>
          <li><strong>Fast & Accurate</strong> — Powered by precise formulas and instant computation</li>
          <li><strong>Beautiful Design</strong> — Modern, clean interface that works on all devices</li>
          <li><strong>Comprehensive</strong> — Thousands of calculators across 16 categories</li>
          <li><strong>Multi-language</strong> — Available in 10 languages</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8">Our Experts</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Every calculator on JDCALC is reviewed by a qualified subject-matter expert before publication and re-checked on a regular schedule.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {AUTHOR_LIST.map((author) => (
            <div key={author.id} className="rounded-lg border border-gray-200 dark:border-gray-800 p-5">
              <div className="flex items-center gap-3">
                {author.avatar ? (
                  <img src={author.avatar} alt={author.name} width={48} height={48} loading="lazy" decoding="async" className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold" aria-hidden="true">
                    {author.name.split(' ').slice(0, 2).map((p) => p[0]).join('')}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{author.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{author.credentials}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{author.bio}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {author.specialty.map((hub) => (
                  <span key={hub} className="rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs text-gray-600 dark:text-gray-300">
                    {hubTitleMap[hub] || hub}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
