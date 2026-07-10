'use client'

import React from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { CalculatorIntro } from '@/components/premium/CalculatorIntro'
import type { PremiumCalculatorShellProps } from '@/components/premium/PremiumCalculatorShell'

type TFunc = (key: string) => string

function BreadcrumbNav({ items }: { items: { label: string; href: string }[] }) {
  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <svg className="w-3 h-3 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
            {i < items.length - 1 ? (
              <a href={item.href} className="hover:text-primary dark:hover:text-primary transition-colors">
                {item.label}
              </a>
            ) : (
              <span className="text-gray-600 dark:text-gray-300 font-medium" aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export interface ShellHeaderProps {
  calculator: PremiumCalculatorShellProps['calculator']
  t: TFunc
  th: TFunc
  tocSections: { id: string; label: string }[]
  showToC: boolean
  onToggleToC: () => void
}

export function ShellHeader({ calculator, t, th, tocSections, showToC, onToggleToC }: ShellHeaderProps) {
  const breadcrumbItems = [
    { label: t('home'), href: '/' },
    { label: th(calculator.hubSlug), href: `/${calculator.hubSlug}` },
    { label: calculator.title, href: `/${calculator.hubSlug}/${calculator.slug}` },
  ]
  return (
    <>
      <BreadcrumbNav items={breadcrumbItems} />

      <CalculatorIntro
        title={calculator.title}
        description={calculator.description}
        category={calculator.category}
      />

      {/* Table of Contents */}
      {tocSections.length > 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <button onClick={onToggleToC} className="flex items-center justify-between w-full text-sm font-medium text-gray-700 dark:text-gray-300">
            On this page
            {showToC ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showToC && (
            <nav className="mt-3 space-y-1">
              {tocSections.map(s => (
                <a key={s.id} href={`#${s.id}`} onClick={onToggleToC}
                  className="block text-sm text-gray-500 dark:text-gray-400 hover:text-[#06b6d4] transition-colors py-0.5">
                  {s.label}
                </a>
              ))}
            </nav>
          )}
        </div>
      )}
    </>
  )
}
