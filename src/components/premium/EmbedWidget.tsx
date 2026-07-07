'use client'

import { useRef, useState, useEffect } from 'react'
import { Code2, Copy, Check } from 'lucide-react'

interface EmbedWidgetProps {
  slug: string
  title: string
  hubSlug: string
}

const ghostBtn =
  'min-h-[44px] px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors inline-flex items-center gap-1.5 border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'

export function EmbedWidget({ slug, title, hubSlug }: EmbedWidgetProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const embedCode = `<iframe src="https://www.jdcalc.com/${hubSlug}/${slug}" width="100%" height="600" frameborder="0" title="${title.replace(/"/g, '&quot;')}"></iframe>`

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* fallback */ }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={ghostBtn}
        aria-label="Open embed options"
        aria-expanded={open}
      >
        <Code2 className="w-3.5 h-3.5 shrink-0" />
        <span>Embed</span>
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 z-50 min-w-[340px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 shadow-lg">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            Embed this calculator
          </p>
          <pre className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-300 overflow-x-auto mb-3 font-mono whitespace-pre-wrap">
            <code>{embedCode}</code>
          </pre>
          <button
            onClick={handleCopy}
            className="min-h-[44px] px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors inline-flex items-center gap-1.5 border-primary bg-primary text-white hover:bg-primary/90"
            aria-label={copied ? 'Embed code copied' : 'Copy embed code'}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <Copy className="w-3.5 h-3.5 shrink-0" />
            )}
            {copied ? 'Copied' : 'Copy code'}
          </button>
        </div>
      )}
    </div>
  )
}
