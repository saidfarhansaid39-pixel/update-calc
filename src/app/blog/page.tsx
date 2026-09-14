import { Link } from '@/lib/navigation'
import { SchemaMarkup, breadcrumbListSchema } from '@/components/SchemaMarkup'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculat.online'

export const dynamic = 'force-static'

export async function generateMetadata() {
  return {
    title: 'Blog & Editorial — Calculat',
    description: 'Expert articles on mortgage tips, BMI, retirement planning, currency exchange, credit scores, and more from the Calculat editorial team.',
    alternates: { canonical: `${siteUrl}/blog` },
    openGraph: { title: 'Blog & Editorial — Calculat', description: 'Expert articles on mortgage tips, BMI, retirement planning, currency exchange, credit scores, and more.', url: `${siteUrl}/blog`, siteName: 'Calculat', type: 'website', images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title: 'Blog & Editorial — Calculat', description: 'Expert articles on mortgage tips, BMI, retirement planning, currency exchange, credit scores, and more.' },
  }
}

const articles = [
  {
    slug: 'investment-calculator-guide',
    title: 'How to Calculate Investment Returns: A Complete Guide',
    excerpt: 'Learn how to calculate investment returns using compound interest, CAGR, and IRR. Includes formulas, examples, and a free investment calculator.',
    date: 'July 19, 2026',
    category: 'Finance',
  },
  {
    slug: 'loan-comparison-guide',
    title: 'How to Compare Loan Types: Personal, Auto, Mortgage & More',
    excerpt: 'Compare personal loans, auto loans, mortgages, and student loans. Learn about interest rates, terms, and which loan type fits your needs.',
    date: 'July 19, 2026',
    category: 'Finance',
  },
  {
    slug: 'calorie-deficit-explained',
    title: 'How Many Calories Should You Eat to Lose Weight?',
    excerpt: 'Calculate your ideal calorie deficit for weight loss using the Mifflin-St Jeor equation. Learn about BMR, TDEE, and safe weight loss rates.',
    date: 'July 19, 2026',
    category: 'Health',
  },
  {
    slug: 'conversion-cooking-guide',
    title: 'Cooking Measurement Conversion Guide: Cups, Grams, Ounces & More',
    excerpt: 'Convert cooking measurements instantly between cups, grams, ounces, milliliters, and teaspoons. Essential kitchen conversion charts and tips.',
    date: 'July 19, 2026',
    category: 'Conversion',
  },
  {
    slug: 'gpa-strategies',
    title: 'How to Raise Your GPA: Strategies That Actually Work',
    excerpt: 'Proven strategies to improve your GPA. Calculate your current GPA, find out what grades you need, and create a plan to reach your target GPA.',
    date: 'July 19, 2026',
    category: 'Education',
  },
  {
    slug: 'mortgage-tips-2026',
    title: '10 Mortgage Tips for 2026',
    excerpt: 'Navigate the 2026 housing market with confidence. Learn about rate trends, down payment strategies, and how to choose the right mortgage product for your situation.',
    date: 'July 10, 2026',
    category: 'Finance',
  },
  {
    slug: 'bmi-limitations',
    title: 'Understanding BMI Limitations and Alternatives',
    excerpt: 'BMI is widely used but has significant limitations. Explore alternative body composition metrics and why they may give a more accurate picture of your health.',
    date: 'July 5, 2026',
    category: 'Health',
  },
  {
    slug: 'retirement-savings-guide',
    title: 'Retirement Savings Guide by Age',
    excerpt: 'No matter where you are in your career, it is never too early or too late to plan for retirement. This guide breaks down savings targets by decade.',
    date: 'June 28, 2026',
    category: 'Finance',
  },
  {
    slug: 'currency-exchange-explained',
    title: 'How Currency Exchange Rates Work',
    excerpt: 'Understand the forces behind currency fluctuations — from interest rates and inflation to geopolitical events — and how they affect your money.',
    date: 'June 20, 2026',
    category: 'Finance',
  },
  {
    slug: 'improving-credit-score',
    title: '5 Ways to Improve Your Credit Score',
    excerpt: 'A strong credit score opens doors to better interest rates and financial opportunities. Discover five proven strategies to boost your score fast.',
    date: 'June 15, 2026',
    category: 'Finance',
  },
]

export default async function BlogListingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-gray-700 dark:text-gray-200">Blog & Editorial</li>
        </ol>
      </nav>
      <SchemaMarkup type="BreadcrumbList" data={breadcrumbListSchema([
        { name: 'Home', url: siteUrl },
        { name: 'Blog & Editorial', url: `${siteUrl}/blog` },
      ])} />
      <h1 className="text-3xl font-bold mb-2">Blog & Editorial</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Expert insights, tips, and guides from the Calculat editorial team.</p>
      <div className="space-y-8">
        {articles.map((article) => (
          <article key={article.slug} className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium">{article.category}</span>
              <time dateTime={article.date}>{article.date}</time>
            </div>
            <h2 className="text-xl font-semibold mb-2">
              <Link href={`/blog/${article.slug}`} className="text-gray-900 dark:text-white hover:text-primary transition-colors">
                {article.title}
              </Link>
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{article.excerpt}</p>
            <Link href={`/blog/${article.slug}`} className="mt-2 inline-block text-sm text-primary hover:underline">
              Read more →
            </Link>
          </article>
        ))}
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Link href="/" className="text-primary hover:underline">Back to Home</Link>
      </div>
    </div>
  )
}
