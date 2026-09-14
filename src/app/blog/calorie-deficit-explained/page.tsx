import { Link } from '@/lib/navigation'
import { SchemaMarkup, breadcrumbListSchema } from '@/components/SchemaMarkup'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculat.online'

export const dynamic = 'force-static'

export async function generateMetadata() {
  const title = 'How Many Calories Should You Eat to Lose Weight? — Calculat Blog'
  const description = 'Calculate your ideal calorie deficit for weight loss using the Mifflin-St Jeor equation. Learn about BMR, TDEE, and safe weight loss rates.'
  return {
    title, description,
    alternates: { canonical: `${siteUrl}/blog/calorie-deficit-explained` },
    openGraph: { title, description, url: `${siteUrl}/blog/calorie-deficit-explained`, siteName: 'Calculat', type: 'article', publishedTime: '2026-07-19', images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function CalorieDeficitPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-gray-700 dark:text-gray-200">Calorie Deficit Guide</li>
        </ol>
      </nav>
      <SchemaMarkup type="BreadcrumbList" data={breadcrumbListSchema([
        { name: 'Home', url: siteUrl }, { name: 'Blog', url: `${siteUrl}/blog` }, { name: 'Calorie Deficit Guide', url: `${siteUrl}/blog/calorie-deficit-explained` },
      ])} />
      <SchemaMarkup type="Article" data={{
        '@type': 'Article', headline: 'How Many Calories Should You Eat to Lose Weight?', datePublished: '2026-07-19', dateModified: '2026-07-19',
        author: { '@type': 'Person', name: 'Dr. Sarah Chen, MD, MPH' },
        publisher: { '@type': 'Organization', name: 'Calculat', logo: { '@type': 'ImageObject', url: `${siteUrl}/favicon.svg` } },
        description: 'Calculate your ideal calorie deficit for weight loss.', mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/blog/calorie-deficit-explained` },
      }} />
      <h1 className="text-3xl font-bold mb-2">How Many Calories Should You Eat to Lose Weight?</h1>
      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <time dateTime="2026-07-19">July 19, 2026</time><span aria-hidden="true">·</span><span>Dr. Sarah Chen, MD, MPH</span>
      </div>
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <p>Weight loss comes down to a simple equation: calories in versus calories out. But finding the right calorie deficit for your body requires understanding your metabolism. This guide explains how to calculate your ideal calorie intake for safe, sustainable weight loss.</p>

        <h2>What is BMR?</h2>
        <p>Your Basal Metabolic Rate (BMR) is the number of calories your body needs at complete rest to maintain vital functions like breathing, circulation, and cell production. The <strong>Mifflin-St Jeor equation</strong> is the most accurate formula:</p>
        <p><strong>Men:</strong> BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(y) + 5</p>
        <p><strong>Women:</strong> BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(y) - 161</p>

        <h2>What is TDEE?</h2>
        <p>Your Total Daily Energy Expenditure (TDEE) is BMR plus the calories you burn through activity and digestion. Multiply your BMR by an activity factor:</p>
        <ul>
          <li><strong>Sedentary:</strong> BMR × 1.2 (little or no exercise)</li>
          <li><strong>Lightly active:</strong> BMR × 1.375 (1-3 days/week)</li>
          <li><strong>Moderately active:</strong> BMR × 1.55 (3-5 days/week)</li>
          <li><strong>Very active:</strong> BMR × 1.725 (6-7 days/week)</li>
          <li><strong>Extra active:</strong> BMR × 1.9 (physical job + training)</li>
        </ul>

        <h2>Creating a Calorie Deficit</h2>
        <p>To lose weight, eat below your TDEE:</p>
        <ul>
          <li><strong>Mild deficit:</strong> TDEE - 250 calories = ~0.5 lb/week loss</li>
          <li><strong>Moderate deficit:</strong> TDEE - 500 calories = ~1 lb/week loss</li>
          <li><strong>Aggressive deficit:</strong> TDEE - 1000 calories = ~2 lb/week loss</li>
        </ul>
        <p>Never go below 1,200 calories for women or 1,500 for men without medical supervision. Rapid weight loss can lead to muscle loss, nutrient deficiencies, and metabolic slowdown.</p>

        <h2>Calculate Your Numbers</h2>
        <p>Use our free <Link href="/health-calculators/calorie-calculator" className="text-primary hover:underline">calorie calculator</Link> to get your personalized BMR and TDEE. It factors in your age, sex, weight, height, and activity level to give you accurate targets for weight loss, maintenance, or weight gain.</p>

        <p>For a complete health assessment, also try our <Link href="/health-calculators/bmi-calculator" className="text-primary hover:underline">BMI calculator</Link> to track your progress over time.</p>
      </div>
    </div>
  )
}
