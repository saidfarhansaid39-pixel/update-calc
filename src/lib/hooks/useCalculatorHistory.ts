'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'

export interface HistoryEntry {
  id: string
  slug: string
  title: string
  inputs: Record<string, string>
  timestamp: number
}

const STORAGE_KEY = 'calc_history'
const MAX_ENTRIES = 200

function loadHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveHistory(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch { }
}

export function useCalculatorHistory(slug: string, title: string) {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [clearConfirm, setClearConfirm] = useState(false)

  useEffect(() => {
    setHistory(loadHistory())
  }, [])

  const addEntry = useCallback((inputs: Record<string, string>) => {
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      slug,
      title,
      inputs,
      timestamp: Date.now(),
    }
    setHistory(prev => {
      const filtered = prev.filter(e => e.slug !== slug || JSON.stringify(e.inputs) !== JSON.stringify(inputs))
      const next = [entry, ...filtered].slice(0, MAX_ENTRIES)
      saveHistory(next)
      return next
    })
  }, [slug, title])

  const removeEntry = useCallback((id: string) => {
    setHistory(prev => {
      const next = prev.filter(e => e.id !== id)
      saveHistory(next)
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    saveHistory([])
    setClearConfirm(false)
  }, [])

  const exportCSV = useCallback(() => {
    const headers = ['ID', 'Calculator', 'Slug', 'Timestamp', 'Date', 'Time', 'Inputs']
    const rows = history.map(e => [
      e.id,
      `"${e.title}"`,
      e.slug,
      e.timestamp,
      new Date(e.timestamp).toLocaleDateString(),
      new Date(e.timestamp).toLocaleTimeString(),
      `"${Object.entries(e.inputs).map(([k, v]) => `${k}: ${v}`).join('; ')}"`,
    ])
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  }, [history])

  const currentEntries = useMemo(() => {
    let filtered = history.filter(e => e.slug === slug)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(q) ||
        new Date(e.timestamp).toLocaleDateString().includes(q) ||
        Object.values(e.inputs).some(v => v.toLowerCase().includes(q))
      )
    }
    return filtered
  }, [history, slug, searchQuery])

  const calcStats = useMemo(() => {
    const byCalc: Record<string, { count: number; lastUsed: number; title: string }> = {}
    history.forEach(e => {
      if (!byCalc[e.slug]) byCalc[e.slug] = { count: 0, lastUsed: 0, title: e.title }
      byCalc[e.slug].count++
      if (e.timestamp > byCalc[e.slug].lastUsed) byCalc[e.slug].lastUsed = e.timestamp
    })
    return byCalc
  }, [history])

  return {
    history: currentEntries,
    allHistory: history,
    addEntry,
    removeEntry,
    clearHistory,
    showHistory,
    setShowHistory,
    exportCSV,
    searchQuery,
    setSearchQuery,
    clearConfirm,
    setClearConfirm,
    calcStats,
  }
}
