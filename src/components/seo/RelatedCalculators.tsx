import React from 'react'
import { Link } from '@/lib/navigation'
import type { CalculatorEntry } from '@calcuniverse/calculator-registry'
import { getLocale } from 'next-intl/server'
import { getLocalizedCalculator } from '@/lib/localized-registry'
import { getHubTheme } from '@/lib/hub-themes'
import { SchemaMarkup } from '@/components/SchemaMarkup'

const siteUrl = 'https://www.jdcalc.com'
const DEFAULT_ACCENT = '#06b6d4' // cyan fallback

interface RelatedCalculatorsProps {
  calculator: CalculatorEntry
  max?: number
}

function titleSimilarity(a: string, b: string): number {
  const aWords = a.toLowerCase().split(/\s+/)
  const bWords = b.toLowerCase().split(/\s+/)
  let intersection = 0
  for (let i = 0; i < aWords.length; i++) {
    if (bWords.indexOf(aWords[i]) !== -1) intersection++
  }
  const union = aWords.concat(bWords).filter((w, i, arr) => arr.indexOf(w) === i).length
  return union === 0 ? 0 : intersection / union
}

function keywordOverlap(a: string[], b: string[]): number {
  const aLower = a.map(k => k.toLowerCase())
  let count = 0
  for (let i = 0; i < b.length; i++) {
    if (aLower.indexOf(b[i].toLowerCase()) !== -1) count++
  }
  return count
}

export async function RelatedCalculators({ calculator, max = 6 }: RelatedCalculatorsProps) {
  const locale = await getLocale()
  const t = (await import('next-intl/server')).getTranslations
  const th = await t('hubs')
  const { calculatorRegistry } = await import('@calcuniverse/calculator-registry')
  const candidates = calculatorRegistry
    .filter(c => c.hubSlug !== calculator.hubSlug && c.slug !== calculator.slug && !/\d$/.test(c.slug))
    .map(c => ({
      calc: c,
      titleScore: titleSimilarity(c.title, calculator.title),
      keywordScore: keywordOverlap(c.keywords, calculator.keywords),
    }))
    .filter(c => c.titleScore > 0.15 || c.keywordScore > 0)
    .sort((a, b) => (b.titleScore + b.keywordScore * 0.5) - (a.titleScore + a.keywordScore * 0.5))
    .slice(0, max)

  if (candidates.length === 0) return null

  const localizedEntries = await Promise.all(
    candidates.map(async ({ calc: c }) => {
      const localized = await getLocalizedCalculator(c.slug, locale) ?? c
      return localized
    })
  )

  const accent = getHubTheme(calculator.hubSlug)?.accent || DEFAULT_ACCENT
  const localePrefix = locale === 'en' ? '' : `/${locale}`

  const itemListSchema = {
    name: 'Related Calculators',
    itemListElement: candidates.map(({ calc: c }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: localizedEntries[i].title,
      url: `${siteUrl}${localePrefix}/${c.hubSlug}/${c.slug}`,
    })),
  }

  return (
    <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
      <SchemaMarkup type="ItemList" data={itemListSchema} locale={locale} />
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
        <span className="inline-block h-4 w-1 rounded-full" style={{ backgroundColor: accent }} aria-hidden="true" />
        Related Calculators from Other Categories
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {localizedEntries.map((localized, i) => (
          <Link
            key={candidates[i].calc.slug}
            href={`/${candidates[i].calc.hubSlug}/${candidates[i].calc.slug}`}
            rel="bookmark"
            className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-all"
            style={{ borderLeftWidth: '3px', borderLeftColor: accent }}
          >
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{localized.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{th(candidates[i].calc.hubSlug)}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
