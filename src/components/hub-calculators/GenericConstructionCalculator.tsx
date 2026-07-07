'use client'

import React, { useMemo, useCallback, useState } from 'react'
import { useForm, FormProvider, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalculatorFormField } from '@/components/forms/CalculatorFormField'
import { renderCalcField } from '@/lib/calc-field-helper'
import { PremiumCalculatorShell } from '@/components/premium/PremiumCalculatorShell.dynamic'
import { ModeFieldGroup } from '@/components/premium/ModeFieldGroup'
import { DynamicComparisonPieChart } from '@/components/premium/DynamicCharts'
import { calcDefs } from '@/lib/constructionCalcDefs'
import { buildGenericDef } from '@/lib/generic-fallback'
import type { ModeLevel, FieldDef, ResultValue, CalcDef } from '@/lib/constructionCalcDefs/types'



interface Props {
  calculator: {
    slug: string; title: string; description: string; tier: string
    category: string; hubSlug: string; hubName: string; keywords: string[]
    dataDependent?: boolean; dataRefreshCadence?: string
  }
}

function FallbackConstruction({ calculator }: Props) {
  return (
    <div className="text-center py-12 px-4">
      <div className="text-4xl mb-4">🚧</div>
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">{calculator.title}</h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">{calculator.description}</p>
      <p className="text-sm text-gray-400 mt-4">This calculator is being developed. Browse other {calculator.hubName} in the menu.</p>
    </div>
  )
}

export function GenericConstructionCalculator({ calculator }: Props) {
  const calcDef = calcDefs[calculator.slug] || (buildGenericDef(calculator) as unknown as CalcDef)
  const [useSlider, setUseSlider] = useState(true)
  const [lockedFields, setLockedFields] = useState<Set<string>>(new Set())
  const [extraFields, setExtraFields] = useState<Record<string, string>>({})
  const toggleLock = useCallback((name: string) => {
    setLockedFields(prev => { const next = new Set(prev); if (next.has(name)) next.delete(name); else next.add(name); return next })
  }, [])

  const form = useForm({
    resolver: zodResolver(calcDef.schema),
    mode: 'onChange',
  })

  const watched = useWatch({ control: form.control })
  const v = watched as Record<string, string>
  const watchedInputs = useMemo(() => {
    const vals = (typeof watched === 'object' && watched !== null) ? watched as Record<string, string> : {}
    return Object.fromEntries(Object.entries(vals).filter(([, v]) => v !== undefined && v !== ''))
  }, [watched])

  const mainValue = useMemo(() => {
    if (!v || Object.keys(v).length === 0) return undefined
    const res = calcDef.compute(v)
    const parsed = typeof res.result === 'number' ? res.result : parseFloat(String(res.result))
    return isNaN(parsed) ? undefined : parsed
  }, [v, calcDef])

  const result = useMemo(() => {
    if (!v || Object.keys(v).length === 0) return null
    const res = calcDef.compute(v)
    const displayVal = typeof res.result === 'number' ? res.result.toFixed(2) : res.result
    return (
      <div className="text-center space-y-4">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">{res.label}</p>
          <p className="text-3xl font-bold text-[#06b6d4]">{displayVal} {res.unit}</p>
        </div>
        {res.steps && res.steps.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 text-xs text-gray-500 space-y-1.5">
            <p className="font-medium text-gray-700 dark:text-gray-300">Steps</p>
            {res.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[#1a3a8a]/10 text-[#06b6d4] flex items-center justify-center text-[10px] font-medium mt-0.5">{i + 1}</span>
                <span>{typeof step === 'string' ? step : `${step.label}: ${step.value}`}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }, [v, calcDef])

  const copyResultText = useMemo(() => {
    const lines: string[] = [calculator.title]
    Object.entries(v).filter(([, val]) => val).forEach(([k, val]) => lines.push(`${k}: ${val}`))
    return lines.join('\n')
  }, [calculator.title, v])

  const presets = calcDef?.presets || []
  const applyPreset = useCallback((preset: { label: string; values: Record<string, string> }) => {
    Object.entries(preset.values).forEach(([key, value]) => {
      if (!lockedFields.has(key)) form.setValue(key as any, value)
    })
  }, [form, lockedFields])

  const constructionChartData = useMemo(() => {
    if (!v || Object.keys(v).length === 0) return []
    try {
      const res = calcDef.compute(v)
      if (!res.steps || !Array.isArray(res.steps)) return []
      return res.steps
        .filter((s: any) => s && s.label && (!isNaN(parseFloat(s.value)) || !isNaN(parseFloat(String(s.value)))))
        .slice(0, 8)
        .map((s: any) => ({
          name: s.label.length > 15 ? s.label.substring(0, 15) + '…' : s.label,
          value: parseFloat(s.value) || parseFloat(String(s.value)) || 0,
        }))
    } catch { return [] }
  }, [v, calcDef])

  const formContent = useMemo(() => {
    const basicFields = calcDef.fields.filter(f => !f.mode || f.mode === 'basic')
    const advancedFields = calcDef.fields.filter(f => f.mode === 'advanced')
    const professionalFields = calcDef.fields.filter(f => f.mode === 'professional')
    const expertFields = calcDef.fields.filter(f => f.mode === 'expert')
    return (
      <>
        {basicFields.map(field => renderCalcField(field, useSlider, lockedFields, toggleLock))}
        {advancedFields.length > 0 && (
          <ModeFieldGroup key="advanced" minMode="advanced" label="Advanced Options">
            {advancedFields.map(field => renderCalcField(field, useSlider, lockedFields, toggleLock))}
          </ModeFieldGroup>
        )}
        {professionalFields.length > 0 && (
          <ModeFieldGroup key="professional" minMode="professional" label="Professional Options">
            {professionalFields.map(field => renderCalcField(field, useSlider, lockedFields, toggleLock))}
          </ModeFieldGroup>
        )}
        {expertFields.length > 0 && (
          <ModeFieldGroup key="expert" minMode="expert" label="Expert Options">
            {expertFields.map(field => renderCalcField(field, useSlider, lockedFields, toggleLock))}
          </ModeFieldGroup>
        )}
      </>
    )
  }, [calcDef, lockedFields, toggleLock, form, useSlider])

  return (
    <FormProvider {...form}>
      <PremiumCalculatorShell
        calculator={calculator}
        form={formContent}
        result={result}
        charts={constructionChartData.length > 0 ? <DynamicComparisonPieChart data={constructionChartData} /> : undefined}
        lockedFields={lockedFields}
        onExtraFieldsChange={setExtraFields}
        formula={calcDef.formula}
        interpretation={calcDef.interpretation}
        presets={presets}
        onPresetApply={applyPreset}
        onReset={() => {
          const locked = Object.fromEntries(
            Array.from(lockedFields).map(key => [key, form.getValues(key)])
          )
          form.reset()
          Object.entries(locked).forEach(([key, value]) => {
            if (value !== undefined && value !== '') form.setValue(key as any, value)
          })
        }}
        copyResultText={copyResultText}
        inputs={watchedInputs}
        showTabs={true}
        useSlider={useSlider}
        onToggleSlider={() => setUseSlider(!useSlider)}
        hubCategory="construction"
        mainValue={mainValue}
        onSaveScenario={() => Object.entries(v).filter(([, val]) => val).map(([k, val]) => `${k}: ${val}`).join('\n')}
        onExportCSV={() => Object.entries(v).filter(([, val]) => val).map(([k, val]) => `${k},${val}`).join('\n')}
        userCount={4832}
      />
    </FormProvider>
  )
}
