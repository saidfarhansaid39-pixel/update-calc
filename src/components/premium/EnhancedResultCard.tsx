'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { 
  Sparkles, Brain, ChevronDown, ChevronUp, AlertTriangle, 
  TrendingUp, Target, Info, CheckCircle2, XCircle, MinusCircle, Copy
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/lib/context/CurrencyContext'

interface ResultValue {
  label: string
  value: string | number
  unit?: string
  highlight?: boolean
  color?: 'default' | 'positive' | 'negative' | 'neutral'
}

interface EnhancedExplanation {
  goodRange?: { min: number; max: number }
  benchmarks?: { label: string; value: string; isGood?: boolean }[]
  nextActions?: { label: string; description: string; priority?: 'high' | 'medium' | 'low' }[]
  warnings?: string[]
  insights?: string[]
  detailedExplanation?: {
    whatItMeans?: string
    whyItMatters?: string
    whatAffectsIt?: string[]
    howToImprove?: string[]
    detailedSections?: { title: string; content: string }[]
  }
}

interface EnhancedResultCardProps {
  title?: string
  primary: ResultValue
  secondary?: ResultValue[]
  interpretation?: string
  steps?: { label: string; value: string }[]
  enhancedExplanation?: EnhancedExplanation
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

export function EnhancedResultCard({
  title,
  primary,
  secondary,
  interpretation,
  steps,
  enhancedExplanation,
  className = '',
}: EnhancedResultCardProps) {
  const [showInterpretation, setShowInterpretation] = useState(false)
  const [showEnhanced, setShowEnhanced] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const { currencySymbol } = useCurrency()
  
  const localUnit = useMemo(() => primary.unit ? fmtUnit(primary.unit, currencySymbol) : undefined, [primary.unit, currencySymbol])

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch {}
  }

  const isGoodRange = useMemo(() => {
    if (!enhancedExplanation?.goodRange || primary.value === undefined) return null
    const val = typeof primary.value === 'number' ? primary.value : parseFloat(String(primary.value))
    if (isNaN(val)) return null
    return val >= enhancedExplanation.goodRange.min && val <= enhancedExplanation.goodRange.max
  }, [enhancedExplanation, primary.value])

  return (
    <div className={cn('rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden', className)}>
      {title && (
        <div className="px-5 py-3 bg-gradient-to-r from-[#1a759f] to-[#06b6d4]">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
      )}

      <div className="p-5 space-y-5">
        {/* Primary result */}
        <div className={cn('rounded-xl p-5 text-center', colorBgMap[primary.color || 'default'])}>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
            {primary.label}
          </p>
          <div className="flex items-baseline justify-center gap-1.5">
            <span className={cn('text-3xl sm:text-4xl font-bold tracking-tight', colorMap[primary.color || 'default'])}>
              {fmtUnit(String(primary.value), currencySymbol)}
            </span>
            {localUnit && (
              <span className="text-lg font-medium text-gray-500 dark:text-gray-400">{localUnit}</span>
            )}
          </div>
          <button
            onClick={() => handleCopy(`${primary.value}${localUnit ? ' ' + localUnit : ''}`, -1)}
            className="mt-2 inline-flex items-center gap-1 text-xs text-gray-400 hover:text-[#06b6d4] transition-colors"
            aria-label="Copy result"
          >
            {copiedIndex === -1 ? <CheckCircle2 size={12} /> : <Copy size={12} />}
            {copiedIndex === -1 ? 'Copied' : 'Copy'}
          </button>
          
          {/* Good range indicator */}
          {isGoodRange !== null && (
            <div className="flex items-center justify-center gap-1 mt-2">
              {isGoodRange ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">Within healthy range</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-red-500">Outside recommended range</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Secondary results */}
        {secondary && secondary.length > 0 && (
          <div className={cn('grid gap-3', secondary.length <= 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3')}>
            {secondary.map((item, i) => (
              <div key={i} className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">{item.label}</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className={cn('text-lg font-semibold', colorMap[item.color || 'default'])}>
                    {fmtUnit(String(item.value), currencySymbol)}
                  </span>
                  {item.unit && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">{fmtUnit(item.unit, currencySymbol)}</span>
                  )}
                </div>
                <button
                  onClick={() => handleCopy(`${item.value}${item.unit ? ' ' + fmtUnit(item.unit, currencySymbol) : ''}`, i)}
                  className="mt-1 text-xs text-gray-400 hover:text-[#06b6d4] transition-colors"
                  aria-label={`Copy ${item.label}`}
                >
                  {copiedIndex === i ? <CheckCircle2 size={10} className="inline" /> : <Copy size={10} className="inline" />}
                  <span className="ml-0.5">{copiedIndex === i ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Steps */}
        {steps && steps.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Calculation Steps</p>
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
          <div className="space-y-2">
            <button
              onClick={() => setShowInterpretation(!showInterpretation)}
              className="flex items-center justify-between w-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#06b6d4] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#06b6d4]" />
                <span>What This Means</span>
              </div>
              {showInterpretation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showInterpretation && (
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-3">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-0.5">Interpretation</p>
                <p className="text-sm text-blue-600 dark:text-blue-200 leading-relaxed">{fmtUnit(interpretation, currencySymbol)}</p>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Explanation */}
        {enhancedExplanation && (
          <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
              onClick={() => setShowEnhanced(!showEnhanced)}
              className="flex items-center justify-between w-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#06b6d4] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Enhanced Analysis</span>
              </div>
              {showEnhanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showEnhanced && (
              <div className="space-y-4 animate-fade-in">
                {/* Good/Bad Range */}
                {enhancedExplanation.goodRange && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Healthy Range</span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {enhancedExplanation.goodRange.min.toLocaleString()} – {enhancedExplanation.goodRange.max.toLocaleString()}{primary.unit ? ` ${fmtUnit(primary.unit, currencySymbol)}` : ''}
                      </span>
                    </div>
                    <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="absolute inset-y-0 left-0 w-1/4 bg-red-300 dark:bg-red-800/40" />
                      <div className="absolute inset-y-0 left-1/4 w-1/2 bg-emerald-300 dark:bg-emerald-800/40" />
                      <div className="absolute inset-y-0 right-0 w-1/4 bg-red-300 dark:bg-red-800/40" />
                      <div className="absolute top-0.5 bottom-0.5 w-1.5 bg-[#1a3a8a] rounded-full shadow-md transition-all duration-500" style={{ left: '50%' }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span>Low</span>
                      <span className="font-medium text-gray-500">Good: {enhancedExplanation.goodRange.min}–{enhancedExplanation.goodRange.max}</span>
                      <span>High</span>
                    </div>
                  </div>
                )}

                {/* Benchmarks */}
                {enhancedExplanation.benchmarks && enhancedExplanation.benchmarks.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Benchmarks</p>
                    <div className="space-y-1">
                      {enhancedExplanation.benchmarks.map((b, i) => (
                        <div key={i} className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{b.label}</span>
                          <span className={cn('text-sm font-medium', b.isGood ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
                            {b.value}{b.isGood ? ' ✓' : ' ✗'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warnings */}
                {enhancedExplanation.warnings && enhancedExplanation.warnings.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Warnings</p>
                    <div className="space-y-1">
                      {enhancedExplanation.warnings.map((w, i) => (
                        <div key={i} className="flex items-start gap-2 px-2 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                          <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                          <span className="text-sm text-red-700 dark:text-red-300">{w}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Next Actions */}
                {enhancedExplanation.nextActions && enhancedExplanation.nextActions.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Next Actions</p>
                    <div className="space-y-1">
                      {enhancedExplanation.nextActions.map((a, i) => (
                        <div key={i} className="flex items-start gap-2 px-2 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                          <Target className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{a.label}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{a.description}</p>
                          </div>
                          <span className={cn('ml-auto text-[10px] px-1.5 py-0.5 rounded',
                            a.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                            a.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          )}>
                            {a.priority || 'low'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Insights */}
                {enhancedExplanation.insights && enhancedExplanation.insights.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Key Insights</p>
                    <div className="space-y-1">
                      {enhancedExplanation.insights.map((insight, i) => (
                        <div key={i} className="flex items-start gap-2 px-2 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
                          <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-emerald-700 dark:text-emerald-300">{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detailed Explanation */}
                {enhancedExplanation.detailedExplanation && (
                  <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Detailed Explanation</p>
                    <div className="space-y-2 text-sm">
                      {enhancedExplanation.detailedExplanation.whatItMeans && (
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">What this means</p>
                          <p className="text-gray-600 dark:text-gray-400">{enhancedExplanation.detailedExplanation.whatItMeans}</p>
                        </div>
                      )}
                      {enhancedExplanation.detailedExplanation.whyItMatters && (
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Why it matters</p>
                          <p className="text-gray-600 dark:text-gray-400">{enhancedExplanation.detailedExplanation.whyItMatters}</p>
                        </div>
                      )}
                      {enhancedExplanation.detailedExplanation.whatAffectsIt && enhancedExplanation.detailedExplanation.whatAffectsIt.length > 0 && (
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">What affects it</p>
                          <ul className="space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                            {enhancedExplanation.detailedExplanation.whatAffectsIt.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {enhancedExplanation.detailedExplanation.howToImprove && enhancedExplanation.detailedExplanation.howToImprove.length > 0 && (
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">How to improve</p>
                          <ul className="space-y-1 list-disc list-inside text-emerald-700 dark:text-emerald-300">
                            {enhancedExplanation.detailedExplanation.howToImprove.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {enhancedExplanation.detailedExplanation.detailedSections && enhancedExplanation.detailedExplanation.detailedSections.map((section, i) => (
                        <div key={i}>
                          <p className="font-medium text-gray-900 dark:text-white">{section.title}</p>
                          <p className="text-gray-600 dark:text-gray-400">{section.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function formatVal(val: string | number, precision?: number) {
  const str = String(val)
  const num = parseFloat(str.replace(/,/g, ''))
  if (isNaN(num)) return str
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: precision ?? 2 }).format(num)
}
