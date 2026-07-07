'use client'

import React from 'react'
import { Lightbulb, Target, Zap } from 'lucide-react'

interface Preset {
  label: string
  values: Record<string, string>
}

interface VisualPresetCardsProps {
  presets: Preset[]
  onApply: (preset: Preset) => void
}

const presetIcons = [Lightbulb, Target, Zap, Lightbulb, Target, Zap]

export function VisualPresetCards({ presets, onApply }: VisualPresetCardsProps) {
  if (!presets.length) return null

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Try an example scenario
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {presets.map((preset, i) => {
          const Icon = presetIcons[i % presetIcons.length]
          return (
            <button
              key={preset.label}
              onClick={() => onApply(preset)}
              className="group text-left p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#06b6d4] dark:hover:border-[#06b6d4] hover:shadow-md transition-all min-h-[44px]"
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 w-8 h-8 rounded-lg bg-[#1a3a8a]/10 dark:bg-[#1a3a8a]/20 flex items-center justify-center shrink-0 group-hover:bg-[#1a3a8a]/20 transition-colors">
                  <Icon className="w-4 h-4 text-[#06b6d4]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-[#06b6d4] transition-colors">
                    {preset.label}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">
                    {Object.entries(preset.values).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
