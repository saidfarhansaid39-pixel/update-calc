'use client'

import React from 'react'
import { CheckCircle, BookOpen, ExternalLink } from 'lucide-react'
import type { QualityInfo } from '@/lib/quality/calculator-quality'

interface ResultQualityBadgeProps {
  quality: QualityInfo
  result?: number
  resultLabel?: string
}

const accuracyColors: Record<string, string> = {
  high: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  medium: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
  standard: 'text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700',
}

const accuracyLabels: Record<string, string> = {
  high: 'High accuracy',
  medium: 'Estimated (±)',
  standard: 'Standard formula',
}

export function ResultQualityBadge({ quality }: ResultQualityBadgeProps) {
  const accuracyClass = accuracyColors[quality.accuracy] || accuracyColors.standard
  const accuracyLabel = accuracyLabels[quality.accuracy] || accuracyLabels.standard

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium border ${accuracyClass}`}>
        {quality.accuracy === 'high' ? (
          <CheckCircle className="w-3 h-3" />
        ) : (
          <BookOpen className="w-3 h-3" />
        )}
        {accuracyLabel}
      </div>
      {quality.sourceUrl && quality.referenceLabel && (
        <a
          href={quality.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium text-[#06b6d4] bg-[#1a3a8a]/5 dark:bg-[#1a3a8a]/10 border border-[#06b6d4]/20 hover:bg-[#1a3a8a]/10 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          {quality.referenceLabel} verified
        </a>
      )}
      {quality.formulaSource && (
        <span className="text-[10px] text-gray-400 dark:text-gray-500 truncate max-w-[200px]" title={quality.formulaSource}>
          {quality.formulaSource}
        </span>
      )}
    </div>
  )
}
