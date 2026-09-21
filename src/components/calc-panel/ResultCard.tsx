'use client'

import React, { useMemo, useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { useCurrency } from '@/lib/context/CurrencyContext'
import { useTranslations } from 'next-intl'

interface ResultValue {
  label: string
  value: string | number
  unit?: string
  highlight?: boolean
  color?: 'default' | 'positive' | 'negative' | 'neutral'
}

interface ResultCardProps {
  title?: string
  primary: ResultValue
  secondary?: ResultValue[]
  interpretation?: string
  steps?: { label: string; value: string }[]
  className?: string
}

const colorMap: Record<string, string> = {
  default: 'text-gray-900 dark:text-white',
  positive: 'text-emerald-600 dark:text-emerald-400',
  negative: 'text-red-600 dark:text-red-400',
  neutral: 'text-amber-600 dark:text-amber-400',
}

const colorBgMap: Record<string, string> = {
  default: 'bg-white dark:bg-gray-800',
  positive: 'bg-emerald-50 dark:bg-emerald-900/20',
  negative: 'bg-red-50 dark:bg-red-900/20',
  neutral: 'bg-amber-50 dark:bg-amber-900/20',
}

function fmtUnit(u: string, sym: string) {
  return u.replace(/\$/g, sym)
}

export function ResultCard({ title, primary, secondary, interpretation, steps, className = '' }: ResultCardProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const { currencySymbol } = useCurrency()
  const t = useTranslations('chrome')
  const ta = useTranslations('actions')
  const localUnit = useMemo(() => primary.unit ? fmtUnit(primary.unit, currencySymbol) : undefined, [primary.unit, currencySymbol])

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch {}
  }

  return (
    <div className={`rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden ${className}`}>
      {title && (
        <div className="px-5 py-3 bg-gradient-to-r from-[#1a759f] to-[#06b6d4]">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
      )}

      <div className="p-5 space-y-5">
        {/* Primary result */}
        <div className={`rounded-xl p-5 text-center ${colorBgMap[primary.color || 'default']}`}>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
            {primary.label}
          </p>
          <div className="flex items-baseline justify-center gap-1.5">
            <span className={`text-3xl sm:text-4xl font-bold tracking-tight ${colorMap[primary.color || 'default']}`}>
              {fmtUnit(String(primary.value), currencySymbol)}
            </span>
            {localUnit && (
              <span className="text-lg font-medium text-gray-500 dark:text-gray-400">{localUnit}</span>
            )}
          </div>
          <button
            onClick={() => handleCopy(`${primary.value}${localUnit ? ' ' + localUnit : ''}`, -1)}
            className="mt-2 inline-flex items-center gap-1 text-xs text-gray-400 hover:text-[#06b6d4] transition-colors"
            aria-label={t('copyResultAria')}
          >
            {copiedIndex === -1 ? <Check size={12} /> : <Copy size={12} />}
            {copiedIndex === -1 ? ta('copied') : ta('copy')}
          </button>
        </div>

        {/* Secondary results */}
        {secondary && secondary.length > 0 && (
          <div className={`grid gap-3 ${secondary.length <= 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
            {secondary.map((item, i) => (
              <div key={i} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">{item.label}</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className={`text-lg font-semibold ${colorMap[item.color || 'default']}`}>
                    {fmtUnit(String(item.value), currencySymbol)}
                  </span>
                  {item.unit && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">{fmtUnit(item.unit, currencySymbol)}</span>
                  )}
                </div>
                <button
                  onClick={() => handleCopy(`${item.value}${item.unit ? ' ' + fmtUnit(item.unit, currencySymbol) : ''}`, i)}
                  className="mt-1 text-xs text-gray-400 hover:text-[#06b6d4] transition-colors"
                  aria-label={`${ta('copy')} ${item.label}`}
                >
                  {copiedIndex === i ? <Check size={10} className="inline" /> : <Copy size={10} className="inline" />}
                  <span className="ml-0.5">{copiedIndex === i ? ta('copied') : ta('copy')}</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Steps */}
        {steps && steps.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('calculationSteps')}</p>
            <div className="space-y-1.5">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-xs font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-600 dark:text-gray-400">{step.label}</p>
                    <p className="font-mono text-sm font-medium text-gray-900 dark:text-white">{fmtUnit(step.value, currencySymbol)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interpretation */}
        {interpretation && (
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-3">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-0.5">{t('whatThisMeans')}</p>
            <p className="text-sm text-blue-600 dark:text-blue-200 leading-relaxed">{fmtUnit(interpretation, currencySymbol)}</p>
          </div>
        )}
      </div>
    </div>
  )
}
