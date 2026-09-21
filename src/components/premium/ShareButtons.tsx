'use client'

import { useRef, useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Share2, MessageCircle, Users, Linkedin, Image, Mail } from 'lucide-react'

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
}

const ghostBtn =
  'min-h-[44px] px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors inline-flex items-center gap-1.5 border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'

const shareItems = [
  {
    labelKey: 'itemTwitter',
    icon: MessageCircle,
    getUrl: (url: string, title: string, _desc?: string, _locale?: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    labelKey: 'itemFacebook',
    icon: Users,
    getUrl: (url: string, _title: string, _desc?: string, _locale?: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    labelKey: 'itemLinkedIn',
    icon: Linkedin,
    getUrl: (url: string, _title: string, _desc?: string, _locale?: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    labelKey: 'itemPinterest',
    icon: Image,
    getUrl: (url: string, _title: string, desc?: string, _locale?: string) =>
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(desc || _title)}`,
  },
  {
    labelKey: 'itemEmail',
    icon: Mail,
    getUrl: (url: string, title: string, desc?: string, _locale?: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(desc || title + '\n' + url)}`,
  },
]

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const locale = useLocale()
  const t = useTranslations('calculatorUI')

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={ghostBtn}
        aria-label={t('premium.shareButtons.openOptions')}
        aria-expanded={open}
      >
        <Share2 className="w-3.5 h-3.5 shrink-0" />
        <span>{t('premium.shareButtons.share')}</span>
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 z-50 flex flex-col gap-1 min-w-[180px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 shadow-lg">
          {shareItems.map((item) => {
            const href = item.getUrl(url, title, description, locale)
            const itemLabel = t(`premium.shareButtons.${item.labelKey}`)
            return (
              <a
                key={item.labelKey}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={ghostBtn}
                aria-label={t('premium.shareButtons.shareOn', { label: itemLabel })}
              >
                <item.icon className="w-3.5 h-3.5 shrink-0" />
                {itemLabel}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}