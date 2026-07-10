'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, Table2, Download, Share2, Printer, Copy, Check, FileText, LineChart, PieChart, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  content: React.ReactNode
}

interface ResultTabsProps {
  mainResult: React.ReactNode
  charts?: React.ReactNode
  breakdown?: React.ReactNode
  schedule?: React.ReactNode
  inputs?: Record<string, string>
  slug?: string
}

export function ResultTabs({ mainResult, charts, breakdown, schedule, inputs, slug }: ResultTabsProps) {
  const [activeTab, setActiveTab] = useState('summary')
  const [copied, setCopied] = useState(false)

  const handleCopyResult = useCallback(() => {
    if (!inputs) return
    const text = Object.entries(inputs)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [inputs])

  const handleExportCSV = useCallback(() => {
    if (!inputs) return
    const header = 'Field,Value\n'
    const rows = Object.entries(inputs).filter(([, v]) => v).map(([k, v]) => `${k},${v}`).join('\n')
    const csv = `${header}${rows}`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slug || 'calculator'}-results.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [inputs, slug])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const handleShare = useCallback(async () => {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ url }); return } catch { }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { }
  }, [])

  const tabs: Tab[] = [
    { id: 'summary', label: 'Summary', icon: Info, content: mainResult },
    ...(charts ? [{ id: 'chart', label: 'Chart', icon: LineChart, content: charts }] : []),
    ...(breakdown ? [{ id: 'breakdown', label: 'Breakdown', icon: PieChart, content: breakdown }] : []),
    ...(schedule ? [{ id: 'schedule', label: 'Schedule', icon: Table2, content: schedule }] : []),
    {
      id: 'export', label: 'Export', icon: Download,
      content: (
        <div className="space-y-3 p-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Export Options</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-600 dark:text-gray-300">
              <FileText className="w-4 h-4" /> Download CSV
            </button>
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-600 dark:text-gray-300">
              <Printer className="w-4 h-4" /> Print
            </button>
            <button onClick={handleShare} className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-600 dark:text-gray-300">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />} {copied ? 'Copied Link' : 'Share Link'}
            </button>
            <button onClick={handleCopyResult} className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-600 dark:text-gray-300">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />} Copy Data
            </button>
          </div>
          {inputs && (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-500 mb-2">Current Input Values</p>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-xs font-mono text-gray-600 dark:text-gray-400 max-h-32 overflow-y-auto">
                {Object.entries(inputs).filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-0.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <span className="capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{v as string}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
  ]

  if (tabs.length <= 2 && !charts) {
    return <>{mainResult}</>
  }

  return (
    <div>
      <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors',
              activeTab === tab.id
                ? 'border-[#06b6d4] text-[#06b6d4]'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {tabs.find(t => t.id === activeTab)?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
