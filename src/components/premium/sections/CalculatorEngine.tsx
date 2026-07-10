'use client'

import React from 'react'
import { RefreshCw } from 'lucide-react'
import { CalculatorModeToggle, type CalcMode } from '@/components/premium/CalculatorModeToggle'
import { CalculatorModeProvider } from '@/lib/context/CalculatorModeContext'
import { InternationalizationPanel } from '@/components/premium/InternationalizationPanel'
import { ExportPanel } from '@/components/premium/ExportPanel'
import { ExtraFieldsProvider } from '@/lib/context/ExtraFieldsContext'
import { ExtraFieldInjector } from '@/components/premium/ExtraFieldInjector'
import { ResultTabs } from '@/components/premium/ResultTabs'
import { ResultQualityBadge } from '@/components/premium/ResultQualityBadge'
import { InputRangeValidator } from '@/components/premium/InputRangeValidator'
import { VisualPresetCards } from '@/components/premium/VisualPresetCards'
import { ActionToolbar } from '@/components/premium/ActionToolbar'
import { ScenarioComparison } from '@/components/premium/ScenarioComparison'
import { ShareButtons } from '@/components/premium/ShareButtons'
import { EmbedWidget } from '@/components/premium/EmbedWidget'
import { CitationGenerator } from '@/components/premium/CitationGenerator'
import { ExtraFieldAdjustments } from '@/components/premium/ExtraFieldAdjustments'
import { InputSection } from './InputSection'
import { ResultSection } from './ResultSection'
import { getExtraFieldsForCalculator } from '@/lib/extra-field-pools'
import { getQualityInfo, getInputRanges } from '@/lib/quality/calculator-quality'
import { useAutoSave } from '@/lib/hooks/useAutoSave'
import type { Currency, MeasurementSystem } from '@/lib/i18n/calculator-i18n'
import type { UnitSystem, Preset, Scenario, PremiumCalculatorShellProps } from '@/components/premium/PremiumCalculatorShell'
import type { TierFeatures } from './types'

const unitOptions: { value: UnitSystem; label: string }[] = [
  { value: 'metric', label: 'Metric' },
  { value: 'imperial', label: 'Imperial' },
  { value: 'us', label: 'US' },
]

interface CalculatorEngineProps {
  calculator: PremiumCalculatorShellProps['calculator']
  mode: CalcMode
  availableModes: CalcMode[]
  onModeChange: (m: CalcMode) => void
  tierFeatures: TierFeatures
  country: string
  currency: Currency
  measurement: MeasurementSystem
  onCountryChange: (c: string) => void
  onCurrencyChange: (c: Currency) => void
  onMeasurementChange: (s: MeasurementSystem) => void
  extraFieldValues: Record<string, string>
  onExtraFieldsChange: (v: Record<string, string>) => void
  form: React.ReactNode
  showTabs?: boolean
  modeLevel: number
  result: React.ReactNode
  charts?: React.ReactNode
  breakdown?: React.ReactNode
  schedule?: React.ReactNode
  inputs?: Record<string, string>
  steps?: { label: string; value: string }[]
  rangeVisualizer?: React.ReactNode
  showRestore: boolean
  autoSave: ReturnType<typeof useAutoSave>
  onRestoreValues?: (v: Record<string, string>) => void
  setRestoreDismissed: (v: boolean) => void
  setShowRestore: (v: boolean) => void
  mainValue?: number
  presets?: Preset[]
  onPresetApply?: (p: Preset) => void
  onReset?: () => void
  onUnitChange?: (u: UnitSystem) => void
  unitSystem?: UnitSystem
  onToggleSlider?: () => void
  useSlider?: boolean
  onExport: (format: string) => void
  onShare: () => void
  shareCopied: boolean
  onCopyResult?: () => void
  copyResultText?: string
  onSaveScenario: () => void
  showCSV: boolean
  showBatch: boolean
  onToggleBatch: () => void
  shareUrl: string
  extraActions?: React.ReactNode
  scenarios: Scenario[]
  onRemoveScenario: (id: string) => void
  scenarioLabel?: string
}

export function CalculatorEngine(props: CalculatorEngineProps) {
  const {
    calculator, mode, availableModes, onModeChange, tierFeatures,
    country, currency, measurement, onCountryChange, onCurrencyChange, onMeasurementChange,
    extraFieldValues, onExtraFieldsChange, form, showTabs, modeLevel, result,
    charts, breakdown, schedule, inputs, steps, rangeVisualizer, showRestore, autoSave,
    onRestoreValues, setRestoreDismissed, setShowRestore, mainValue, presets, onPresetApply,
    onReset, onUnitChange, unitSystem, onToggleSlider, useSlider, onExport,
    onShare, shareCopied, onCopyResult, copyResultText, onSaveScenario, showCSV,
    showBatch, onToggleBatch, shareUrl, extraActions, scenarios, onRemoveScenario, scenarioLabel,
  } = props

  return (
    <CalculatorModeProvider mode={mode}>
      <div id="calculator" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
        {/* Calculator Mode Toggle & Toolbar */}
        {tierFeatures.modes && (
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-y-2">
              <div className="flex items-center gap-3">
                <CalculatorModeToggle mode={mode} onChange={onModeChange} availableModes={availableModes} />
                <span className="hidden sm:inline text-xs text-gray-400 dark:text-gray-500">
                  {mode === 'basic' && 'Essential — just the result'}
                  {mode === 'advanced' && 'Formula, steps & interpretation'}
                  {mode === 'professional' && 'Charts, examples & deep explanations'}
                  {mode === 'expert' && 'Scenarios, batch & quality audit'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {tierFeatures.i18n && (
                  <InternationalizationPanel
                    country={country} currency={currency} measurement={measurement}
                    onCountryChange={onCountryChange} onCurrencyChange={onCurrencyChange}
                    onMeasurementChange={onMeasurementChange}
                  />
                )}
                <ExportPanel
                  slug={calculator.slug} title={calculator.title}
                  inputs={inputs} resultSummary={copyResultText} steps={steps}
                  resultValue={copyResultText} category={calculator.category}
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <InputSection
            calculator={calculator}
            form={form}
            extraFieldValues={extraFieldValues}
            onExtraFieldsChange={onExtraFieldsChange}
          />
          <ResultSection
            showTabs={showTabs}
            modeLevel={modeLevel}
            result={result}
            charts={charts}
            breakdown={breakdown}
            schedule={schedule}
            inputs={inputs}
            slug={calculator.slug}
            category={calculator.category}
          />
        </div>

        {/* Range Visualizer */}
        {rangeVisualizer && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
            {rangeVisualizer}
          </div>
        )}

        {/* Restore saved values banner */}
        {showRestore && onRestoreValues && (
          <div className="flex items-center justify-between gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <RefreshCw className="w-4 h-4 shrink-0" />
              <span>Restore your previous values?</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  const saved = autoSave.restore()
                  if (saved && onRestoreValues) { onRestoreValues(saved) }
                  setShowRestore(false)
                }}
                className="px-3 py-1.5 text-xs font-medium bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors min-h-[44px]"
              >
                Restore
              </button>
              <button
                onClick={() => { setRestoreDismissed(true); autoSave.clear() }}
                className="px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-800/30 rounded-lg transition-colors min-h-[44px]"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Extra Field Adjustments */}
        {Object.keys(extraFieldValues).length > 0 && mainValue !== undefined && (
          <ExtraFieldAdjustments
            hubSlug={calculator.hubSlug}
            mainValue={mainValue}
            extraFields={extraFieldValues}
          />
        )}

        {/* Presets */}
        {presets && presets.length > 0 && onPresetApply && (
          <div className="mt-4">
            <VisualPresetCards presets={presets} onApply={onPresetApply} />
          </div>
        )}

        {/* Tier action bar */}
        {(tierFeatures.export || tierFeatures.comparison || onUnitChange || extraActions || onReset || onToggleSlider) && (
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <ActionToolbar
              onReset={onReset}
              onUnitChange={onUnitChange as ((unit: string) => void) | undefined}
              unitOptions={unitOptions}
              unitSystem={unitSystem}
              onToggleSlider={onToggleSlider}
              useSlider={useSlider}
              onExport={onExport}
              onShare={onShare}
              shareCopied={shareCopied}
              onCopyResult={(copyResultText || inputs) ? onCopyResult : undefined}
              copyResultText="Copy Result"
                onSaveScenario={onSaveScenario}
              showCSV={showCSV}
              modeLevel={modeLevel}
              tierFeatures={tierFeatures}
              showBatch={showBatch}
              onToggleBatch={onToggleBatch}
              shareButtons={
                <ShareButtons url={shareUrl} title={calculator.title} description={calculator.description} />
              }
              embedWidget={
                <EmbedWidget slug={calculator.slug} title={calculator.title} hubSlug={calculator.hubSlug} />
              }
              citationGenerator={
                <CitationGenerator title={calculator.title} url={shareUrl} />
              }
              extraActions={extraActions}
            />
          </div>
        )}

        {/* Scenario comparison (Expert+) */}
        {modeLevel >= 3 && tierFeatures.comparison && (
          <ScenarioComparison
            scenarios={scenarios.map(s => ({
              ...s,
              inputs: Object.fromEntries(s.snapshot.split('\n').filter(Boolean).map(l => {
                const [k, ...v] = l.split(': ')
                return [k, v.join(': ')]
              })),
              mainValue: s.mainValue,
            }))}
            mainValueLabel={calculator.title}
            onRemove={onRemoveScenario}
            onApply={(vals) => {
              if (onRestoreValues) {
                onRestoreValues(vals)
              } else {
                for (const [key, val] of Object.entries(vals)) {
                  try { (document.querySelector(`[name="${key}"]`) as HTMLInputElement)?.focus() } catch {}
                }
              }
            }}
            onSave={onSaveScenario}
            scenarioLabel={scenarioLabel}
          />
        )}
      </div>
    </CalculatorModeProvider>
  )
}
