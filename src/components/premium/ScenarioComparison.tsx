'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, ChevronDown, ChevronUp, Trash2, Plus, TrendingUp, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DynamicComparisonBarChart } from '@/components/premium/DynamicCharts'

interface Scenario {
  id: string
  label: string
  inputs: Record<string, string>
  summary?: string
  mainValue?: number
}

interface ScenarioComparisonProps {
  scenarios: Scenario[]
  onRemove: (id: string) => void
  onApply: (inputs: Record<string, string>) => void
  onSave: () => void
  scenarioLabel?: string
  mainValueLabel?: string
}

export function ScenarioComparison({
  scenarios, onRemove, onApply, onSave, scenarioLabel, mainValueLabel,
}: ScenarioComparisonProps) {
  const [showComparison, setShowComparison] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list')

  if (scenarios.length === 0) return null

  const allKeys = Array.from(new Set(scenarios.flatMap(s => Object.keys(s.inputs))))
  const hasMainValues = scenarios.some(s => s.mainValue !== undefined)

  const chartData = hasMainValues && scenarios.length > 1
    ? scenarios.map(s => ({ name: s.label.length > 12 ? s.label.substring(0, 12) + '…' : s.label, value: s.mainValue || 0, color: '#06b6d4' }))
    : null

  return (
    <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#06b6d4] transition-colors"
        >
          <BarChart3 className="w-4 h-4" />
          Compare Scenarios ({scenarios.length})
          {showComparison ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <button
          onClick={onSave}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border border-[#06b6d4]/30 hover:bg-[#1a3a8a]/5 transition-colors text-[#06b6d4]"
        >
          <Plus className="w-3 h-3" /> {scenarioLabel || 'Save Current'}
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
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setViewMode('list')}
                className={cn('px-2 py-1 text-[10px] font-medium rounded transition-colors', viewMode === 'list' ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700')}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={cn('px-2 py-1 text-[10px] font-medium rounded transition-colors', viewMode === 'table' ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700')}
              >
                Table
              </button>
            </div>

            {viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 pr-3 font-medium text-gray-500">Field</th>
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
                          {mainValueLabel ? mainValueLabel.replace(/([A-Z])/g, ' $1') : 'Result'}
                        </td>
                        {scenarios.map(s => (
                          <td key={s.id} className="text-right py-1.5 px-2 font-mono text-[#06b6d4] font-semibold">
                            {s.mainValue !== undefined ? s.mainValue.toLocaleString() : '-'}
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
            ) : (
              <div className="space-y-2">
                {scenarios.map(s => (
                  <div
                    key={s.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                        {s.label}
                        {scenarios.length > 1 && (
                          <span className="text-[10px] text-gray-400 font-normal">
                            vs baseline
                          </span>
                        )}
                      </p>
                      {s.mainValue !== undefined && (
                        <p className="text-xs text-[#06b6d4] font-semibold mt-0.5">
                          {mainValueLabel || 'Result'}: {s.mainValue.toLocaleString()}
                        </p>
                      )}
                      <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-0.5">
                        {Object.entries(s.inputs).filter(([, v]) => v).map(([k, v]) => (
                          <div key={k} className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                            <span className="capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="font-medium text-gray-700 dark:text-gray-300 ml-2">{v as string}</span>
                          </div>
                        ))}
                      </div>
                      {s.summary && (
                        <p className="mt-1 text-xs text-[#06b6d4] font-medium">{s.summary}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onApply(s.inputs)}
                        className="p-1 text-gray-400 hover:text-[#06b6d4] transition-colors opacity-0 group-hover:opacity-100"
                        title="Load this scenario"
                      >
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onRemove(s.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove scenario"
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
