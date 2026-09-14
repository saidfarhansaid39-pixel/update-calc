'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Star } from 'lucide-react'

const STORAGE_PREFIX = 'calculat_rating_'

function getAllRatings(slug: string): number[] {
  try {
    const all: number[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(STORAGE_PREFIX + slug + '_')) {
        const val = parseFloat(localStorage.getItem(key) || '')
        if (!isNaN(val) && val >= 1 && val <= 5) all.push(val)
      }
    }
    return all
  } catch {
    return []
  }
}

interface StarRatingProps {
  calculatorSlug: string
}

export function StarRating({ calculatorSlug }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const [userRating, setUserRating] = useState(0)
  const [allRatings, setAllRatings] = useState<number[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_PREFIX + calculatorSlug)
    if (stored) {
      const val = parseFloat(stored)
      if (!isNaN(val) && val >= 1 && val <= 5) setUserRating(val)
    }
    setAllRatings(getAllRatings(calculatorSlug))
  }, [calculatorSlug])

  const handleRate = useCallback((rating: number) => {
    setUserRating(rating)
    try {
      localStorage.setItem(STORAGE_PREFIX + calculatorSlug, rating.toString())
      localStorage.setItem(STORAGE_PREFIX + calculatorSlug + '_' + Date.now(), rating.toString())
    } catch {}
    setAllRatings(getAllRatings(calculatorSlug))
    fetch('/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: calculatorSlug, rating, timestamp: Date.now() }),
    }).catch(() => {})
  }, [calculatorSlug])

  const avgRating = allRatings.length > 0
    ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length
    : 0

  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (hovered || userRating)
          return (
            <button
              key={star}
              type="button"
              onClick={() => handleRate(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4] rounded-sm"
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              <Star
                className={`w-5 h-5 ${
                  filled
                    ? 'fill-[#1a3a8a] text-[#1a3a8a]'
                    : 'fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600'
                }`}
              />
            </button>
          )
        })}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {allRatings.length > 0
          ? `${avgRating.toFixed(1)}/5 (${allRatings.length} rating${allRatings.length !== 1 ? 's' : ''})`
          : 'No ratings yet'}
      </p>
    </div>
  )
}
