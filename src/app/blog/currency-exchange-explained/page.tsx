import { Link } from '@/lib/navigation'
import { SchemaMarkup, breadcrumbListSchema } from '@/components/SchemaMarkup'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculat.online'

export const dynamic = 'force-static'

export async function generateMetadata() {
  const title = 'How Currency Exchange Rates Work — Calculat Blog'
  const description = 'Understand the forces behind currency fluctuations — interest rates, inflation, geopolitics, and how they affect your money.'
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/blog/currency-exchange-explained` },
    openGraph: { title, description, url: `${siteUrl}/blog/currency-exchange-explained`, siteName: 'Calculat', type: 'article', publishedTime: '2026-06-20', images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function CurrencyExchangePage() {
  const title = 'How Currency Exchange Rates Work'
  const date = 'June 20, 2026'
  const author = 'Calculat Editorial Team'
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-gray-700 dark:text-gray-200">{title}</li>
        </ol>
      </nav>
      <SchemaMarkup type="BreadcrumbList" data={breadcrumbListSchema([
        { name: 'Home', url: siteUrl },
        { name: 'Blog', url: `${siteUrl}/blog` },
        { name: title, url: `${siteUrl}/blog/currency-exchange-explained` },
      ])} />
      <SchemaMarkup type="Article" data={{
        '@type': 'Article',
        headline: title,
        datePublished: '2026-06-20',
        dateModified: '2026-06-20',
        author: { '@type': 'Organization', name: 'Calculat' },
        publisher: { '@type': 'Organization', name: 'Calculat', logo: { '@type': 'ImageObject', url: `${siteUrl}/favicon.svg` } },
        description: 'Understand the forces behind currency fluctuations.',
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/blog/currency-exchange-explained` },
      }} />
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <time dateTime="2026-06-20">{date}</time>
        <span aria-hidden="true">·</span>
        <span>{author}</span>
      </div>
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <p>Currency exchange rates determine how much one currency is worth in terms of another. They affect everything from international travel and online shopping to global trade and investment returns. Understanding how they work can help you make smarter financial decisions.</p>
        <p><strong>Supply and Demand.</strong> At its core, a currency exchange rate is driven by supply and demand. When demand for a currency increases — because more people want to buy goods, services, or assets priced in that currency — its value rises. Conversely, when demand falls, the currency depreciates.</p>
        <p><strong>Interest Rates and Central Bank Policy.</strong> Central banks influence exchange rates through monetary policy. Higher interest rates attract foreign investment, increasing demand for the currency and pushing its value up. Lower rates tend to have the opposite effect. Central bank announcements are closely watched by currency traders worldwide.</p>
        <p><strong>Inflation and Economic Health.</strong> Countries with low inflation tend to have stronger currencies because purchasing power is preserved. Economic indicators such as GDP growth, employment data, and trade balances all contribute to a currency perceived strength or weakness on the global stage.</p>
        <p><strong>Geopolitical Factors.</strong> Political stability, trade agreements, sanctions, and international relations all play a role. Safe-haven currencies like the US dollar, Swiss franc, and Japanese yen often strengthen during times of global uncertainty as investors seek stability.</p>
        <p><strong>Fixed vs. Floating Rates.</strong> Some countries use fixed exchange rates, pegging their currency to another (often the US dollar). Others use floating rates determined by the market. Many fall somewhere in between, with managed floats that allow central banks to intervene when necessary.</p>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-3">Related Calculators</h2>
        <ul className="space-y-2">
          <li><Link href="/financial-calculators/currency-calculator" className="text-primary hover:underline">Currency Calculator</Link></li>
          <li><Link href="/financial-calculators/inflation-calculator" className="text-primary hover:underline">Inflation Calculator</Link></li>
          <li><Link href="/conversion-calculators/multicurrency-calculator" className="text-primary hover:underline">Multi-Currency Converter</Link></li>
        </ul>
      </div>
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Link href="/blog" className="text-primary hover:underline">← Back to Blog</Link>
      </div>
    </div>
  )
}
