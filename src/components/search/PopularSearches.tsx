'use client'

import React from 'react'
import { Link } from '@/lib/navigation'
import { TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'

const popularSearches = [
  { key: 'popularMortgage', slug: 'mortgage-calculator', hubSlug: 'financial-calculators' },
  { key: 'popularBmi', slug: 'bmi-calculator', hubSlug: 'health-calculators' },
  { key: 'popularCompoundInterest', slug: 'compound-interest-calculator', hubSlug: 'financial-calculators' },
  { key: 'popularSalary', slug: 'salary-calculator', hubSlug: 'financial-calculators' },
  { key: 'popularCurrency', slug: 'currency-calculator', hubSlug: 'financial-calculators' },
  { key: 'popularLoan', slug: 'loan-calculator', hubSlug: 'financial-calculators' },
  { key: 'popularRetirement', slug: 'retirement-calculator', hubSlug: 'financial-calculators' },
  { key: 'popularDateDifference', slug: 'date-difference-calculator', hubSlug: 'date-time-calculators' },
  { key: 'popularTip', slug: 'tip-calculator', hubSlug: 'math-calculators' },
  { key: 'popularDiscount', slug: 'discount-calculator', hubSlug: 'math-calculators' },
]

export function PopularSearches() {
  const t = useTranslations('chrome')
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <TrendingUp className="w-3.5 h-3.5 text-gray-400 shrink-0" />
      <span className="text-xs font-medium text-gray-400 dark:text-gray-500 shrink-0 whitespace-nowrap">
        {t('popularPrefix')}
      </span>
      <div className="flex items-center gap-1.5">
        {popularSearches.map((item) => (
          <Link
            key={item.slug}
            href={`/${item.hubSlug}/${item.slug}`}
            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-[#1a3a8a]/10 hover:text-[#1a3a8a] dark:hover:bg-[#06b6d4]/10 dark:hover:text-[#06b6d4] transition-colors whitespace-nowrap shrink-0"
          >
            {t(item.key)}
          </Link>
        ))}
      </div>
    </div>
  )
}
