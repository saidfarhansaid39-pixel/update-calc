'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Link } from '@/lib/navigation'
import { calculatorRegistry } from '@calcuniverse/calculator-registry'
import type { CalculatorEntry } from '@calcuniverse/calculator-registry'
import { ArrowRight, TrendingUp, Clock, BookOpen, BarChart3, Hash, List } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { getLocalizedCalculator } from '@/lib/localized-registry'

interface InternalLinkingGridProps {
  calculatorData: {
    title: string
    hub: string
    tier?: string
  }
}

export function InternalLinkingGrid({ calculatorData }: InternalLinkingGridProps) {
  const locale = useLocale()
  const th = useTranslations('hubs')
  const ti = useTranslations('internalLinks')
  const [localizedTitles, setLocalizedTitles] = useState<Record<string, string>>({})
  const [localizedDescriptions, setLocalizedDescriptions] = useState<Record<string, string>>({})
  const { title, hub } = calculatorData

  const links = useMemo(() => {
    const all = calculatorRegistry
    const sameCategory = all.filter(c => c.hubSlug === hub && c.slug !== title.toLowerCase().replace(/\s+/g, '-'))
    const hubPath = hub
    const hubPage = `/${hubPath}`
    // "Related calculators" — closest matches within the same hub.
    const relatedDetail = sameCategory.slice(0, 4)
    // "Popular in {hub}" — same-hub only, skipping the related picks above
    // so no calculator is linked twice. Cross-hub discovery links were
    // removed here: recommendations stay strictly within the category silo.
    const popular = sameCategory.filter(c => !relatedDetail.includes(c)).slice(0, 6)
    return { popular, hubPath, hubPage, relatedDetail, all, sameCategory }
  }, [hub, title])

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

  const linkCount = 1 + links.relatedDetail.length + links.popular.length + 3

  return (
    <div className="space-y-6">
      {/* Main Hub link */}
      <div className="bg-gradient-to-r from-[#1a3a8a]/5 to-transparent rounded-2xl border border-[#1a3a8a]/20 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{th(hub)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{ti('viewAll', { count: links.sameCategory.length + 1 })}</p>
          </div>
          <Link href={links.hubPage} rel="bookmark" className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1a3a8a] text-white rounded-lg text-sm font-medium hover:bg-[#0a1d4f] transition-colors">
            {ti('browseAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Related calculators */}
      {links.relatedDetail.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <List className="w-4 h-4 text-gray-400" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{ti('related')}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {links.relatedDetail.map(c => (
              <Link key={c.slug} href={`/${links.hubPath}/${c.slug}`} rel="bookmark"
                className="px-3 py-2.5 bg-white dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-[#1a3a8a]/5 hover:text-[#1a3a8a] transition-colors border border-gray-200 dark:border-gray-700 shadow-sm">
                <p className="font-medium truncate">{localizedCalc(c).title}</p>
                {locale === 'en' && (
                  <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{localizedCalc(c).description}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Popular in {hub} */}
      {links.popular.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{ti('popularIn', { hub: th(hub) })}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {links.popular.map(c => (
              <Link key={c.slug} href={`/${links.hubPath}/${c.slug}`} rel="bookmark"
                className="px-2.5 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg text-xs text-gray-700 dark:text-gray-300 hover:bg-[#1a3a8a]/5 hover:text-[#1a3a8a] transition-colors border border-gray-100 dark:border-gray-800 truncate">
                {localizedCalc(c).title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Internal link cluster: site utilities only (no repeated calculator links). */}
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <Hash className="w-4 h-4 text-gray-400" />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{ti('quickLinks')}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Link href="/" rel="bookmark" className="px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-600 dark:text-gray-400 hover:text-[#1a3a8a] hover:bg-[#1a3a8a]/5 transition-colors border border-gray-100 dark:border-gray-800">
            {ti('home')}
          </Link>
          <Link href={links.hubPage} rel="bookmark" className="px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-600 dark:text-gray-400 hover:text-[#1a3a8a] hover:bg-[#1a3a8a]/5 transition-colors border border-gray-100 dark:border-gray-800">
            {ti('allHub', { hub: th(hub) })}
          </Link>
          <Link href="/about" rel="bookmark" className="px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-600 dark:text-gray-400 hover:text-[#1a3a8a] hover:bg-[#1a3a8a]/5 transition-colors border border-gray-100 dark:border-gray-800">
            {ti('aboutUs')}
          </Link>
        </div>
        <p className="text-[10px] text-gray-400 mt-2">
          {ti('linkCount', { count: linkCount })}
        </p>
      </div>
    </div>
  )
}
