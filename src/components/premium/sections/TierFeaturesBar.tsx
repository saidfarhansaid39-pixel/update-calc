'use client'

import React from 'react'
import { BarChart3, TrendingUp, BookOpen, RotateCcw, ThumbsUp, Zap, DollarSign, Heart, Calculator, HardHat, Gauge, Clock, Globe, Ruler, Activity, GraduationCap, Atom } from 'lucide-react'
import type { PremiumCalculatorShellProps } from '@/components/premium/PremiumCalculatorShell'
import type { TierFeatures } from './types'

const hubIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  financial: DollarSign,
  health: Heart,
  math: Calculator,
  construction: HardHat,
  engineering: Gauge,
  'date-time': Clock,
  everyday: Globe,
  conversion: Ruler,
  statistics: Activity,
  education: GraduationCap,
  physics: Atom,
  chemistry: Atom,
  food: Heart,
  biology: Atom,
  ecology: Activity,
  sports: TrendingUp,
}

interface TierFeaturesBarProps {
  calculator: PremiumCalculatorShellProps['calculator']
  tierFeatures: TierFeatures
  unitSystem?: PremiumCalculatorShellProps['unitSystem']
  userCount?: number
}

export function TierFeaturesBar({ calculator, tierFeatures, unitSystem, userCount }: TierFeaturesBarProps) {
  const tier = calculator.tier as 'tier1' | 'tier2' | 'tier3'
  const HubIcon = hubIcons[calculator.category] || Zap
  return (
    <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
      <span className={`px-2 py-0.5 rounded-full font-medium ${
        tier === 'tier3' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300' :
        tier === 'tier2' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' :
        'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
      }`}>
        {tier === 'tier3' ? 'Premium' : tier === 'tier2' ? 'Standard' : 'Essential'}
      </span>
      {tierFeatures.charts && <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> Charts</span>}
      {tierFeatures.comparison && <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Comparison</span>}
      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> Guide</span>
      {unitSystem && <span className="flex items-center gap-1"><RotateCcw className="w-3 h-3" /> {unitSystem}</span>}
      <HubIcon className="w-3 h-3 text-gray-300 dark:text-gray-600" />
      {userCount !== undefined && (
        <span className="flex items-center gap-1 text-gray-400">
          <ThumbsUp className="w-3 h-3" /> {userCount.toLocaleString()} users
        </span>
      )}
    </div>
  )
}
