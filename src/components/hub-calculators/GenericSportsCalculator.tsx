'use client'

import React, { useMemo, useCallback, useState } from 'react'
import { useForm, FormProvider, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalculatorFormField } from '@/components/forms/CalculatorFormField'
import { FieldsByMode } from '@/lib/calc-field-helper'
import { PremiumCalculatorShell } from '@/components/premium/PremiumCalculatorShell.dynamic'
import { DynamicHealthBarChart } from '@/components/premium/DynamicCharts'
import { buildGenericDef } from '@/lib/generic-fallback'
import type { UnitSystem } from '@/components/premium/PremiumCalculatorShell'
import type { CalculatorEntry } from '@calcuniverse/calculator-registry'

const paceSchema = z.object({
  distance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  hours: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
  minutes: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= 59 }, '0-59'),
  seconds: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= 59 }, '0-59'),
})

const paceSchemaDistOnly = z.object({
  distance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  hours: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
  minutes: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= 59 }, '0-59'),
})

const caloriesSchema = z.object({
  weight: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  duration: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  met: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
})

const caloriesDistanceSchema = z.object({
  weight: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  distance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  met: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
})

const heartRateSchema = z.object({
  age: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 1 && n <= 120 }, '1-120'),
  restingHR: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0'),
})

const targetHrSchema = z.object({
  age: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 1 && n <= 120 }, '1-120'),
  restingHR: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0'),
  intensity: z.string().optional().refine(v => !v || (parseFloat(v) >= 50 && parseFloat(v) <= 100), '50-100%'),
})

const recoveryHrSchema = z.object({
  postHR: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  oneMinHR: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
})

const oneRmSchema = z.object({
  weight: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  reps: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 1 && n <= 30 }, '1-30'),
})

const wilksSchema = z.object({
  bodyweight: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  total: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  gender: z.string(),
})

const vo2maxSchema = z.object({
  distance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  age: z.string().optional().refine(v => !v || (parseFloat(v) >= 1 && parseFloat(v) <= 120), '1-120'),
  gender: z.string().optional(),
})

const cyclingSchema = z.object({
  distance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  hours: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
  minutes: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= 59 }, '0-59'),
  weight: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0'),
})

const cyclingPowerSchema = z.object({
  weight: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  power: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
})

const cadenceSchema = z.object({
  rpm: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n > 0 && n <= 200 }, '1-200'),
  chainring: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n > 0 }, 'Must be > 0'),
  cog: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n > 0 }, 'Must be > 0'),
  wheel: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n > 0 }, 'Must be > 0'),
})

const swimPaceSchema = z.object({
  distance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  hours: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
  minutes: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= 59 }, '0-59'),
  seconds: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= 59 }, '0-59'),
})

const swimStrokeSchema = z.object({
  distance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  strokes: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
})

const pushupSchema = z.object({
  count: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
  age: z.string().optional().refine(v => !v || (parseFloat(v) >= 1 && parseFloat(v) <= 120), '1-120'),
  gender: z.string().optional(),
})

const cooperSchema = z.object({
  distance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  age: z.string().optional().refine(v => !v || (parseFloat(v) >= 1 && parseFloat(v) <= 120), '1-120'),
  gender: z.string().optional(),
})

const beepSchema = z.object({
  level: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n > 0 && n <= 25 }, '1-25'),
  shuttle: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n > 0 && n <= 20 }, '1-20'),
})

const jumpSchema = z.object({
  height: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  gender: z.string().optional(),
})

const sprintSchema = z.object({
  distance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  time: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
})

const agilitySchema = z.object({
  time: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  gender: z.string().optional(),
})

const tdeeSchema = z.object({
  weight: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  height: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  age: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 1 && n <= 120 }, '1-120'),
  gender: z.string(),
  activity: z.string(),
})

const fitnessAgeSchema = z.object({
  age: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 1 && n <= 120 }, '1-120'),
  vo2max: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
})

const bodyFatSchema = z.object({
  neck: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  waist: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  height: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  gender: z.string(),
  hip: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0'),
})

const metActivityOptions = [
  { label: 'Resting (1.0)', value: '1' },
  { label: 'Walking slow (2.5)', value: '2.5' },
  { label: 'Walking brisk (3.5)', value: '3.5' },
  { label: 'Cycling leisure (5.0)', value: '5' },
  { label: 'Swimming (6.0)', value: '6' },
  { label: 'Running 10 km/h (10.0)', value: '10' },
  { label: 'HIIT (8.0)', value: '8' },
  { label: 'Weight lifting (4.0)', value: '4' },
  { label: 'Rowing (7.0)', value: '7' },
  { label: 'Jump rope (10.0)', value: '10' },
]

const hiitMetOptions = [
  { label: 'HIIT - Low intensity (5.0 MET)', value: '5' },
  { label: 'HIIT - Moderate (8.0 MET)', value: '8' },
  { label: 'HIIT - Vigorous (10.5 MET)', value: '10.5' },
  { label: 'HIIT - Extreme (14.0 MET)', value: '14' },
]

const walkMetOptions = [
  { label: 'Walking slow (2.0 MET)', value: '2' },
  { label: 'Walking moderate (3.0 MET)', value: '3' },
  { label: 'Walking brisk (3.5 MET)', value: '3.5' },
  { label: 'Walking very brisk (4.3 MET)', value: '4.3' },
  { label: 'Nordic walking (5.0 MET)', value: '5' },
]

const runMetOptions = [
  { label: 'Running 8 km/h (8.0 MET)', value: '8' },
  { label: 'Running 10 km/h (10.0 MET)', value: '10' },
  { label: 'Running 12 km/h (12.5 MET)', value: '12.5' },
  { label: 'Running 14 km/h (14.0 MET)', value: '14' },
  { label: 'Running 16 km/h (16.0 MET)', value: '16' },
]

const intensityOptions = [
  { label: '50% (very light)', value: '50' },
  { label: '60% (light)', value: '60' },
  { label: '70% (moderate)', value: '70' },
  { label: '80% (vigorous)', value: '80' },
  { label: '85% (very vigorous)', value: '85' },
  { label: '90% (near max)', value: '90' },
]

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
]

const activityLevelOptions = [
  { label: 'Sedentary (1.2)', value: '1.2' },
  { label: 'Light (1.375)', value: '1.375' },
  { label: 'Moderate (1.55)', value: '1.55' },
  { label: 'Very Active (1.725)', value: '1.725' },
  { label: 'Extra Active (1.9)', value: '1.9' },
]

interface FieldDef {
  name: string; label: string; type: 'number' | 'select'
  options?: { label: string; value: string }[]; unit?: string; min?: number; max?: number; step?: string
}
import { calcDefs } from './sports'
import type { CalcDef } from '@/lib/generic-fallback'

type Props = { calculator: CalculatorEntry }

const calcAliases: Record<string, string> = {}

export function GenericSportsCalculator({ calculator }: Props) {
  const resolvedSlug = calcAliases[calculator.slug] || calculator.slug
  const def = calcDefs[resolvedSlug] || (buildGenericDef(calculator) as unknown as CalcDef)

  const schema = def.schema || z.object({ val1: z.string().min(1, 'Required') })

  const defaultVals: Record<string, string> = {}
  def.fields.forEach(f => {
    if (f.type === 'select') defaultVals[f.name] = f.options?.[1]?.value || f.options?.[0]?.value || ''
    else defaultVals[f.name] = '70'
  })

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultVals,
    mode: 'onChange',
  })

  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric')
  const [useSlider, setUseSlider] = useState(true)
  const [lockedFields, setLockedFields] = useState<Set<string>>(new Set())
  const [extraFields, setExtraFields] = useState<Record<string, string>>({})
  const toggleLock = useCallback((name: string) => {
    setLockedFields(prev => { const next = new Set(prev); if (next.has(name)) next.delete(name); else next.add(name); return next })
  }, [])

  const watched = useWatch({ control: form.control })
  const v = watched as any
  const watchedInputs = useMemo(() => {
    const vals = (typeof watched === 'object' && watched !== null) ? watched as Record<string, string> : {}
    return Object.fromEntries(Object.entries(vals).filter(([, v]) => v !== undefined && v !== ''))
  }, [watched])

  const vals: Record<string, number> = {}
  Object.entries(v).forEach(([key, val]) => { vals[key] = parseFloat(val as string) || 0 })
  const genderNum = useMemo(() => v.gender === 'female' ? 2 : 1, [v.gender])
  const valsForCompute = useMemo(() => ({ ...vals, gender: genderNum }), [vals, genderNum])

  const chartData = useMemo(() => {
    const entries = Object.entries(v).filter(([, val]) => val && !isNaN(parseFloat(String(val))))
    if (entries.length === 0) return []
    return entries.slice(0, 6).map(([k, val]) => ({
      name: k.length > 15 ? k.substring(0, 15) + '…' : k,
      value: parseFloat(String(val)) || 0,
    }))
  }, [v])

  const resultData = useMemo(() => {
    if (!def) return null
    return def.compute(valsForCompute)
  }, [valsForCompute, calculator.slug])

  const mainValue = useMemo(() => {
    if (!resultData) return 0
    return typeof resultData.result === 'number' ? resultData.result : parseFloat(String(resultData.result)) || 0
  }, [resultData])

  const formContent = useMemo(() => {
    if (!def) return <p className="text-sm text-gray-400">Select a sports calculator</p>
    return <FieldsByMode fields={def.fields} useSlider={useSlider} lockedFields={lockedFields} toggleLock={toggleLock} />
  }, [def, form, lockedFields, toggleLock, useSlider])

  const saveScenario = useCallback(() => {
    const vals = watched as Record<string, string>
    return Object.entries(vals).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n')
  }, [watched])

  const exportCSV = useCallback(() => {
    const vals = watched as Record<string, string>
    return 'Field,Value\n' + Object.entries(vals).filter(([, v]) => v).map(([k, v]) => `${k},${v}`).join('\n')
  }, [watched])

  const copyResultText = useMemo(() => {
    const lines: string[] = [calculator.title]
    Object.entries(v).filter(([, val]) => val).forEach(([k, val]) => lines.push(`${k}: ${val}`))
    if (resultData) lines.push(`Result: ${typeof resultData.result === 'number' ? resultData.result.toFixed(2) : resultData.result} ${resultData.unit}`)
    return lines.join('\n')
  }, [calculator.title, v, resultData])

  const presets = def?.presets || []
  const applyPreset = useCallback((preset: { label: string; values: Record<string, string> }) => {
    Object.entries(preset.values).forEach(([key, value]) => {
      if (!lockedFields.has(key)) form.setValue(key as any, value as string)
    })
  }, [form, lockedFields])

  const sportsAuthor = { name: 'Alex Rivera', photoUrl: 'https://i.pravatar.cc/150?u=alex-rivera', credential: 'CSCS, USAW', title: 'Certified Strength & Conditioning Specialist', linkedIn: 'https://www.linkedin.com/in/alex-rivera-sports' }
  const sportsReferences = [
    { label: 'ACSM. Guidelines for Exercise Testing and Prescription. 11th Edition. 2021.', url: 'https://www.acsm.org/' },
    { label: 'Ainsworth BE, et al. Compendium of Physical Activities. Med Sci Sports Exerc. 2011.', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
  ]
  const sportsExample = Array.isArray(def?.example) ? def.example : def?.example ? [def.example] : []

  return (
    <FormProvider {...form}>
      <PremiumCalculatorShell calculator={calculator} form={formContent} result={
        <div className="text-center space-y-4">
          {resultData && typeof resultData.result === 'number' && resultData.result > 0 ? (
            <>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">{resultData.label}</p>
                <p className="text-3xl font-bold text-[#06b6d4]">{typeof resultData.result === 'number' ? (resultData.result % 1 === 0 ? resultData.result.toFixed(0) : resultData.result.toFixed(2)) : resultData.result} <span className="text-sm font-normal text-gray-500">{resultData.unit}</span></p>
              </div>
              {(resultData.steps ?? []).length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-xs font-medium text-gray-500 mb-2 text-left">Step-by-Step</p>
                  <div className="space-y-1.5">
                    {(resultData.steps ?? []).filter(s => s.label).map((s, i) => (
                      <p key={i} className="text-xs text-left text-gray-600 dark:text-gray-400">
                        <span className="text-[#06b6d4] font-medium">{i + 1}.</span> {s.label}: <span className="text-gray-800 dark:text-gray-200">{s.value}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-8">
              <p className="text-gray-400 text-sm">Enter your details above</p>
              <p className="text-gray-400 text-xs mt-1">{def.description}</p>
            </div>
          )}
        </div>
      } lockedFields={lockedFields} onExtraFieldsChange={setExtraFields} inputs={watchedInputs} showTabs={true} useSlider={useSlider} onToggleSlider={() => setUseSlider(!useSlider)} onSaveScenario={saveScenario} onExportCSV={exportCSV} unitSystem={unitSystem} onUnitChange={setUnitSystem} presets={presets} onPresetApply={applyPreset} formula={resultData?.steps?.map(s => s.value).join(' ? ') || ''} interpretation={def.description} author={sportsAuthor} reviewer={{ name: 'Dr. Sarah Chen', photoUrl: 'https://i.pravatar.cc/150?u=sarah-chen', credential: 'PhD, FACSM', title: 'Professor of Exercise Physiology', linkedIn: 'https://www.linkedin.com/in/sarah-chen-sports' }} references={sportsReferences} example={sportsExample.length > 0 ? sportsExample : undefined} userCount={12450} charts={chartData.length > 0 ? <DynamicHealthBarChart data={chartData} /> : undefined} onReset={() => {
  const locked = Object.fromEntries(Array.from(lockedFields).map(key => [key, form.getValues(key)]))
  form.reset(defaultVals)
  Object.entries(locked).forEach(([key, value]) => {
    if (value !== undefined && value !== '') form.setValue(key as any, value as string)
  })
}} copyResultText={copyResultText} hubCategory="sports" mainValue={mainValue} />
    </FormProvider>
  )
}
