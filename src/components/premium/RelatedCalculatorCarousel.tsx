'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { Link } from '@/lib/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { CalculatorEntry } from '@calcuniverse/calculator-registry'
import { useLocale } from 'next-intl'
import { getLocalizedCalculator } from '@/lib/localized-registry'

export interface RelatedCalculatorCarouselProps {
  calculators: CalculatorEntry[]
  hubPath: string
  title?: string
}

export function RelatedCalculatorCarousel({ calculators, hubPath, title }: RelatedCalculatorCarouselProps) {
  const locale = useLocale()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, scrollLeft: 0 })
  const [localizedMap, setLocalizedMap] = useState<Map<string, CalculatorEntry>>(new Map())

  useEffect(() => {
    (async () => {
      const map = new Map<string, CalculatorEntry>()
      await Promise.all(calculators.map(async (calc) => {
        const localized = await getLocalizedCalculator(calc.slug, locale)
        if (localized) map.set(calc.slug, localized)
      }))
      setLocalizedMap(map)
    })()
  }, [calculators, locale])

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    const resizeObserver = new ResizeObserver(updateScrollState)
    resizeObserver.observe(el)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      resizeObserver.disconnect()
    }
  }, [updateScrollState])

  const scroll = useCallback((dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.6
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current
    if (!el) return
    setIsDragging(true)
    dragStart.current = { x: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft }
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    const el = scrollRef.current
    if (!el) return
    e.preventDefault()
    const x = e.pageX - el.offsetLeft
    const walk = (x - dragStart.current.x) * 1.5
    el.scrollLeft = dragStart.current.scrollLeft - walk
  }, [isDragging])

  if (!calculators.length) return null

  return (
    <div className="relative">
      {title && (
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>
      )}
      <div className="relative group">
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 min-h-[44px] min-w-[44px] flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-md hover:shadow-lg transition-shadow opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Scroll related calculators left"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        )}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2 -mx-1 px-1 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {calculators.map((calc) => {
            const localized = localizedMap.get(calc.slug) ?? calc
            return (
            <Link
              key={calc.slug}
              href={`/${hubPath}/${calc.slug}`}
              className="flex-shrink-0 w-52 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#06b6d4] dark:hover:border-[#06b6d4] transition-all hover:shadow-md group/card"
            >
              <p className="text-sm font-medium text-gray-900 dark:text-white group-hover/card:text-[#06b6d4] transition-colors line-clamp-1">
                {localized.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                {localized.description}
              </p>
              <span className="inline-block mt-2 text-[10px] font-medium text-[#06b6d4] opacity-0 group-hover/card:opacity-100 transition-opacity">
                Calculate now →
              </span>
            </Link>
            )
          })}
        </div>
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 min-h-[44px] min-w-[44px] flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-md hover:shadow-lg transition-shadow opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Scroll related calculators right"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        )}
      </div>
    </div>
  )
}
