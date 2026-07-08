'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Link } from '@/lib/navigation'
import type { CalculatorEntry } from '@calcuniverse/calculator-registry'
import { ArrowRight, TrendingUp, Clock, Grid3X3, BookOpen, BarChart3, Hash, List } from 'lucide-react'
import { useLocale } from 'next-intl'
import { getLocalizedCalculator } from '@/lib/localized-registry'

let _registryPromise: Promise<CalculatorEntry[]> | null = null
function getRegistry(): Promise<CalculatorEntry[]> {
  if (!_registryPromise) {
    _registryPromise = import('@calcuniverse/calculator-registry').then(m => m.calculatorRegistry)
  }
  return _registryPromise
}

const hubPaths: Record<string, string> = {
  financial: 'financial-calculators', health: 'health-calculators', math: 'math-calculators',
  conversion: 'conversion-calculators', 'date-time': 'date-time-calculators',
  construction: 'construction-calculators', statistics: 'statistics-calculators',
  education: 'education-calculators', physics: 'physics-calculators',
  chemistry: 'chemistry-calculators', engineering: 'engineering-calculators',
  everyday: 'everyday-calculators', food: 'food-calculators',
  biology: 'biology-calculators', ecology: 'ecology-calculators', sports: 'sports-calculators',
}

interface InternalLinkingGridProps {
  calculator: {
    slug: string
    title: string
    category: string
    hubSlug: string
    hubName: string
    keywords: string[]
  }
}

export function InternalLinkingGrid({ calculator }: InternalLinkingGridProps) {
  const locale = useLocale()
  const [registry, setRegistry] = useState<CalculatorEntry[] | null>(null)
  const [localizedTitles, setLocalizedTitles] = useState<Record<string, string>>({})
  const [localizedDescriptions, setLocalizedDescriptions] = useState<Record<string, string>>({})

  useEffect(() => {
    getRegistry().then(setRegistry)
  }, [])

  const links = useMemo(() => {
    if (!registry) return null
    const all = registry
    const sameCategory = all.filter(c => c.category === calculator.category && c.slug !== calculator.slug)
    const popular = sameCategory.slice(0, 6)
    const hubPath = hubPaths[calculator.category] || calculator.hubSlug
    const hubPage = `/${hubPath}`
    const relatedDetail = sameCategory.slice(0, 4)
    return { popular, hubPath, hubPage, relatedDetail, all, sameCategory }
  }, [calculator, registry])

  const displayEntries = useMemo(() => {
    if (!links) return []
    const slugs = new Set<string>()
    links.popular.forEach(c => slugs.add(c.slug))
    links.relatedDetail.forEach(c => slugs.add(c.slug))
    return Array.from(slugs)
  }, [links])

  useEffect(() => {
    async function load() {
      const titles: Record<string, string> = {}
      const descs: Record<string, string> = {}
      await Promise.all(displayEntries.map(async slug => {
        const loc = await getLocalizedCalculator(slug, locale)
        if (loc) {
          titles[slug] = loc.title
          descs[slug] = loc.description
        }
      }))
      setLocalizedTitles(titles)
      setLocalizedDescriptions(descs)
    }
    if (locale !== 'en') load()
  }, [locale, displayEntries])

  const localizedCalc = (entry: CalculatorEntry) => ({
    ...entry,
    title: localizedTitles[entry.slug] || entry.title,
    description: localizedDescriptions[entry.slug] || entry.description,
  })

  if (!links) return null

  const linkCount = 1 + links.popular.length + links.relatedDetail.length + 3 + Math.min(links.popular.length, 3)

  return (
    <div className="space-y-6">
      {/* Main Hub link */}
      <div className="bg-gradient-to-r from-[#1a3a8a]/5 to-transparent rounded-2xl border border-[#1a3a8a]/20 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{calculator.hubName} Hub</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">View all {links.sameCategory.length + 1} calculators in this category</p>
          </div>
          <Link href={links.hubPage} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1a3a8a] text-white rounded-lg text-sm font-medium hover:bg-[#0a1d4f] transition-colors">
            Browse All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Popular in category */}
      {links.popular.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Popular {calculator.hubName}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {links.popular.map(c => (
              <Link key={c.slug} href={`/${links.hubPath}/${c.slug}`}
                className="px-2.5 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg text-xs text-gray-700 dark:text-gray-300 hover:bg-[#1a3a8a]/5 hover:text-[#1a3a8a] transition-colors border border-gray-100 dark:border-gray-800 truncate">
                {localizedCalc(c).title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recently Updated / Related Detail */}
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <Clock className="w-4 h-4 text-gray-400" />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Related Calculators</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {links.relatedDetail.map(c => (
            <Link key={c.slug} href={`/${links.hubPath}/${c.slug}`}
              className="px-3 py-2.5 bg-white dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-[#1a3a8a]/5 hover:text-[#1a3a8a] transition-colors border border-gray-200 dark:border-gray-700 shadow-sm">
              <p className="font-medium truncate">{localizedCalc(c).title}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{localizedCalc(c).description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Internal link cluster */}
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <Hash className="w-4 h-4 text-gray-400" />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Links</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Link href="/" className="px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-600 dark:text-gray-400 hover:text-[#1a3a8a] hover:bg-[#1a3a8a]/5 transition-colors border border-gray-100 dark:border-gray-800">
            Home
          </Link>
          <Link href={links.hubPage} className="px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-600 dark:text-gray-400 hover:text-[#1a3a8a] hover:bg-[#1a3a8a]/5 transition-colors border border-gray-100 dark:border-gray-800">
            All {calculator.hubName}
          </Link>
          <Link href="/about" className="px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-600 dark:text-gray-400 hover:text-[#1a3a8a] hover:bg-[#1a3a8a]/5 transition-colors border border-gray-100 dark:border-gray-800">
            About Us
          </Link>
          {calculator.keywords.slice(0, 4).map(kw => (
            <span key={kw} className="px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-400 border border-gray-100 dark:border-gray-800">
              {kw}
            </span>
          ))}
          {links.popular.slice(0, 3).map(c => (
            <Link key={c.slug} href={`/${links.hubPath}/${c.slug}`}
              className="px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-600 dark:text-gray-400 hover:text-[#1a3a8a] transition-colors border border-gray-100 dark:border-gray-800">
              {localizedCalc(c).title}
            </Link>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-2">
          {linkCount} internal links on this page
        </p>
      </div>
    </div>
  )
}
