'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { StarRating } from '@/components/rating/StarRating'

export function CalculatorRating() {
  const params = useParams()
  const slug = typeof params?.slug === 'string' ? params.slug : undefined

  if (!slug) return null

  return <StarRating calculatorSlug={slug} />
}
