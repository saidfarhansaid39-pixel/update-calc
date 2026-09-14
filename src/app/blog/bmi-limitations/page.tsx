import { Link } from '@/lib/navigation'
import { SchemaMarkup, breadcrumbListSchema } from '@/components/SchemaMarkup'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculat.online'

export const dynamic = 'force-static'

export async function generateMetadata() {
  const title = 'Understanding BMI Limitations and Alternatives — Calculat Blog'
  const description = 'BMI is widely used but has significant limitations. Explore alternative body composition metrics for a more accurate health picture.'
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/blog/bmi-limitations` },
    openGraph: { title, description, url: `${siteUrl}/blog/bmi-limitations`, siteName: 'Calculat', type: 'article', publishedTime: '2026-07-05', images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function BmiLimitationsPage() {
  const title = 'Understanding BMI Limitations and Alternatives'
  const date = 'July 5, 2026'
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
        { name: title, url: `${siteUrl}/blog/bmi-limitations` },
      ])} />
      <SchemaMarkup type="Article" data={{
        '@type': 'Article',
        headline: title,
        datePublished: '2026-07-05',
        dateModified: '2026-07-05',
        author: { '@type': 'Organization', name: 'Calculat' },
        publisher: { '@type': 'Organization', name: 'Calculat', logo: { '@type': 'ImageObject', url: `${siteUrl}/favicon.svg` } },
        description: 'Explore the limitations of BMI and alternative body composition metrics.',
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/blog/bmi-limitations` },
      }} />
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <time dateTime="2026-07-05">{date}</time>
        <span aria-hidden="true">·</span>
        <span>{author}</span>
      </div>
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <p>Body Mass Index (BMI) has been used for decades as a quick screening tool for weight categories. While it remains a useful population-level metric, its limitations are increasingly recognized by health professionals and researchers.</p>
        <p><strong>What BMI Measures.</strong> BMI is calculated by dividing weight in kilograms by height in meters squared. It categorizes individuals as underweight, normal weight, overweight, or obese. The calculation is simple and inexpensive, which is why it remains widely used in clinical settings.</p>
        <p><strong>The Key Limitations.</strong> BMI does not distinguish between fat mass and lean muscle mass. Athletes and individuals with high muscle mass may be classified as overweight or obese despite having very low body fat. Conversely, older adults may have normal BMI but high body fat percentages. BMI also does not account for fat distribution, which is significant because visceral fat carries higher health risks than subcutaneous fat.</p>
        <p><strong>Alternative Metrics.</strong> Several alternatives provide a more nuanced picture. Body fat percentage directly measures the proportion of fat in your body. Waist-to-hip ratio and waist circumference are strong predictors of cardiovascular risk. The Body Shape Index (BSI) adjusts for height and weight distribution. Bioelectrical impedance analysis (BIA) and DEXA scans offer clinical-grade body composition data.</p>
        <p><strong>The Bottom Line.</strong> BMI is best used as a starting point rather than a definitive health assessment. For a complete picture, combine BMI with other measurements and consult a healthcare professional who can interpret these metrics in the context of your overall health, fitness level, and medical history.</p>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-3">Related Calculators</h2>
        <ul className="space-y-2">
          <li><Link href="/health-calculators/bmi-calculator" className="text-primary hover:underline">BMI Calculator</Link></li>
          <li><Link href="/health-calculators/body-fat-calculator" className="text-primary hover:underline">Body Fat Calculator</Link></li>
          <li><Link href="/food-calculators/ideal-weight-calculator" className="text-primary hover:underline">Ideal Weight Calculator</Link></li>
        </ul>
      </div>
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Link href="/blog" className="text-primary hover:underline">← Back to Blog</Link>
      </div>
    </div>
  )
}
