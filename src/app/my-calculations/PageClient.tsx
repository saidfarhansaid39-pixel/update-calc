'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from '@/lib/navigation'
import { Link } from '@/lib/navigation'
import { calculatorRegistry } from '@calcuniverse/calculator-registry'

interface SavedCalculation {
  id: string
  calculatorSlug: string
  inputs: string
  result: string
  createdAt: string
}

function entryFor(slug: string) {
  return calculatorRegistry.find((c) => c.slug === slug) ?? null
}

export default function MyCalculationsPage() {
  const router = useRouter()
  const [items, setItems] = useState<SavedCalculation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const me = await fetch('/api/auth/me', { cache: 'no-store' })
      if (!me.ok) {
        router.replace('/login')
        return
      }
      const res = await fetch('/api/saved-calculations', { cache: 'no-store' })
      if (!res.ok) {
        setError('Failed to load your saved calculations.')
        return
      }
      const data = await res.json()
      setItems(data.items || [])
    } catch {
      setError('Failed to load your saved calculations.')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    load()
  }, [load])

  const handleDelete = useCallback(async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/saved-calculations/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id))
      }
    } finally {
      setDeletingId(null)
    }
  }, [])

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Calculations</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Calculations you've saved across Calculat.
      </p>

      {loading && <p className="mt-8 text-sm text-gray-500">Loading…</p>}

      {error && (
        <div className="mt-8 rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="mt-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-sm text-gray-500 dark:text-gray-400">
          You haven't saved any calculations yet. Use the <span className="font-medium text-gray-700 dark:text-gray-200">Save</span> button on any calculator to keep your results here.
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <ul className="mt-8 space-y-3">
          {items.map((item) => {
            let inputSummary = ''
            try {
              const parsed = JSON.parse(item.inputs) as Record<string, string>
              inputSummary = Object.entries(parsed)
                .filter(([, v]) => v !== '' && v != null)
                .slice(0, 4)
                .map(([k, v]) => `${k}: ${v}`)
                .join(' · ')
            } catch {
              inputSummary = ''
            }
            return (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm"
              >
                <div className="min-w-0">
                  <Link
                    href={entryFor(item.calculatorSlug) ? `/${entryFor(item.calculatorSlug)!.hubSlug}/${entryFor(item.calculatorSlug)!.slug}` : '#'}
                    className="block truncate text-sm font-semibold text-gray-900 dark:text-white hover:text-[#06b6d4] transition-colors"
                  >
                    {entryFor(item.calculatorSlug)?.title ?? item.calculatorSlug}
                  </Link>
                  {inputSummary && (
                    <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">{inputSummary}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="shrink-0 inline-flex min-h-[44px] items-center rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-60"
                >
                  {deletingId === item.id ? 'Deleting…' : 'Delete'}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
