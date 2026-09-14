import { Link } from '@/lib/navigation'
import { SchemaMarkup, breadcrumbListSchema } from '@/components/SchemaMarkup'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculat.online'

export const dynamic = 'force-static'

export async function generateMetadata() {
  const title = 'How to Compare Loan Types: Personal, Auto, Mortgage & More — Calculat Blog'
  const description = 'Compare personal loans, auto loans, mortgages, and student loans. Learn about interest rates, terms, and which loan type fits your needs.'
  return {
    title, description,
    alternates: { canonical: `${siteUrl}/blog/loan-comparison-guide` },
    openGraph: { title, description, url: `${siteUrl}/blog/loan-comparison-guide`, siteName: 'Calculat', type: 'article', publishedTime: '2026-07-19', images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function LoanComparisonPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-gray-700 dark:text-gray-200">Loan Comparison Guide</li>
        </ol>
      </nav>
      <SchemaMarkup type="BreadcrumbList" data={breadcrumbListSchema([
        { name: 'Home', url: siteUrl }, { name: 'Blog', url: `${siteUrl}/blog` }, { name: 'Loan Comparison Guide', url: `${siteUrl}/blog/loan-comparison-guide` },
      ])} />
      <SchemaMarkup type="Article" data={{
        '@type': 'Article', headline: 'How to Compare Loan Types', datePublished: '2026-07-19', dateModified: '2026-07-19',
        author: { '@type': 'Person', name: 'James Mitchell, CFA' },
        publisher: { '@type': 'Organization', name: 'Calculat', logo: { '@type': 'ImageObject', url: `${siteUrl}/favicon.svg` } },
        description: 'Compare personal loans, auto loans, mortgages, and student loans.', mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/blog/loan-comparison-guide` },
      }} />
      <h1 className="text-3xl font-bold mb-2">How to Compare Loan Types: A Complete Guide</h1>
      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <time dateTime="2026-07-19">July 19, 2026</time><span aria-hidden="true">·</span><span>James Mitchell, CFA</span>
      </div>
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <p>Choosing the right loan can save you thousands of dollars. Whether you are buying a home, financing a car, or consolidating debt, understanding the differences between loan types is critical. Here is everything you need to know.</p>

        <h2>Mortgage Loans</h2>
        <p>Mortgages are secured by real estate and typically offer the lowest interest rates. Fixed-rate mortgages lock in your rate for 15-30 years, while adjustable-rate mortgages (ARMs) start lower but can increase. Use our <Link href="/financial-calculators/mortgage-calculator" className="text-primary hover:underline">mortgage calculator</Link> to compare scenarios.</p>
        <ul>
          <li><strong>Rates:</strong> 6-8% (2026 averages)</li>
          <li><strong>Terms:</strong> 15-30 years</li>
          <li><strong>Best for:</strong> Homebuyers with good credit</li>
        </ul>

        <h2>Auto Loans</h2>
        <p>Auto loans are secured by the vehicle. Rates vary significantly based on credit score and whether the car is new or used. Our <Link href="/financial-calculators/auto-loan-calculator" className="text-primary hover:underline">auto loan calculator</Link> helps you find the right payment plan.</p>
        <ul>
          <li><strong>Rates:</strong> 5-10% for new, 7-15% for used</li>
          <li><strong>Terms:</strong> 36-72 months</li>
          <li><strong>Best for:</strong> Vehicle purchases with competitive rates</li>
        </ul>

        <h2>Personal Loans</h2>
        <p>Personal loans are unsecured, meaning no collateral required. Rates depend heavily on credit score. They are ideal for debt consolidation, home improvements, or major expenses.</p>
        <ul>
          <li><strong>Rates:</strong> 7-36%</li>
          <li><strong>Terms:</strong> 1-7 years</li>
          <li><strong>Best for:</strong> Debt consolidation, unexpected expenses</li>
        </ul>

        <h2>Student Loans</h2>
        <p>Federal student loans offer fixed rates and flexible repayment options. Private student loans may have variable rates and fewer protections.</p>

        <h2>How to Compare Loans</h2>
        <p>When comparing loans, look beyond the monthly payment. Consider the APR (which includes fees), total interest over the loan term, and prepayment penalties. Use our <Link href="/financial-calculators/loan-calculator" className="text-primary hover:underline">loan calculator</Link> to see the full picture before borrowing.</p>

        <p>Ready to compare your options? Try our <Link href="/financial-calculators/loan-calculator" className="text-primary hover:underline">loan calculator</Link> or <Link href="/financial-calculators/mortgage-calculator" className="text-primary hover:underline">mortgage calculator</Link> today.</p>
      </div>
    </div>
  )
}
