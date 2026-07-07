'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

export interface UseAutoSaveOptions {
  slug: string
  debounceMs?: number
  enabled?: boolean
}

export interface UseAutoSaveReturn {
  saved: boolean
  hasSavedData: boolean
  save: (values: Record<string, string>) => void
  restore: () => Record<string, string> | null
  clear: () => void
  lastSaved: number | null
}

function getStorageKey(slug: string): string {
  return `calc_autosave_${slug}`
}

export function useAutoSave({ slug, debounceMs = 800, enabled = true }: UseAutoSaveOptions): UseAutoSaveReturn {
  const [saved, setSaved] = useState(false)
  const [lastSaved, setLastSaved] = useState<number | null>(null)
  const [hasSavedData, setHasSavedData] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const key = getStorageKey(slug)
    setHasSavedData(localStorage.getItem(key) !== null)
  }, [slug])

  const save = useCallback((values: Record<string, string>) => {
    if (!enabled) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      try {
        const key = getStorageKey(slug)
        localStorage.setItem(key, JSON.stringify({ values, timestamp: Date.now() }))
        setSaved(true)
        setLastSaved(Date.now())
        setHasSavedData(true)
        setTimeout(() => setSaved(false), 2000)
      } catch { }
    }, debounceMs)
  }, [slug, debounceMs, enabled])

  const restore = useCallback((): Record<string, string> | null => {
    if (typeof window === 'undefined') return null
    try {
      const key = getStorageKey(slug)
      const raw = localStorage.getItem(key)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      return parsed.values ?? null
    } catch {
      return null
    }
  }, [slug])

  const clear = useCallback(() => {
    try {
      const key = getStorageKey(slug)
      localStorage.removeItem(key)
      setHasSavedData(false)
      setLastSaved(null)
    } catch { }
  }, [slug])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return { saved, hasSavedData, save, restore, clear, lastSaved }
}
