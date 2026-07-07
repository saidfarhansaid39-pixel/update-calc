import React from 'react'
import { Link } from '@/lib/navigation'
import { CalculatorContent } from '@/lib/seo/calculator-content-engine'
import { Users, ArrowRight, Grid3X3 } from 'lucide-react'
import type { CalculatorEntry } from '@calcuniverse/calculator-registry'

interface NavigationalSectionProps {
  calculator: {
    slug: string
    title: string
    category: string
    hubSlug: string
    hubName: string
    keywords: string[]
  }
  content: CalculatorContent
  allCalculators?: CalculatorEntry[]
}

const hubCategoryMap: Record<string, string> = {
  financial: 'financial-calculators',
  health: 'health-calculators',
  math: 'math-calculators',
  conversion: 'conversion-calculators',
  'date-time': 'date-time-calculators',
  construction: 'construction-calculators',
  statistics: 'statistics-calculators',
  education: 'education-calculators',
  physics: 'physics-calculators',
  chemistry: 'chemistry-calculators',
  engineering: 'engineering-calculators',
  everyday: 'everyday-calculators',
  food: 'food-calculators',
  biology: 'biology-calculators',
  ecology: 'ecology-calculators',
  sports: 'sports-calculators',
}

export function NavigationalSection({ calculator, content, allCalculators }: NavigationalSectionProps) {
  const hubSlug = hubCategoryMap[calculator.category] || calculator.hubSlug

  const relatedCalculators = allCalculators
    ? allCalculators
        .filter(c => c.category === calculator.category && c.slug !== calculator.slug)
        .slice(0, 8)
    : []

  return (
    <div className="space-y-6">
      {/* Relevant Audience */}
      {content.relevantAudience.length > 0 && (
        <div id="audience" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Who Should Use This Calculator?</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {content.relevantAudience.map((audience, i) => (
              <span key={i} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 rounded-lg text-sm border border-blue-100 dark:border-blue-900/30">
                {audience}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Browse the Hub */}
      <div id="hub-navigation" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Grid3X3 className="w-5 h-5 text-[#06b6d4]" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Explore More in {calculator.hubName}</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Browse our complete collection of {calculator.category} calculators for more tools and resources.
        </p>
        <Link
          href={`/${hubSlug}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1a3a8a] text-white rounded-lg text-sm font-medium hover:bg-[#0a1d4f] transition-colors"
        >
          View All {calculator.hubName} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Related Calculators (as actual links) */}
      {relatedCalculators.length > 0 && (
        <div id="related-links" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Related Calculators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {relatedCalculators.map((rc) => (
              <Link
                key={rc.slug}
                href={`/${hubCategoryMap[rc.category] || rc.hubSlug}/${rc.slug}`}
                className="px-3 py-2.5 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-[#1a3a8a]/5 hover:text-[#06b6d4] hover:border-[#06b6d4]/30 transition-colors border border-gray-100 dark:border-gray-800 capitalize"
              >
                {rc.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
