'use client'

import React from 'react'
import { BarChart3, ChevronUp, ChevronDown } from 'lucide-react'
import { QualityAuditScore, generateAuditScores } from '@/components/premium/QualityAuditScore'
import type { PremiumCalculatorShellProps } from '@/components/premium/PremiumCalculatorShell'
import type { TierFeatures } from './types'

interface QualityAuditSectionProps {
  modeLevel: number
  tierFeatures: TierFeatures
  showAudit: boolean
  onToggleAudit: () => void
  calculator: PremiumCalculatorShellProps['calculator']
}

export function QualityAuditSection({ modeLevel, tierFeatures, showAudit, onToggleAudit, calculator }: QualityAuditSectionProps) {
  if (!(modeLevel >= 3 && tierFeatures.audit)) return null
  return (
    <div>
      <button
        onClick={onToggleAudit}
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#06b6d4] transition-colors"
      >
        <BarChart3 className="w-3.5 h-3.5" />
        {showAudit ? 'Hide' : 'Show'} AI Quality Audit
        {showAudit ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {showAudit && <QualityAuditScore categories={generateAuditScores(calculator, tierFeatures)} />}
    </div>
  )
}
