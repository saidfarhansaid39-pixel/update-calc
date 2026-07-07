'use client'

import React, { useState } from 'react'
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Lightbulb, Target, ArrowRight, BarChart3, ChevronDown, ChevronUp, Info } from 'lucide-react'

interface Benchmark {
  label: string
  value: string
  isGood?: boolean
}

interface NextAction {
  label: string
  description: string
  priority?: 'high' | 'medium' | 'low'
}

interface OptimizationSuggestion {
  label: string
  impact: string
  effort: 'low' | 'medium' | 'high'
}

interface DetailedExplanation {
  whatItMeans?: string
  whyItMatters?: string
  whatAffectsIt?: string[]
  howToImprove?: string[]
  detailedSections?: { title: string; content: string }[]
}

interface EnhancedExplanationProps {
  value: number
  label: string
  unit?: string
  goodRange?: { min: number; max: number }
  benchmarks?: Benchmark[]
  nextActions?: NextAction[]
  optimizations?: OptimizationSuggestion[]
  warnings?: string[]
  resultInsights?: string[]
  detailedExplanation?: DetailedExplanation
}

export function EnhancedResultExplanation({
  value, label, unit, goodRange, benchmarks, nextActions, optimizations, warnings, resultInsights, detailedExplanation,
}: EnhancedExplanationProps) {
  const valStr = value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  const isGood = goodRange ? value >= goodRange.min && value <= goodRange.max : undefined
  const [showDetail, setShowDetail] = useState(false)

  return (
    <div className="space-y-4">
      {/* Main Result */}
      <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`text-3xl font-bold ${isGood === true ? 'text-green-600 dark:text-green-400' : isGood === false ? 'text-red-500 dark:text-red-400' : 'text-[#06b6d4]'}`}>
          {valStr}{unit && <span className="text-lg ml-1">{unit}</span>}
        </p>
        {isGood !== undefined && (
          <div className="flex items-center justify-center gap-1 mt-1">
            {isGood
              ? <><TrendingUp className="w-4 h-4 text-green-500" /><span className="text-xs text-green-600 dark:text-green-400">Within healthy range</span></>
              : <><AlertTriangle className="w-4 h-4 text-red-500" /><span className="text-xs text-red-500">Outside recommended range</span></>
            }
          </div>
        )}
      </div>

      {/* Explain in Detail */}
      {detailedExplanation && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowDetail(!showDetail)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#06b6d4]" />
              Explain in Detail
            </span>
            {showDetail ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showDetail && (
            <div className="px-4 pb-4 space-y-3 text-sm">
              {detailedExplanation.whatItMeans && (
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">What this means</p>
                  <p className="text-gray-600 dark:text-gray-400">{detailedExplanation.whatItMeans}</p>
                </div>
              )}
              {detailedExplanation.whyItMatters && (
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Why it matters</p>
                  <p className="text-gray-600 dark:text-gray-400">{detailedExplanation.whyItMatters}</p>
                </div>
              )}
              {detailedExplanation.whatAffectsIt && detailedExplanation.whatAffectsIt.length > 0 && (
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">What affects it</p>
                  <ul className="space-y-1">
                    {detailedExplanation.whatAffectsIt.map((item, i) => (
                      <li key={i} className="text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                        <span className="text-[#06b6d4] mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {detailedExplanation.howToImprove && detailedExplanation.howToImprove.length > 0 && (
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">How to improve</p>
                  <ul className="space-y-1">
                    {detailedExplanation.howToImprove.map((item, i) => (
                      <li key={i} className="text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                        <span className="text-green-500 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {detailedExplanation.detailedSections && detailedExplanation.detailedSections.map((section, i) => (
                <div key={i}>
                  <p className="font-medium text-gray-900 dark:text-white">{section.title}</p>
                  <p className="text-gray-600 dark:text-gray-400">{section.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Good/Bad Range Indicator */}
      {goodRange && (
        <div className="space-y-1.5">
          <div className="relative h-5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-red-300 dark:bg-red-800/40" style={{ width: '30%' }} />
            <div className="absolute inset-y-0 bg-green-300 dark:bg-green-800/40" style={{ left: '30%', width: '40%' }} />
            <div className="absolute inset-y-0 right-0 bg-red-300 dark:bg-red-800/40" style={{ width: '30%' }} />
            <div
              className="absolute top-0.5 bottom-0.5 w-1.5 bg-[#1a3a8a] rounded-full shadow-md transition-all duration-500"
              style={{ left: `calc(${((value - (goodRange.min - (goodRange.max - goodRange.min))) / ((goodRange.max + (goodRange.max - goodRange.min)) - (goodRange.min - (goodRange.max - goodRange.min)))) * 100}%)` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>Low</span>
            <span className="font-medium text-gray-500">Good: {goodRange.min}–{goodRange.max}{unit}</span>
            <span>High</span>
          </div>
        </div>
      )}

      {/* Benchmarks */}
      {benchmarks && benchmarks.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <BarChart3 className="w-4 h-4 text-gray-400" />
            <p className="text-xs font-medium text-gray-500">Industry Benchmarks</p>
          </div>
          <div className="space-y-1.5">
            {benchmarks.map((b, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-1.5 bg-gray-50 dark:bg-gray-900 rounded-lg text-xs">
                <span className="text-gray-600 dark:text-gray-400">{b.label}</span>
                <span className={`font-medium ${b.isGood === true ? 'text-green-600' : b.isGood === false ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                  {b.isGood !== undefined && (b.isGood ? <TrendingUp className="w-3 h-3 inline mr-1" /> : <TrendingDown className="w-3 h-3 inline mr-1" />)}
                  {b.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <div className="flex items-center gap-1.5 mb-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">Warnings</p>
          </div>
          <ul className="space-y-1">
            {warnings.map((w, i) => (
              <li key={i} className="text-xs text-amber-600 dark:text-amber-400 flex items-start gap-1.5">
                <span className="mt-0.5">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Result Insights */}
      {resultInsights && resultInsights.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <p className="text-xs font-medium text-gray-500">Key Insights</p>
          </div>
          <ul className="space-y-1.5">
            {resultInsights.map((ri, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                <span className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">!</span>
                {ri}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next Actions */}
      {nextActions && nextActions.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Target className="w-4 h-4 text-[#06b6d4]" />
            <p className="text-xs font-medium text-gray-500">Recommended Next Actions</p>
          </div>
          <div className="space-y-2">
            {nextActions.map((a, i) => (
              <div key={i} className="flex items-start gap-2 p-2.5 bg-[#1a3a8a]/5 rounded-lg border border-[#06b6d4]/10">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5 ${
                  a.priority === 'high' ? 'bg-red-100 text-red-600' : a.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {a.priority === 'high' ? '!' : a.priority === 'medium' ? '→' : '·'}
                </span>
                <div>
                  <p className="text-xs font-medium text-gray-900 dark:text-white">{a.label}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optimization Suggestions */}
      {optimizations && optimizations.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <ArrowRight className="w-4 h-4 text-purple-500" />
            <p className="text-xs font-medium text-gray-500">Optimization Suggestions</p>
          </div>
          <div className="space-y-1.5">
            {optimizations.map((o, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 bg-purple-50 dark:bg-purple-900/10 rounded-lg text-xs">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{o.label}</p>
                  <p className="text-gray-500 dark:text-gray-400">Impact: {o.impact}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  o.effort === 'low' ? 'bg-green-100 text-green-600' : o.effort === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                }`}>
                  {o.effort} effort
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
