'use client'

import React from 'react'
import { Link } from '@/lib/navigation'
import { TrendingUp } from 'lucide-react'

const popularSearches = [
  { label: 'Mortgage', slug: 'mortgage-calculator', hubSlug: 'financial-calculators' },
  { label: 'BMI', slug: 'bmi-calculator', hubSlug: 'health-calculators' },
  { label: 'Compound Interest', slug: 'compound-interest-calculator', hubSlug: 'financial-calculators' },
  { label: 'Salary', slug: 'salary-calculator', hubSlug: 'financial-calculators' },
  { label: 'Currency', slug: 'currency-calculator', hubSlug: 'financial-calculators' },
  { label: 'Loan', slug: 'loan-calculator', hubSlug: 'financial-calculators' },
  { label: 'Retirement', slug: 'retirement-calculator', hubSlug: 'financial-calculators' },
  { label: 'Date Difference', slug: 'date-difference-calculator', hubSlug: 'date-time-calculators' },
  { label: 'Tip', slug: 'tip-calculator', hubSlug: 'math-calculators' },
  { label: 'Discount', slug: 'discount-calculator', hubSlug: 'math-calculators' },
]

export function PopularSearches() {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <TrendingUp className="w-3.5 h-3.5 text-gray-400 shrink-0" />
      <span className="text-xs font-medium text-gray-400 dark:text-gray-500 shrink-0 whitespace-nowrap">
        Popular:
      </span>
      <div className="flex items-center gap-1.5">
        {popularSearches.map((item) => (
          <Link
            key={item.slug}
            href={`/${item.hubSlug}/${item.slug}`}
            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-[#1a3a8a]/10 hover:text-[#1a3a8a] dark:hover:bg-[#06b6d4]/10 dark:hover:text-[#06b6d4] transition-colors whitespace-nowrap shrink-0"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
