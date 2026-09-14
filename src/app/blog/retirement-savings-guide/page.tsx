import { Link } from '@/lib/navigation'
import { SchemaMarkup, breadcrumbListSchema } from '@/components/SchemaMarkup'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculat.online'

export const dynamic = 'force-static'

export async function generateMetadata() {
  const title = 'Retirement Savings Guide by Age — Calculat Blog'
  const description = 'Plan your retirement savings at every stage of life. Age-based targets and strategies to build a secure financial future.'
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/blog/retirement-savings-guide` },
    openGraph: { title, description, url: `${siteUrl}/blog/retirement-savings-guide`, siteName: 'Calculat', type: 'article', publishedTime: '2026-06-28', images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function RetirementSavingsPage() {
  const title = 'Retirement Savings Guide by Age'
  const date = 'June 28, 2026'
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
        { name: title, url: `${siteUrl}/blog/retirement-savings-guide` },
      ])} />
      <SchemaMarkup type="Article" data={{
        '@type': 'Article',
        headline: title,
        datePublished: '2026-06-28',
        dateModified: '2026-06-28',
        author: { '@type': 'Organization', name: 'Calculat' },
        publisher: { '@type': 'Organization', name: 'Calculat', logo: { '@type': 'ImageObject', url: `${siteUrl}/favicon.svg` } },
        description: 'Age-based retirement savings targets and strategies.',
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/blog/retirement-savings-guide` },
      }} />
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <time dateTime="2026-06-28">{date}</time>
        <span aria-hidden="true">·</span>
        <span>{author}</span>
      </div>
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <p>Planning for retirement can feel overwhelming, but breaking it down by decade makes the goal more achievable. The key is to start early, stay consistent, and adjust your strategy as your income and responsibilities evolve.</p>
        <p><strong>Your 20s — Build the Habit.</strong> Time is your greatest asset. Aim to save 10-15% of your income, including any employer match. Focus on paying off high-interest debt and building an emergency fund of 3-6 months of expenses. A target of 1x your annual salary saved by age 30 is a solid benchmark.</p>
        <p><strong>Your 30s — Accelerate Savings.</strong> As your income grows, increase your savings rate. Aim to have 2-3x your annual salary saved by age 40. Consider maxing out tax-advantaged accounts like 401(k)s and IRAs. This is also the time to diversify your investments and review your asset allocation.</p>
        <p><strong>Your 40s — Maximize Contributions.</strong> With peak earning years ahead, aim to save 15-20% of your income. Target 4-6x your salary by age 50. Take advantage of catch-up contributions if available. Rebalance your portfolio to gradually reduce risk as retirement approaches.</p>
        <p><strong>Your 50s — Catch-Up and Consolidate.</strong> Use catch-up contributions allowed for retirement accounts. Aim for 7-9x your salary by age 60. Focus on paying down remaining debt and consider your retirement budget more seriously. Meet with a financial advisor to fine-tune your withdrawal strategy.</p>
        <p><strong>Your 60s — Prepare for Withdrawals.</strong> By retirement, aim for 10-12x your final salary saved. Create a sustainable withdrawal strategy — the 4% rule is a common starting point. Review Social Security claiming strategies and Medicare options carefully.</p>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-3">Related Calculators</h2>
        <ul className="space-y-2">
          <li><Link href="/financial-calculators/retirement-calculator" className="text-primary hover:underline">Retirement Calculator</Link></li>
          <li><Link href="/financial-calculators/401k-calculator" className="text-primary hover:underline">401(k) Calculator</Link></li>
          <li><Link href="/financial-calculators/compound-interest-calculator" className="text-primary hover:underline">Compound Interest Calculator</Link></li>
        </ul>
      </div>
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Link href="/blog" className="text-primary hover:underline">← Back to Blog</Link>
      </div>
    </div>
  )
}
