import { notFound } from 'next/navigation'
import { Link } from '@/lib/navigation'
import { SchemaMarkup, breadcrumbListSchema } from '@/components/SchemaMarkup'
import { AUTHORS, AUTHOR_LIST } from '@/lib/authors'
import { calculatorRegistry } from '@calcuniverse/calculator-registry'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculat.online'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return Object.keys(AUTHORS).map(id => ({ id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const author = AUTHORS[id]
  if (!author) return { title: 'Author Not Found' }
  const title = `${author.name}, ${author.credentials} — Calculat Expert Reviewer`
  const description = author.bio
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/author/${id}` },
    openGraph: { title, description, url: `${siteUrl}/author/${id}`, siteName: 'Calculat', type: 'profile', images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function AuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const author = AUTHORS[id]
  if (!author) notFound()

  const hubLabels: Record<string, string> = {
    'financial-calculators': 'Financial Calculators',
    'health-calculators': 'Health Calculators',
    'math-calculators': 'Math Calculators',
    'conversion-calculators': 'Conversion Calculators',
    'date-time-calculators': 'Date & Time Calculators',
    'construction-calculators': 'Construction Calculators',
    'statistics-calculators': 'Statistics Calculators',
    'education-calculators': 'Education Calculators',
    'physics-calculators': 'Physics Calculators',
    'chemistry-calculators': 'Chemistry Calculators',
    'engineering-calculators': 'Engineering Calculators',
    'everyday-calculators': 'Everyday Calculators',
    'food-calculators': 'Food Calculators',
    'biology-calculators': 'Biology Calculators',
    'ecology-calculators': 'Ecology Calculators',
    'sports-calculators': 'Sports Calculators',
  }

  const calculators = calculatorRegistry
    .filter(c => author.specialty.includes(c.hubSlug) && !/\d$/.test(c.slug))
    .slice(0, 50)

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/author" className="hover:text-primary transition-colors">Our Experts</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-gray-700 dark:text-gray-200">{author.name}</li>
        </ol>
      </nav>
      <SchemaMarkup type="BreadcrumbList" data={breadcrumbListSchema([
        { name: 'Home', url: siteUrl },
        { name: 'Our Experts', url: `${siteUrl}/author` },
        { name: author.name, url: `${siteUrl}/author/${id}` },
      ])} />
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900 mb-8">
        <h1 className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">{author.name}</h1>
        <p className="text-lg text-blue-600 dark:text-blue-400 font-medium mb-4">{author.credentials}</p>
        <p className="text-gray-600 dark:text-gray-300">{author.bio}</p>
        {author.sameAs && (
          <div className="mt-4 flex items-center gap-4">
            {author.sameAs.linkedin && (
              <a href={author.sameAs.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                LinkedIn
              </a>
            )}
            {author.sameAs.twitter && (
              <a href={author.sameAs.twitter} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                X / Twitter
              </a>
            )}
            <Link href="/editorial-policy" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
              Editorial Policy
            </Link>
          </div>
        )}
      </div>

      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Reviewed Calculators ({calculators.length}+)
      </h2>
      <div className="space-y-3">
        {calculators.map((calc) => (
          <div key={calc.slug} className="rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-200 transition-colors dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-700">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Link
                  href={`/${calc.hubSlug}/${calc.slug}`}
                  className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors dark:text-white"
                >
                  {calc.title}
                </Link>
                <p className="text-xs text-gray-500 mt-0.5 dark:text-gray-400">
                  {hubLabels[calc.hubSlug] || calc.hubSlug}
                </p>
              </div>
              <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                calc.tier === 'tier1' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                : calc.tier === 'tier2' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {calc.tier === 'tier1' ? 'Premium' : calc.tier === 'tier2' ? 'Advanced' : 'Basic'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
