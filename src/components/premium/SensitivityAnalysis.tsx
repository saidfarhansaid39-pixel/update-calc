'use client'

import React, { useMemo, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle, Maximize2, Minimize2, Info, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DynamicComparisonBarChart } from '@/components/premium/DynamicCharts'

interface SensitivityInput {
  name: string
  label: string
  baseValue: number
  minValue: number
  maxValue: number
  unit?: string
  formatValue?: (val: number) => string
}

interface SensitivityResult {
  inputName: string
  inputLabel: string
  baseOutput: number
  minOutput: number
  maxOutput: number
  swing: number
  impact: 'high' | 'medium' | 'low'
  direction: 'positive' | 'negative'
  sensitivity: number
}

interface SensitivityAnalysisProps {
  inputs: SensitivityInput[]
  compute: (inputs: Record<string, number>) => number
  baseInputs: Record<string, number>
  mainOutputLabel: string
  mainOutputUnit?: string
  className?: string
  steps?: number
}

function calculateImpact(swing: number, baseOutput: number): 'high' | 'medium' | 'low' {
  const relativeSwing = baseOutput !== 0 ? Math.abs(swing / baseOutput) : 0
  if (relativeSwing > 0.2) return 'high'
  if (relativeSwing > 0.05) return 'medium'
  return 'low'
}

export function SensitivityAnalysis({
  inputs,
  compute,
  baseInputs,
  mainOutputLabel,
  mainOutputUnit,
  className,
  steps = 10,
}: SensitivityAnalysisProps) {
  const t = useTranslations('calculatorUI')
  const [expanded, setExpanded] = useState(true)
  const [sortBy, setSortBy] = useState<'impact' | 'name' | 'sensitivity'>('impact')

  const baseOutput = useMemo(() => compute(baseInputs), [compute, baseInputs])

  const results = useMemo((): SensitivityResult[] => {
    return inputs.map(input => {
      const minInputs = { ...baseInputs, [input.name]: input.minValue }
      const maxInputs = { ...baseInputs, [input.name]: input.maxValue }
      
      const minOutput = compute(minInputs)
      const maxOutput = compute(maxInputs)
      const swing = maxOutput - minOutput
      const direction = swing >= 0 ? 'positive' as const : 'negative' as const
      const impact = calculateImpact(Math.abs(swing), baseOutput)
      const sensitivity = baseOutput !== 0 ? Math.abs(swing / baseOutput) : 0

      return {
        inputName: input.name,
        inputLabel: input.label,
        baseOutput,
        minOutput,
        maxOutput,
        swing: Math.abs(swing),
        impact,
        direction,
        sensitivity,
      }
    }).sort((a, b) => {
      if (sortBy === 'impact') {
        const impactOrder = { high: 3, medium: 2, low: 1 }
        return impactOrder[b.impact] - impactOrder[a.impact]
      }
      if (sortBy === 'sensitivity') {
        return b.sensitivity - a.sensitivity
      }
      return a.inputLabel.localeCompare(b.inputLabel)
    })
  }, [inputs, compute, baseInputs, baseOutput, sortBy])

const chartData = useMemo(() => 
    results.map(r => ({
      name: r.inputLabel.length > 15 ? r.inputLabel.substring(0, 15) + '…' : r.inputLabel,
      value: r.swing,
      color: r.impact === 'high' ? '#ef4444' : r.impact === 'medium' ? '#f59e0b' : '#10b981',
    }))
  , [results])

  const impactColors = {
    high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    medium: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    low: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  }

  const impactLabels = {
    high: t('premium.sensitivity.impactHigh'),
    medium: t('premium.sensitivity.impactMedium'),
    low: t('premium.sensitivity.impactLow'),
  }

  const formatVal = (val: number) => {
    if (val >= 1e9) return `${(val / 1e9).toFixed(2)}B`
    if (val >= 1e6) return `${(val / 1e6).toFixed(2)}M`
    if (val >= 1e3) return `${(val / 1e3).toFixed(1)}K`
    return val.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  const exportCSV = useCallback(() => {
    const headers = [t('premium.sensitivity.csvInput'), t('premium.sensitivity.csvBaseOutput'), t('premium.sensitivity.csvMinOutput'), t('premium.sensitivity.csvMaxOutput'), t('premium.sensitivity.csvSwing'), t('premium.sensitivity.csvImpact'), t('premium.sensitivity.csvDirection'), t('premium.sensitivity.csvSensitivity')]
    const rows = results.map(r => [
      r.inputLabel,
      formatVal(r.baseOutput),
      formatVal(r.minOutput),
      formatVal(r.maxOutput),
      formatVal(r.swing),
      r.impact,
      r.direction,
      (r.sensitivity * 100).toFixed(1)
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sensitivity-analysis-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [results, t])

  return (
    <div className={cn('rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden', className)}>
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-5 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('premium.sensitivity.title')}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('premium.sensitivity.subtitle', { label: mainOutputLabel })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'impact' | 'name' | 'sensitivity')}
              className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="impact">{t('premium.sensitivity.sortImpact')}</option>
              <option value="sensitivity">{t('premium.sensitivity.sortSensitivity')}</option>
              <option value="name">{t('premium.sensitivity.sortName')}</option>
            </select>
            <button
              onClick={exportCSV}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
              title={t('premium.sensitivity.exportCsv')}
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label={expanded ? t('premium.sensitivity.collapse') : t('premium.sensitivity.expand')}
            >
              {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="p-5 space-y-4">
<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <DynamicComparisonBarChart 
              data={chartData}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 px-1">
              <span className="w-40">{t('premium.sensitivity.colInput')}</span>
              <span className="w-24 text-right">{t('premium.sensitivity.colBase')}</span>
              <span className="w-24 text-right">{t('premium.sensitivity.colMin')}</span>
              <span className="w-24 text-right">{t('premium.sensitivity.colMax')}</span>
              <span className="w-24 text-right">{t('premium.sensitivity.colSwing')}</span>
              <span className="w-20">{t('premium.sensitivity.colImpact')}</span>
              <span className="w-20">{t('premium.sensitivity.colDirection')}</span>
              <span className="w-20">{t('premium.sensitivity.colSensitivity')}</span>
            </div>
            
            {results.map((result, idx) => (
              <div 
                key={result.inputName} 
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors',
                  idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-900'
                )}
              >
                <div className="w-40 text-sm font-medium text-gray-900 dark:text-white truncate" title={result.inputLabel}>
                  {result.inputLabel}
                </div>
                <div className="w-24 text-right text-sm text-gray-600 dark:text-gray-400 font-mono">
                  {formatVal(result.baseOutput)}{mainOutputUnit ? ` ${mainOutputUnit}` : ''}
                </div>
                <div className="w-24 text-right text-sm text-gray-600 dark:text-gray-400 font-mono">
                  {formatVal(result.minOutput)}{mainOutputUnit ? ` ${mainOutputUnit}` : ''}
                </div>
                <div className="w-24 text-right text-sm text-gray-600 dark:text-gray-400 font-mono">
                  {formatVal(result.maxOutput)}{mainOutputUnit ? ` ${mainOutputUnit}` : ''}
                </div>
                <div className="w-24 text-right text-sm font-medium font-mono text-gray-900 dark:text-white">
                  {formatVal(result.swing)}{mainOutputUnit ? ` ${mainOutputUnit}` : ''}
                </div>
                <div className="w-20">
                  <span className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                    impactColors[result.impact]
                  )}>
                    {result.direction === 'positive' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {impactLabels[result.impact]}
                  </span>
                </div>
                <div className="w-20">
                  <span className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                    result.direction === 'positive' 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  )}>
                    {result.direction === 'positive' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {(result.sensitivity * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                <p className="font-medium">{t('premium.sensitivity.interpretationGuide')}</p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>{t('premium.sensitivity.bulletHighImpact')}</li>
                  <li>{t('premium.sensitivity.bulletMediumImpact')}</li>
                  <li>{t('premium.sensitivity.bulletLowImpact')}</li>
                  <li>{t('premium.sensitivity.bulletFormula')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function formatVal(val: number) {
  if (val >= 1e9) return `${(val / 1e9).toFixed(2)}B`
  if (val >= 1e6) return `${(val / 1e6).toFixed(2)}M`
  if (val >= 1e3) return `${(val / 1e3).toFixed(1)}K`
  return val.toLocaleString(undefined, { maximumFractionDigits: 2 })
}





