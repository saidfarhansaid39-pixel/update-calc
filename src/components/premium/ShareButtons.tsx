'use client'

import { useRef, useState, useEffect } from 'react'
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
    label: 'Twitter / X',
    icon: MessageCircle,
    getUrl: (url: string, title: string, _desc?: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    label: 'Facebook',
    icon: Users,
    getUrl: (url: string, _title: string, _desc?: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    label: 'LinkedIn',
    icon: Linkedin,
    getUrl: (url: string, _title: string, _desc?: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    label: 'Pinterest',
    icon: Image,
    getUrl: (url: string, _title: string, desc?: string) =>
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(desc || _title)}`,
  },
  {
    label: 'Email',
    icon: Mail,
    getUrl: (url: string, title: string, desc?: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(desc || title + '\n' + url)}`,
  },
]

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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
        aria-label="Open share options"
        aria-expanded={open}
      >
        <Share2 className="w-3.5 h-3.5 shrink-0" />
        <span>Share</span>
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 z-50 flex flex-col gap-1 min-w-[180px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 shadow-lg">
          {shareItems.map((item) => {
            const href = item.getUrl(url, title, description)
            return (
              <a
                key={item.label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={ghostBtn}
                aria-label={`Share on ${item.label}`}
              >
                <item.icon className="w-3.5 h-3.5 shrink-0" />
                {item.label}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
