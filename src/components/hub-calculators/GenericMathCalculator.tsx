'use client'
import { memoizedCompute } from '@/lib/calc-executor'

import React, { useMemo, useState, useCallback } from 'react'
import { useForm, FormProvider, useWatch } from 'react-hook-form'
import { PremiumCalculatorShell } from '@/components/premium/PremiumCalculatorShell.dynamic'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalculatorFormField } from '@/components/forms/CalculatorFormField'
import { ModeFieldGroup } from '@/components/premium/ModeFieldGroup'
import { useTranslations } from 'next-intl'
import type { CalculatorEntry } from '@calcuniverse/calculator-registry'
import { DynamicMathPieChart } from '@/components/premium/DynamicCharts'
import { buildGenericDef } from '@/lib/generic-fallback'
import { formatWithExtras, applyRoundingMode } from '@/lib/format-with-extras'

const n = (v: string) => parseFloat(v) || 0
const ni = (v: string) => parseInt(v, 10) || 0

const fact = (x: number): number => x <= 1 ? 1 : x * fact(x - 1)

const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b)

function step(label: string, value: string): { label: string; value: string } {
  return { label, value }
}

type FieldMode = 'basic' | 'advanced' | 'professional' | 'expert'

interface FieldDef {
  name: string; label: string; type: 'number' | 'select' | 'text'
  options?: { label: string; value: string }[]; unit?: string; min?: number; max?: number; step?: string; placeholder?: string; mode?: 'basic' | 'advanced' | 'professional' | 'expert'
}

interface CalcResult {
  result: number | string
  label: string
  unit?: string
  steps?: { label: string; value: string }[]
  extras?: { label: string; value: string | number }[]
}
import { calcDefs } from './math'
import type { CalcDef } from '@/lib/generic-fallback'

export default function GenericMathCalculator({ calculator }: { calculator: CalculatorEntry }) {
  const calcDef = useMemo(() => calcDefs[calculator.slug] || (buildGenericDef(calculator) as unknown as CalcDef), [calculator.slug, calculator]);
  const [lockedFields, setLockedFields] = useState<Set<string>>(new Set());
  const [extraFields, setExtraFields] = useState<Record<string, string>>({});

  const toggleLock = useCallback((name: string) => {
    setLockedFields(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const tf = useTranslations('calculatorUI')
  const tl = useCallback((key: string, fallback: string) => {
    try { return tf.has('formLabels.' + key) ? tf('formLabels.' + key) : fallback } catch { return fallback }
  }, [tf])

  const form = useForm({
    resolver: zodResolver(calcDef?.schema || z.object({})),
    defaultValues: calcDef?.defaults || {},
  });
  const { register, formState: { errors }, control } = form;

  const values = useWatch({ control });

  const computed = useMemo(() => {
    const hasValue = Object.values(values).some(v => v !== undefined && v !== '')
    if (!hasValue) return null
    const res = memoizedCompute(calcDef)(values as Record<string, string>)
    return res as CalcResult
  }, [values, calcDef])

  const renderField = (field: FieldDef) =>
    field.type === 'select' && field.options ? (
      <div key={field.name}>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{tl(field.name, field.label)}</label>
        <select {...register(field.name)} className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
          {field.options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        {errors[field.name] && <p className="text-xs text-red-500 mt-1">{errors[field.name]?.message as string}</p>}
      </div>
    ) : (
      <CalculatorFormField key={field.name} name={field.name} label={field.label} type={field.type === 'number' ? 'number' : 'text'} min={field.min} max={field.max} step={field.step?.toString()} placeholder={field.placeholder} locked={lockedFields.has(field.name)} onLockToggle={toggleLock} />
    )

  const basicFields = calcDef.fields.filter(f => !f.mode || f.mode === 'basic')
  const advancedFields = calcDef.fields.filter(f => f.mode === 'advanced')
  const professionalFields = calcDef.fields.filter(f => f.mode === 'professional')
  const expertFields = calcDef.fields.filter(f => f.mode === 'expert')

  const formContent = useMemo(() => (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {basicFields.map(renderField)}
      </div>
      {advancedFields.length > 0 && (
        <ModeFieldGroup minMode="advanced" label="Advanced Options">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {advancedFields.map(renderField)}
          </div>
        </ModeFieldGroup>
      )}
      {professionalFields.length > 0 && (
        <ModeFieldGroup minMode="professional" label="Professional Options">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {professionalFields.map(renderField)}
          </div>
        </ModeFieldGroup>
      )}
      {expertFields.length > 0 && (
        <ModeFieldGroup minMode="expert" label="Expert Options">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {expertFields.map(renderField)}
          </div>
        </ModeFieldGroup>
      )}

    {calcDef.presets && calcDef.presets.length > 0 && (
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-slate-500 self-center">Presets:</span>
        {calcDef.presets.map((preset, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              Object.entries(preset.values).forEach(([key, val]) => form.setValue(key as any, val))
            }}
            className="rounded-md border border-slate-200 px-3 py-1 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            {preset.label}
          </button>
        ))}
      </div>
    )}
  </>
), [calcDef, register, errors, lockedFields, toggleLock, form])

function getMathInterpretation(slug: string, val?: number | string, unit?: string): React.ReactNode {
  const nval = typeof val === 'number' ? val : parseFloat(String(val ?? ''))
  if (isNaN(nval)) return null
  if (slug.includes('area') || slug.includes('surface-area')) {
    return <div className="text-xs text-blue-600 font-medium mt-1">{nval.toFixed(4)} {unit} — The result represents the total area enclosed within the shape.</div>
  }
  if (slug.includes('volume') || slug.includes('capacity')) {
    return <div className="text-xs text-blue-600 font-medium mt-1">{nval.toFixed(4)} {unit} — The space occupied by the 3D shape.</div>
  }
  if (slug.includes('pythagorean') || slug.includes('hypotenuse')) {
    return <div className="text-xs text-emerald-600 font-medium mt-1">{nval.toFixed(4)} {unit} — a² + b² = c². The hypotenuse is the longest side of a right triangle.</div>
  }
  if (slug.includes('slope')) {
    return <div className="text-xs text-blue-600 font-medium mt-1">Slope: {nval.toFixed(4)} — {nval > 0 ? 'Positive (rising)' : nval < 0 ? 'Negative (falling)' : 'Zero (horizontal)'} line.</div>
  }
  if (slug.includes('quadratic') || slug.includes('discriminant')) {
    return <div className={`text-xs font-medium mt-1 ${nval > 0 ? 'text-emerald-600' : nval === 0 ? 'text-amber-600' : 'text-red-600'}`}>Δ = {nval.toFixed(4)} — {nval > 0 ? 'Two distinct real roots' : nval === 0 ? 'One real (double) root' : 'Complex roots'}.</div>
  }
  if (slug.includes('standard-deviation') || slug.includes('std-dev')) {
    return <div className="text-xs text-blue-600 font-medium mt-1">σ = {nval.toFixed(4)} — About 68% of data falls within ±1σ, 95% within ±2σ.</div>
  }
  if (slug.includes('mean') || slug.includes('average')) {
    return <div className="text-xs text-blue-600 font-medium mt-1">Mean: {nval.toFixed(4)} — The sum of all values divided by the count.</div>
  }
  if (slug.includes('median')) {
    return <div className="text-xs text-blue-600 font-medium mt-1">Median: {nval.toFixed(4)} — The middle value when data is sorted.</div>
  }
  if (slug.includes('correlation') || slug.includes('r-squared')) {
    const abs = Math.abs(nval)
    return <div className={`text-xs font-medium mt-1 ${abs >= 0.7 ? 'text-emerald-600' : abs >= 0.4 ? 'text-blue-600' : 'text-amber-600'}`}>r = {nval.toFixed(4)} — {abs >= 0.7 ? 'Strong' : abs >= 0.4 ? 'Moderate' : 'Weak'} relationship.</div>
  }
  if (slug.includes('percentage') || slug.includes('percent')) {
    return <div className="text-xs text-blue-600 font-medium mt-1">{nval.toFixed(2)}% — Value expressed as a percentage.</div>
  }
  if (slug.includes('ratio')) {
    return <div className="text-xs text-blue-600 font-medium mt-1">{nval.toFixed(4)} — A ratio comparing two quantities.</div>
  }
  if (slug.includes('fraction') || slug.includes('simplify')) {
    return <div className="text-xs text-emerald-600 font-medium mt-1">Simplified to lowest terms.</div>
  }
  if (slug.includes('trig') || slug.includes('sin') || slug.includes('cos') || slug.includes('tan')) {
    return <div className="text-xs text-blue-600 font-medium mt-1">{nval.toFixed(6)} — Trigonometric value in the range [-1, 1] for sine/cosine.</div>
  }
  if (slug.includes('log') || slug.includes('logarithm')) {
    return <div className="text-xs text-blue-600 font-medium mt-1">log = {nval.toFixed(6)} — The exponent to which the base must be raised.</div>
  }
  if (slug.includes('factorial')) {
    return <div className="text-xs text-amber-600 font-medium mt-1">{nval.toLocaleString()} — n! = n × (n-1) × ... × 1. Grows extremely fast.</div>
  }
  if (slug.includes('prime')) {
    return <div className="text-xs text-emerald-600 font-medium mt-1">A prime number is divisible only by 1 and itself.</div>
  }
  if (slug.includes('probability') || slug.includes('permutation') || slug.includes('combination')) {
    return <div className="text-xs text-blue-600 font-medium mt-1">{nval.toLocaleString()} — Number of possible arrangements/combinations.</div>
  }
  if (slug.includes('angle') || slug.includes('degree') || slug.includes('radian')) {
    return <div className="text-xs text-blue-600 font-medium mt-1">{nval.toFixed(4)} {unit} — Angle measurement.</div>
  }
  if (slug.includes('distance') || slug.includes('midpoint')) {
    return <div className="text-xs text-blue-600 font-medium mt-1">{nval.toFixed(4)} {unit} — The distance between two points in coordinate space.</div>
  }
  if (slug.includes('matrix') || slug.includes('determinant')) {
    return <div className="text-xs text-blue-600 font-medium mt-1">{nval.toFixed(4)} — {nval !== 0 ? 'Matrix is invertible (det ≠ 0)' : 'Matrix is singular (det = 0)'}.</div>
  }
  return null
}

const result = useMemo(() => {
  if (!computed) return null
  const fmt = (v: number | string) => {
    const num = typeof v === 'number' ? v : parseFloat(v as string)
    if (!isNaN(num)) {
      const mode = extraFields.extra_rounding_mode
      const rounded = applyRoundingMode(num, mode)
      return formatWithExtras(rounded, extraFields)
    }
    return String(v)
  }
  return (
    <div className="space-y-4">
      <div className="text-2xl font-bold text-slate-900 dark:text-white">
        {computed.label}: {fmt(computed.result)}{computed.unit ? ' ' + computed.unit : ''}
      </div>
      {getMathInterpretation(calculator.slug, computed.result, computed.unit)}
      {computed.steps && computed.steps.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Steps</h3>
          {computed.steps.map((s, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <span className="font-medium text-slate-500">{s.label}:</span>
              <span className="text-slate-700 dark:text-slate-300">{fmt(s.value)}</span>
            </div>
          ))}
        </div>
      )}
      {computed.extras && computed.extras.length > 0 && (
        <div className="space-y-2">
          {computed.extras.map((e, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <span className="font-medium text-slate-500">{e.label}:</span>
              <span className="text-slate-700 dark:text-slate-300">{e.value}</span>
            </div>
          ))}
        </div>
      )}
      {calcDef.interpretation && (
        <p className="text-sm text-slate-500 italic">{calcDef.interpretation}</p>
      )}
    </div>
  )
}, [computed, calcDef, extraFields])

const mainValue = useMemo(() => {
  if (!computed) return undefined
  const v = computed.result
  if (typeof v === 'number') return v
  const parsed = parseFloat(v as string)
  return isNaN(parsed) ? undefined : parsed
}, [computed])

const saveScenario = useCallback(() => {
  return Object.entries(values).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n')
}, [values])

const exportCSV = useCallback(() => {
  const header = 'Field,Value\n'
  const rows = Object.entries(values).filter(([, v]) => v).map(([k, v]) => `${k},${v}`).join('\n')
  return `${header}${rows}`
}, [values])

const watchedInputs = useMemo(() => {
  return Object.fromEntries(Object.entries(values).filter(([, v]) => v !== undefined && v !== ''))
}, [values])

const applyPreset = useCallback((preset: { values: Record<string, string> }) => {
  for (const [key, val] of Object.entries(preset.values)) {
    if (!lockedFields.has(key)) form.setValue(key as any, val)
  }
}, [form, lockedFields])

const copyResultText = useMemo(() => {
  const lines: string[] = [calculator.title]
  Object.entries(values).filter(([, val]) => val).forEach(([k, val]) => lines.push(`${k}: ${val}`))
  return lines.join('\n')
}, [calculator.title, values])

const mathChartData = useMemo(() => {
  if (!computed?.steps || !Array.isArray(computed.steps)) return []
  return computed.steps
    .filter((s: any) => s && s.label && (!isNaN(parseFloat(s.value)) || !isNaN(parseFloat(String(s.value)))))
    .slice(0, 6)
    .map((s: any) => ({
      name: s.label.length > 15 ? s.label.substring(0, 15) + '…' : s.label,
      value: parseFloat(String(s.value)) || 0,
    }))
}, [computed])

return (
  <FormProvider {...form}>
    <PremiumCalculatorShell
      calculator={calculator}
      form={formContent}
      result={result}
      charts={mathChartData.length > 0 ? <DynamicMathPieChart data={mathChartData} /> : undefined}
      lockedFields={lockedFields}
      onExtraFieldsChange={setExtraFields}
      presets={calcDef.presets || []}
      onPresetApply={applyPreset}
      onSaveScenario={saveScenario}
      onExportCSV={exportCSV}
      formula={calcDef.formula}
      interpretation={calcDef.interpretation}
      onReset={() => {
  const locked = Object.fromEntries(Array.from(lockedFields).map(key => [key, form.getValues(key)]))
  form.reset(calcDef.defaults || {})
  Object.entries(locked).forEach(([key, value]) => {
    if (value !== undefined && value !== '') form.setValue(key as any, value as string)
  })
}}
      copyResultText={copyResultText}
      inputs={watchedInputs as Record<string, string>}
      showTabs={true}
      hubCategory="math"
      mainValue={mainValue}
    />
  </FormProvider>
)

}

export { GenericMathCalculator }
