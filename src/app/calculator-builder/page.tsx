import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/lib/navigation'
import { SchemaMarkup, breadcrumbListSchema } from '@/components/SchemaMarkup'
import CalculatorBuilderClient from './client'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculat.online'

export const dynamic = 'force-static'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations('pages')
  const title = t('calculatorBuilderTitle')
  const description = t('calculatorBuilderDescription')
  const languages: Record<string, string> = { 'x-default': `${siteUrl}/calculator-builder`, en: `${siteUrl}/calculator-builder` }
  return {
    title: `${title} | Calculat`,
    description,
    alternates: { canonical: `${siteUrl}/calculator-builder`, languages },
    openGraph: { title: `${title} | Calculat`, description, url: `${siteUrl}/calculator-builder`, siteName: 'Calculat' },
    twitter: { card: 'summary_large_image', title: `${title} | Calculat`, description },
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
