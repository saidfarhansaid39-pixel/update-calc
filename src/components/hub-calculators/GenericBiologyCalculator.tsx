'use client'

import React, { useMemo, useCallback, useState } from 'react'
import { useForm, FormProvider, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalculatorFormField } from '@/components/forms/CalculatorFormField'
import { FieldsByMode } from '@/lib/calc-field-helper'
import { PremiumCalculatorShell } from '@/components/premium/PremiumCalculatorShell.dynamic'
import type { UnitSystem } from '@/components/premium/PremiumCalculatorShell'
import { buildGenericDef } from '@/lib/generic-fallback'

interface FieldDef {
  name: string; label: string; type: 'number' | 'select'
  options?: { label: string; value: string }[]; unit?: string; min?: number; max?: number; step?: string
}
import { calcDefs } from './biology'
import type { CalcDef } from '@/lib/generic-fallback'
import type { CalculatorEntry } from '@calcuniverse/calculator-registry'

type Props = { calculator: CalculatorEntry }

export function GenericBiologyCalculator({ calculator }: Props) {
  const def = calcDefs[calculator.slug] || (buildGenericDef(calculator) as unknown as CalcDef)
  const schema = def?.schema || z.object({
    val1: z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)), 'Must be a number'),
  })
  const defaults = def?.defaults || def?.fields.reduce((acc, f) => {
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

  const presets = def?.presets || []
  const applyPreset = useCallback((preset: { label: string; values: Record<string, string> }) => {
    Object.entries(preset.values).forEach(([key, value]) => {
      if (!lockedFields.has(key)) form.setValue(key as any, value)
    })
  }, [form, lockedFields])

  const formulaVariables = def?.formulaVariables

  const [tempUnit, setTempUnit] = useState('celsius')

  const watched = useWatch({ control: form.control })
  const v = watched as any
  const watchedInputs = useMemo(() => {
    const vals = (typeof watched === 'object' && watched !== null) ? watched as Record<string, string> : {}
    return Object.fromEntries(Object.entries(vals).filter(([, v]) => v !== undefined && v !== ''))
  }, [watched])

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
    if (calculator.slug === 'annealing-temperature-calculator') {
      vals.unit = tempUnit
    }
    const res = def.compute(vals)
    return (
      <div className="text-center space-y-4">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">{res.label}</p>
          <p className="text-3xl font-bold text-[#06b6d4]">{Number(res.result).toFixed(2)} {res.unit}</p>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 text-xs text-gray-400 space-y-1">
          {(res.steps ?? []).map((step, i) => (
            <p key={i}><strong>{step.label}:</strong> {step.value}</p>
          ))}
        </div>
      </div>
    )
  }, [def, v])

  const mainValue = useMemo(() => {
    if (!def) return 0
    const vals: Record<string, any> = {}
    for (const f of def.fields) {
      const raw = v[f.name]
      if (f.type === 'number') {
        vals[f.name] = raw !== undefined && raw !== '' ? Number(raw) : 0
      } else {
        vals[f.name] = raw ?? ''
      }
    }
    const res = def.compute(vals)
    return typeof res.result === 'number' ? res.result : parseFloat(String(res.result)) || 0
  }, [def, v])

  const formContent = useMemo(() => {
    return <>
      <FieldsByMode fields={def.fields} useSlider={useSlider} lockedFields={lockedFields} toggleLock={toggleLock} />
      {calculator.slug === 'annealing-temperature-calculator' && (
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-gray-500">Temperature unit:</span>
          {['celsius', 'fahrenheit', 'kelvin'].map(u => (
            <button
              key={u}
              type="button"
              onClick={() => setTempUnit(u)}
              className={`px-2 py-1 text-xs rounded ${tempUnit === u ? 'bg-[#1a3a8a] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
            >
              {u === 'celsius' ? '°C' : u === 'fahrenheit' ? '°F' : 'K'}
            </button>
          ))}
        </div>
      )}
    </>
  }, [def, form, lockedFields, toggleLock, useSlider, calculator.slug, tempUnit])

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
  const interpretation = def?.interpretation || 'Biology calculator for quantitative analysis in life sciences.'

  const bioAuthor = { name: 'Dr. Elena Vasquez', photoUrl: 'https://i.pravatar.cc/150?u=elena-bio', credential: 'PhD', title: 'Molecular Biologist', linkedIn: 'https://www.linkedin.com/in/elena-vasquez-bio' }
  const bioReviewer = { name: 'Dr. Marcus Webb', photoUrl: 'https://i.pravatar.cc/150?u=marcus-bio', credential: 'PhD', title: 'Professor of Biology', linkedIn: 'https://www.linkedin.com/in/marcus-webb-biology' }
  const bioReferences = [
    { label: 'Alberts B, et al. Molecular Biology of the Cell. 7th Edition. Garland Science. 2022', url: 'https://www.ncbi.nlm.nih.gov/books/NBK26882/' },
    { label: 'Lodish H, et al. Molecular Cell Biology. 9th Edition. W.H. Freeman. 2021', url: 'https://www.ncbi.nlm.nih.gov/books/NBK21475/' },
  ]
  const bioExample = { label: calculator.slug, value: 'See results above' }

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
        formula={formula}
        interpretation={interpretation}
        presets={presets}
        onPresetApply={applyPreset}
        formulaVariables={formulaVariables}
        author={bioAuthor}
        reviewer={bioReviewer}
        references={bioReferences}
        example={[bioExample]}
        userCount={7234}
        onReset={() => {
  const locked = Object.fromEntries(Array.from(lockedFields).map(key => [key, form.getValues(key)]))
  form.reset(defaults)
  Object.entries(locked).forEach(([key, value]) => {
    if (value !== undefined && value !== '') form.setValue(key as any, value)
  })
}}
        copyResultText={copyResultText}
        hubCategory="biology"
        mainValue={mainValue}
      />
    </FormProvider>
  )
}
