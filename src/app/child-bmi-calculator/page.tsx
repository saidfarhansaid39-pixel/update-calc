import type { Metadata } from 'next'
import { ChildBmiCalculator } from '@/components/calculator/ChildBmiCalculator'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculat.online'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Child BMI Percentile Calculator (CDC Growth Chart)',
  description: 'Calculate your child BMI and BMI-for-age percentile with a CDC-style growth chart. For ages 2-20.',
  alternates: { canonical: `${siteUrl}/child-bmi-calculator` },
  openGraph: { title: 'Child BMI Percentile Calculator', description: 'Child BMI and CDC growth chart for ages 2-20.', url: `${siteUrl}/child-bmi-calculator`, type: 'website' },
}

export default function ChildBmiPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Child BMI Percentile Calculator</h1>
          <p className="text-gray-500 dark:text-gray-300 mt-2">
            Enter your child&apos;s age, height, and weight to compute BMI and the BMI-for-age percentile using a CDC-style growth chart.
          </p>
        </header>
        <div className="card-premium dark:bg-gray-800 dark:border-gray-700 p-6">
          <ChildBmiCalculator />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-300 mt-6">
          BMI is calculated as weight (kg) &divide; height (m)&sup2;. Percentiles indicate how a child&apos;s BMI compares to others of the same age and sex. This tool is for informational purposes only and is not a substitute for professional medical advice.
        </p>
      </main>
    </div>
  )
}
