'use client'

import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { 
  BarChart3, TrendingUp, TrendingDown, AlertTriangle, 
  Maximize2, Minimize2, Info, Play, Pause, RefreshCw,
  Settings, Download, Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DynamicComparisonBarChart } from '@/components/premium/DynamicCharts'

interface MonteCarloInput {
  name: string
  label: string
  distribution: 'normal' | 'uniform' | 'triangular' | 'lognormal'
  mean?: number
  stdDev?: number
  min?: number
  max?: number
  mode?: number
  baseValue: number
}

interface MonteCarloResult {
  mean: number
  median: number
  stdDev: number
  min: number
  max: number
  percentiles: Record<number, number>
  histogram: { bin: number; count: number }[]
  samples: number[]
}

interface MonteCarloProps {
  inputs: MonteCarloInput[]
  compute: (inputs: Record<string, number>) => number
  baseInputs: Record<string, number>
  mainOutputLabel: string
  mainOutputUnit?: string
  iterations?: number
  className?: string
  autoRun?: boolean
}

function sampleNormal(mean: number, stdDev: number): number {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  return mean + z * stdDev
}

function sampleUniform(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function sampleTriangular(min: number, max: number, mode: number): number {
  const u = Math.random()
  const f = (mode - min) / (max - min)
  if (u <= f) {
    return min + Math.sqrt(u * (max - min) * (mode - min))
  } else {
    return max - Math.sqrt((1 - u) * (max - min) * (max - mode))
  }
}

function sampleLognormal(mean: number, stdDev: number): number {
  const mu = Math.log(mean / Math.sqrt(1 + (stdDev / mean) ** 2))
  const sigma = Math.sqrt(Math.log(1 + (stdDev / mean) ** 2))
  return Math.exp(sampleNormal(mu, sigma))
}

function percentile(arr: number[], p: number): number {
  if (arr.length === 0) return 0
  const sorted = [...arr].sort((a, b) => a - b)
  const idx = Math.ceil(p / 100 * sorted.length) - 1
  return sorted[Math.max(0, idx)]
}

export function MonteCarloSimulation({
  inputs,
  compute,
  baseInputs,
  mainOutputLabel,
  mainOutputUnit,
  iterations = 10000,
  className,
  autoRun = false,
}: MonteCarloProps) {
  const t = useTranslations('calculatorUI')
  const [running, setRunning] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<MonteCarloResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(true)
  const [viewMode, setViewMode] = useState<'summary' | 'histogram' | 'percentiles'>('summary')
  const workerRef = useRef<Worker | null>(null)
  const abortRef = useRef(false)

  const baseOutput = useMemo(() => compute(baseInputs), [compute, baseInputs])

  const runSimulation = useCallback(async () => {
    if (running) return
    
    setRunning(true)
    setProgress(0)
    setError(null)
    setCompleted(false)
    abortRef.current = false

    try {
      const totalIterations = iterations
      const batchSize = Math.max(100, Math.floor(totalIterations / 100))
      const samples: number[] = []
      
      const inputConfigs = inputs.map(input => ({
        name: input.name,
        sample: (() => {
          switch (input.distribution) {
            case 'normal':
              return () => sampleNormal(input.mean ?? input.baseValue, input.stdDev ?? Math.abs(input.baseValue * 0.1))
            case 'uniform':
              return () => sampleUniform(input.min ?? input.baseValue * 0.8, input.max ?? input.baseValue * 1.2)
            case 'triangular':
              return () => sampleTriangular(
                input.min ?? input.baseValue * 0.8, 
                input.max ?? input.baseValue * 1.2, 
                input.mode ?? input.baseValue
              )
            case 'lognormal':
              return () => sampleLognormal(input.mean ?? input.baseValue, input.stdDev ?? Math.abs(input.baseValue * 0.1))
            default:
              return () => input.baseValue
          }
        })()
      }))

      let completed = 0
      const batchResults: number[] = []

      while (completed < totalIterations && !abortRef.current) {
        const currentBatch = Math.min(batchSize, totalIterations - completed)
        for (let i = 0; i < currentBatch; i++) {
          const sampledInputs: Record<string, number> = { ...baseInputs }
          inputConfigs.forEach(cfg => {
            sampledInputs[cfg.name] = cfg.sample()
          })
          try {
            const result = compute(sampledInputs)
            if (isFinite(result)) batchResults.push(result)
          } catch {}
        }
        completed += currentBatch
        setProgress(Math.round((completed / totalIterations) * 100))
        await new Promise(r => setTimeout(r, 0))
      }

      if (abortRef.current) return

      const finalSamples = batchResults.filter(isFinite)
      if (finalSamples.length === 0) throw new Error(t('premium.monteCarlo.noValidSamples'))

      const sorted = [...finalSamples].sort((a, b) => a - b)
      const mean = finalSamples.reduce((a, b) => a + b, 0) / finalSamples.length
      const median = finalSamples.length % 2 === 0
        ? (sorted[finalSamples.length / 2 - 1] + sorted[finalSamples.length / 2]) / 2
        : sorted[Math.floor(finalSamples.length / 2)]
      const variance = finalSamples.reduce((sum, v) => sum + (v - mean) ** 2, 0) / finalSamples.length
      const stdDev = Math.sqrt(variance)

      const percentiles = {
        1: percentile(sorted, 1),
        5: percentile(sorted, 5),
        10: percentile(sorted, 10),
        25: percentile(sorted, 25),
        50: percentile(sorted, 50),
        75: percentile(sorted, 75),
        90: percentile(sorted, 90),
        95: percentile(sorted, 95),
        99: percentile(sorted, 99),
      }

      const binCount = 30
      const min = sorted[0]
      const max = sorted[sorted.length - 1]
      const binWidth = (max - min) / binCount
      const histogram = Array.from({ length: binCount }, (_, i) => {
        const binStart = min + i * binWidth
        const binEnd = binStart + binWidth
        const count = sorted.filter(v => v >= binStart && (i === binCount - 1 ? v <= binEnd : v < binEnd)).length
        return { bin: (binStart + binEnd) / 2, count }
      })

      setResults({
        mean,
        median,
        stdDev,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        percentiles,
        histogram,
        samples: finalSamples,
      })
      setCompleted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('premium.monteCarlo.simulationFailed'))
    } finally {
      setRunning(false)
      setProgress(100)
    }
  }, [compute, baseInputs, inputs, iterations, t])

  const stopSimulation = useCallback(() => {
    abortRef.current = true
    setRunning(false)
  }, [])

  const resetSimulation = useCallback(() => {
    setResults(null)
    setCompleted(false)
    setProgress(0)
    setError(null)
  }, [])

  useEffect(() => {
    if (autoRun) {
      runSimulation()
    }
    return () => { abortRef.current = true }
  }, [autoRun, runSimulation])

  const formatVal = (val: number) => {
    if (val >= 1e9) return `${(val / 1e9).toFixed(2)}B`
    if (val >= 1e6) return `${(val / 1e6).toFixed(2)}M`
    if (val >= 1e3) return `${(val / 1e3).toFixed(1)}K`
    return val.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  const exportCSV = useCallback(() => {
    if (!results) return
    const headers = [t('premium.monteCarlo.csvMetric'), t('premium.monteCarlo.csvValue')]
    const rows = [
      [t('premium.monteCarlo.statMean'), formatVal(results.mean)],
      [t('premium.monteCarlo.statMedian'), formatVal(results.median)],
      [t('premium.monteCarlo.statStdDev'), formatVal(results.stdDev)],
      [t('premium.monteCarlo.statMin'), formatVal(results.min)],
      [t('premium.monteCarlo.statMax'), formatVal(results.max)],
      ...Object.entries(results.percentiles).map(([p, v]) => [`P${p}`, formatVal(v)]),
    ]
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `monte-carlo-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [results, t])

  return (
    <div className={cn('rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden', className)}>
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-5 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('premium.monteCarlo.title')}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('premium.monteCarlo.subtitle', { label: mainOutputLabel })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={viewMode}
              onChange={e => setViewMode(e.target.value as 'summary' | 'histogram' | 'percentiles')}
              className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="summary">{t('premium.monteCarlo.viewSummary')}</option>
              <option value="histogram">{t('premium.monteCarlo.viewHistogram')}</option>
              <option value="percentiles">{t('premium.monteCarlo.viewPercentiles')}</option>
            </select>
            <button onClick={exportCSV} disabled={!results} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50" title={t('premium.monteCarlo.exportCsv')}>
              <Download className="w-4 h-4" />
            </button>
            <button onClick={() => setExpanded(!expanded)} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </p>
            </div>
          )}

          {!running && !completed && (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">{t('premium.monteCarlo.runPrompt')}</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <input
                  type="number"
                  value={iterations}
                  onChange={e => e.target.value && console.log}
                  min={100}
                  max={1000000}
                  step={100}
                  className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                />
                <span className="text-sm text-gray-500">{t('premium.monteCarlo.iterationsLabel')}</span>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={runSimulation}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 text-white shadow-md hover:opacity-90 transition-all min-h-[44px]"
                >
                  <Play className="w-4 h-4" />
                  {t('premium.monteCarlo.runSimulation')}
                </button>
                <button onClick={resetSimulation} className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[44px]">
                  {t('premium.monteCarlo.reset')}
                </button>
              </div>
            </div>
          )}

          {running && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[50px]">{progress}%</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {t('premium.monteCarlo.running', { current: Math.round(progress / 100 * iterations).toLocaleString(), total: iterations.toLocaleString() })}
              </p>
              <button onClick={stopSimulation} className="w-full px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[44px]">
                {t('premium.monteCarlo.stopSimulation')}
              </button>
            </div>
          )}

          {completed && results && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard 
                  label={t('premium.monteCarlo.statMean')} 
                  value={formatVal(results.mean)} 
                  unit={mainOutputUnit}
                  color="blue"
                  baseline={baseOutput}
                />
                <StatCard 
                  label={t('premium.monteCarlo.statMedian')} 
                  value={formatVal(results.median)} 
                  unit={mainOutputUnit}
                  color="green"
                  baseline={baseOutput}
                />
                <StatCard 
                  label={t('premium.monteCarlo.statStdDev')} 
                  value={formatVal(results.stdDev)} 
                  unit={mainOutputUnit}
                  color="amber"
                />
                <StatCard 
                  label={t('premium.monteCarlo.statRange')} 
                  value={`${formatVal(results.min)} – ${formatVal(results.max)}`} 
                  unit={mainOutputUnit}
                  color="purple"
                />
              </div>

              {viewMode === 'summary' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {Object.entries(results.percentiles).map(([p, v]) => (
                    <div key={p} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">P{p}</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{formatVal(v)}{mainOutputUnit ? ` ${mainOutputUnit}` : ''}</p>
                    </div>
                  ))}
                </div>
              )}

              {viewMode === 'histogram' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">{t('premium.monteCarlo.outputDistribution')}</h4>
                  <DynamicComparisonBarChart
                    data={results.histogram.map(h => ({
                      name: formatVal(h.bin),
                      value: h.count,
                      color: '#06b6d4'
                    }))}
                  />
                </div>
              )}

              {viewMode === 'percentiles' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 px-3 font-medium text-gray-500">{t('premium.monteCarlo.percentile')}</th>
                        <th className="text-right py-2 px-3 font-medium text-gray-500">{t('premium.monteCarlo.value')}</th>
                        <th className="text-right py-2 px-3 font-medium text-gray-500">{t('premium.monteCarlo.vsBase')}</th>
                        <th className="text-right py-2 px-3 font-medium text-gray-500">{t('premium.monteCarlo.probability')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(results.percentiles).map(([p, v]) => (
                        <tr key={p} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="py-2 px-3 font-medium text-gray-700 dark:text-gray-300">P{p}</td>
                          <td className="py-2 px-3 text-right font-mono text-gray-900 dark:text-white">{formatVal(v)}{mainOutputUnit ? ` ${mainOutputUnit}` : ''}</td>
                          <td className="py-2 px-3 text-right text-gray-600 dark:text-gray-400">
                            {baseOutput !== 0 ? `${((v - baseOutput) / Math.abs(baseOutput) * 100).toFixed(1)}%` : '—'}
                          </td>
                          <td className="py-2 px-3 text-right text-gray-500 dark:text-gray-400">{p}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                    <p className="font-medium">{t('premium.monteCarlo.interpretation')}</p>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      <li>{t('premium.monteCarlo.bulletMean')}</li>
                      <li>{t('premium.monteCarlo.bulletSkewed')}</li>
                      <li>{t('premium.monteCarlo.bulletStdDev')}</li>
                      <li>{t('premium.monteCarlo.bulletP95')}</li>
                      <li>{t('premium.monteCarlo.bulletIterations')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {completed && results ? t('premium.monteCarlo.completedIterations', { count: results.samples.length.toLocaleString() }) : t('premium.monteCarlo.ready')}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {running ? (
                <button onClick={stopSimulation} className="px-3 py-2 text-sm font-medium rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors min-h-[44px]">
                  {t('premium.monteCarlo.stop')}
                </button>
              ) : (
                <button onClick={runSimulation} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 text-white shadow-md hover:opacity-90 transition-all min-h-[44px]">
                  <Play className="w-4 h-4" />
                  {completed ? t('premium.monteCarlo.rerun') : t('premium.monteCarlo.runSimulation')}
                </button>
              )}
              <button onClick={resetSimulation} className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[44px]">
                {t('premium.monteCarlo.reset')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, unit, color, baseline }: { label: string; value: string; unit?: string; color: string; baseline?: number }) {
  const t = useTranslations('calculatorUI')
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    green: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  }

  const diff = baseline !== undefined && color === 'blue' 
    ? `${((parseFloat(value.replace(/[^\d.-]/g, '')) - baseline) / Math.abs(baseline) * 100).toFixed(1)}%`
    : null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
        {unit && <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{unit}</span>}
      </div>
      {diff && (
        <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
          {parseFloat(diff) >= 0 ? '+' : ''}{diff} {t('premium.monteCarlo.vsBaseShort')}
        </p>
      )}
    </div>
  )
}