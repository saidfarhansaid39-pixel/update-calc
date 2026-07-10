'use client'

import React, { useMemo, useCallback, useState } from 'react'
import { useForm, FormProvider, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalculatorFormField } from '@/components/forms/CalculatorFormField'
import { CalculatorSlider } from '@/components/forms/CalculatorSlider'
import { PremiumCalculatorShell } from '@/components/premium/PremiumCalculatorShell.dynamic'
import { DynamicHealthBarChart } from '@/components/premium/DynamicCharts'
import type { UnitSystem } from '@/components/premium/PremiumCalculatorShell'
import { FieldsByMode } from '@/lib/calc-field-helper'
import { getUnits, toBaseUnit } from '@/lib/units'
import { buildGenericDef } from '@/lib/generic-fallback'

type CalcType = 'calorie-burn' | 'daily-cal' | 'cal-per-day' | 'cal-deficit' | 'cal-surplus' | 'macro-calc' | 'macronutrient' | 'protein' | 'carb' | 'fat' | 'recipe-cost' | 'food-cost' | 'recipe-nutri' | 'meal-cal' | 'nutri-facts' | 'serving-size' | 'portion-size' | 'meal-prep' | 'meal-plan' | 'cooking-time' | 'temp-convert' | 'ingredient-sub' | 'food-budget' | 'grocery-budget-food' | 'food-storage' | 'hydration' | 'water-intake' | 'caffeine' | 'alcohol' | 'bbq' | 'sous-vide' | 'bread' | 'pizza' | 'sourdough' | 'coffee' | 'tea' | 'pasta' | 'rice' | 'smoothie' | 'salad' | 'soup' | 'dressing' | 'marinade' | 'spice' | 'herb-convert' | 'body-fat' | 'ideal-weight' | 'lean-mass' | 'fast-food' | 'scale-recipe' | 'baking-convert' | 'recipe-ratio' | 'food-weight' | 'food-scale' | 'food-volume' | 'caffeine-limit' | 'wine' | 'beer' | 'grill' | 'smoker' | 'ovens' | 'bbq-party' | 'meal-cost' | 'food-expire' | 'protein-calculator-calc' | 'carb-calculator-calc' | 'fat-intake-calc' | 'fiber-calculator-calc' | 'sugar-intake-calc' | 'sodium-calculator-calc' | 'potassium-calc' | 'calcium-calculator-calc' | 'iron-intake-calc' | 'vitamin-d-calc' | 'vitamin-b12-calc' | 'magnesium-calc' | 'zinc-calculator' | 'omega3-calculator' | 'water-calculator' | 'coffee-caffeine-calc' | 'alcohol-calorie-calc' | 'meal-planner-calc' | 'recipe-scaler' | 'substitution-calc' | 'recipe-cost-calc' | 'cost-per-serving' | 'ingredient-substitution' | 'baking-conversion' | 'flour-substitution' | 'sugar-substitution' | 'oil-substitution' | 'dairy-substitution' | 'egg-substitution' | 'spice-substitution' | 'herb-substitution' | 'salt-substitution' | 'gluten-free-flour' | 'yeast-conversion' | 'sourdough-starter' | 'sourdough-hydration' | 'baker-percentage' | 'dough-hydration' | 'bread-flour-ratio' | 'pizza-dough-calc' | 'pasta-serving' | 'rice-serving' | 'rice-water-ratio' | 'quinoa-cooking' | 'oatmeal-ratio' | 'chicken-temp' | 'beef-temp' | 'pork-temp' | 'fish-temp' | 'turkey-temp' | 'oven-cooking-time' | 'convection-conversion' | 'air-fryer-conversion' | 'slow-cooker-conversion' | 'pressure-cooker-time' | 'microwave-cooking' | 'grill-temperature' | 'smoker-time' | 'marinade-calc' | 'brine-calc' | 'rub-calc' | 'sauce-calc' | 'portion-scaling' | 'batch-scaling' | 'sheet-pan-serving' | 'cake-batter' | 'cake-pan-size' | 'baking-dish-volume' | 'loaf-pan' | 'muffin-tin' | 'cupcake-icing' | 'cookie-dough' | 'pie-crust' | 'cream-puff' | 'cheesecake-batter' | 'macaron-calc' | 'ganache-ratio' | 'buttercream' | 'canning-time' | 'pickling-brine' | 'fermentation-salt' | 'cheese-making' | 'ice-cream-base' | 'coffee-brew-ratio'

const calcTypeMap: Record<string, CalcType> = {
  'calorie-calculator': 'daily-cal',
  'calories-per-day-calculator': 'cal-per-day',
  'calorie-burn-calculator': 'calorie-burn',
  'calorie-defecit-calculator': 'cal-deficit',
  'calorie-surplus-calculator': 'cal-surplus',
  'macro-calculator': 'macro-calc',
  'macronutrient-calculator': 'macronutrient',
  'protein-calculator': 'protein',
  'carb-calculator': 'carb',
  'fat-calculator': 'fat',
  'recipe-cost-calculator': 'recipe-cost',
  'recipe-nutrition-calculator': 'recipe-nutri',
  'recipe-scaling-calculator': 'scale-recipe',
  'serving-size-calculator': 'serving-size',
  'meal-prep-calculator': 'meal-prep',
  'meal-planner-calculator': 'meal-plan',
  'meal-calorie-calculator': 'meal-cal',
  'portion-size-calculator': 'portion-size',
  'food-scale-calculator': 'food-scale',
  'nutrition-facts-calculator': 'nutri-facts',
  'food-weight-calculator': 'food-weight',
  'food-volume-calculator': 'food-volume',
  'cooking-time-calculator': 'cooking-time',
  'cooking-temperature-calculator': 'temp-convert',
  'oven-time-calculator': 'ovens',
  'baking-conversion-calculator': 'baking-convert',
  'ingredient-substitution-calculator': 'ingredient-sub',
  'food-budget-calculator': 'food-budget',
  'grocery-budget-calculator': 'grocery-budget-food',
  'meal-cost-calculator': 'meal-cost',
  'food-storage-calculator': 'food-storage',
  'food-expiration-calculator': 'food-expire',
  'food-cost-calculator': 'food-cost',
  'ingredient-ratio-calculator': 'recipe-ratio',
  'hydration-calculator': 'hydration',
  'hydratation-calculator': 'hydration',
  'water-intake-calculator': 'water-intake',
  'caffeine-calculator': 'caffeine',
  'alcohol-calculator': 'alcohol',
  'body-fat-calculator': 'body-fat',
  'ideal-weight-calculator': 'ideal-weight',
  'lean-body-mass-calculator': 'lean-mass',
  'bbq-calculator': 'bbq',
  'grill-calculator': 'grill',
  'smoker-calculator': 'smoker',
  'sous-vide-calculator': 'sous-vide',
  'bread-calculator': 'bread',
  'pizza-calculator': 'pizza',
  'sourdough-calculator': 'sourdough',
  'coffee-calculator': 'coffee',
  'tea-calculator': 'tea',
  'wine-calculator': 'wine',
  'beer-calculator': 'beer',
  'pasta-calculator': 'pasta',
  'rice-calculator': 'rice',
  'soup-calculator': 'soup',
  'smoothie-calculator': 'smoothie',
  'salad-calculator': 'salad',
  'dressing-calculator': 'dressing',
  'marinade-calculator': 'marinade',
  'spice-calculator': 'spice',
  'herb-calculator': 'herb-convert',
  'protein-calculator-calc': 'protein-calculator-calc',
  'carb-calculator-calc': 'carb-calculator-calc',
  'fat-intake-calc': 'fat-intake-calc',
  'fiber-calculator-calc': 'fiber-calculator-calc',
  'sugar-intake-calc': 'sugar-intake-calc',
  'sodium-calculator-calc': 'sodium-calculator-calc',
  'potassium-calc': 'potassium-calc',
  'calcium-calculator-calc': 'calcium-calculator-calc',
  'iron-intake-calc': 'iron-intake-calc',
  'vitamin-d-calc': 'vitamin-d-calc',
  'vitamin-b12-calc': 'vitamin-b12-calc',
  'magnesium-calc': 'magnesium-calc',
  'zinc-calculator': 'zinc-calculator',
  'omega3-calculator': 'omega3-calculator',
  'water-calculator': 'water-calculator',
  'coffee-caffeine-calc': 'coffee-caffeine-calc',
  'alcohol-calorie-calc': 'alcohol-calorie-calc',
  'meal-planner-calc': 'meal-planner-calc',
  'recipe-scaler': 'recipe-scaler',
  'substitution-calc': 'substitution-calc',
  'recipe-cost-calc': 'recipe-cost-calc',
  'cost-per-serving': 'cost-per-serving',
  'ingredient-substitution': 'ingredient-substitution',
  'baking-conversion': 'baking-conversion',
  'flour-substitution': 'flour-substitution',
  'sugar-substitution': 'sugar-substitution',
  'oil-substitution': 'oil-substitution',
  'dairy-substitution': 'dairy-substitution',
  'egg-substitution': 'egg-substitution',
  'spice-substitution': 'spice-substitution',
  'herb-substitution': 'herb-substitution',
  'salt-substitution': 'salt-substitution',
  'gluten-free-flour': 'gluten-free-flour',
  'yeast-conversion': 'yeast-conversion',
  'sourdough-starter': 'sourdough-starter',
  'sourdough-hydration': 'sourdough-hydration',
  'baker-percentage': 'baker-percentage',
  'dough-hydration': 'dough-hydration',
  'bread-flour-ratio': 'bread-flour-ratio',
  'pizza-dough-calc': 'pizza-dough-calc',
  'pasta-serving': 'pasta-serving',
  'rice-serving': 'rice-serving',
  'rice-water-ratio': 'rice-water-ratio',
  'quinoa-cooking': 'quinoa-cooking',
  'oatmeal-ratio': 'oatmeal-ratio',
  'chicken-temp': 'chicken-temp',
  'beef-temp': 'beef-temp',
  'pork-temp': 'pork-temp',
  'fish-temp': 'fish-temp',
  'turkey-temp': 'turkey-temp',
  'oven-cooking-time': 'oven-cooking-time',
  'convection-conversion': 'convection-conversion',
  'air-fryer-conversion': 'air-fryer-conversion',
  'slow-cooker-conversion': 'slow-cooker-conversion',
  'pressure-cooker-time': 'pressure-cooker-time',
  'microwave-cooking': 'microwave-cooking',
  'grill-temperature': 'grill-temperature',
  'smoker-time': 'smoker-time',
  'marinade-calc': 'marinade-calc',
  'brine-calc': 'brine-calc',
  'rub-calc': 'rub-calc',
  'sauce-calc': 'sauce-calc',
  'portion-scaling': 'portion-scaling',
  'batch-scaling': 'batch-scaling',
  'sheet-pan-serving': 'sheet-pan-serving',
  'cake-batter': 'cake-batter',
  'cake-pan-size': 'cake-pan-size',
  'baking-dish-volume': 'baking-dish-volume',
  'loaf-pan': 'loaf-pan',
  'muffin-tin': 'muffin-tin',
  'cupcake-icing': 'cupcake-icing',
  'cookie-dough': 'cookie-dough',
  'pie-crust': 'pie-crust',
  'cream-puff': 'cream-puff',
  'cheesecake-batter': 'cheesecake-batter',
  'macaron-calc': 'macaron-calc',
  'ganache-ratio': 'ganache-ratio',
  'buttercream': 'buttercream',
  'canning-time': 'canning-time',
  'pickling-brine': 'pickling-brine',
  'fermentation-salt': 'fermentation-salt',
  'cheese-making': 'cheese-making',
  'ice-cream-base': 'ice-cream-base',
  'coffee-brew-ratio': 'coffee-brew-ratio',
  'fast-food-calculator': 'fast-food',
}

const activityLevels = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, extra: 1.9 }
const goals = { maintain: 1, lose: 0.8, gain: 1.15 }

interface FieldDef {
  name: string; label: string; type: 'number' | 'select'
  options?: { label: string; value: string }[]
  unit?: string; units?: { value: string; label: string }[]; defaultUnit?: string
  min?: number; max?: number; step?: string
}

import { calcDefs } from './food'
import type { CalcDef } from '@/lib/generic-fallback'
import type { CalculatorEntry } from '@calcuniverse/calculator-registry'

type Props = { calculator: CalculatorEntry }

export function GenericFoodCalculator({ calculator }: Props) {
  const calcType = calcTypeMap[calculator.slug]
  const def = calcType ? calcDefs[calcType] : (buildGenericDef(calculator) as unknown as CalcDef)

  const fieldNames = def ? def.fields.map(f => f.name) : ['val1', 'val2']
  const selectFieldNames = def ? new Set(def.fields.filter(f => f.type === 'select').map(f => f.name)) : new Set<string>()
  const schemaShape: Record<string, z.ZodTypeAny> = {}
  fieldNames.forEach(name => {
    if (selectFieldNames.has(name)) {
      schemaShape[name] = z.string().min(1, 'Required')
    } else {
      schemaShape[name] = z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) || v === '', 'Must be a number')
    }
  })
  const schema = z.object(schemaShape)

  const [lockedFields, setLockedFields] = useState<Set<string>>(new Set())
  const [extraFields, setExtraFields] = useState<Record<string, string>>({})
  const toggleLock = useCallback((name: string) => {
    setLockedFields(prev => {
      const next = new Set(prev); if (next.has(name)) next.delete(name); else next.add(name); return next
    })
  }, [])

  const defaultVals: Record<string, string> = {}
  if (def) {
    def.fields.forEach(f => {
      if (f.type === 'select') defaultVals[f.name] = f.options?.[1]?.value || f.options?.[0]?.value || ''
      else defaultVals[f.name] = '100'
    })
  } else {
    defaultVals.val1 = '10'; defaultVals.val2 = '5'
  }

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultVals,
    mode: 'onChange',
  })

  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric')
  const [useSlider, setUseSlider] = useState(true)
  const watched = useWatch({ control: form.control })
  const v = watched as any
  const watchedInputs = useMemo(() => {
    const vals = watched as Record<string, string>
    return Object.fromEntries(Object.entries(vals).filter(([, v]) => v !== undefined && v !== ''))
  }, [watched])

  const selectFields = new Set((def?.fields || []).filter(f => f.type === 'select').map(f => f.name))
  const unitToDefault: Record<string, number> = { 'lb': 0.453592, 'in': 2.54, 'oz': 28.3495, 'ft': 30.48 }
  const vals: Record<string, any> = {}
  Object.entries(v).forEach(([key, val]) => {
    if (key.endsWith('Unit')) return
    const s = val as string
    let numericVal = selectFields.has(key) ? s : (parseFloat(s) || 0)
    const unitKey = key + 'Unit'
    const unit = v[unitKey] as string | undefined
    if (unit && unitToDefault[unit]) {
      numericVal = typeof numericVal === 'number' ? numericVal * unitToDefault[unit] : numericVal
    }
    vals[key] = numericVal
  })

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
    return def.compute(vals)
  }, [vals, calcType])

  const mainValue = useMemo(() => {
    if (!resultData || typeof resultData.result !== 'number') return undefined
    return resultData.result
  }, [resultData])

  const formContent = useMemo(() => {
    const field = (name: string, label: string, opts?: { min?: number; max?: number; step?: number }) =>
      useSlider
        ? <CalculatorSlider key={name} name={name} label={label} min={opts?.min} max={opts?.max} step={opts?.step ?? 1} />
        : <CalculatorFormField key={name} name={name} label={label} min={opts?.min} max={opts?.max} step={(opts?.step ?? 1).toString()} />
    if (!def) return <p className="text-sm text-gray-400">Select a food calculator</p>
    return <FieldsByMode fields={def.fields as any} useSlider={useSlider} lockedFields={lockedFields} toggleLock={toggleLock} />
  }, [def, form, lockedFields, toggleLock, useSlider])

  const saveScenario = useCallback(() => {
    const vals = watched as Record<string, string>
    return Object.entries(vals).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n')
  }, [watched])

  const exportCSV = useCallback(() => {
    const vals = watched as Record<string, string>
    const header = 'Field,Value\n'
    const rows = Object.entries(vals).filter(([, v]) => v).map(([k, v]) => `${k},${v}`).join('\n')
    return `${header}${rows}`
  }, [watched])

  const copyResultText = useMemo(() => {
    const lines: string[] = [calculator.title]
    Object.entries(v).filter(([, val]) => val).forEach(([k, val]) => lines.push(`${k}: ${val}`))
    if (resultData) lines.push(`Result: ${Number(resultData.result).toFixed(2)} ${resultData.unit}`)
    return lines.join('\n')
  }, [calculator.title, v, resultData])

  const presets = def?.presets || []
  const applyPreset = useCallback((preset: { label: string; values: Record<string, string> }) => {
    Object.entries(preset.values).forEach(([key, value]) => {
      if (!lockedFields.has(key)) form.setValue(key as any, value as string)
    })
  }, [form, lockedFields])

  const foodAuthor = { name: 'Chef Maria Rossi', photoUrl: 'https://i.pravatar.cc/150?u=chef-maria', credential: 'RD, CPT', title: 'Registered Dietitian & Culinary Expert', linkedIn: 'https://www.linkedin.com/in/maria-rossi-food' }
  const foodReferences = [
    { label: 'USDA. Dietary Guidelines for Americans. 2020-2025. 9th Edition.', url: 'https://www.dietaryguidelines.gov/' },
    { label: 'FDA. Nutrition Facts Label. Food and Drug Administration. 2023', url: 'https://www.fda.gov/food/nutrition-nutrition-labeling' },
  ]
  const foodExample = Array.isArray(def?.example) ? def.example : def?.example ? [def.example] : []

  return (
    <FormProvider {...form}>
      <PremiumCalculatorShell calculator={calculator} form={formContent} result={
        <div className="text-center space-y-4">
          {resultData && Number(resultData.result) > 0 ? (
            <>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">{resultData.label}</p>
                <p className="text-3xl font-bold text-[#06b6d4]">{Number(resultData.result).toFixed(resultData.unit === '$' ? 2 : resultData.unit === '%' ? 1 : resultData.unit === 'kcal/day' || resultData.unit === 'kcal' || resultData.unit === 'min' || resultData.unit === 'g' || resultData.unit === 'meals' ? 0 : 2)} <span className="text-sm font-normal text-gray-500">{resultData.unit}</span></p>
              </div>
              {(resultData.steps ?? []).length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-xs font-medium text-gray-500 mb-2 text-left">Step-by-Step</p>
                  <div className="space-y-1.5">
                    {(resultData.steps ?? []).map((s, i) => (
                      <p key={i} className={`text-xs text-left ${s.label.includes('??') ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
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
              <p className="text-gray-400 text-xs mt-1">{def?.description || ''}</p>
            </div>
          )}
        </div>
      } charts={chartData.length > 0 ? <DynamicHealthBarChart data={chartData} /> : undefined} lockedFields={lockedFields} onExtraFieldsChange={setExtraFields} onSaveScenario={saveScenario} onExportCSV={exportCSV} unitSystem={unitSystem} onUnitChange={setUnitSystem} inputs={watchedInputs} showTabs={true} useSlider={useSlider} onToggleSlider={() => setUseSlider(!useSlider)} presets={presets} onPresetApply={applyPreset} formula={def ? 'See step-by-step' : 'Food calculation'} interpretation={def?.description || 'Food and nutrition calculator for cooking and meal planning.'} author={foodAuthor} reviewer={{ name: 'Dr. James Kent', photoUrl: 'https://i.pravatar.cc/150?u=james-kent', credential: 'PhD, RD', title: 'Professor of Nutrition', linkedIn: 'https://www.linkedin.com/in/james-kent-nutrition' }} references={foodReferences} example={foodExample.length > 0 ? foodExample : undefined} userCount={8934} onReset={() => {
          const locked = Object.fromEntries(
            Array.from(lockedFields).map(key => [key, form.getValues(key)])
          )
          form.reset(defaultVals)
          Object.entries(locked).forEach(([key, value]) => {
            if (value !== undefined && value !== '') form.setValue(key as any, value as string)
          })
        }} copyResultText={copyResultText} hubCategory="food" mainValue={mainValue}
        onRestoreValues={(vals) => {
          Object.entries(vals).forEach(([key, val]) => {
            form.setValue(key as any, val)
          })
        }}
      />
    </FormProvider>
  )
}
