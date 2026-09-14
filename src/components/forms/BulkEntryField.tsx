'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { Clipboard, X, Check, AlertTriangle, FileText, Download, Trash2, Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FieldMapping {
  formField: string
  label: string
  csvHeader?: string
  jsonKey?: string
  transform?: (val: string) => string
  required?: boolean
}

interface BulkEntryFieldProps {
  fieldMappings: FieldMapping[]
  onSuccess?: (importedCount: number, errors: string[]) => void
  onError?: (error: string) => void
  className?: string
  delimiter?: ',' | ';' | '\t' | '|'
  allowMultipleRows?: boolean
}

interface ParsedData {
  headers: string[]
  rows: string[][]
  fieldMap: Record<string, string>
}

export function BulkEntryField({
  fieldMappings,
  onSuccess,
  onError,
  className,
  delimiter = ',',
  allowMultipleRows = true,
}: BulkEntryFieldProps) {
  const { setValue, trigger, formState: { errors }, watch } = useFormContext()
  const [pasteText, setPasteText] = useState('')
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [previewMode, setPreviewMode] = useState<'csv' | 'json' | 'tsv'>('csv')
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({})
  const [importing, setImporting] = useState(false)
  const [showTemplate, setShowTemplate] = useState(false)

  const requiredFields = useMemo(() => 
    fieldMappings.filter(fm => fm.required).map(fm => fm.formField), 
    [fieldMappings]
  )

  const buildFieldMap = useCallback(() => {
    const map: Record<string, string> = {}
    fieldMappings.forEach(fm => {
      const key = fm.csvHeader || fm.jsonKey || fm.formField
      map[key] = fm.formField
    })
    return map
  }, [fieldMappings])

  const parseCSV = useCallback((text: string): ParsedData => {
    const lines = text.trim().split('\n').filter(l => l.trim())
    if (lines.length === 0) return { headers: [], rows: [], fieldMap: {} }

    const headers = lines[0].split(delimiter).map(h => h.trim())
    const rows = lines.slice(1).map(line => 
      line.split(delimiter).map(c => c.trim())
    )

    return {
      headers,
      rows,
      fieldMap: buildFieldMap()
    }
  }, [delimiter, buildFieldMap])

  const parseJSON = useCallback((text: string): ParsedData => {
    try {
      const data = JSON.parse(text)
      const arr = Array.isArray(data) ? data : [data]
      if (arr.length === 0) return { headers: [], rows: [], fieldMap: {} }

      const headers = Object.keys(arr[0])
      const rows = arr.map(obj => headers.map(h => String(obj[h] ?? '')))

      return {
        headers,
        rows,
        fieldMap: buildFieldMap()
      }
    } catch {
      throw new Error('Invalid JSON format')
    }
  }, [buildFieldMap])

  const parseTSV = useCallback((text: string): ParsedData => {
    return parseCSV(text.replace(/\t/g, delimiter))
  }, [parseCSV, delimiter])

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData('text')
    setPasteText(text)
    try {
      let parsed: ParsedData
      if (previewMode === 'json') parsed = parseJSON(text)
      else if (previewMode === 'tsv') parsed = parseTSV(text)
      else parsed = parseCSV(text)
      setParsedData(parsed)
      if (parsed.rows.length > 0) {
        const newSelection = new Set<number>()
        parsed.rows.forEach((_, i) => newSelection.add(i))
        setSelectedRows(newSelection)
      }
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Parse error')
    }
  }, [previewMode, parseCSV, parseJSON, parseTSV, onError])

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setPasteText(text)
    try {
      let parsed: ParsedData
      if (previewMode === 'json') parsed = parseJSON(text)
      else if (previewMode === 'tsv') parsed = parseTSV(text)
      else parsed = parseCSV(text)
      setParsedData(parsed)
      if (parsed.rows.length > 0) {
        const newSelection = new Set<number>()
        parsed.rows.forEach((_, i) => newSelection.add(i))
        setSelectedRows(newSelection)
      }
    } catch {
      setParsedData(null)
    }
  }, [previewMode, parseCSV, parseJSON, parseTSV])

  const toggleRowSelection = useCallback((rowIndex: number) => {
    setSelectedRows(prev => {
      const next = new Set(prev)
      if (next.has(rowIndex)) next.delete(rowIndex)
      else next.add(rowIndex)
      return next
    })
  }, [])

  const toggleAllRows = useCallback(() => {
    if (!parsedData) return
    if (selectedRows.size === parsedData.rows.length) {
      setSelectedRows(new Set())
    } else {
      const next = new Set<number>()
      parsedData.rows.forEach((_, i) => next.add(i))
      setSelectedRows(next)
    }
  }, [parsedData, selectedRows])

  const applyMapping = useCallback(() => {
    if (!parsedData) return

    const errors: string[] = []
    let imported = 0

    const rowsToImport = Array.from(selectedRows).sort((a, b) => a - b)

    rowsToImport.forEach((rowIndex) => {
      const row = parsedData.rows[rowIndex]
      if (!row) return

      parsedData.headers.forEach((header, colIndex) => {
        const formField = columnMapping[header] || parsedData.fieldMap[header]
        if (!formField) return

        const value = row[colIndex]?.trim()
        if (value === undefined || value === '') return

        const fm = fieldMappings.find(f => f.formField === formField)
        let transformed = value
        if (fm?.transform) {
          try { transformed = fm.transform(value) } 
          catch { errors.push(`Row ${rowIndex + 1}: ${formField} transform failed`) }
        }

        try {
          setValue(formField, transformed, { shouldValidate: true, shouldDirty: true })
          imported++
        } catch {
          errors.push(`Row ${rowIndex + 1}: Failed to set ${formField}`)
        }
      })
    })

    if (errors.length > 0) onError?.(errors.join('; '))
    if (imported > 0) {
      trigger()
      onSuccess?.(imported, errors)
    }
  }, [parsedData, selectedRows, columnMapping, fieldMappings, setValue, trigger, onSuccess, onError])

  const downloadTemplate = useCallback(() => {
    const headers = fieldMappings.map(fm => fm.csvHeader || fm.jsonKey || fm.formField)
    const exampleRow = fieldMappings.map(() => '')
    const csv = [headers.join(delimiter), exampleRow.join(delimiter)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bulk-entry-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }, [fieldMappings, delimiter])

  const getMissingRequired = useCallback(() => {
    if (!parsedData) return []
    const mappedFields = new Set(Object.values(columnMapping))
    return requiredFields.filter(f => !mappedFields.has(f))
  }, [parsedData, columnMapping, requiredFields])

  return (
    <div className={cn('rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden', className)}>
      <div className="bg-gray-50 dark:bg-gray-800/50 px-5 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
              <Clipboard className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bulk Entry Import</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Paste CSV/TSV/JSON data to populate multiple fields at once
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={previewMode}
              onChange={e => setPreviewMode(e.target.value as 'csv' | 'json' | 'tsv')}
              className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            >
              <option value="csv">CSV</option>
              <option value="tsv">TSV</option>
              <option value="json">JSON</option>
            </select>
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[44px]"
            >
              <FileText className="w-3 h-3" /> Template
            </button>
            <button
              onClick={() => setShowTemplate(!showTemplate)}
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[44px]"
            >
              <Plus className="w-3 h-3" /> Template
            </button>
          </div>
        </div>
      </div>

      {showTemplate && (
        <div className="px-5 py-3 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">CSV Template (copy and fill)</span>
            <button onClick={() => setShowTemplate(false)} className="text-amber-600 hover:text-amber-800">×</button>
          </div>
          <div className="mt-2 relative">
            <textarea
              readOnly
              value={fieldMappings.map(fm => fm.csvHeader || fm.jsonKey || fm.formField).join(delimiter)}
              className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded"
              rows={1}
            />
            <button
              onClick={() => navigator.clipboard.writeText(fieldMappings.map(fm => fm.csvHeader || fm.jsonKey || fm.formField).join(delimiter))}
              className="absolute right-2 top-2 text-xs px-2 py-1 bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-200 rounded"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      <div className="p-5 space-y-4">
        <div className="relative">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
            Paste {previewMode.toUpperCase()} data here
          </label>
          <textarea
            value={pasteText}
            onChange={handleTextChange}
            onPaste={handlePaste}
            placeholder={`Paste ${previewMode.toUpperCase()} data here…
Example CSV:
${fieldMappings.slice(0, 3).map(fm => fm.csvHeader || fm.formField).join(delimiter)}
100,5.5,30
...`}
            className={cn(
              'w-full px-4 py-3 text-sm font-mono border rounded-lg bg-white dark:bg-gray-800 dark:text-white transition-all',
              'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'min-h-[120px] resize-y'
            )}
            rows={6}
            spellCheck={false}
          />
          <div className="absolute bottom-2 right-2 flex gap-1">
            {pasteText && (
              <button
                onClick={() => { setPasteText(''); setParsedData(null); setSelectedRows(new Set()); }}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                title="Clear"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {pasteText && !parsedData && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-xs text-red-700 dark:text-red-300 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Failed to parse. Check format and delimiter.
            </p>
          </div>
        )}

        {parsedData && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {parsedData.rows.length} row(s), {parsedData.headers.length} column(s)
                </span>
                <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === parsedData.rows.length && parsedData.rows.length > 0}
                    onChange={toggleAllRows}
                    className="w-3 h-3 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  Select all
                </label>
              </div>
              <button
                onClick={applyMapping}
                disabled={selectedRows.size === 0 || importing}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-gradient-to-br from-cyan-600 to-cyan-400 text-white shadow-md hover:opacity-90 transition-all disabled:opacity-50 min-h-[44px]"
              >
                <Check className="w-4 h-4" />
                Import {selectedRows.size} row(s)
              </button>
            </div>

            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                      <th className="w-10 text-center py-2 px-1 font-medium text-gray-500">#</th>
                      <th className="w-10 text-center py-2 px-1 font-medium text-gray-500">
                        <input
                          type="checkbox"
                          checked={selectedRows.size === parsedData.rows.length && parsedData.rows.length > 0}
                          onChange={toggleAllRows}
                          className="w-3 h-3 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                        />
                      </th>
                      {parsedData.headers.map((header, colIndex) => (
                        <th key={header} className="py-2 px-2 font-medium text-gray-700 dark:text-gray-300 text-left">
                          <div className="flex items-center gap-1">
                            <span>{header}</span>
                            <select
                              value={columnMapping[header] || ''}
                              onChange={e => setColumnMapping(prev => ({ ...prev, [header]: e.target.value }))}
                              className="text-[10px] px-1 py-0.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                            >
                              <option value="">— Map to —</option>
                              {fieldMappings.map(fm => (
                                <option key={fm.formField} value={fm.formField}>
                                  {fm.label} ({fm.formField})
                                </option>
                              ))}
                            </select>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className={`border-b border-gray-100 dark:border-gray-800 ${selectedRows.has(rowIndex) ? 'bg-cyan-50 dark:bg-cyan-900/20' : ''}`}>
                        <td className="text-center py-2 px-1 text-gray-500">{rowIndex + 1}</td>
                        <td className="text-center py-2 px-1">
                          <input
                            type="checkbox"
                            checked={selectedRows.has(rowIndex)}
                            onChange={() => toggleRowSelection(rowIndex)}
                            className="w-3 h-3 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                          />
                        </td>
                        {row.map((cell, colIndex) => (
                          <td key={colIndex} className="py-2 px-2 font-mono text-gray-900 dark:text-white truncate max-w-[150px]">
                            {cell || <span className="text-gray-400">—</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {getMissingRequired().length > 0 && (
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-xs text-amber-800 dark:text-amber-200 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Required fields not mapped: {getMissingRequired().join(', ')}
            </p>
          </div>
        )}

        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Field Mapping Reference</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {fieldMappings.map(fm => (
              <div key={fm.formField} className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{fm.label}</span>
                  <code className="text-cyan-600 dark:text-cyan-400">{fm.formField}</code>
                </div>
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mt-0.5">
                  {fm.csvHeader && <span>CSV: {fm.csvHeader}</span>}
                  {fm.jsonKey && <span>JSON: {fm.jsonKey}</span>}
                  {fm.required && <span className="text-red-500">*</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}