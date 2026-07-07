'use client'

import React, { useState } from 'react'
import { Clock, Trash2, RotateCcw, History, Search, Download, X, AlertTriangle } from 'lucide-react'
import type { HistoryEntry } from '@/lib/hooks/useCalculatorHistory'

interface CalculationHistoryProps {
  entries: HistoryEntry[]
  onApply: (inputs: Record<string, string>) => void
  onRemove: (id: string) => void
  onClear: () => void
  onExportCSV?: () => string
  show: boolean
  onToggle: () => void
  searchQuery?: string
  onSearchChange?: (q: string) => void
  clearConfirm?: boolean
  onClearConfirm?: (v: boolean) => void
  calcStats?: Record<string, { count: number; lastUsed: number; title: string }>
}

export function CalculationHistory({
  entries, onApply, onRemove, onClear, onExportCSV, show, onToggle,
  searchQuery = '', onSearchChange, clearConfirm = false, onClearConfirm, calcStats,
}: CalculationHistoryProps) {
  if (entries.length === 0 && !show) return null

  return (
    <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-3">
      <button
        onClick={onToggle}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-[#06b6d4] transition-colors"
      >
        <History className="w-3.5 h-3.5" />
        Recent calculations ({entries.length})
      </button>

      {show && (
        <div className="mt-2 space-y-2">
          {/* Search */}
          {onSearchChange && (
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Filter by date, calculator, or value..."
                className="w-full pl-7 pr-7 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400"
              />
              {searchQuery && (
                <button onClick={() => onSearchChange('')} className="absolute right-2 top-1/2 -translate-y-1/2">
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              )}
            </div>
          )}

          {/* Calculator stats */}
          {calcStats && Object.keys(calcStats).length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(calcStats).slice(0, 5).map(([slug, stat]) => (
                <span key={slug} className="px-2 py-0.5 bg-gray-50 dark:bg-gray-900 rounded-full text-[10px] text-gray-500 dark:text-gray-400">
                  {stat.title}: {stat.count} uses
                </span>
              ))}
            </div>
          )}

          {/* History entries */}
          <div className="space-y-1.5 max-h-60 overflow-y-auto">
            {entries.length === 0 ? (
              <p className="text-[10px] text-gray-400 text-center py-2">No matching entries found</p>
            ) : (
              entries.slice(0, 20).map(entry => {
                const date = new Date(entry.timestamp)
                const dateStr = date.toLocaleDateString()
                const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                return (
                  <div
                    key={entry.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs group"
                  >
                    <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                    <button
                      onClick={() => onApply(entry.inputs)}
                      className="flex-1 text-left min-w-0 text-gray-600 dark:text-gray-400 hover:text-[#06b6d4] transition-colors truncate"
                      title="Restore this calculation"
                    >
                      {Object.values(entry.inputs).filter(Boolean).join(', ')}
                    </button>
                    <span className="text-[10px] text-gray-400 shrink-0 whitespace-nowrap" title={dateStr + ' ' + timeStr}>
                      {dateStr}
                    </span>
                    <button
                      onClick={() => onRemove(entry.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                      title="Remove from history"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )
              })
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            {onExportCSV && entries.length > 0 && (
              <button
                onClick={() => {
                  const csv = onExportCSV()
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = 'calculation-history.csv'
                  a.click()
                  URL.revokeObjectURL(url)
                }}
                className="text-[10px] text-gray-400 hover:text-[#06b6d4] transition-colors flex items-center gap-1"
              >
                <Download className="w-2.5 h-2.5" /> Export CSV
              </button>
            )}

            {onClearConfirm && entries.length > 0 && !clearConfirm && (
              <button
                onClick={() => onClearConfirm(true)}
                className="text-[10px] text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-2.5 h-2.5" /> Clear all
              </button>
            )}

            {clearConfirm && onClearConfirm && (
              <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle className="w-3 h-3 text-red-500" />
                <span className="text-[10px] text-red-600 dark:text-red-400">Clear all history?</span>
                <button
                  onClick={onClear}
                  className="text-[10px] px-2 py-0.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Confirm
                </button>
                <button
                  onClick={() => onClearConfirm(false)}
                  className="text-[10px] px-2 py-0.5 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
