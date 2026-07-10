import { routing } from '@/i18n/routing'
import { Link } from '@/lib/navigation'
import { SchemaMarkup, breadcrumbListSchema } from '@/components/SchemaMarkup'
import CalculatorBuilderClient from './client'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jdcalc.com'

export async function generateMetadata() {
  const languages: Record<string, string> = { 'x-default': `${siteUrl}/calculator-builder` }
  for (const l of routing.locales) {
    languages[l] = l === 'en' ? `${siteUrl}/calculator-builder` : `${siteUrl}/${l}/calculator-builder`
  }
  return {
    title: 'Calculator Builder - Create Custom Calculators | JDCALC',
    description: 'Build your own custom calculators with custom formulas and fields. Free online calculator builder tool.',
    alternates: { canonical: `${siteUrl}/calculator-builder`, languages },
    openGraph: { title: 'Calculator Builder - Create Custom Calculators | JDCALC', description: 'Build your own custom calculators with custom formulas and fields.', url: `${siteUrl}/calculator-builder`, siteName: 'JDCALC', type: 'website', images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title: 'Calculator Builder - Create Custom Calculators | JDCALC', description: 'Build your own custom calculators with custom formulas and fields.' },
  }
}

export default function CalculatorBuilderPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-gray-700 dark:text-gray-200">Calculator Builder</li>
        </ol>
      </nav>
      <SchemaMarkup type="BreadcrumbList" data={breadcrumbListSchema([
        { name: 'Home', url: siteUrl },
        { name: 'Calculator Builder', url: `${siteUrl}/calculator-builder` },
      ])} />
      <CalculatorBuilderClient />
    </div>
  )
}
