'use client'

import React, { useState, useCallback } from 'react'
import { Plus, Trash2, Download, Play, AlertTriangle, Table, X } from 'lucide-react'

interface BatchField {
  name: string
  label: string
  type: 'number' | 'text' | 'select'
  options?: string[]
}

interface BatchCalculatorProps {
  title: string
  fields: BatchField[]
  onCalculate: (inputs: Record<string, string>[]) => { label: string; value: string }[][]
  show?: boolean
  onToggle?: () => void
}

export function BatchCalculator({ title, fields, onCalculate, show, onToggle }: BatchCalculatorProps) {
  const [rows, setRows] = useState<Record<string, string>[]>([Object.fromEntries(fields.map(f => [f.name, '']))])
  const [results, setResults] = useState<{ label: string; value: string }[][] | null>(null)
  const [showPanel, setShowPanel] = useState(false)

  const addRow = useCallback(() => {
    setRows(prev => [...prev, Object.fromEntries(fields.map(f => [f.name, '']))])
  }, [fields])

  const removeRow = useCallback((index: number) => {
    setRows(prev => prev.filter((_, i) => i !== index))
    setResults(null)
  }, [])

  const updateRow = useCallback((index: number, field: string, value: string) => {
    setRows(prev => prev.map((row, i) => i === index ? { ...row, [field]: value } : row))
    setResults(null)
  }, [])

  const handleCalculate = useCallback(() => {
    const validRows = rows.filter(r => fields.some(f => r[f.name] && r[f.name].trim() !== ''))
    if (validRows.length === 0) return
    const res = onCalculate(validRows)
    setResults(res)
  }, [rows, fields, onCalculate])

  const handleExportCSV = useCallback(() => {
    if (!results) return
    const headers = fields.map(f => f.label).concat(results[0]?.map(r => r.label) || [])
    const csvRows = [headers.join(',')]
    rows.forEach((row, i) => {
      const inputVals = fields.map(f => `"${row[f.name] || ''}"`)
      const resultVals = results[i]?.map(r => `"${r.value}"`) || []
      csvRows.push([...inputVals, ...resultVals].join(','))
    })
    const csv = csvRows.join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-batch-results.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [results, rows, fields, title])

  const displayPanel = show !== undefined ? show : showPanel
  const togglePanel = onToggle || (() => setShowPanel(!showPanel))

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={togglePanel}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Table className="w-4 h-4 text-[#06b6d4]" />
          Batch Mode
        </span>
        <span className="text-[10px] text-gray-400">Process multiple rows at once</span>
      </button>

      {displayPanel && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Enter multiple sets of values and process them all at once. Results appear in a table below.
          </p>

          {/* Data table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  {fields.map(f => (
                    <th key={f.name} className="px-2 py-1.5 text-left font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                      {f.label}
                    </th>
                  ))}
                  {results && results[0]?.map((r, i) => (
                    <th key={`result-${i}`} className="px-2 py-1.5 text-left font-medium text-[#06b6d4] border border-gray-200 dark:border-gray-700">
                      {r.label}
                    </th>
                  ))}
                  <th className="px-2 py-1.5 w-8 border border-gray-200 dark:border-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-gray-100 dark:border-gray-800">
                    {fields.map(f => (
                      <td key={f.name} className="px-2 py-1 border border-gray-100 dark:border-gray-800">
                        {f.type === 'select' ? (
                          <select
                            value={row[f.name] || ''}
                            onChange={e => updateRow(rowIndex, f.name, e.target.value)}
                            className="w-full px-1.5 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300"
                          >
                            <option value="">Select...</option>
                            {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input
                            type={f.type}
                            value={row[f.name] || ''}
                            onChange={e => updateRow(rowIndex, f.name, e.target.value)}
                            placeholder={f.label}
                            className="w-full px-1.5 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 placeholder-gray-400"
                          />
                        )}
                      </td>
                    ))}
                    {results && results[rowIndex]?.map((r, i) => (
                      <td key={`result-${i}`} className="px-2 py-1 font-medium text-gray-900 dark:text-white border border-gray-100 dark:border-gray-800">
                        {r.value}
                      </td>
                    ))}
                    <td className="px-2 py-1 border border-gray-100 dark:border-gray-800">
                      <button
                        onClick={() => removeRow(rowIndex)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        disabled={rows.length === 1}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={addRow}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
            >
              <Plus className="w-3 h-3" /> Add Row
            </button>
            <button
              onClick={handleCalculate}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#1a3a8a] text-white hover:bg-[#0a1d4f] transition-colors"
            >
              <Play className="w-3 h-3" /> Calculate All ({rows.length})
            </button>
            {results && (
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
              >
                <Download className="w-3 h-3" /> Export CSV
              </button>
            )}
          </div>

          {/* Results summary */}
          {results && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-xs text-green-700 dark:text-green-300 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              Processed {results.length} row(s) successfully
            </div>
          )}
        </div>
      )}
    </div>
  )
}
