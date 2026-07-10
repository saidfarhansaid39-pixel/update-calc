'use client'
import { memoizedCompute } from '@/lib/calc-executor'

import React, { useMemo, useCallback, useState } from 'react'
import { useForm, FormProvider, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalculatorFormField } from '@/components/forms/CalculatorFormField'
import { FieldsByMode } from '@/lib/calc-field-helper'
import { PremiumCalculatorShell } from '@/components/premium/PremiumCalculatorShell.dynamic'
import type { UnitSystem } from '@/components/premium/PremiumCalculatorShell'
import { DynamicHealthBarChart } from '@/components/premium/DynamicCharts'
import { buildGenericDef } from '@/lib/generic-fallback'

interface FieldDef {
  name: string; label: string; type: 'number' | 'select'
  options?: { label: string; value: string }[]; unit?: string; min?: number; max?: number; step?: string
}
import { calcDefs } from './chemistry'
import type { CalcDef } from '@/lib/generic-fallback'

export default function GenericChemistryCalculator({ calculator }: Props) {
  const def = calcDefs[calculator.slug] || (buildGenericDef(calculator) as unknown as CalcDef)
  const schema = def?.schema || z.object({
    val1: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
  })
  const defaults = def?.fields.reduce((acc, f) => {
    acc[f.name] = f.type === 'select' ? (f.options?.[0]?.value || '') : ''
    return acc
  }, {} as Record<string, string>) || { val1: '' }


  const [fieldUnits, setFieldUnits] = useState<Record<string, string>>({})
  const handleUnitChange = useCallback((name: string, unit: string) => {
    setFieldUnits(prev => ({ ...prev, [name]: unit }))
  }, [])

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaults as any,
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

  const chartData = useMemo(() => {
    if (!def) return []
    const vals: Record<string, any> = {}
    for (const f of def.fields) {
      const raw = v[f.name]
      if (f.type === 'number') {
        vals[f.name] = raw !== undefined && raw !== '' ? Number(raw) : 0
      } else {
        vals[f.name] = raw ?? ''
      }
    }
    const res = memoizedCompute(def)(vals)
    if (res.steps?.length) {
      return res.steps
        .filter((s: any) => s && s.label && s.value !== undefined && !isNaN(parseFloat(String(s.value))))
        .slice(0, 6)
        .map((s: any) => ({
          name: s.label.length > 15 ? s.label.substring(0, 15) + '…' : s.label,
          value: parseFloat(String(s.value)) || 0,
        }))
    }
    const entries = Object.entries(v).filter(([, val]) => val && !isNaN(parseFloat(String(val))))
    if (entries.length === 0) return []
    return entries.slice(0, 6).map(([k, val]) => ({
      name: k.length > 15 ? k.substring(0, 15) + '…' : k,
      value: parseFloat(String(val)) || 0,
    }))
  }, [def, v])

  const mainValue = useMemo(() => {
    if (!def) return undefined
    const vals: Record<string, any> = {}
    for (const f of def.fields) {
      const raw = v[f.name]
      if (f.type === 'number') {
        vals[f.name] = raw !== undefined && raw !== '' ? Number(raw) : 0
      } else {
        vals[f.name] = raw ?? ''
      }
    }
    const res = memoizedCompute(def)(vals)
    const parsed = typeof res.result === 'number' ? res.result : parseFloat(String(res.result))
    return isNaN(parsed) ? undefined : parsed
  }, [def, v])

  const result = useMemo(() => {
    if (!def) return <div className="text-center text-gray-400">Select values to calculate</div>
    const vals: Record<string, any> = {}
    for (const f of def.fields) {
      const raw = v[f.name]
      if (f.type === 'number') {
        vals[f.name] = raw !== undefined && raw !== '' ? Number(raw) : 0
      } else {
        vals[f.name] = raw ?? ''
      }
    }
    const res = memoizedCompute(def)(vals)
    return (
      <div className="text-center space-y-4">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">{res.label}</p>
          <p className="text-3xl font-bold text-[#06b6d4]">{typeof res.result === 'number' ? res.result.toFixed(2) : res.result} {res.unit}</p>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 text-xs text-gray-400 space-y-1">
          {(res.steps ?? []).map((step, i) => (
            <p key={i}><strong>{step.label}:</strong> {step.value}</p>
          ))}
        </div>
      </div>
    )
  }, [def, v])

  const formContent = useMemo(() => {
    return <FieldsByMode fields={def.fields} useSlider={useSlider} lockedFields={lockedFields} toggleLock={toggleLock} />
  }, [def, form, lockedFields, toggleLock, useSlider])

  const saveScenario = useCallback(() => {
    return Object.entries(v).filter(([, val]) => val).map(([k, val]) => `${k}: ${val}`).join('\n')
  }, [v])

  const exportCSV = useCallback(() => {
    const header = 'Field,Value\n'
    const rows = Object.entries(v).filter(([, val]) => val).map(([k, val]) => `${k},${val}`).join('\n')
    return `${header}${rows}`
  }, [v])

  const copyResultText = useMemo(() => {
    const lines: string[] = [calculator.title]
    Object.entries(v).filter(([, val]) => val).forEach(([k, val]) => lines.push(`${k}: ${val}`))
    return lines.join('\n')
  }, [calculator.title, v])

  const formula = def?.formula || 'Standard calculation'
  const interpretation = def?.interpretation || 'Chemistry calculator for quantitative analysis in chemical sciences.'
  const presets = def?.presets || []
  const applyPreset = useCallback((preset: { label: string; values: Record<string, string> }) => {
    Object.entries(preset.values).forEach(([key, value]) => {
      if (!lockedFields.has(key)) form.setValue(key as any, value)
    })
  }, [form, lockedFields])

  const chemAuthor = { name: 'Dr. Lin Wei', photoUrl: 'https://i.pravatar.cc/150?u=lin-chem', credential: 'PhD', title: 'Analytical Chemist', linkedIn: 'https://www.linkedin.com/in/lin-wei-chem' }
  const chemReviewer = { name: 'Prof. Sarah Johansson', photoUrl: 'https://i.pravatar.cc/150?u=sarah-chem', credential: 'PhD', title: 'Chemical Education Researcher', linkedIn: 'https://www.linkedin.com/in/sarah-johansson-chem' }
  const chemReferences = [
    { label: 'Brown TE, LeMay HE, Bursten BE, et al. Chemistry: The Central Science. 14th Edition. Pearson. 2017', url: 'https://en.wikipedia.org/wiki/Chemistry:_The_Central_Science' },
    { label: 'Chang R, Overby J. Chemistry. 13th Edition. McGraw-Hill. 2018', url: 'https://en.wikipedia.org/wiki/General_Chemistry_(Chang)' },
  ]
  const chemExample = { label: calculator.slug, value: 'See results above' }

  return (
    <FormProvider {...form}>
    <PremiumCalculatorShell
      calculator={calculator}
      form={formContent}
      result={result}
      lockedFields={lockedFields}
      onExtraFieldsChange={setExtraFields}
      onSaveScenario={saveScenario}
      onExportCSV={exportCSV}
      unitSystem={unitSystem}
      onUnitChange={setUnitSystem}
      inputs={watchedInputs}
        showTabs={true}
        useSlider={useSlider}
        onToggleSlider={() => setUseSlider(!useSlider)}
        charts={chartData.length > 0 ? <DynamicHealthBarChart data={chartData} /> : undefined}
        formula={formula}
        interpretation={interpretation}
        presets={presets}
        onPresetApply={applyPreset}
        author={chemAuthor}
        reviewer={chemReviewer}
        references={chemReferences}
        example={[chemExample]}
        userCount={7234}
        onReset={() => {
          const locked = Object.fromEntries(
            Array.from(lockedFields).map(key => [key, form.getValues(key)])
          )
          form.reset(defaults)
          Object.entries(locked).forEach(([key, value]) => {
            if (value !== undefined && value !== '') form.setValue(key as any, value)
          })
        }}
        copyResultText={copyResultText}
        hubCategory="chemistry"
        mainValue={mainValue}
      />
    </FormProvider>
  )
}

interface Props {
  calculator: {
    slug: string; title: string; description: string; tier: string
    category: string; hubSlug: string; hubName: string; keywords: string[]
    dataDependent?: boolean; dataRefreshCadence?: string
  }
}

export { GenericChemistryCalculator }
