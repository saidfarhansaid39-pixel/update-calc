'use client'

import React, { useState } from 'react'
import { Code, Copy, Check, ExternalLink, Monitor, Smartphone } from 'lucide-react'

interface CalculatorWidgetProps {
  slug: string
  title: string
  category: string
}

export function CalculatorWidget({ slug, title, category }: CalculatorWidgetProps) {
  const [showEmbed, setShowEmbed] = useState(false)
  const [embedType, setEmbedType] = useState<'iframe' | 'script'>('iframe')
  const [width, setWidth] = useState(400)
  const [height, setHeight] = useState(480)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [copied, setCopied] = useState(false)
  const baseUrl = 'https://www.jdcalc.com'

  const iframeCode = `<iframe src="${baseUrl}/api/widget/${slug}" width="${width}" height="${height}" frameborder="0" scrolling="no" title="${title}"></iframe>`

  const scriptCode = `<script src="${baseUrl}/api/widget/${slug}/embed.js" data-calculator="${slug}" data-theme="${theme}" async></script>`

  const handleCopy = async () => {
    const code = embedType === 'iframe' ? iframeCode : scriptCode
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { }
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setShowEmbed(!showEmbed)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Code className="w-4 h-4 text-[#06b6d4]" />
          Embed this calculator
        </span>
        {showEmbed ? '-' : '+'}
      </button>

      {showEmbed && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Add this calculator to your website with a simple embed code.
          </p>

          {/* Preview */}
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center" style={{ minHeight: 80 }}>
            <div className="text-center">
              <Monitor className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-1" />
              <p className="text-[10px] text-gray-400">{title} widget preview</p>
              <p className="text-[10px] text-gray-400">{width}×{height} · {theme} theme</p>
            </div>
          </div>

          {/* Customization */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400">Width (px)</label>
              <input
                type="number" value={width} min={200} max={1200} step={10}
                onChange={e => setWidth(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              />
            </div>
            <div>
              <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400">Height (px)</label>
              <input
                type="number" value={height} min={300} max={1200} step={10}
                onChange={e => setHeight(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              />
            </div>
            <div>
              <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400">Theme</label>
              <select
                value={theme} onChange={e => setTheme(e.target.value as 'light' | 'dark')}
                className="w-full px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>

          {/* Embed type toggle */}
          <div className="flex gap-1">
            <button
              onClick={() => setEmbedType('iframe')}
              className={`px-3 py-1 text-[10px] font-medium rounded-md transition-colors ${embedType === 'iframe' ? 'bg-[#1a3a8a] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
            >
              iframe
            </button>
            <button
              onClick={() => setEmbedType('script')}
              className={`px-3 py-1 text-[10px] font-medium rounded-md transition-colors ${embedType === 'script' ? 'bg-[#1a3a8a] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
            >
              Script Tag
            </button>
          </div>

          {/* Code display */}
          <div className="relative">
            <pre className="p-3 bg-gray-900 text-gray-100 rounded-lg text-[10px] overflow-x-auto leading-relaxed max-h-24 overflow-y-auto">
              {embedType === 'iframe' ? iframeCode : scriptCode}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
              title="Copy code"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          {copied && <p className="text-[10px] text-green-500 text-center">Copied to clipboard!</p>}

          <a
            href={`${baseUrl}/api/widget/${slug}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] text-[#06b6d4] hover:underline"
          >
            <ExternalLink className="w-3 h-3" /> Advanced embed options
          </a>
        </div>
      )}
    </div>
  )
}
