'use client'

import { useRef, useState, useEffect } from 'react'
import { FileText, Copy, Check } from 'lucide-react'

interface CitationGeneratorProps {
  title: string
  url: string
  accessDate?: string
  authorName?: string
}

const ghostBtn =
  'min-h-[44px] px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors inline-flex items-center gap-1.5 border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function buildCitations(title: string, url: string, author: string, accessDate: string) {
  const year = new Date().getFullYear()
  const path = url.replace(/^https?:\/\/[^/]+/, '')

  return {
    apa: `${author}. (${year}). ${title}. JDCALC.com. Retrieved ${accessDate}, from ${url}`,
    mla: `${author}. "${title}." JDCALC.com, ${year}, ${url}. Accessed ${accessDate}.`,
    chicago: `${author}. "${title}." JDCALC.com. Accessed ${accessDate}. https://www.jdcalc.com${path}.`,
  }
}

export function CitationGenerator({
  title,
  url,
  accessDate,
  authorName = 'JDCALC.com Team',
}: CitationGeneratorProps) {
  const [open, setOpen] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  const date = accessDate || formatDate(new Date())
  const citations = buildCitations(title, url, authorName, date)

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch { /* fallback */ }
  }

  const styles: Record<string, { label: string; key: string; text: string }[]> = {
    apa: [{ label: 'APA 7th Edition', key: 'apa', text: citations.apa }],
    mla: [{ label: 'MLA 9th Edition', key: 'mla', text: citations.mla }],
    chicago: [{ label: 'Chicago (17th ed.)', key: 'chicago', text: citations.chicago }],
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={ghostBtn}
        aria-label="Open citation options"
        aria-expanded={open}
      >
        <FileText className="w-3.5 h-3.5 shrink-0" />
        <span>Cite</span>
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 z-50 min-w-[400px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 shadow-lg">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            Cite this calculator
          </p>
          <div className="space-y-3">
            {Object.entries(styles).map(([styleKey, items]) =>
              items.map((item) => (
                <div key={item.key}>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {item.label}
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2.5 text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-1">
                    {item.text}
                  </div>
                  <button
                    onClick={() => handleCopy(item.key, item.text)}
                    className="min-h-[44px] px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors inline-flex items-center gap-1.5 border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label={
                      copiedKey === item.key
                        ? `${item.label} citation copied`
                        : `Copy ${item.label} citation`
                    }
                  >
                    {copiedKey === item.key ? (
                      <Check className="w-3 h-3 shrink-0 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3 shrink-0" />
                    )}
                    {copiedKey === item.key ? 'Copied' : 'Copy'}
                  </button>
                </div>
              )),
            )}
          </div>
        </div>
      )}
    </div>
  )
}
