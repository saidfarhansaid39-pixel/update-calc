'use client'

import { useRef, useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { FileText, Copy, Check } from 'lucide-react'

interface CitationGeneratorProps {
  title: string
  url: string
  accessDate?: string
  authorName?: string
}

const ghostBtn =
  'min-h-[44px] px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors inline-flex items-center gap-1.5 border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'

function formatDate(date: Date, locale: string): string {
  return date.toLocaleDateString(locale === 'zh-CN' ? 'zh-CN' : locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function CitationGenerator({
  title,
  url,
  accessDate,
  authorName = '',
}: CitationGeneratorProps) {
  const [open, setOpen] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const locale = useLocale()
  const t = useTranslations('calculatorUI')

  const date = accessDate || formatDate(new Date(), locale)
  const author = authorName || t('premium.citationGenerator.calculatTeam')
  const year = new Date().getFullYear()
  const path = url.replace(/^https?:\/\/[^/]+/, '')

  const citations = {
    apa: `${author}. (${year}). ${title}. Calculat. ${t('premium.citationGenerator.retrievedFrom', { date, url })}`,
    mla: `${author}. "${title}." Calculat, ${year}, ${url}. ${t('premium.citationGenerator.accessed', { date })}.`,
    chicago: `${author}. "${title}." Calculat. ${t('premium.citationGenerator.accessed', { date })}. https://www.calculat.online${path}.`,
  }

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

  const styles: Record<string, { labelKey: string; key: string; text: string }[]> = {
    apa: [{ labelKey: 'apa', key: 'apa', text: citations.apa }],
    mla: [{ labelKey: 'mla', key: 'mla', text: citations.mla }],
    chicago: [{ labelKey: 'chicago', key: 'chicago', text: citations.chicago }],
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={ghostBtn}
        aria-label={t('premium.citationGenerator.openOptions')}
        aria-expanded={open}
      >
        <FileText className="w-3.5 h-3.5 shrink-0" />
        <span>{t('premium.citationGenerator.cite')}</span>
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 z-50 min-w-[400px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 shadow-lg">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            {t('premium.citationGenerator.citeThis')}
          </p>
          <div className="space-y-3">
            {Object.entries(styles).map(([styleKey, items]) =>
              items.map((item) => {
                const itemLabel = t(`premium.citationGenerator.${item.labelKey}`)
                return (
                  <div key={item.key}>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      {itemLabel}
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2.5 text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-1">
                      {item.text}
                    </div>
                    <button
                      onClick={() => handleCopy(item.key, item.text)}
                      className="min-h-[44px] px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors inline-flex items-center gap-1.5 border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      aria-label={
                        copiedKey === item.key
                          ? t('premium.citationGenerator.citationCopied', { label: itemLabel })
                          : t('premium.citationGenerator.copyCitation', { label: itemLabel })
                      }
                    >
                      {copiedKey === item.key ? (
                        <Check className="w-3 h-3 shrink-0 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3 shrink-0" />
                      )}
                      {copiedKey === item.key ? t('premium.citationGenerator.copied') : t('premium.citationGenerator.copy')}
                    </button>
                  </div>
                )
              }),
            )}
          </div>
        </div>
      )}
    </div>
  )
}