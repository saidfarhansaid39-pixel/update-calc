'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, TrendingUp, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SubCalcResult {
  label: string
  value: string
  description?: string
  badge?: 'positive' | 'negative' | 'info'
}

interface SubCalcPanelProps {
  title: string
  icon?: React.ComponentType<{ className?: string }>
  results: SubCalcResult[]
  defaultOpen?: boolean
}

export function SubCalcPanel({ title, icon: Icon, results, defaultOpen = false }: SubCalcPanelProps) {
  const [open, setOpen] = useState(defaultOpen)

  if (results.length === 0) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-[#06b6d4]" />}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
          <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">{results.length}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 space-y-2">
              {results.map((r, i) => (
                <div key={i} className={cn(
                  'flex items-start gap-3 p-2.5 rounded-lg text-sm',
                  r.badge === 'positive' ? 'bg-green-50 dark:bg-green-900/10' :
                  r.badge === 'negative' ? 'bg-red-50 dark:bg-red-900/10' :
                  'bg-gray-50 dark:bg-gray-900'
                )}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-gray-400">{r.label}</span>
                      {r.badge === 'positive' && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">Good</span>}
                      {r.badge === 'negative' && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">Attention</span>}
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white mt-0.5">{r.value}</p>
                    {r.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-start gap-1">
                        <Info className="w-3 h-3 mt-0.5 shrink-0" />
                        {r.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function SubCalcGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {children}
    </div>
  )
}
