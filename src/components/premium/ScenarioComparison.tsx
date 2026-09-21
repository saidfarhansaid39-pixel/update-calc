'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, ChevronDown, ChevronUp, Trash2, Plus, TrendingUp, ArrowUpDown, Copy, Download, FileText, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DynamicComparisonBarChart } from '@/components/premium/DynamicCharts'

interface Scenario {
  id: string
  label: string
  inputs: Record<string, string>
  summary?: string
  mainValue?: number
  isBaseline?: boolean
}

interface ScenarioComparisonProps {
  scenarios: Scenario[]
  onRemove: (id: string) => void
  onApply: (inputs: Record<string, string>) => void
  onSave: () => void
  scenarioLabel?: string
  mainValueLabel?: string
  baselineId?: string
  allInputLabels?: Record<string, string>
}

const formatValue = (val: number) => {
  if (val >= 1e9) return `${(val / 1e9).toFixed(2)}B`
  if (val >= 1e6) return `${(val / 1e6).toFixed(2)}M`
  if (val >= 1e3) return `${(val / 1e3).toFixed(1)}K`
  return val.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

export function ScenarioComparison({
  scenarios,
  onRemove,
  onApply,
  onSave,
  scenarioLabel,
  mainValueLabel,
  baselineId,
  allInputLabels,
}: ScenarioComparisonProps) {
  const t = useTranslations('calculatorUI')
  const [showComparison, setShowComparison] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'table' | 'diff'>('list')
  const [diffBaseline, setDiffBaseline] = useState<string>(baselineId || scenarios[0]?.id || '')
  const [copied, setCopied] = useState<string | null>(null)

  const allKeys = useMemo(() => 
    Array.from(new Set(scenarios.flatMap(s => Object.keys(s.inputs))))
  , [scenarios])

  const hasMainValues = scenarios.some(s => s.mainValue !== undefined)

  const chartData = useMemo(() => 
    hasMainValues && scenarios.length > 1
      ? scenarios.map(s => ({ 
          name: s.label.length > 12 ? s.label.substring(0, 12) + '…' : s.label, 
          value: s.mainValue || 0, 
          color: s.isBaseline ? '#f59e0b' : '#06b6d4' 
        }))
      : null
  , [scenarios, hasMainValues])

  const diffData = useMemo(() => {
    if (!diffBaseline) return null
    const baseline = scenarios.find(s => s.id === diffBaseline)
    if (!baseline) return null
    
    return scenarios
      .filter(s => s.id !== diffBaseline)
      .map(s => {
        const diffs = allKeys.map(key => {
          const base = parseFloat(baseline.inputs[key] || '0')
          const curr = parseFloat(s.inputs[key] || '0')
          const diff = curr - base
          const pct = base !== 0 ? (diff / base) * 100 : 0
          return { key, diff, pct, base, curr }
        }).filter(d => d.diff !== 0)
        return { scenario: s, diffs }
      })
  }, [scenarios, diffBaseline, baselineId, allKeys])

  const copyScenario = useCallback((s: Scenario) => {
    const json = JSON.stringify(s, null, 2)
    navigator.clipboard.writeText(json)
    setCopied(s.id)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  const exportScenario = useCallback((s: Scenario) => {
    const csv = [
      [t('premium.scenarioComparison.field'), t('premium.scenarioComparison.value')],
      ...Object.entries(s.inputs).map(([k, v]) => [k, v])
    ].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${s.label.replace(/\s+/g, '-')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [t])

  if (scenarios.length === 0) return null

  return (
    <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#06b6d4] transition-colors"
        >
          <BarChart3 className="w-4 h-4" />
          {t('premium.scenarioComparison.compareScenarios', { count: scenarios.length })}
          {showComparison ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <button
          onClick={onSave}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border border-[#06b6d4]/30 hover:bg-[#1a3a8a]/5 transition-colors text-[#06b6d4]"
        >
          <Plus className="w-3 h-3" /> {scenarioLabel || t('premium.scenarioComparison.saveCurrent')}
        </button>
      </div>

      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => setViewMode('list')}
                className={cn('px-2 py-1 text-[10px] font-medium rounded transition-colors', viewMode === 'list' ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700')}
              >
                {t('premium.scenarioComparison.viewList')}
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={cn('px-2 py-1 text-[10px] font-medium rounded transition-colors', viewMode === 'table' ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700')}
              >
                {t('premium.scenarioComparison.viewTable')}
              </button>
              <button
                onClick={() => setViewMode('diff')}
                className={cn('px-2 py-1 text-[10px] font-medium rounded transition-colors', viewMode === 'diff' ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700')}
              >
                {t('premium.scenarioComparison.viewDiff')}
              </button>
            </div>

            {viewMode === 'table' && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 pr-3 font-medium text-gray-500">{t('premium.scenarioComparison.field')}</th>
                      {scenarios.map(s => (
                        <th key={s.id} className="text-right py-2 px-2 font-medium text-gray-700 dark:text-gray-300 min-w-[100px]">
                          {s.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {hasMainValues && (
                      <tr className="border-b border-[#06b6d4]/20 bg-[#1a3a8a]/5">
                        <td className="py-1.5 pr-3 text-gray-500 capitalize font-medium">
                          {mainValueLabel ? mainValueLabel.replace(/([A-Z])/g, ' $1') : t('premium.scenarioComparison.result')}
                        </td>
                        {scenarios.map(s => (
                          <td key={s.id} className="text-right py-1.5 px-2 font-mono text-[#06b6d4] font-semibold">
                            {s.mainValue !== undefined ? formatValue(s.mainValue) : '-'}
                          </td>
                        ))}
                      </tr>
                    )}
                    {allKeys.map(key => (
                      <tr key={key} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1.5 pr-3 text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                        {scenarios.map(s => (
                          <td key={s.id} className="text-right py-1.5 px-2 font-mono text-gray-900 dark:text-white">
                            {s.inputs[key] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {chartData && (
                  <div className="mt-3">
                    <DynamicComparisonBarChart data={chartData} />
                  </div>
                )}
              </div>
            )}

            {viewMode === 'diff' && (
              <div className="space-y-3">
                {diffBaseline && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{t('premium.scenarioComparison.diffAgainst')}</span>
                    <select
                      value={diffBaseline}
                      onChange={e => setDiffBaseline(e.target.value)}
                      className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    >
                      {scenarios.map(s => (
                        <option key={s.id} value={s.id}>{s.label}{s.isBaseline ? t('premium.scenarioComparison.baselineSuffix') : ''}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {diffData && diffData.length > 0 ? (
                  diffData.map(({ scenario, diffs }) => (
                    <div key={scenario.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 dark:bg-gray-800 px-3 py-2 font-medium text-gray-900 dark:text-white">
                        {t('premium.scenarioComparison.vsBaseline', { name: scenario.label })}
                      </div>
                      <div className="p-3 space-y-1 max-h-64 overflow-auto">
                        {diffs.length === 0 ? (
                          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">{t('premium.scenarioComparison.noDifferences')}</p>
                        ) : (
                          diffs.map(d => (
                            <div key={d.key} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
                              <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{d.key.replace(/([A-Z])/g, ' $1')}</span>
                              <div className="flex items-center gap-2">
                                <span className={cn('text-sm font-mono', d.diff > 0 ? 'text-emerald-600' : 'text-red-600')}>
                                  {d.diff > 0 ? '+' : ''}{formatValue(d.diff)}
                                </span>
                                <span className={cn('text-xs px-1.5 py-0.5 rounded', d.diff > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300')}>
                                  {d.pct > 0 ? '+' : ''}{d.pct.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t('premium.scenarioComparison.selectBaseline')}</p>
                )}
              </div>
            )}

            {viewMode === 'list' && (
              <div className="space-y-2">
                {scenarios.map(s => (
                  <div
                    key={s.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                        {s.label}
                        {s.isBaseline && <span className="text-[10px] bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded">{t('premium.scenarioComparison.baseline')}</span>}
                      </p>
                      {s.mainValue !== undefined && (
                        <p className="text-xs text-[#06b6d4] font-semibold mt-0.5">
                          {mainValueLabel || t('premium.scenarioComparison.result')}: {formatValue(s.mainValue)}
                        </p>
                      )}
                      <div className="mt-1 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-0.5">
                        {Object.entries(s.inputs).filter(([, v]) => v).map(([k, v]) => (
                          <div key={k} className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                            <span className="capitalize">{allInputLabels?.[k] || k.replace(/([A-Z])/g, ' $1')}</span>
                            <span className="font-medium text-gray-700 dark:text-gray-300 ml-2">{v}</span>
                          </div>
                        ))}
                      </div>
                      {s.summary && (
                        <p className="mt-1 text-xs text-[#06b6d4] font-medium">{s.summary}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <button
                        onClick={() => onApply(s.inputs)}
                        className="p-1 text-gray-400 hover:text-[#06b6d4] transition-colors opacity-0 group-hover:opacity-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title={t('premium.scenarioComparison.loadScenario')}
                      >
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => copyScenario(s)}
                        className="p-1 text-gray-400 hover:text-[#06b6d4] transition-colors opacity-0 group-hover:opacity-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title={copied === s.id ? t('premium.scenarioComparison.copied') : t('premium.scenarioComparison.copyJson')}
                      >
                        {copied === s.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => exportScenario(s)}
                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title={t('premium.scenarioComparison.exportCsv')}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onRemove(s.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title={t('premium.scenarioComparison.removeScenario')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}