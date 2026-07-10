'use client'
import { memoizedCompute } from '@/lib/calc-executor'

import React, { useMemo, useCallback, useState, useEffect } from 'react'
import { useForm, FormProvider, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MultiUnitField } from '@/components/forms/MultiUnitField'
import { CalculatorFormField } from '@/components/forms/CalculatorFormField'
import { CalculatorSlider } from '@/components/forms/CalculatorSlider'
import { UnitToggle } from '@/components/forms/UnitToggle'
import { PremiumCalculatorShell } from '@/components/premium/PremiumCalculatorShell.dynamic'
import type { UnitSystem } from '@/components/premium/PremiumCalculatorShell'
import { ModeFieldGroup } from '@/components/premium/ModeFieldGroup'
import { getHealthFormula, healthSlugOverrides } from '@/lib/seo/formula-generator'
import { healthSchema } from '@/lib/forms/schemas'
import { getUnits, toBaseUnit, fromBaseUnit } from '@/lib/units'
import type { CalculatorEntry } from '@calcuniverse/calculator-registry'
import { DynamicHealthBarChart } from '@/components/premium/DynamicCharts'
import { buildGenericDef } from '@/lib/generic-fallback'
import { calculateBMRHarrisBenedict } from '@calcuniverse/formulas'

const weightUnits = [
  { value: 'kg', label: 'kg', toBase: (v: number) => v, fromBase: (v: number) => v },
  { value: 'lb', label: 'lb', toBase: (v: number) => v * 0.453592, fromBase: (v: number) => v / 0.453592 },
  { value: 'st', label: 'st', toBase: (v: number) => v * 6.35029, fromBase: (v: number) => v / 6.35029 },
]

const heightUnits = [
  { value: 'cm', label: 'cm', toBase: (v: number) => v / 100, fromBase: (v: number) => v * 100 },
  { value: 'm', label: 'm', toBase: (v: number) => v, fromBase: (v: number) => v },
  { value: 'ft', label: 'ft', toBase: (v: number) => v * 0.3048, fromBase: (v: number) => v / 0.3048 },
  { value: 'in', label: 'in', toBase: (v: number) => v * 0.0254, fromBase: (v: number) => v / 0.0254 },
]

type CalcType = 'bmi' | 'calorie' | 'bmr' | 'tdee' | 'macro' | 'body-fat' | 'army-bf' | 'heart-rate' | 'pregnancy' | 'pace'
  | 'bp' | 'map' | 'pulse-pressure' | 'cardiac-output' | 'stroke-volume' | 'ejection-fraction'
  | 'heart-age' | 'framingham' | 'ascvd' | 'chads-vasc' | 'hr-zone' | 'target-hr' | 'heart-rate-target'
  | 'whr' | 'whtr' | 'body-roundness' | 'ponderal' | 'frame-size' | 'lbm' | 'lean-mass' | 'ffmi' | 'smm'
  | 'body-fat-caliper' | 'navy-body-fat'
  | 'vo2-max' | 'met-minutes' | 'exercise-hr' | 'recovery-hr' | 'hrv' | 'trimp' | 'fitness-age'
  | 'pal' | 'pal-calc' | 'neat'
  | 'protein' | 'carb' | 'fat-calc' | 'fiber' | 'sugar' | 'sodium' | 'vitamin-d' | 'calcium'
  | 'iron' | 'water-needs' | 'saturated-fat' | 'added-sugar'
  | 'preg-weight' | 'preg-gain' | 'gestational' | 'fetal-growth' | 'fertility' | 'ovulation' | 'period' | 'fertility-window' | 'implantation'
  | 'hcg-doubling' | 'conception-date' | 'due-by-conception' | 'naegeles' | 'preg-week' | 'edd' | 'expected-dd'
  | 'child-bmi' | 'infant-growth' | 'height-predict' | 'target-height' | 'bone-age'
  | 'peds-bp' | 'peds-fever' | 'formula-amount' | 'ibuprofen' | 'apgar'
  | 'sleep-cycle' | 'bedtime' | 'wake-up' | 'sleep-debt' | 'power-nap' | 'circadian'
  | 'phq9' | 'gad7' | 'stress' | 'burnout' | 'wellbeing' | 'resilience'
  | 'drug-dosage' | 'iv-drip' | 'fluid-resus' | 'crcl' | 'egfr' | 'bsa' | 'anion-gap'
  | 'o2-sat' | 'a-a-gradient' | 'gcs' | 'apache' | 'meld' | 'child-pugh' | 'curb65' | 'psi'
  | 'ibw' | 'abw' | 'corrected-calcium' | 'fena' | 'qtc' | 'valve-area' | 'lvesv'
  | 'bac' | 'alcohol-cal' | 'caffeine-halflife' | 'caffeine-bev' | 'hangover' | 'ciwa'
  | 'default'

const calcTypeMap: Record<string, CalcType> = {
  'bmi-calculator': 'bmi',
  'calorie-calculator': 'calorie',
  'bmr-calculator': 'bmr',
  'tdee-calculator': 'tdee',
  'macro-calculator': 'macro',
  'body-fat-calculator': 'body-fat',
  'army-body-fat-calculator': 'army-bf',
  'lean-body-mass-calculator': 'lbm',
  'target-heart-rate-calculator': 'target-hr',
  'pregnancy-calculator': 'pregnancy',
  'pregnancy-weight-gain-calculator': 'preg-weight',
  'pregnancy-conception-calculator': 'conception-date',
  'due-date-calculator': 'edd',
  'ovulation-calculator': 'ovulation',
  'period-calculator': 'period',
  'pace-calculator': 'pace',
  'blood-pressure-calculator': 'bp',
  'mean-arterial-pressure': 'map',
  'pulse-pressure': 'pulse-pressure',
  'cardiac-output': 'cardiac-output',
  'stroke-volume': 'stroke-volume',
  'ejection-fraction': 'ejection-fraction',
  'heart-age': 'heart-age',
  'framingham-risk-score': 'framingham',
  'ascvd-risk': 'ascvd',
  'chads-vasc-score': 'chads-vasc',
  'heart-rate-zone': 'hr-zone',
  'target-heart-rate': 'heart-rate-target',
  'waist-to-hip-ratio': 'whr',
  'waist-to-height-ratio': 'whtr',
  'body-roundness-index': 'body-roundness',
  'ponderal-index': 'ponderal',
  'frame-size': 'frame-size',
  'lean-body-mass': 'lean-mass',
  'fat-free-mass-index': 'ffmi',
  'skeletal-muscle-mass': 'smm',
  'body-fat-caliper': 'body-fat-caliper',
  'navy-body-fat': 'navy-body-fat',
  'vo2-max-estimate': 'vo2-max',
  'met-minutes': 'met-minutes',
  'exercise-heart-rate': 'exercise-hr',
  'recovery-heart-rate': 'recovery-hr',
  'heart-rate-variability': 'hrv',
  'training-impulse': 'trimp',
  'fitness-age': 'fitness-age',
  'physical-activity-level': 'pal',
  'pal-calculator': 'pal-calc',
  'neat-calculator': 'neat',
  'protein-calculator': 'protein',
  'carb-calculator': 'carb',
  'fat-calculator': 'fat-calc',
  'fiber-calculator': 'fiber',
  'sugar-calculator': 'sugar',
  'sodium-calculator': 'sodium',
  'vitamin-d-calculator': 'vitamin-d',
  'calcium-calculator': 'calcium',
  'iron-calculator': 'iron',
  'water-needs-calculator': 'water-needs',
  'saturated-fat-calculator': 'saturated-fat',
  'added-sugar-calculator': 'added-sugar',
  'pregnancy-weight-gain': 'preg-gain',
  'gestational-age': 'gestational',
  'fetal-growth-percentile': 'fetal-growth',
  'fertility-window': 'fertility-window',
  'implantation-date': 'implantation',
  'hcg-doubling-time': 'hcg-doubling',
  'due-date-by-conception': 'due-by-conception',
  'naegeles-rule': 'naegeles',
  'pregnancy-week-calculator': 'preg-week',
  'expected-delivery-date': 'expected-dd',
  'child-bmi-percentile': 'child-bmi',
  'infant-growth-percentile': 'infant-growth',
  'height-predictor': 'height-predict',
  'target-height': 'target-height',
  'bone-age': 'bone-age',
  'pediatric-blood-pressure': 'peds-bp',
  'pediatric-fever': 'peds-fever',
  'infant-formula-amount': 'formula-amount',
  'children-ibuprofen-dosage': 'ibuprofen',
  'apgar-score': 'apgar',
  'sleep-cycle-calculator': 'sleep-cycle',
  'bedtime-calculator': 'bedtime',
  'wake-up-time-calculator': 'wake-up',
  'sleep-debt': 'sleep-debt',
  'power-nap': 'power-nap',
  'circadian-rhythm': 'circadian',
  'phq9-depression-score': 'phq9',
  'gad7-anxiety-score': 'gad7',
  'stress-level': 'stress',
  'burnout-assessment': 'burnout',
  'well-being-index': 'wellbeing',
  'resilience-score': 'resilience',
  'drug-dosage-calculator': 'drug-dosage',
  'iv-drip-rate': 'iv-drip',
  'fluid-resuscitation': 'fluid-resus',
  'creatinine-clearance': 'crcl',
  'egfr-calculator': 'egfr',
  'bsa-calculator': 'bsa',
  'anion-gap': 'anion-gap',
  'oxygen-saturation': 'o2-sat',
  'alveolar-arterial-gradient': 'a-a-gradient',
  'glasgow-coma-scale': 'gcs',
  'apache-score': 'apache',
  'meld-score': 'meld',
  'child-pugh-score': 'child-pugh',
  'curb65-score': 'curb65',
  'pneumonia-severity-index': 'psi',
  'ideal-body-weight': 'ibw',
  'adjusted-body-weight': 'abw',
  'corrected-calcium': 'corrected-calcium',
  'fena-calculator': 'fena',
  'qtc-calculator': 'qtc',
  'blood-alcohol-content': 'bac',
  'alcohol-calories': 'alcohol-cal',
  'caffeine-half-life': 'caffeine-halflife',
  'caffeine-by-beverage': 'caffeine-bev',
  'hangover-severity': 'hangover',
  'ciwa-score': 'ciwa',
}

function getCalcType(slug: string): CalcType {
  if (calcTypeMap[slug]) return calcTypeMap[slug]
  const m = slug.match(/-(bmi|bmr|body-fat|calorie|macro|heart-rate|blood-pressure|sleep|water|vitamin)-\d+$/)
  if (m) {
    const kw = m[1]
    if (kw === 'bmi') return 'bmi'
    if (kw === 'bmr') return 'bmr'
    if (kw === 'body-fat') return 'body-fat'
    if (kw === 'calorie') return 'calorie'
    if (kw === 'macro') return 'macro'
    if (kw === 'heart-rate') return 'heart-rate'
    if (kw === 'blood-pressure') return 'bp'
    if (kw === 'sleep') return 'sleep-cycle'
    if (kw === 'water') return 'water-needs'
    if (kw === 'vitamin') return 'vitamin-d'
  }
  return 'default'
}
const bmiSchema = z.object({
  weight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  height: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
})

const pregnancySchema = z.object({
  lmp: z.string().min(1),
  cycle: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 21 && parseFloat(v) <= 45, '21-45'),
})

const paceSchema = z.object({
  distance: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  hours: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, '>=0'),
  minutes: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, '>=0'),
  seconds: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, '>=0'),
  unit: z.enum(['km', 'mi']),
})

const bpSchema = z.object({
  systolic: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 50 && parseFloat(v) <= 300, '50-300'),
  diastolic: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 20 && parseFloat(v) <= 200, '20-200'),
})

const cardiacOutputSchema = z.object({
  heartRate: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 20 && parseFloat(v) <= 300, '20-300'),
  strokeVolumeMl: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 10 && parseFloat(v) <= 250, '10-250'),
})

const strokeVolumeSchema = z.object({
  edv: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  esv: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, '>=0'),
})

const heartAgeSchema = z.object({
  age: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 18 && parseFloat(v) <= 100, '18-100'),
  systolic: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 60 && parseFloat(v) <= 300, '60-300'),
  bmi: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  smoker: z.enum(['yes', 'no']),
})

const framinghamSchema = z.object({
  age: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 30 && parseFloat(v) <= 79, '30-79'),
  totalChol: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  hdl: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  systolic: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 60 && parseFloat(v) <= 300, '60-300'),
  smoker: z.enum(['yes', 'no']),
  diabetic: z.enum(['yes', 'no']),
  treated: z.enum(['yes', 'no']),
  gender: z.enum(['male', 'female']),
})

const ascvdSchema = z.object({
  age: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 40 && parseFloat(v) <= 79, '40-79'),
  totalChol: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  hdl: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  systolic: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 60 && parseFloat(v) <= 300, '60-300'),
  smoker: z.enum(['yes', 'no']),
  diabetic: z.enum(['yes', 'no']),
  hypertensive: z.enum(['yes', 'no']),
  gender: z.enum(['male', 'female']),
})

const chadsVascSchema = z.object({
  age: z.enum(['under65', '65to74', '75plus']),
  hypertensive: z.enum(['yes', 'no']),
  diabetic: z.enum(['yes', 'no']),
  stroke: z.enum(['yes', 'no']),
  vascularDisease: z.enum(['yes', 'no']),
  female: z.enum(['yes', 'no']),
  heartFailure: z.enum(['yes', 'no']),
})

const hrZoneSchema = z.object({
  age: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 120, '1-120'),
  intensity: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 10 && parseFloat(v) <= 100, '10-100'),
})

const targetHrSchema = z.object({
  age: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 120, '1-120'),
  restHR: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 30 && parseFloat(v) <= 150, '30-150'),
  intensity: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 10 && parseFloat(v) <= 100, '10-100'),
})

const whrSchema = z.object({
  waist: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  hip: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
})

const whtrSchema = z.object({
  waist: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  height: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
})

const bodyRoundnessSchema = z.object({
  waist: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  height: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  hip: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
})

const ponderalSchema = z.object({
  weight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  height: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
})

const frameSizeSchema = z.object({
  height: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  wrist: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  gender: z.enum(['male', 'female']),
})

const lbmSchema = z.object({
  weight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  height: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  gender: z.enum(['male', 'female']),
})

const ffmiSchema = z.object({
  weight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  height: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  bodyFatPct: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 2 && parseFloat(v) <= 60, '2-60'),
})

const smmSchema = z.object({
  weight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  height: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  age: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 18 && parseFloat(v) <= 100, '18-100'),
  gender: z.enum(['male', 'female']),
})

const bodyFatCaliperSchema = z.object({
  chest: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 2 && parseFloat(v) <= 60, '2-60mm'),
  abdomen: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 2 && parseFloat(v) <= 60, '2-60mm'),
  thigh: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 2 && parseFloat(v) <= 60, '2-60mm'),
  age: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 18 && parseFloat(v) <= 100, '18-100'),
  gender: z.enum(['male', 'female']),
})

const navyBodyFatSchema = z.object({
  height: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  waist: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  neck: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  hip: z.string().optional(),
  gender: z.enum(['male', 'female']),
})

const vo2MaxSchema = z.object({
  age: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 18 && parseFloat(v) <= 100, '18-100'),
  restHR: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 30 && parseFloat(v) <= 150, '30-150'),
  gender: z.enum(['male', 'female']),
})

const metMinutesSchema = z.object({
  met: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0.5 && parseFloat(v) <= 20, '0.5-20'),
  minutes: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 1440, '1-1440'),
  days: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 7, '1-7'),
})

const recoveryHrSchema = z.object({
  hrPeak: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 60 && parseFloat(v) <= 250, '60-250'),
  hrAfter1: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 30 && parseFloat(v) <= 200, '30-200'),
})

const hrvSchema = z.object({ rmssd: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 500, '1-500') })

const trimpSchema = z.object({
  duration: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  avgHR: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 30 && parseFloat(v) <= 250, '30-250'),
  restHR: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 30 && parseFloat(v) <= 150, '30-150'),
  maxHR: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 60 && parseFloat(v) <= 250, '60-250'),
  gender: z.enum(['male', 'female']),
})

const fitnessAgeSchema = z.object({
  age: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 18 && parseFloat(v) <= 90, '18-90'),
  restHR: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 30 && parseFloat(v) <= 150, '30-150'),
  bmi: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  activityDays: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 7, '0-7'),
})

const palSchema = z.object({
  sleep: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 4 && parseFloat(v) <= 12, '4-12'),
  sedentary: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 24, '0-24'),
  light: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 24, '0-24'),
  moderate: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 24, '0-24'),
  vigorous: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 24, '0-24'),
})

const neatSchema = z.object({
  steps: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 100000, '0-100k'),
  standing: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 24, '0-24'),
  walking: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 24, '0-24'),
  weight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
})

const proteinSchema = z.object({
  weight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  activity: z.enum(['sedentary', 'light', 'moderate', 'active', 'very-active']),
})

const carbSchema = z.object({
  weight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  activity: z.enum(['sedentary', 'light', 'moderate', 'active', 'very-active']),
})

const fatCalcSchema = z.object({
  weight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  activity: z.enum(['sedentary', 'light', 'moderate', 'active', 'very-active']),
})

const fiberSchema = z.object({
  age: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 120, '1-120'),
  gender: z.enum(['male', 'female']),
})

const sugarSchema = z.object({
  calories: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 500 && parseFloat(v) <= 10000, '500-10k'),
})

const sodiumSchema = z.object({
  age: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 120, '1-120'),
})

const vitaminDSchema = z.object({
  age: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 120, '1-120'),
  sunExposure: z.enum(['low', 'moderate', 'high']),
})

const calciumSchema = z.object({
  age: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 120, '1-120'),
  gender: z.enum(['male', 'female']),
  pregnant: z.enum(['yes', 'no']),
})

const ironSchema = z.object({
  age: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 120, '1-120'),
  gender: z.enum(['male', 'female']),
  pregnant: z.enum(['yes', 'no']),
})

const waterNeedsSchema = z.object({
  weight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  activity: z.enum(['sedentary', 'light', 'moderate', 'active', 'very-active']),
  climate: z.enum(['cool', 'temperate', 'hot']),
})

const saturatedFatSchema = z.object({
  calories: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 500 && parseFloat(v) <= 10000, '500-10k'),
})

const addedSugarSchema = z.object({
  calories: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 500 && parseFloat(v) <= 10000, '500-10k'),
})

const pregWeightSchema = z.object({
  preWeight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  height: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  week: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 42, '1-42'),
})

const gestationalSchema = z.object({ lmp: z.string().min(1) })
const fetalGrowthSchema = z.object({
  fundalHeight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 10 && parseFloat(v) <= 50, '10-50cm'),
  week: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 12 && parseFloat(v) <= 42, '12-42'),
})

const fertilitySchema = z.object({
  cycleLength: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 21 && parseFloat(v) <= 45, '21-45'),
  periodLength: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 15, '1-15'),
})

const implantationSchema = z.object({
  ovulationDay: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 7 && parseFloat(v) <= 25, '7-25'),
})

const hcgDoublingSchema = z.object({
  hcg1: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  hcg2: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  daysBetween: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 14, '1-14'),
})

const dueDateConceptionSchema = z.object({ conceptionDate: z.string().min(1) })
const naegelesSchema = z.object({ lmp: z.string().min(1), cycleLength: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 21 && parseFloat(v) <= 45, '21-45') })
const pregWeekSchema = z.object({ lmp: z.string().min(1) })
const eddSchema = z.object({ lmp: z.string().min(1) })

const childBmiSchema = z.object({
  weight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  height: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  age: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 2 && parseFloat(v) <= 20, '2-20'),
  gender: z.enum(['male', 'female']),
})

const infantGrowthSchema = z.object({
  weight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  length: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  ageMonths: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 36, '0-36'),
  gender: z.enum(['male', 'female']),
})

const heightPredictSchema = z.object({
  motherHeight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  fatherHeight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  gender: z.enum(['male', 'female']),
})

const targetHeightSchema = z.object({
  motherHeight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  fatherHeight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  childAge: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 18, '1-18'),
  childHeight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  gender: z.enum(['male', 'female']),
})

const boneAgeSchema = z.object({
  age: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 18, '1-18'),
  height: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  weight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  gender: z.enum(['male', 'female']),
})

const pedsBpSchema = z.object({
  age: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 17, '1-17'),
  systolic: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 50 && parseFloat(v) <= 200, '50-200'),
  diastolic: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 30 && parseFloat(v) <= 150, '30-150'),
  heightCm: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  gender: z.enum(['male', 'female']),
})

const pedsFeverSchema = z.object({
  temperature: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 35 && parseFloat(v) <= 42, '35-42'),
  ageMonths: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 216, '0-216'),
  method: z.enum(['rectal', 'oral', 'axillary', 'tympanic']),
})

const formulaAmountSchema = z.object({
  weight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  ageMonths: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 12, '0-12'),
})

const ibuprofenSchema = z.object({ weight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0') })

const apgarSchema = z.object({
  appearance: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 2, '0-2'),
  pulse: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 2, '0-2'),
  grimace: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 2, '0-2'),
  activity: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 2, '0-2'),
  respiration: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 2, '0-2'),
})

const sleepCycleSchema = z.object({
  hours: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 24, '1-24'),
  minutes: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 59, '0-59'),
})

const bedtimeSchema = z.object({
  wakeTime: z.string().min(1),
  cycles: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 8, '1-8'),
})

const wakeUpSchema = z.object({
  bedtime: z.string().min(1),
  cycles: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 8, '1-8'),
})

const sleepDebtSchema = z.object({
  weekdaySleep: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 24, '0-24'),
  weekendSleep: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 24, '0-24'),
})

const powerNapSchema = z.object({ napMinutes: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 180, '1-180') })
const circadianSchema = z.object({ wakeTime: z.string().min(1), bedTime: z.string().min(1) })

const phq9Schema = z.object({
  q1: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 3, '0-3'),
  q2: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 3, '0-3'),
  q3: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 3, '0-3'),
  q4: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 3, '0-3'),
  q5: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 3, '0-3'),
  q6: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 3, '0-3'),
  q7: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 3, '0-3'),
  q8: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 3, '0-3'),
  q9: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 3, '0-3'),
})

const gad7Schema = z.object({
  q1: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 3, '0-3'),
  q2: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 3, '0-3'),
  q3: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 3, '0-3'),
  q4: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 3, '0-3'),
  q5: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 3, '0-3'),
  q6: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 3, '0-3'),
  q7: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 3, '0-3'),
})

const stressSchema = z.object({
  frequency: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 4, '0-4'),
  control: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 4, '0-4'),
  coping: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 4, '0-4'),
})

const burnoutSchema = z.object({
  exhaustion: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 10, '0-10'),
  cynicism: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 10, '0-10'),
  efficacy: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 10, '0-10'),
})

const wellbeingSchema = z.object({
  happiness: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 10, '0-10'),
  satisfaction: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 10, '0-10'),
  meaning: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 10, '0-10'),
})

const resilienceSchema = z.object({
  adaptability: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 4, '0-4'),
  optimism: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 4, '0-4'),
  support: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 4, '0-4'),
})

const drugDosageSchema = z.object({
  weight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  dosePerKg: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
})

const ivDripSchema = z.object({
  volume: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  hours: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  dropFactor: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 10 && parseFloat(v) <= 60, '10-60'),
})

const fluidResusSchema = z.object({
  weight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  percentBurn: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 100, '0-100'),
})

const crclSchema = z.object({
  age: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 18 && parseFloat(v) <= 110, '18-110'),
  weight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  creatinine: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  gender: z.enum(['male', 'female']),
})

const egfrSchema = z.object({
  age: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 18 && parseFloat(v) <= 110, '18-110'),
  creatinine: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  gender: z.enum(['male', 'female']),
  race: z.enum(['black', 'non-black']),
})

const bsaSchema = z.object({
  weight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  height: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
})

const anionGapSchema = z.object({
  sodium: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 100 && parseFloat(v) <= 180, '100-180'),
  chloride: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 60 && parseFloat(v) <= 140, '60-140'),
  bicarbonate: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 5 && parseFloat(v) <= 50, '5-50'),
})

const o2SatSchema = z.object({ paO2: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 20 && parseFloat(v) <= 700, '20-700') })

const aAGradientSchema = z.object({
  fiO2: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0.21 && parseFloat(v) <= 1.0, '0.21-1.0'),
  paCO2: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 10 && parseFloat(v) <= 150, '10-150'),
  paO2: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 20 && parseFloat(v) <= 700, '20-700'),
  age: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 110, '1-110'),
})

const gcsSchema = z.object({
  eye: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 4, '1-4'),
  verbal: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 5, '1-5'),
  motor: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 6, '1-6'),
})

const apacheSchema = z.object({
  age: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 18 && parseFloat(v) <= 110, '18-110'),
  temperature: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 30 && parseFloat(v) <= 45, '30-45'),
  heartRate: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 20 && parseFloat(v) <= 300, '20-300'),
  respiratoryRate: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 5 && parseFloat(v) <= 100, '5-100'),
  gcs: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 3 && parseFloat(v) <= 15, '3-15'),
  creatinine: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  agePoints: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 6, '0-6'),
})

const meldSchema = z.object({
  bilirubin: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 100, '0-100'),
  inr: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0.5 && parseFloat(v) <= 10, '0.5-10'),
  creatinine: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 20, '0-20'),
  dialysis: z.enum(['yes', 'no']),
})

const childPughSchema = z.object({
  bilirubin: z.enum(['under2', '2to3', 'over3']),
  albumin: z.enum(['over3.5', '2.8to3.5', 'under2.8']),
  inr: z.enum(['under1.7', '1.7to2.3', 'over2.3']),
  ascites: z.enum(['none', 'mild', 'moderate']),
  encephalopathy: z.enum(['none', 'grade1-2', 'grade3-4']),
})

const curb65Schema = z.object({
  confusion: z.enum(['yes', 'no']),
  bun: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 200, '0-200'),
  respiratoryRate: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 5 && parseFloat(v) <= 100, '5-100'),
  systolic: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 50 && parseFloat(v) <= 300, '50-300'),
  age: z.enum(['under65', '65plus']),
})

const psiSchema = z.object({
  age: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 18 && parseFloat(v) <= 110, '18-110'),
  nursingHome: z.enum(['yes', 'no']),
  neoplasm: z.enum(['yes', 'no']),
  liver: z.enum(['yes', 'no']),
  heartFailure: z.enum(['yes', 'no']),
  cerebrovascular: z.enum(['yes', 'no']),
  renal: z.enum(['yes', 'no']),
  alteredMental: z.enum(['yes', 'no']),
  respiratoryRate: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 5 && parseFloat(v) <= 100, '5-100'),
  systolic: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 50 && parseFloat(v) <= 300, '50-300'),
  temperature: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 30 && parseFloat(v) <= 45, '30-45'),
  heartRate: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 20 && parseFloat(v) <= 300, '20-300'),
  ph: z.enum(['under7.35', '7.35plus']),
  sodium: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 100 && parseFloat(v) <= 180, '100-180'),
  glucose: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 20 && parseFloat(v) <= 1000, '20-1000'),
  hematocrit: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 10 && parseFloat(v) <= 60, '10-60'),
  paO2: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 20 && parseFloat(v) <= 700, '20-700'),
  pleuralEffusion: z.enum(['yes', 'no']),
  gender: z.enum(['male', 'female']),
})

const ibwSchema = z.object({
  height: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  gender: z.enum(['male', 'female']),
})

const correctedCalciumSchema = z.object({
  calcium: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 5 && parseFloat(v) <= 20, '5-20'),
  albumin: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 7, '1-7'),
})

const fenaSchema = z.object({
  serumNa: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 100 && parseFloat(v) <= 180, '100-180'),
  urineNa: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 300, '0-300'),
  serumCr: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0.1 && parseFloat(v) <= 20, '0.1-20'),
  urineCr: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 500, '0-500'),
})

const qtcSchema = z.object({
  qtInterval: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 200 && parseFloat(v) <= 700, '200-700'),
  rrInterval: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 400 && parseFloat(v) <= 2000, '400-2000'),
})

const bacSchema = z.object({
  drinks: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 50, '0-50'),
  weight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  hours: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 48, '0-48'),
  gender: z.enum(['male', 'female']),
})

const alcoholCalSchema = z.object({
  drinks: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 50, '0-50'),
  ozPerDrink: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  abv: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && parseFloat(v) <= 100, '1-100'),
})

const caffeineHalflifeSchema = z.object({
  mg: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 2000, '0-2000'),
  hoursElapsed: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 72, '0-72'),
})

const caffeineBevSchema = z.object({
  beverage: z.enum(['coffee', 'espresso', 'tea', 'soda', 'energy', 'preworkout']),
  servings: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0.5 && parseFloat(v) <= 20, '0.5-20'),
})

const hangoverSchema = z.object({
  drinks: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 50, '0-50'),
  weight: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, '>0'),
  hours: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 48, '0-48'),
  gender: z.enum(['male', 'female']),
})

const ciwaSchema = z.object({
  nausea: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 7, '0-7'),
  tremor: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 7, '0-7'),
  sweats: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 7, '0-7'),
  anxiety: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 7, '0-7'),
  agitation: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 7, '0-7'),
  orientation: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 4, '0-4'),
})

function BMIResults({ weight, height, weightUnit, heightUnit }: { weight: number; height: number; weightUnit: string; heightUnit: string }) {
  const weightKg = toBaseUnit(weight, weightUnit)
  const heightM = toBaseUnit(height, heightUnit)
  const bmi = weightKg > 0 && heightM > 0 ? weightKg / (heightM ** 2) : 0
  const bmiPrime = bmi / 25
  const category = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'
  const color = bmi < 18.5 || bmi >= 30 ? 'text-[#d62828]' : bmi < 25 ? 'text-[#06b6d4]' : 'text-amber-500'
  return (
    <div className="text-center space-y-4">
      <div><p className="text-sm text-gray-500">Your BMI</p><p className="text-3xl font-bold">{bmi.toFixed(1)}</p></div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-gray-400">BMI Prime</p><p className="text-lg font-bold">{bmiPrime.toFixed(2)}</p></div>
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-gray-400">Category</p><p className="text-lg font-bold">{category}</p></div>
      </div>
      <div className="text-xs text-gray-400 space-y-1"><p>Underweight: &lt;18.5 | Normal: 18.5-24.9 | Overweight: 25-29.9 | Obese: =30</p></div>
    </div>
  )
}

function BMIScaleBar({ bmi }: { bmi: number }) {
  const clamped = Math.max(12, Math.min(42, bmi))
  const pct = ((clamped - 12) / 30) * 100
  const segments = [
    { label: 'UW', range: [0, 18.5], color: 'bg-blue-400' },
    { label: 'Normal', range: [18.5, 25], color: 'bg-green-400' },
    { label: 'OW', range: [25, 30], color: 'bg-amber-400' },
    { label: 'Obese', range: [30, 45], color: 'bg-red-400' },
  ]
  return (
    <div className="space-y-1">
      <div className="relative h-5 w-full rounded-full overflow-hidden flex">
        {segments.map((s, i) => <div key={i} className={s.color} style={{ flex: `${((s.range[1] - s.range[0]) / 30 * 100)}%` }} />)}
        <div className="absolute top-0 bottom-0 w-0.5 bg-black dark:bg-white transition-all" style={{ left: `${pct}%` }}><div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold whitespace-nowrap">{bmi.toFixed(1)}</div></div>
      </div>
      <div className="flex justify-between text-[10px] text-gray-400"><span>12</span><span>18.5</span><span>25</span><span>30</span><span>42</span></div>
    </div>
  )
}

function CalorieResults({ age, weight, height, weightUnit, heightUnit, gender }: { age: number; weight: number; height: number; weightUnit: string; heightUnit: string; gender: string }) {
  const weightKg = toBaseUnit(weight, weightUnit)
  const heightCm = toBaseUnit(height, heightUnit) * 100
  const bmr = gender === 'male' ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5 : 10 * weightKg + 6.25 * heightCm - 5 * age - 161
  return (
    <div className="text-center space-y-4">
      <div><p className="text-sm text-gray-500">BMR (Resting Calories)</p><p className="text-3xl font-bold text-[#06b6d4]">{bmr.toFixed(0)} cal/day</p></div>
      <div className="text-xs text-gray-400 space-y-1">
        <p>Sedentary: {(bmr * 1.2).toFixed(0)} | Light: {(bmr * 1.375).toFixed(0)} | Moderate: {(bmr * 1.55).toFixed(0)}</p>
        <p>Active: {(bmr * 1.725).toFixed(0)} | Very Active: {(bmr * 1.9).toFixed(0)}</p>
      </div>
    </div>
  )
}

function PregnancyResults({ lmp, cycle }: { lmp: string; cycle: number }) {
  const lmpDate = new Date(lmp)
  const dueDate = new Date(lmpDate); dueDate.setDate(dueDate.getDate() + 280)
  const today = new Date()
  const weeks = Math.floor((today.getTime() - lmpDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
  return (
    <div className="text-center space-y-4">
      <div><p className="text-sm text-gray-500">Estimated Due Date</p><p className="text-3xl font-bold text-[#06b6d4]">{dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p></div>
      <div><p className="text-sm text-gray-500">Current Week</p><p className="text-xl font-bold text-gray-900 dark:text-white">{Math.max(0, Math.min(40, weeks))} weeks</p></div>
    </div>
  )
}

function PaceResults({ distance, hours, minutes, seconds, unit }: { distance: number; hours: number; minutes: number; seconds: number; unit: string }) {
  const totalSeconds = hours * 3600 + minutes * 60 + seconds
  const pacePerKm = totalSeconds / distance
  const paceMin = Math.floor(pacePerKm / 60); const paceSec = Math.floor(pacePerKm % 60)
  const speed = distance / (totalSeconds / 3600)
  return (
    <div className="text-center space-y-4">
      <div><p className="text-sm text-gray-500">Pace</p><p className="text-3xl font-bold text-[#06b6d4]">{paceMin}:{paceSec.toString().padStart(2, '0')} /{unit}</p></div>
      <div><p className="text-sm text-gray-500">Speed</p><p className="text-xl font-bold text-gray-900 dark:text-white">{speed.toFixed(1)} {unit}/h</p></div>
    </div>
  )
}

function BPResults({ systolic, diastolic }: { systolic: number; diastolic: number }) {
  const meanMap = diastolic + (systolic - diastolic) / 3
  const pp = systolic - diastolic
  let category = 'Normal'; let color = 'text-[#06b6d4]'
  if (systolic >= 180 || diastolic >= 120) { category = 'Crisis'; color = 'text-[#d62828]' }
  else if (systolic >= 140 || diastolic >= 90) { category = 'Stage 2 HTN'; color = 'text-[#d62828]' }
  else if (systolic >= 130 || diastolic >= 80) { category = 'Stage 1 HTN'; color = 'text-amber-500' }
  else if (systolic >= 120) { category = 'Elevated'; color = 'text-amber-500' }
  return (
    <div className="text-center space-y-4">
      <div><p className="text-sm text-gray-500">Blood Pressure</p><p className="text-3xl font-bold">{systolic}/{diastolic} <span className="text-sm font-normal">mmHg</span></p></div>
      <div className="text-lg font-bold">{category}</div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-gray-400">MAP</p><p className="text-lg font-bold text-[#06b6d4]">{meanMap.toFixed(0)} mmHg</p></div>
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-gray-400">Pulse Pressure</p><p className="text-lg font-bold text-[#06b6d4]">{pp.toFixed(0)} mmHg</p></div>
      </div>
    </div>
  )
  }

function BmrResults({ age, weight, height, weightUnit, heightUnit, gender }: { age: number; weight: number; height: number; weightUnit: string; heightUnit: string; gender: string }) {
  const weightKg = toBaseUnit(weight, weightUnit)
  const heightCm = toBaseUnit(height, heightUnit) * 100
  const bmr = gender === 'male' ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5 : 10 * weightKg + 6.25 * heightCm - 5 * age - 161
  return (
    <div className="text-center space-y-4">
      <div><p className="text-sm text-gray-500">BMR (Resting Calories)</p><p className="text-3xl font-bold text-[#06b6d4]">{bmr.toFixed(0)} cal/day</p></div>
      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-xs"><p className="text-gray-400">This is your basal metabolic rate — calories your body needs at complete rest.</p></div>
    </div>
  )
}

function TdeeResults({ age, weight, height, weightUnit, heightUnit, gender, activity }: { age: number; weight: number; height: number; weightUnit: string; heightUnit: string; gender: string; activity: string }) {
  const weightKg = toBaseUnit(weight, weightUnit)
  const heightCm = toBaseUnit(height, heightUnit) * 100
  const bmr = gender === 'male' ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5 : 10 * weightKg + 6.25 * heightCm - 5 * age - 161
  const mults: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, 'very-active': 1.9 }
  const tdee = bmr * (mults[activity] || 1.2)
  return (
    <div className="text-center space-y-4">
      <div><p className="text-sm text-gray-500">TDEE (Total Daily Energy Expenditure)</p><p className="text-3xl font-bold text-[#06b6d4]">{tdee.toFixed(0)} cal/day</p></div>
      <div className="text-xs text-gray-400"><p>BMR: {bmr.toFixed(0)} cal/day × Activity Multiplier: {mults[activity] || 1.2}</p></div>
    </div>
  )
}

function MacroResults({ calories, activity, gender }: { calories: number; activity: string; gender: string }) {
  const mults: Record<string, number> = { sedentary: 0.3, light: 0.3, moderate: 0.35, active: 0.4, 'very-active': 0.45 }
  const proteinPct = mults[activity] || 0.3
  const fatPct = 0.25
  const carbPct = 1 - proteinPct - fatPct
  const proteinG = (calories * proteinPct) / 4
  const fatG = (calories * fatPct) / 9
  const carbG = (calories * carbPct) / 4
  return (
    <div className="text-center space-y-4">
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-gray-400">Protein</p><p className="text-lg font-bold text-[#06b6d4]">{proteinG.toFixed(0)}g</p><p className="text-gray-400">{(proteinPct * 100).toFixed(0)}%</p></div>
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-gray-400">Carbs</p><p className="text-lg font-bold text-amber-500">{carbG.toFixed(0)}g</p><p className="text-gray-400">{(carbPct * 100).toFixed(0)}%</p></div>
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-gray-400">Fat</p><p className="text-lg font-bold text-[#d62828]">{fatG.toFixed(0)}g</p><p className="text-gray-400">{(fatPct * 100).toFixed(0)}%</p></div>
      </div>
    </div>
  )
}

function ArmyBfResults({ height, waist, neck, hip, gender }: { height: number; waist: number; neck: number; hip?: string; gender: string }) {
  const heightIn = height / 2.54
  const waistIn = waist / 2.54
  const neckIn = neck / 2.54
  const hipIn = (hip ? parseFloat(hip) : 0) / 2.54
  let bf = 0
  if (gender === 'male') {
    bf = 86.010 * Math.log10(waistIn - neckIn) - 70.041 * Math.log10(heightIn) + 36.76
  } else {
    bf = 163.205 * Math.log10(waistIn + hipIn - neckIn) - 97.684 * Math.log10(heightIn) - 78.387
  }
  bf = Math.max(2, Math.min(60, bf))
  const cat = bf < 12 ? 'Essential' : bf < 20 ? 'Athletic' : bf < 24 ? 'Fit' : bf < 30 ? 'Average' : 'Overweight'
  return (
    <div className="text-center space-y-4">
      <div><p className="text-sm text-gray-500">US Army Body Fat</p><p className="text-3xl font-bold text-[#06b6d4]">{bf.toFixed(1)}%</p></div>
      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-xs"><p className="text-gray-400">Category: <span className="font-bold text-gray-900 dark:text-white">{cat}</span></p></div>
    </div>
  )
}

function LeanMassResults({ weight, height, gender, bodyFatPct }: { weight: number; height: number; gender: string; bodyFatPct: number }) {
  const bfDecimal = bodyFatPct / 100
  const fatMass = weight * bfDecimal
  const lbm = weight - fatMass
  return (
    <div className="text-center space-y-4">
      <div><p className="text-sm text-gray-500">Lean Body Mass</p><p className="text-3xl font-bold text-[#06b6d4]">{lbm.toFixed(1)} kg</p></div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-gray-400">Fat Mass</p><p className="text-lg font-bold text-[#d62828]">{fatMass.toFixed(1)} kg</p></div>
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-gray-400">Body Fat</p><p className="text-lg font-bold text-amber-500">{bodyFatPct.toFixed(1)}%</p></div>
      </div>
    </div>
  )
}

function HrTargetResults({ age, restHR, intensity }: { age: number; restHR: number; intensity: number }) {
  const maxHR = 220 - age
  const karvonen = ((maxHR - restHR) * (intensity / 100)) + restHR
  return (
    <div className="text-center space-y-4">
      <div><p className="text-sm text-gray-500">Target Heart Rate (Karvonen)</p><p className="text-3xl font-bold text-[#06b6d4]">{karvonen.toFixed(0)} bpm</p></div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-gray-400">Max HR</p><p className="text-lg font-bold">{maxHR} bpm</p></div>
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-gray-400">HR Reserve</p><p className="text-lg font-bold">{maxHR - restHR} bpm</p></div>
      </div>
    </div>
  )
}

function PregGainResults({ preWeight, height, week, currentWeight }: { preWeight: number; height: number; week: number; currentWeight: number }) {
  const gain = currentWeight - preWeight
  const bmi = preWeight / ((height / 100) ** 2)
  let range: [number, number] = [11.5, 16]
  if (bmi < 18.5) range = [12.7, 18.1]
  else if (bmi < 25) range = [11.5, 16]
  else if (bmi < 30) range = [7, 11.5]
  else range = [5, 9]
  const weeksElapsed = week
  const rate = weeksElapsed > 13 ? gain / weeksElapsed : 0
  return (
    <div className="text-center space-y-4">
      <div><p className="text-sm text-gray-500">Total Weight Gain</p><p className="text-3xl font-bold text-[#06b6d4]">{gain.toFixed(1)} kg</p></div>
      <div className="text-xs text-gray-400 space-y-1">
        <p>Recommended range: {range[0]}–{range[1]} kg</p>
        {rate > 0 && <p>Current rate: {rate.toFixed(2)} kg/week</p>}
      </div>
    </div>
  )
}

function ConceptionDateResults({ dueDate }: { dueDate: string }) {
  const dd = new Date(dueDate)
  const conception = new Date(dd); conception.setDate(conception.getDate() - 266)
  return (
    <div className="text-center space-y-4">
      <div><p className="text-sm text-gray-500">Estimated Conception Date</p><p className="text-3xl font-bold text-[#06b6d4]">{conception.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p></div>
    </div>
  )
}

function DueByConceptionResults({ conceptionDate }: { conceptionDate: string }) {
  const cd = new Date(conceptionDate)
  const due = new Date(cd); due.setDate(due.getDate() + 266)
  return (
    <div className="text-center space-y-4">
      <div><p className="text-sm text-gray-500">Estimated Due Date</p><p className="text-3xl font-bold text-[#06b6d4]">{due.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p></div>
    </div>
  )
}

function ExpectedDdResults({ lmp, cycleLength }: { lmp: string; cycleLength: number }) {
  const lmpDate = new Date(lmp)
  const adjustment = parseFloat(String(cycleLength)) - 28 || 0
  const dueDate = new Date(lmpDate); dueDate.setDate(dueDate.getDate() + 280 + adjustment)
  const today = new Date()
  const weeks = Math.floor((today.getTime() - lmpDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
  return (
    <div className="text-center space-y-4">
      <div><p className="text-sm text-gray-500">Estimated Due Date</p><p className="text-3xl font-bold text-[#06b6d4]">{dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p></div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-gray-400">Current Week</p><p className="text-lg font-bold">{Math.max(0, Math.min(42, weeks))} weeks</p></div>
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-gray-400">Cycle Adjustment</p><p className="text-lg font-bold">{adjustment > 0 ? `+${adjustment}` : adjustment} days</p></div>
      </div>
    </div>
  )
}

function OvulationResults({ cycleLength, periodLength }: { cycleLength: number; periodLength: number }) {
  const ovulationDay = Math.max(7, cycleLength - 14)
  const fertileStart = Math.max(1, ovulationDay - 5)
  const fertileEnd = ovulationDay + 1
  const nextPeriod = cycleLength
  return (
    <div className="text-center space-y-4">
      <div><p className="text-sm text-gray-500">Ovulation Day</p><p className="text-3xl font-bold text-[#06b6d4]">Day {ovulationDay}</p></div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-gray-400">Fertile Window</p><p className="text-lg font-bold">Days {fertileStart}–{fertileEnd}</p></div>
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><p className="text-gray-400">Next Period</p><p className="text-lg font-bold">Day {nextPeriod}</p></div>
      </div>
    </div>
  )
}

function PeriodResults({ cycleLength, periodLength }: { cycleLength: number; periodLength: number }) {
  const today = new Date()
  const cycleDays = cycleLength
  const periodDays = periodLength
  const nextPeriodDate = new Date(today); nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleDays)
  const ovulationDay = cycleDays - 14
  const fertileStart = Math.max(1, ovulationDay - 5)
  return (
    <div className="text-center space-y-4">
      <div><p className="text-sm text-gray-500">Next Period Expected</p><p className="text-3xl font-bold text-[#06b6d4]">{nextPeriodDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p></div>
      <div className="text-xs text-gray-400"><p>{cycleDays}-day cycle, {periodDays}-day period | Ovulation ˜ Day {ovulationDay}</p></div>
    </div>
  )
}

function FertilityWindowResults({ cycleLength, periodLength }: { cycleLength: number; periodLength: number }) {
  const ovulationDay = Math.max(7, cycleLength - 14)
  const fertileStart = Math.max(1, ovulationDay - 5)
  const fertileEnd = ovulationDay + 1
  const fertileDays = fertileEnd - fertileStart + 1
  return (
    <div className="text-center space-y-4">
      <div><p className="text-sm text-gray-500">Fertile Window</p><p className="text-3xl font-bold text-[#06b6d4]">Days {fertileStart}–{fertileEnd}</p></div>
      <div className="text-xs text-gray-400"><p>{fertileDays} fertile days | Ovulation ˜ Day {ovulationDay}</p></div>
    </div>
  )
}

function PalCalcResults({ sleep, sedentary, light, moderate, vigorous }: { sleep: number; light: number; moderate: number; vigorous: number; sedentary: number }) {
  const total = parseFloat(String(sleep)) + parseFloat(String(sedentary)) + parseFloat(String(light)) + parseFloat(String(moderate)) + parseFloat(String(vigorous))
  const pal = total > 0 ? (parseFloat(String(sleep)) * 0.95 + parseFloat(String(sedentary)) * 1.2 + parseFloat(String(light)) * 1.5 + parseFloat(String(moderate)) * 2.0 + parseFloat(String(vigorous)) * 3.0) / 24 : 1.2
  const cat = pal < 1.4 ? 'Sedentary' : pal < 1.6 ? 'Low Active' : pal < 1.8 ? 'Active' : pal < 2.0 ? 'Very Active' : 'Extremely Active'
  return (
    <div className="text-center space-y-4">
      <div><p className="text-sm text-gray-500">Physical Activity Level (PAL)</p><p className="text-3xl font-bold text-[#06b6d4]">{pal.toFixed(2)}</p></div>
      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-xs"><p className="text-gray-400">Category: <span className="font-bold text-gray-900 dark:text-white">{cat}</span></p></div>
    </div>
  )
}

function num(v: string): number { return parseFloat(v) || 0 }

const genNum = (min: number, max: number, msg: string) => z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= min && parseFloat(v) <= max, msg)
const genNumPos = (msg: string) => z.string().min(1, 'Required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, msg)
const enumSchema = <T extends [string, ...string[]]>(opts: T) => z.enum(opts)
const calorieSchema = z.object({ age: genNumPos('>0'), weight: genNumPos('>0'), height: genNumPos('>0'), gender: z.enum(['male', 'female']) })
const bodyFatSchema = z.object({ weight: genNumPos('>0'), height: genNumPos('>0'), gender: z.enum(['male', 'female']) })
const heartRateSchema = z.object({ age: genNumPos('>0') })
const defaultSchema = z.object({ weight: genNumPos('>0'), height: genNumPos('>0') })
const ejectionFractionSchema = z.object({ edv: genNumPos('>0'), esv: genNumPos('>=0') })
const tdeeSchema = z.object({ age: genNumPos('>0'), weight: genNumPos('>0'), height: genNumPos('>0'), gender: z.enum(['male', 'female']), activity: z.enum(['sedentary', 'light', 'moderate', 'active', 'very-active']) })
const macroSchema = z.object({ calories: genNumPos('>0'), activity: z.enum(['sedentary', 'light', 'moderate', 'active', 'very-active']), gender: z.enum(['male', 'female']) })
const armyBfSchema = z.object({ height: genNumPos('>0'), waist: genNumPos('>0'), neck: genNumPos('>0'), hip: z.string().optional(), gender: z.enum(['male', 'female']) })
const leanMassSchema = z.object({ weight: genNumPos('>0'), height: genNumPos('>0'), gender: z.enum(['male', 'female']), bodyFatPct: genNum(2, 60, '2-60') })
const pregGainSchema = z.object({ preWeight: genNumPos('>0'), height: genNumPos('>0'), week: genNum(1, 42, '1-42'), currentWeight: genNumPos('>0') })
const conceptionDateSchema = z.object({ dueDate: z.string().min(1) })
const expectedDdSchema = z.object({ lmp: z.string().min(1), cycleLength: genNum(21, 45, '21-45') })

function getSchemaForType(t: CalcType) {
  const m: Record<string, any> = {
    bmi: bmiSchema, calorie: calorieSchema, bmr: calorieSchema, tdee: tdeeSchema, macro: macroSchema,
    'body-fat': bodyFatSchema, 'army-bf': armyBfSchema, 'heart-rate': heartRateSchema,
    'cardiac-output': cardiacOutputSchema, 'stroke-volume': strokeVolumeSchema, 'ejection-fraction': ejectionFractionSchema,
    'heart-age': heartAgeSchema, framingham: framinghamSchema, ascvd: ascvdSchema, 'chads-vasc': chadsVascSchema,
    'hr-zone': hrZoneSchema, 'target-hr': targetHrSchema, 'heart-rate-target': targetHrSchema, whr: whrSchema, whtr: whtrSchema,
    'body-roundness': whtrSchema, ponderal: ponderalSchema, 'frame-size': frameSizeSchema,
    lbm: lbmSchema, 'lean-mass': leanMassSchema, ffmi: lbmSchema, smm: lbmSchema, 'body-fat-caliper': bodyFatCaliperSchema,
    'navy-body-fat': navyBodyFatSchema, 'vo2-max': vo2MaxSchema, pal: palSchema, 'pal-calc': palSchema, protein: proteinSchema,
    carb: carbSchema, 'fat-calc': fatCalcSchema, fiber: fiberSchema, sugar: sugarSchema, sodium: sodiumSchema,
    'vitamin-d': vitaminDSchema, calcium: calciumSchema, iron: ironSchema, 'water-needs': waterNeedsSchema,
    'saturated-fat': saturatedFatSchema, 'added-sugar': addedSugarSchema,
    'preg-weight': pregWeightSchema, 'preg-gain': pregGainSchema, gestational: gestationalSchema, 'fetal-growth': fetalGrowthSchema,
    fertility: fertilitySchema, ovulation: fertilitySchema, period: fertilitySchema, 'fertility-window': fertilitySchema, implantation: implantationSchema, 'hcg-doubling': hcgDoublingSchema,
    'conception-date': conceptionDateSchema, 'due-by-conception': dueDateConceptionSchema, naegeles: naegelesSchema, 'preg-week': pregWeekSchema,
    edd: eddSchema, 'expected-dd': expectedDdSchema, 'child-bmi': childBmiSchema, 'infant-growth': infantGrowthSchema,
    'height-predict': heightPredictSchema, 'target-height': targetHeightSchema, 'bone-age': boneAgeSchema,
    'peds-bp': pedsBpSchema, 'peds-fever': pedsFeverSchema, 'formula-amount': formulaAmountSchema,
    ibuprofen: ibuprofenSchema, apgar: apgarSchema, 'sleep-cycle': sleepCycleSchema,
    bedtime: bedtimeSchema, 'wake-up': wakeUpSchema, 'sleep-debt': sleepDebtSchema,
    'power-nap': powerNapSchema, circadian: circadianSchema, phq9: phq9Schema, gad7: gad7Schema,
    stress: stressSchema, burnout: burnoutSchema, wellbeing: wellbeingSchema, resilience: resilienceSchema,
    'drug-dosage': drugDosageSchema, 'iv-drip': ivDripSchema, 'fluid-resus': fluidResusSchema,
    crcl: crclSchema, egfr: egfrSchema, bsa: bsaSchema, 'anion-gap': anionGapSchema,
    'o2-sat': o2SatSchema, 'a-a-gradient': aAGradientSchema, gcs: gcsSchema, apache: apacheSchema,
    meld: meldSchema, 'child-pugh': childPughSchema, curb65: curb65Schema, psi: psiSchema,
    ibw: ibwSchema, abw: ibwSchema, 'corrected-calcium': correctedCalciumSchema, fena: fenaSchema,
    qtc: qtcSchema, 'valve-area': cardiacOutputSchema, lvesv: strokeVolumeSchema,
    bac: bacSchema, 'alcohol-cal': alcoholCalSchema, 'caffeine-halflife': caffeineHalflifeSchema,
    'caffeine-bev': caffeineBevSchema, hangover: hangoverSchema, ciwa: ciwaSchema,
  }
  return m[t] || defaultSchema
}

function getResultComponent(t: CalcType) {
  const m: Record<string, any> = {
    bmi: BMIResults, calorie: CalorieResults, bmr: BmrResults, tdee: TdeeResults, macro: MacroResults,
    pregnancy: PregnancyResults, pace: PaceResults,
    bp: BPResults, 'army-bf': ArmyBfResults, 'lean-mass': LeanMassResults,
    'heart-rate-target': HrTargetResults, 'preg-gain': PregGainResults,
    'conception-date': ConceptionDateResults, 'due-by-conception': DueByConceptionResults,
    'expected-dd': ExpectedDdResults,
    ovulation: OvulationResults, period: PeriodResults, 'fertility-window': FertilityWindowResults,
    'pal-calc': PalCalcResults,
  }
  return m[t] || DefaultResults
}

function DefaultResults({ mainValue }: { mainValue: number }) {
  return <div className="text-center"><p className="text-3xl font-bold text-[#06b6d4]">{mainValue.toFixed(1)}</p></div>
}

const healthMeta: Record<string, { mainLabel: string; unit: string }> = {
  bmi: { mainLabel: 'BMI', unit: '' }, calorie: { mainLabel: 'Calories', unit: 'cal/day' },
  bmr: { mainLabel: 'BMR', unit: 'cal/day' }, tdee: { mainLabel: 'TDEE', unit: 'cal/day' },
  macro: { mainLabel: 'Macros', unit: 'g' },
  'body-fat': { mainLabel: 'Body Fat', unit: '%' }, 'army-bf': { mainLabel: 'Body Fat', unit: '%' },
  pregnancy: { mainLabel: 'Due Date', unit: '' },
  pace: { mainLabel: 'Pace', unit: '/km' }, bp: { mainLabel: 'Blood Pressure', unit: 'mmHg' },
  'lean-mass': { mainLabel: 'Lean Mass', unit: 'kg' },
  'target-hr': { mainLabel: 'Target HR', unit: 'bpm' }, 'heart-rate-target': { mainLabel: 'Target HR', unit: 'bpm' },
  'preg-weight': { mainLabel: 'Weight Gain', unit: 'kg' }, 'preg-gain': { mainLabel: 'Weight Gain', unit: 'kg' },
  'conception-date': { mainLabel: 'Conception Date', unit: '' }, 'due-by-conception': { mainLabel: 'Due Date', unit: '' },
  edd: { mainLabel: 'Due Date', unit: '' }, 'expected-dd': { mainLabel: 'Due Date', unit: '' },
  ovulation: { mainLabel: 'Ovulation', unit: 'day' }, period: { mainLabel: 'Next Period', unit: '' },
  'fertility-window': { mainLabel: 'Fertile Window', unit: '' },
  pal: { mainLabel: 'PAL', unit: '' }, 'pal-calc': { mainLabel: 'PAL', unit: '' },
}

function mainValue(t: CalcType, values: any): number {
  const n = (v: string) => parseFloat(v) || 0
  switch (t) {
    case 'bmi': { const w = n(values.weight), h = n(values.height) || 1; const wUnit = values.weightUnit || 'kg'; const hUnit = values.heightUnit || 'cm'; const weightKg = toBaseUnit(w, wUnit); const heightM = toBaseUnit(h, hUnit); return heightM > 0 ? weightKg / (heightM ** 2) : 0 }
    case 'calorie': case 'bmr': case 'tdee': case 'protein': case 'carb': case 'fat-calc': case 'fiber': case 'water-needs': case 'preg-weight': case 'preg-gain': case 'peds-bp': return n(values.weight)
    case 'macro': return n(values.calories)
    case 'bp': case 'map': case 'pulse-pressure': return n(values.systolic)
    case 'pregnancy': case 'gestational': case 'preg-week': case 'edd': case 'expected-dd': return 40
    case 'conception-date': case 'due-by-conception': return 40
    case 'pace': { const h = n(values.hours) || 0, m = n(values.minutes) || 0, s = n(values.seconds) || 0, d = n(values.distance) || 1; return d > 0 ? (h * 60 + m + s / 60) / d : 0 }
    case 'heart-rate': case 'hr-zone': case 'target-hr': case 'heart-rate-target': case 'exercise-hr': return n(values.age)
    case 'whr': return n(values.waist) / (n(values.hip) || 1)
    case 'ovulation': case 'period': case 'fertility-window': return n(values.cycleLength)
    default: { const w = n(values.weight), h = n(values.height) || 1; const wUnit = values.weightUnit || 'kg'; const hUnit = values.heightUnit || 'cm'; const weightKg = toBaseUnit(w, wUnit); const heightM = toBaseUnit(h, hUnit); return heightM > 0 ? weightKg / (heightM ** 2) : 0 }
  }
}

function calcDefaults(slug: string): Record<string, string> {
  const t = calcTypeMap[slug] || 'bmi'
  const defs: Record<string, Record<string, string>> = {
    bmi: { weight: '70', height: '175', weightUnit: 'kg', heightUnit: 'cm', gender: 'male' },
    calorie: { age: '30', weight: '70', height: '175', weightUnit: 'kg', heightUnit: 'cm', gender: 'male' },
    bmr: { age: '30', weight: '70', height: '175', weightUnit: 'kg', heightUnit: 'cm', gender: 'male' },
    tdee: { age: '30', weight: '70', height: '175', weightUnit: 'kg', heightUnit: 'cm', gender: 'male', activity: 'moderate' },
    macro: { calories: '2000', activity: 'moderate', gender: 'male' },
    pregnancy: { lmp: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    pace: { distance: '10', hours: '0', minutes: '45', seconds: '0', unit: 'km' },
    bp: { systolic: '120', diastolic: '80' },
    'lean-mass': { weight: '70', height: '175', weightUnit: 'kg', heightUnit: 'cm', gender: 'male', bodyFatPct: '15' },
    'heart-rate-target': { age: '30', restHR: '70', intensity: '70' },
    'preg-gain': { preWeight: '65', height: '165', week: '20', currentWeight: '70' },
    'conception-date': { dueDate: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    'due-by-conception': { conceptionDate: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    'expected-dd': { lmp: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], cycleLength: '28' },
    ovulation: { cycleLength: '28', periodLength: '5' },
    period: { cycleLength: '28', periodLength: '5' },
    'fertility-window': { cycleLength: '28', periodLength: '5' },
    'pal-calc': { sleep: '8', sedentary: '8', light: '4', moderate: '3', vigorous: '1' },
  }
  return defs[t] || { weight: '70', height: '175', weightUnit: 'kg', heightUnit: 'cm' }
}

const healthPresetsData: Record<string, { label: string; values: Record<string, string> }[]> = {
  bmi: [{ label: 'Normal', values: { weight: '70', height: '175', gender: 'male', weightUnit: 'kg', heightUnit: 'cm' } }, { label: 'Overweight', values: { weight: '90', height: '175', gender: 'male', weightUnit: 'kg', heightUnit: 'cm' } }, { label: 'Obese', values: { weight: '110', height: '175', gender: 'male', weightUnit: 'kg', heightUnit: 'cm' } }],
  bp: [{ label: 'Normal', values: { systolic: '120', diastolic: '80' } }, { label: 'High', values: { systolic: '140', diastolic: '90' } }, { label: 'Crisis', values: { systolic: '180', diastolic: '120' } }],
  bmr: [{ label: 'Average Male', values: { age: '30', weight: '75', height: '178', weightUnit: 'kg', heightUnit: 'cm', gender: 'male' } }, { label: 'Average Female', values: { age: '30', weight: '65', height: '165', weightUnit: 'kg', heightUnit: 'cm', gender: 'female' } }],
  tdee: [{ label: 'Sedentary', values: { age: '30', weight: '75', height: '178', weightUnit: 'kg', heightUnit: 'cm', gender: 'male', activity: 'sedentary' } }, { label: 'Active', values: { age: '30', weight: '75', height: '178', weightUnit: 'kg', heightUnit: 'cm', gender: 'male', activity: 'active' } }],
  macro: [{ label: 'Maintenance', values: { calories: '2200', activity: 'moderate', gender: 'male' } }, { label: 'Cutting', values: { calories: '1800', activity: 'sedentary', gender: 'male' } }],
  'army-bf': [{ label: 'Male Soldier', values: { height: '178', waist: '85', neck: '38', hip: '', gender: 'male' } }, { label: 'Female Soldier', values: { height: '165', waist: '75', neck: '32', hip: '90', gender: 'female' } }],
  ovulation: [{ label: '28-day cycle', values: { cycleLength: '28', periodLength: '5' } }, { label: '32-day cycle', values: { cycleLength: '32', periodLength: '6' } }],
  'pal-calc': [{ label: 'Office Worker', values: { sleep: '8', sedentary: '9', light: '4', moderate: '2', vigorous: '1' } }, { label: 'Active', values: { sleep: '7', sedentary: '6', light: '6', moderate: '3', vigorous: '2' } }],
}

function getHealthPresets(slug: string) { return healthPresetsData[slug] || [] }

const healthFormulas: Record<string, string> = {
  bmi: 'BMI = weight(kg) / height(m)²',
  calorie: 'BMR = 10w + 6.25h - 5a + 5 (male) / -161 (female)',
  bmr: 'BMR = 10w + 6.25h - 5a + 5 (male) / -161 (female)',
  tdee: 'TDEE = BMR × Activity Mult.',
  macro: 'Protein = cal×P%/4, Carbs = cal×C%/4, Fat = cal×F%/9',
  bp: 'MAP = DBP + 1/3(SBP - DBP)',
  pregnancy: 'EDD = LMP + 280 days',
  pace: 'Pace = total time / distance',
  'army-bf': 'BF% = 86.01×log(waist-neck) - 70.04×log(height) + 36.76 (male)',
  'lean-mass': 'LBM = weight × (1 - BF%/100)',
  'heart-rate-target': 'THR = ((220-age)-RHR)×intensity + RHR',
  'preg-gain': 'Gain = currentWeight - preWeight',
  'conception-date': 'Conception = dueDate - 266 days',
  'due-by-conception': 'Due = conceptionDate + 266 days',
  'expected-dd': 'EDD = LMP + 280 + (cycle - 28)',
  ovulation: 'Ovulation = cycleLength - 14',
  period: 'Next period ˜ today + cycleLength',
  'fertility-window': 'Window = ovulation-5 to ovulation+1',
  'pal-calc': 'PAL = S(activity_hours × MET) / 24',
}

interface FieldDef {
  name: string; label: string; type: 'number' | 'select'
  options?: { label: string; value: string }[]; unit?: string; min?: number; max?: number; step?: string
}
import { calcDefs } from './health'
import type { CalcDef } from '@/lib/generic-fallback'

function GenericHealthCalculator({ calculator }: { calculator: CalculatorEntry }) {
  const [values, setValues] = useState<any>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [result, setResult] = useState<any>(null)
  const [showResults, setShowResults] = useState(false)
  const [showSteps, setShowSteps] = useState(false)
  const [lockedFields, setLockedFields] = useState<Set<string>>(new Set())
  const [extraFields, setExtraFields] = useState<Record<string, string>>({})

  const toggleLock = useCallback((name: string) => {
    setLockedFields(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }, [])

  const isRtl = false
  const t = getCalcType(calculator.slug)
  const schema = getSchemaForType(t)
  const ResultComp = getResultComponent(t)
  const meta = healthMeta[t] || { unit: '', mainLabel: 'Result' }

  useEffect(() => { const d = calcDefaults(calculator.slug); setValues(d); setResult(null); setShowResults(false); setErrors({}) }, [calculator.slug])

  const handleChange = (key: string, value: string) => {
    setValues((prev: any) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev: any) => ({ ...prev, [key]: '' }))
  }

  const handleMultiUnitChange = useCallback((key: string, baseVal: number, unit: string) => {
    const raw = fromBaseUnit(baseVal, unit)
    handleChange(key, isNaN(raw) ? '' : String(raw))
    handleChange(key + 'Unit', unit)
  }, [handleChange])

  const compute = () => {
    const parsed = schema.safeParse(values)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      parsed.error.errors.forEach((e: any) => { const k = e.path[0] as string; fieldErrors[k] = e.message })
      setErrors(fieldErrors); return
    }
    setErrors({})
    const extraFormula = extraFields.extra_bmr_formula || 'mifflin'
    const w = num(values.weight); const h = num(values.height); const a = num(values.age)
    let mainVal = mainValue(t, values)
    const stepsArr: { label: string; value: string }[] = [{ label: 'Base Result', value: String(mainVal) }]

    // Apply alternative BMR formula if selected
    if ((t === 'bmr' || t === 'tdee') && extraFormula !== 'mifflin') {
      const sex = String(values.sex || 'male') as 'male' | 'female'
      const unit = 'metric'
      if (extraFormula === 'harris') {
        const { bmr, formula: formulaName } = calculateBMRHarrisBenedict({ weight: w, height: h, age: a, sex, unit })
        mainVal = bmr
        stepsArr[0] = { label: formulaName, value: String(bmr) }
      } else if (extraFormula === 'katch') {
        const bfPct = num(values.bodyFat) || 15
        const lbm = w * (1 - bfPct / 100)
        const bmr = Math.round(370 + (21.6 * lbm))
        mainVal = bmr
        stepsArr[0] = { label: 'Katch-McArdle Formula', value: String(bmr) }
      }
    }

    let displayVal = mainVal
    const extraActivityLevel = extraFields.extra_activity_level ? parseFloat(extraFields.extra_activity_level) : null
    if (extraActivityLevel && extraActivityLevel > 0) {
      const adjustedVal = mainVal * extraActivityLevel
      stepsArr.push({ label: 'Activity Multiplier', value: String(extraActivityLevel) })
      stepsArr.push({ label: 'Adjusted Result (TDEE-style)', value: String(adjustedVal.toFixed(1)) })
      displayVal = adjustedVal
    }
    setResult({ mainValue: displayVal, steps: stepsArr })
    setShowResults(true)
  }

  const copyResultText = () => {
    const lines = [calculator.title + ':']
    if (result?.steps) result.steps.forEach((s: any) => lines.push(s.label + ': ' + s.value))
    navigator.clipboard.writeText(lines.join('\n'))
  }
  const presets = getHealthPresets(calculator.slug)

  const renderField = (key: string, label: string, type: string = 'text', options?: { value: string; label: string }[]) => {
    const isLocked = lockedFields.has(key)
    if (options) {
      return (
        <div key={key} className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <button type="button" onClick={() => toggleLock(key)} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              {isLocked ? (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
              )}
            </button>
          </div>
          <select value={values[key] || ''} onChange={e => handleChange(key, e.target.value)} disabled={isLocked} className="w-full p-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed">
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {errors[key] && <p className="text-xs text-[#d62828]">{errors[key]}</p>}
        </div>
      )
    }
    return (
      <div key={key} className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
          <button type="button" onClick={() => toggleLock(key)} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            {isLocked ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
            )}
          </button>
        </div>
        <input type={type} value={values[key] || ''} onChange={e => handleChange(key, e.target.value)} disabled={isLocked} className="w-full p-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed" />
        {errors[key] && <p className="text-xs text-[#d62828]">{errors[key]}</p>}
      </div>
    )
  }

  const formContent: React.ReactNode = (() => {
    switch (t) {
      case 'bmi': case 'ponderal': case 'frame-size': case 'lbm': case 'ffmi': case 'smm': case 'navy-body-fat': case 'neat': case 'body-roundness': case 'whtr': case 'target-height': case 'height-predict': case 'bone-age': case 'ibw': case 'bsa':
        return <><MultiUnitField label="Weight" name="weight" units={weightUnits} defaultUnit={values.weightUnit || 'kg'} value={values.weight ? toBaseUnit(parseFloat(values.weight), values.weightUnit || 'kg') : undefined} onChange={(baseVal, unit) => handleMultiUnitChange('weight', baseVal, unit)} locked={lockedFields.has('weight')} onLockToggle={() => toggleLock('weight')} /><MultiUnitField label="Height" name="height" units={heightUnits} defaultUnit={values.heightUnit || 'cm'} value={values.height ? toBaseUnit(parseFloat(values.height), values.heightUnit || 'cm') : undefined} onChange={(baseVal, unit) => handleMultiUnitChange('height', baseVal, unit)} locked={lockedFields.has('height')} onLockToggle={() => toggleLock('height')} />{t !== 'bmi' && t !== 'ponderal' && t !== 'frame-size' && t !== 'bsa' && renderField('gender', 'Gender', 'select', [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }])}</>
      case 'calorie': case 'bmr': case 'tdee': case 'protein': case 'carb': case 'fat-calc': case 'fiber': case 'water-needs': case 'preg-weight': case 'peds-bp':
        return <>{renderField('age', 'Age', 'number')}<MultiUnitField label="Weight" name="weight" units={weightUnits} defaultUnit={values.weightUnit || 'kg'} value={values.weight ? toBaseUnit(parseFloat(values.weight), values.weightUnit || 'kg') : undefined} onChange={(baseVal, unit) => handleMultiUnitChange('weight', baseVal, unit)} locked={lockedFields.has('weight')} onLockToggle={() => toggleLock('weight')} /><MultiUnitField label="Height" name="height" units={heightUnits} defaultUnit={values.heightUnit || 'cm'} value={values.height ? toBaseUnit(parseFloat(values.height), values.heightUnit || 'cm') : undefined} onChange={(baseVal, unit) => handleMultiUnitChange('height', baseVal, unit)} locked={lockedFields.has('height')} onLockToggle={() => toggleLock('height')} />{renderField('gender', 'Gender', 'select', [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }])}</>
      case 'tdee':
        return <>{renderField('age', 'Age', 'number')}<MultiUnitField label="Weight" name="weight" units={weightUnits} defaultUnit={values.weightUnit || 'kg'} value={values.weight ? toBaseUnit(parseFloat(values.weight), values.weightUnit || 'kg') : undefined} onChange={(baseVal, unit) => handleMultiUnitChange('weight', baseVal, unit)} locked={lockedFields.has('weight')} onLockToggle={() => toggleLock('weight')} /><MultiUnitField label="Height" name="height" units={heightUnits} defaultUnit={values.heightUnit || 'cm'} value={values.height ? toBaseUnit(parseFloat(values.height), values.heightUnit || 'cm') : undefined} onChange={(baseVal, unit) => handleMultiUnitChange('height', baseVal, unit)} locked={lockedFields.has('height')} onLockToggle={() => toggleLock('height')} />{renderField('gender', 'Gender', 'select', [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }])}{renderField('activity', 'Activity Level', 'select', [{ value: 'sedentary', label: 'Sedentary' }, { value: 'light', label: 'Light' }, { value: 'moderate', label: 'Moderate' }, { value: 'active', label: 'Active' }, { value: 'very-active', label: 'Very Active' }])}</>
      case 'pregnancy': case 'gestational': case 'preg-week': case 'edd':
        return <>{renderField('lmp', 'Last Menstrual Period', 'date')}</>
      case 'naegeles': case 'expected-dd':
        return <>{renderField('lmp', 'Last Menstrual Period', 'date')}{renderField('cycleLength', 'Cycle Length (days)', 'number')}</>
      case 'conception-date':
        return <>{renderField('dueDate', 'Due Date', 'date')}</>
      case 'due-by-conception':
        return <>{renderField('conceptionDate', 'Conception Date', 'date')}</>
      case 'ovulation': case 'period': case 'fertility-window':
        return <>{renderField('cycleLength', 'Cycle Length (days)', 'number')}{renderField('periodLength', 'Period Length (days)', 'number')}</>
      case 'macro':
        return <>{renderField('calories', 'Daily Calories', 'number')}{renderField('activity', 'Activity Level', 'select', [{ value: 'sedentary', label: 'Sedentary' }, { value: 'light', label: 'Light' }, { value: 'moderate', label: 'Moderate' }, { value: 'active', label: 'Active' }, { value: 'very-active', label: 'Very Active' }])}{renderField('gender', 'Gender', 'select', [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }])}</>
      case 'army-bf':
        return <>{renderField('waist', 'Waist (cm)', 'number')}{renderField('neck', 'Neck (cm)', 'number')}{renderField('hip', 'Hip (cm) — female only', 'number')}{renderField('height', 'Height (cm)', 'number')}{renderField('gender', 'Gender', 'select', [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }])}</>
      case 'lean-mass':
        return <><MultiUnitField label="Weight" name="weight" units={weightUnits} defaultUnit={values.weightUnit || 'kg'} value={values.weight ? toBaseUnit(parseFloat(values.weight), values.weightUnit || 'kg') : undefined} onChange={(baseVal, unit) => handleMultiUnitChange('weight', baseVal, unit)} locked={lockedFields.has('weight')} onLockToggle={() => toggleLock('weight')} /><MultiUnitField label="Height" name="height" units={heightUnits} defaultUnit={values.heightUnit || 'cm'} value={values.height ? toBaseUnit(parseFloat(values.height), values.heightUnit || 'cm') : undefined} onChange={(baseVal, unit) => handleMultiUnitChange('height', baseVal, unit)} locked={lockedFields.has('height')} onLockToggle={() => toggleLock('height')} />{renderField('gender', 'Gender', 'select', [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }])}{renderField('bodyFatPct', 'Body Fat %', 'number')}</>
      case 'preg-gain':
        return <>{renderField('preWeight', 'Pre-Pregnancy Weight (kg)', 'number')}{renderField('height', 'Height (cm)', 'number')}{renderField('week', 'Current Week', 'number')}{renderField('currentWeight', 'Current Weight (kg)', 'number')}</>
      case 'pace':
        return <>{renderField('distance', 'Distance', 'number')}{renderField('hours', 'Hours', 'number')}{renderField('minutes', 'Minutes', 'number')}{renderField('seconds', 'Seconds', 'number')}<ModeFieldGroup minMode="advanced" label="Unit Options">{renderField('unit', 'Unit', 'select', [{ value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }])}</ModeFieldGroup></>
      case 'bp': case 'map': case 'pulse-pressure':
        return <>{renderField('systolic', 'Systolic BP', 'number')}{renderField('diastolic', 'Diastolic BP', 'number')}</>
      case 'cardiac-output': case 'valve-area':
        return <>{renderField('heartRate', 'Heart Rate (bpm)', 'number')}{renderField('strokeVolumeMl', 'Stroke Volume (mL)', 'number')}</>
      case 'stroke-volume': case 'ejection-fraction': case 'lvesv':
        return <>{renderField('edv', 'End-Diastolic Volume (mL)', 'number')}{renderField('esv', 'End-Systolic Volume (mL)', 'number')}</>
      case 'heart-age':
        return <>{renderField('age', 'Age', 'number')}{renderField('systolic', 'Systolic BP', 'number')}{renderField('bmi', 'BMI', 'number')}{renderField('smoker', 'Smoker', 'select', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }])}</>
      case 'framingham':
        return <>{renderField('age', 'Age', 'number')}{renderField('totalChol', 'Total Cholesterol', 'number')}{renderField('hdl', 'HDL', 'number')}{renderField('systolic', 'Systolic BP', 'number')}{renderField('smoker', 'Smoker', 'select', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }])}{renderField('diabetic', 'Diabetic', 'select', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }])}<ModeFieldGroup minMode="advanced" label="Additional Risk Factors">{renderField('treated', 'Treated for HTN', 'select', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }])}{renderField('gender', 'Gender', 'select', [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }])}</ModeFieldGroup></>
      case 'ascvd':
        return <>{renderField('age', 'Age', 'number')}{renderField('totalChol', 'Total Cholesterol', 'number')}{renderField('hdl', 'HDL', 'number')}{renderField('systolic', 'Systolic BP', 'number')}{renderField('smoker', 'Smoker', 'select', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }])}{renderField('diabetic', 'Diabetic', 'select', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }])}<ModeFieldGroup minMode="advanced" label="Additional Risk Factors">{renderField('hypertensive', 'On HTN Treatment', 'select', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }])}{renderField('gender', 'Gender', 'select', [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }])}</ModeFieldGroup></>
      case 'chads-vasc':
        return <>{renderField('age', 'Age Group', 'select', [{ value: 'under65', label: '<65' }, { value: '65-74', label: '65-74' }, { value: '75plus', label: '75+' }])}{renderField('heartFailure', 'Heart Failure', 'select', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }])}{renderField('hypertensive', 'Hypertension', 'select', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }])}{renderField('diabetic', 'Diabetes', 'select', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }])}{renderField('stroke', 'Stroke/TIA', 'select', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }])}{renderField('vascularDisease', 'Vascular Disease', 'select', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }])}{renderField('female', 'Female', 'select', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }])}</>
      case 'hr-zone': case 'exercise-hr': case 'target-hr': case 'heart-rate-target':
        return <>{renderField('age', 'Age', 'number')}{(t === 'target-hr' || t === 'heart-rate-target') && renderField('restHR', 'Resting HR', 'number')}{renderField('intensity', 'Intensity (%)', 'number')}</>
      case 'whr':
        return <>{renderField('waist', 'Waist (cm)', 'number')}{renderField('hip', 'Hip (cm)', 'number')}</>
      case 'body-fat-caliper':
        return <>{renderField('chest', 'Chest Skinfold (mm)', 'number')}{renderField('abdomen', 'Abdominal Skinfold (mm)', 'number')}{renderField('thigh', 'Thigh Skinfold (mm)', 'number')}{renderField('age', 'Age', 'number')}{renderField('gender', 'Gender', 'select', [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }])}</>
      case 'vo2-max':
        return <>{renderField('age', 'Age', 'number')}{renderField('restHR', 'Resting HR', 'number')}{renderField('gender', 'Gender', 'select', [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }])}</>
      case 'pal': case 'pal-calc':
        return <>{renderField('sleep', 'Sleep (hours)', 'number')}{renderField('sedentary', 'Sedentary (hours)', 'number')}{renderField('light', 'Light Activity (hours)', 'number')}{renderField('moderate', 'Moderate Activity (hours)', 'number')}<ModeFieldGroup minMode="advanced" label="Intense Activity">{renderField('vigorous', 'Vigorous Activity (hours)', 'number')}</ModeFieldGroup></>
      case 'sugar': case 'saturated-fat': case 'added-sugar': case 'sodium':
        return <>{renderField('calories', 'Daily Calories', 'number')}</>
      case 'vitamin-d':
        return <>{renderField('age', 'Age', 'number')}{renderField('sunExposure', 'Sun Exposure', 'select', [{ value: 'low', label: 'Low' }, { value: 'moderate', label: 'Moderate' }, { value: 'high', label: 'High' }])}</>
      case 'calcium': case 'iron':
        return <>{renderField('age', 'Age', 'number')}{renderField('gender', 'Gender', 'select', [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }])}{renderField('pregnant', 'Pregnant', 'select', [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }])}</>
      case 'child-bmi':
        return <>{renderField('weight', 'Weight (kg)', 'number')}{renderField('height', 'Height (cm)', 'number')}{renderField('age', 'Age (years)', 'number')}{renderField('gender', 'Gender', 'select', [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }])}</>
      case 'infant-growth':
        return <>{renderField('weight', 'Weight (kg)', 'number')}{renderField('length', 'Length (cm)', 'number')}{renderField('ageMonths', 'Age (months)', 'number')}{renderField('gender', 'Gender', 'select', [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }])}</>
      case 'apgar':
        return <>{renderField('appearance', 'Appearance (0-2)', 'number')}{renderField('pulse', 'Pulse (0-2)', 'number')}{renderField('grimace', 'Grimace (0-2)', 'number')}{renderField('activity', 'Activity (0-2)', 'number')}<ModeFieldGroup minMode="advanced" label="Breathing Assessment">{renderField('respiration', 'Respiration (0-2)', 'number')}</ModeFieldGroup></>
      case 'sleep-cycle': case 'bedtime': case 'wake-up':
        return <>{renderField('hours', 'Hours', 'number')}{renderField('minutes', 'Minutes', 'number')}</>
      case 'sleep-debt':
        return <>{renderField('weekdaySleep', 'Weekday Sleep (hours)', 'number')}{renderField('weekendSleep', 'Weekend Sleep (hours)', 'number')}</>
      case 'power-nap':
        return <>{renderField('napMinutes', 'Nap Duration (min)', 'number')}</>
      case 'circadian':
        return <>{renderField('wakeTime', 'Wake Time', 'time')}{renderField('bedTime', 'Bed Time', 'time')}</>
      case 'phq9':
        return <div className="space-y-3">{['Little interest/pleasure', 'Feeling down/depressed', 'Sleep issues', 'Fatigue', 'Appetite issues', 'Feeling bad about self', 'Concentration issues', 'Moving/speaking slowly/restless', 'Self-harm thoughts'].map((q, i) => renderField(q, q, 'select', [{ value: '0', label: 'Not at all (0)' }, { value: '1', label: 'Several days (1)' }, { value: '2', label: 'More than half (2)' }, { value: '3', label: 'Nearly every day (3)' }]))}</div>
      case 'gad7':
        return <div className="space-y-3">{['Feeling nervous/anxious', 'Not able to stop worrying', 'Worrying too much', 'Trouble relaxing', 'Restless/on edge', 'Easily annoyed/irritable', 'Fearful'].map((q, i) => renderField(q, q, 'select', [{ value: '0', label: 'Not at all (0)' }, { value: '1', label: 'Several days (1)' }, { value: '2', label: 'More than half (2)' }, { value: '3', label: 'Nearly every day (3)' }]))}</div>
      case 'stress':
        return <>{renderField('frequency', 'How often stressed? (0-3)', 'number')}{renderField('control', 'How often unable to control? (0-3)', 'number')}{renderField('coping', 'How often coping well? (reverse, 0-3)', 'number')}</>
      case 'burnout':
        return <>{renderField('exhaustion', 'Emotional Exhaustion (1-7)', 'number')}{renderField('cynicism', 'Cynicism (1-7)', 'number')}{renderField('efficacy', 'Professional Efficacy (1-7)', 'number')}</>
      case 'wellbeing':
        return <>{renderField('happiness', 'Cheerful mood (1-10)', 'number')}{renderField('satisfaction', 'Life satisfaction (1-10)', 'number')}{renderField('meaning', 'Life meaningful (1-10)', 'number')}</>
      case 'resilience':
        return <>{renderField('adaptability', 'Adaptability (1-5)', 'number')}{renderField('optimism', 'Optimism (1-5)', 'number')}{renderField('support', 'Social Support (1-5)', 'number')}</>
      case 'drug-dosage':
        return <>{renderField('weight', 'Weight (kg)', 'number')}{renderField('dosePerKg', 'Dose per kg (mg/kg)', 'number')}</>
      case 'iv-drip':
        return <>{renderField('volume', 'Volume (mL)', 'number')}{renderField('hours', 'Infusion Time (hours)', 'number')}{renderField('dropFactor', 'Drop Factor (gtt/mL)', 'number')}</>
      case 'fluid-resus':
        return <>{renderField('weight', 'Weight (kg)', 'number')}{renderField('percentBurn', 'Total Burn Surface Area (%)', 'number')}</>
      case 'crcl':
        return <>{renderField('age', 'Age', 'number')}{renderField('weight', 'Weight (kg)', 'number')}{renderField('creatinine', 'Serum Creatinine (mg/dL)', 'number')}{renderField('gender', 'Gender', 'select', [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }])}</>
      case 'egfr':
        return <>{renderField('age', 'Age', 'number')}{renderField('creatinine', 'Serum Creatinine (mg/dL)', 'number')}{renderField('gender', 'Gender', 'select', [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }])}{renderField('race', 'Race', 'select', [{ value: 'non-black', label: 'Non-Black' }, { value: 'black', label: 'Black' }])}</>
      case 'anion-gap':
        return <>{renderField('sodium', 'Sodium (mEq/L)', 'number')}{renderField('chloride', 'Chloride (mEq/L)', 'number')}{renderField('bicarbonate', 'Bicarbonate (mEq/L)', 'number')}</>
      case 'o2-sat':
        return <>{renderField('paO2', 'PaO2 (mmHg)', 'number')}</>
      case 'a-a-gradient':
        return <>{renderField('fiO2', 'FiO2 (0.21-1.0)', 'number')}{renderField('paCO2', 'PaCO2 (mmHg)', 'number')}{renderField('paO2', 'PaO2 (mmHg)', 'number')}{renderField('age', 'Age', 'number')}</>
      case 'gcs':
        return <>{renderField('eye', 'Eye Opening (1-4)', 'number')}{renderField('verbal', 'Verbal Response (1-5)', 'number')}{renderField('motor', 'Motor Response (1-6)', 'number')}</>
      case 'apache':
        return <>{renderField('age', 'Age', 'number')}{renderField('temperature', 'Temperature (°C)', 'number')}{renderField('heartRate', 'Heart Rate', 'number')}{renderField('respiratoryRate', 'Respiratory Rate', 'number')}{renderField('gcs', 'GCS (3-15)', 'number')}{renderField('creatinine', 'Creatinine (mg/dL)', 'number')}{renderField('agePoints', 'Age Points (0-6)', 'number')}</>
      case 'meld':
        return <>{renderField('bilirubin', 'Bilirubin (mg/dL)', 'number')}{renderField('inr', 'INR', 'number')}{renderField('creatinine', 'Creatinine (mg/dL)', 'number')}{renderField('dialysis', 'Dialysis', 'select', [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }])}</>
      case 'child-pugh':
        return <>{renderField('bilirubin', 'Bilirubin', 'select', [{ value: 'under2', label: '<2 mg/dL' }, { value: '2to3', label: '2-3 mg/dL' }, { value: 'over3', label: '>3 mg/dL' }])}{renderField('albumin', 'Albumin', 'select', [{ value: 'over3.5', label: '>3.5 g/dL' }, { value: '2.8to3.5', label: '2.8-3.5 g/dL' }, { value: 'under2.8', label: '<2.8 g/dL' }])}{renderField('inr', 'INR', 'select', [{ value: 'under1.7', label: '<1.7' }, { value: '1.7to2.3', label: '1.7-2.3' }, { value: 'over2.3', label: '>2.3' }])}{renderField('ascites', 'Ascites', 'select', [{ value: 'none', label: 'None' }, { value: 'mild', label: 'Mild' }, { value: 'moderate', label: 'Moderate' }])}{renderField('encephalopathy', 'Encephalopathy', 'select', [{ value: 'none', label: 'None' }, { value: 'grade1-2', label: 'Grade 1-2' }, { value: 'grade3-4', label: 'Grade 3-4' }])}</>
      case 'curb65':
        return <>{renderField('confusion', 'New Confusion', 'select', [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }])}{renderField('bun', 'BUN (mg/dL)', 'number')}{renderField('respiratoryRate', 'Respiratory Rate', 'number')}{renderField('systolic', 'Systolic BP', 'number')}{renderField('age', 'Age Group', 'select', [{ value: 'under65', label: '<65' }, { value: '65plus', label: '=65' }])}</>
      case 'psi':
        return <>{renderField('age', 'Age', 'number')}{renderField('gender', 'Gender', 'select', [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }])}{renderField('nursingHome', 'Nursing Home', 'select', [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }])}{renderField('neoplasm', 'Neoplasm', 'select', [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }])}{renderField('liver', 'Liver Disease', 'select', [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }])}{renderField('heartFailure', 'Heart Failure', 'select', [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }])}{renderField('cerebrovascular', 'Cerebrovascular', 'select', [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }])}{renderField('renal', 'Renal Disease', 'select', [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }])}{renderField('alteredMental', 'Altered Mental Status', 'select', [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }])}{renderField('respiratoryRate', 'Respiratory Rate', 'number')}{renderField('systolic', 'Systolic BP', 'number')}{renderField('temperature', 'Temperature (°C)', 'number')}{renderField('heartRate', 'Heart Rate', 'number')}{renderField('ph', 'pH', 'select', [{ value: 'under7.35', label: '<7.35' }, { value: '7.35plus', label: '=7.35' }])}{renderField('sodium', 'Sodium (mEq/L)', 'number')}{renderField('glucose', 'Glucose (mg/dL)', 'number')}{renderField('hematocrit', 'Hematocrit (%)', 'number')}{renderField('paO2', 'PaO2 (mmHg)', 'number')}{renderField('pleuralEffusion', 'Pleural Effusion', 'select', [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }])}</>
      case 'corrected-calcium':
        return <>{renderField('calcium', 'Total Calcium (mg/dL)', 'number')}{renderField('albumin', 'Albumin (g/dL)', 'number')}</>
      case 'fena':
        return <>{renderField('serumNa', 'Serum Na (mEq/L)', 'number')}{renderField('urineNa', 'Urine Na (mEq/L)', 'number')}{renderField('serumCr', 'Serum Creatinine (mg/dL)', 'number')}{renderField('urineCr', 'Urine Creatinine (mg/dL)', 'number')}</>
      case 'qtc':
        return <>{renderField('qtInterval', 'QT Interval (ms)', 'number')}{renderField('rrInterval', 'RR Interval (ms)', 'number')}</>
      case 'bac':
        return <>{renderField('drinks', 'Drinks', 'number')}{renderField('weight', 'Weight (kg)', 'number')}{renderField('hours', 'Hours Since First Drink', 'number')}{renderField('gender', 'Gender', 'select', [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }])}</>
      case 'alcohol-cal':
        return <>{renderField('drinks', 'Number of Drinks', 'number')}{renderField('ozPerDrink', 'Ounces per Drink', 'number')}{renderField('abv', 'ABV (%)', 'number')}</>
      case 'caffeine-halflife':
        return <>{renderField('mg', 'Caffeine Consumed (mg)', 'number')}{renderField('hoursElapsed', 'Hours Elapsed', 'number')}</>
      case 'caffeine-bev':
        return <>{renderField('beverage', 'Beverage', 'select', [{ value: 'coffee', label: 'Coffee (95mg)' }, { value: 'espresso', label: 'Espresso (63mg)' }, { value: 'tea', label: 'Tea (47mg)' }, { value: 'soda', label: 'Soda (34mg)' }, { value: 'energy', label: 'Energy Drink (80mg)' }, { value: 'preworkout', label: 'Pre-Workout (200mg)' }])}{renderField('servings', 'Servings', 'number')}</>
      case 'hangover':
        return <>{renderField('drinks', 'Drinks', 'number')}{renderField('weight', 'Weight (kg)', 'number')}{renderField('hours', 'Hours Drinking', 'number')}{renderField('gender', 'Gender', 'select', [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }])}</>
      case 'ciwa':
        return <>{renderField('nausea', 'Nausea/Vomiting (0-7)', 'number')}{renderField('tremor', 'Tremor (0-7)', 'number')}{renderField('sweats', 'Sweats (0-7)', 'number')}{renderField('anxiety', 'Anxiety (0-7)', 'number')}{renderField('agitation', 'Agitation (0-7)', 'number')}{renderField('orientation', 'Orientation (0-4)', 'number')}</>
      case 'water-needs':
        return <>{renderField('weight', 'Weight (kg)', 'number')}{renderField('activity', 'Activity Level', 'select', [{ value: 'sedentary', label: 'Sedentary' }, { value: 'moderate', label: 'Moderate' }, { value: 'active', label: 'Active' }])}{renderField('climate', 'Climate', 'select', [{ value: 'temperate', label: 'Temperate' }, { value: 'hot', label: 'Hot/Humid' }, { value: 'cold', label: 'Cold' }])}</>
      case 'peds-fever':
        return <>{renderField('temperature', 'Temperature', 'number')}{renderField('ageMonths', 'Age (months)', 'number')}{renderField('method', 'Measurement Method', 'select', [{ value: 'rectal', label: 'Rectal' }, { value: 'oral', label: 'Oral' }, { value: 'axillary', label: 'Axillary' }, { value: 'tympanic', label: 'Tympanic' }])}</>
      case 'formula-amount':
        return <>{renderField('weight', 'Weight (kg)', 'number')}{renderField('ageMonths', 'Age (months)', 'number')}</>
      case 'ibuprofen':
        return <>{renderField('weight', 'Weight (kg)', 'number')}</>
      case 'fetal-growth':
        return <>{renderField('fundalHeight', 'Fundal Height (cm)', 'number')}{renderField('week', 'Week of Gestation', 'number')}</>
      case 'hcg-doubling':
        return <>{renderField('hcg1', 'First HCG Level', 'number')}{renderField('hcg2', 'Second HCG Level', 'number')}{renderField('daysBetween', 'Days Between Tests', 'number')}</>
      case 'implantation':
        return <>{renderField('ovulationDay', 'Ovulation Day of Cycle', 'number')}</>
      case 'exercise-hr':
        return <>{renderField('age', 'Age', 'number')}</>
      case 'recovery-hr':
        return <>{renderField('hrPeak', 'Peak HR During Exercise', 'number')}{renderField('hrAfter1', 'HR After 1 Min Rest', 'number')}</>
      case 'hrv':
        return <>{renderField('rmssd', 'RMSSD (ms)', 'number')}</>
      case 'trimp':
        return <>{renderField('duration', 'Duration (minutes)', 'number')}{renderField('avgHR', 'Average HR', 'number')}{renderField('restHR', 'Resting HR', 'number')}{renderField('maxHR', 'Max HR', 'number')}{renderField('gender', 'Gender', 'select', [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }])}</>
      case 'fitness-age':
        return <>{renderField('age', 'Age', 'number')}{renderField('restHR', 'Resting HR', 'number')}{renderField('bmi', 'BMI', 'number')}{renderField('activityDays', 'Activity Days/Week', 'number')}</>
      case 'neat':
        return <>{renderField('steps', 'Daily Steps', 'number')}{renderField('standing', 'Standing Hours', 'number')}{renderField('walking', 'Walking Hours', 'number')}{renderField('weight', 'Weight (kg)', 'number')}</>
      case 'met-minutes':
        return <>{renderField('met', 'MET Value', 'number')}{renderField('minutes', 'Minutes per Session', 'number')}{renderField('days', 'Days per Week', 'number')}</>
      default: return <><MultiUnitField label="Weight" name="weight" units={weightUnits} defaultUnit={values.weightUnit || 'kg'} value={values.weight ? toBaseUnit(parseFloat(values.weight), values.weightUnit || 'kg') : undefined} onChange={(baseVal, unit) => handleMultiUnitChange('weight', baseVal, unit)} locked={lockedFields.has('weight')} onLockToggle={() => toggleLock('weight')} /><MultiUnitField label="Height" name="height" units={heightUnits} defaultUnit={values.heightUnit || 'cm'} value={values.height ? toBaseUnit(parseFloat(values.height), values.heightUnit || 'cm') : undefined} onChange={(baseVal, unit) => handleMultiUnitChange('height', baseVal, unit)} locked={lockedFields.has('height')} onLockToggle={() => toggleLock('height')} /></>
    }
  })()

  const formula = healthFormulas[calculator.slug] || healthFormulas[t] || ''

  const formElement = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {formContent}
    </div>
  )

  const resultElement = showResults && result ? (
    <div className="space-y-4">
      <div className="text-center py-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">{meta.mainLabel}</p>
        <p className="text-4xl font-bold text-[#06b6d4]">
          {t === 'pregnancy' || t === 'gestational' || t === 'preg-week' ? `${result.mainValue} weeks` :
           t === 'edd' || t === 'expected-dd' || t === 'naegeles' ? new Date(result.mainValue).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) :
           t === 'conception-date' || t === 'due-by-conception' ? new Date(result.mainValue).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) :
           t === 'bp' ? `${num(values.systolic)}/${num(values.diastolic)} mmHg` :
           t === 'bedtime' || t === 'wake-up' ? `${Math.floor(result.mainValue / 60)}:${String(Math.round(result.mainValue % 60)).padStart(2, '0')}` :
           t === 'ovulation' ? `Day ${Math.round(result.mainValue)}` :
           typeof result.mainValue === 'number' ? result.mainValue.toFixed(1) : result.mainValue }
        </p>
      </div>
      {t === 'bmi' && <BMIScaleBar bmi={result.mainValue} />}
      {t !== 'bp' && <ResultComp {...values} />}
      {result.steps && (
        <div className="space-y-2">
          {result.steps.map((s: any, i: number) => (
            <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-sm">
              <span className="text-gray-600 dark:text-gray-400">{s.label}</span>
              <span className="font-medium text-gray-900 dark:text-white">{s.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  ) : <p className="text-gray-400 text-sm">Enter values and calculate to see results.</p>

  const healthCalcDef = calcDefs[calculator.slug] || (buildGenericDef(calculator) as unknown as CalcDef | null)

  if (healthCalcDef && healthCalcDef.fields.length > 1) {
    return <HealthCalcDefRenderer calculator={calculator} def={healthCalcDef} />
  }

  const healthReferences = [
    { label: 'World Health Organization. Health statistics and information systems.', url: 'https://www.who.int/data/gho' },
    { label: 'National Institutes of Health. MedlinePlus health information.', url: 'https://medlineplus.gov/' },
    { label: 'Centers for Disease Control and Prevention. Health data and statistics.', url: 'https://www.cdc.gov/' },
  ]

  const healthChartData = useMemo(() => {
    if (!result?.steps || !Array.isArray(result.steps)) return []
    return result.steps
      .filter((s: any) => s && s.label && (!isNaN(parseFloat(s.value)) || !isNaN(parseFloat(String(s.value)))))
      .slice(0, 6)
      .map((s: any) => ({
        name: s.label.length > 15 ? s.label.substring(0, 15) + '…' : s.label,
        value: parseFloat(String(s.value)) || 0,
      }))
  }, [result])
  return (
    <PremiumCalculatorShell
      calculator={calculator}
      form={formElement}
      result={resultElement}
      charts={healthChartData.length > 0 ? <DynamicHealthBarChart data={healthChartData} /> : undefined}
      lockedFields={lockedFields}
      onSaveScenario={() => JSON.stringify(values)}
      onExportCSV={() => Object.entries(values).map(([k, v]) => `${k},${v}`).join('\n')}
      unitSystem="metric"
      onUnitChange={() => {}}
      inputs={values}
      showTabs={false}
      useSlider={false}
      onToggleSlider={() => {}}
      formula={formula}
      interpretation=""
      presets={presets}
      onPresetApply={(p) => { 
        const filtered = Object.fromEntries(
          Object.entries(p.values).filter(([key]) => !lockedFields.has(key))
        )
        setValues((prev: any) => ({ ...prev, ...filtered })); 
        setShowResults(false); 
        setErrors({}) 
      }}
      author={undefined}
      reviewer={undefined}
      references={healthReferences}
      example={result?.steps}
      userCount={7234}
      onReset={() => { 
        const locked = Object.fromEntries(
          Array.from(lockedFields).map(key => [key, values[key]])
        )
        const d = calcDefaults(calculator.slug); 
        setValues({ ...d, ...locked }); 
        setResult(null); 
        setShowResults(false); 
        setErrors({}) 
      }}
      copyResultText={result ? `${meta.mainLabel}: ${result.mainValue}` : ''}
      hubCategory="health"
      mainValue={result?.mainValue}
      onExtraFieldsChange={setExtraFields}
    />
  )
}

function HealthCalcDefRenderer({ calculator, def }: { calculator: CalculatorEntry; def: CalcDef }) {
  const [fieldUnits, setFieldUnits] = useState<Record<string, string>>({})
  const handleUnitChange = useCallback((name: string, unit: string) => {
    setFieldUnits(prev => ({ ...prev, [name]: unit }))
  }, [])
  const [lockedFields, setLockedFields] = useState<Set<string>>(new Set())
  const [extraFields, setExtraFields] = useState<Record<string, string>>({})
  const toggleLock = useCallback((name: string) => {
    setLockedFields(prev => { const next = new Set(prev); if (next.has(name)) next.delete(name); else next.add(name); return next })
  }, [])
  const form = useForm({
    resolver: zodResolver(def?.schema || defaultSchema),
    defaultValues: (def.defaults || def.fields.reduce((acc, f) => { acc[f.name] = f.type === 'select' ? (f.options?.[0]?.value || '') : ''; return acc }, {} as Record<string, string>)) as any,
    mode: 'onChange',
  })
  const presets = def?.presets || []
  const applyPreset = useCallback((preset: { label: string; values: Record<string, string> }) => {
    Object.entries(preset.values).forEach(([key, value]) => {
      if (!lockedFields.has(key)) form.setValue(key as any, value)
    })
  }, [form, lockedFields])

  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric')
  const [useSlider, setUseSlider] = useState(true)
  const watched = useWatch({ control: form.control })
  const v = watched as any
  const watchedInputs = useMemo(() => {
    const vals = (typeof watched === 'object' && watched !== null) ? watched as Record<string, string> : {}
    return Object.fromEntries(Object.entries(vals).filter(([, v]) => v !== undefined && v !== ''))
  }, [watched])

  const computeRes = useMemo(() => {
    const vals: Record<string, any> = {}
    for (const f of def.fields) {
      const raw = v[f.name]
      vals[f.name] = (f.type === 'number' && raw !== undefined && raw !== '') ? Number(raw) : (raw ?? '')
    }
    return { vals, res: memoizedCompute(def)(vals) }
  }, [def, v])

  const { vals, res } = computeRes

  const result = useMemo(() => (
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
  ), [res])

  const mainValue = useMemo(() =>
    typeof res.result === 'number' ? res.result : parseFloat(String(res.result)) || 0
  , [res])

  const chartData = useMemo(() => {
    if (!res.steps || !Array.isArray(res.steps)) return []
    return res.steps
      .filter((s: any) => s && s.label && !isNaN(parseFloat(String(s.value))))
      .slice(0, 6)
      .map((s: any) => ({
        name: s.label.length > 15 ? s.label.substring(0, 15) + '…' : s.label,
        value: parseFloat(String(s.value)) || 0,
      }))
  }, [res])

  const formContent = useMemo(() => {
    return <>
      {def.fields.map(f => (
        f.type === 'select' ? (
          <div key={f.name} className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{f.label}</label>
              <button type="button" onClick={() => toggleLock(f.name)} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                {lockedFields.has(f.name) ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
                )}
              </button>
            </div>
            <select {...form.register(f.name)} disabled={lockedFields.has(f.name)} className="w-full p-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed">
              {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        ) : (
          <div key={f.name} className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{f.label}</label>
              <button type="button" onClick={() => toggleLock(f.name)} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                {lockedFields.has(f.name) ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
                )}
              </button>
            </div>
            <input type="number" {...form.register(f.name, { valueAsNumber: false })} disabled={lockedFields.has(f.name)} className="w-full p-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed" />
          </div>
        )
      ))}
    </>
  }, [def, form, lockedFields, toggleLock])

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

  const healthReferences = [
    { label: 'World Health Organization. Health statistics and information systems.', url: 'https://www.who.int/data/gho' },
    { label: 'National Institutes of Health. MedlinePlus health information.', url: 'https://medlineplus.gov/' },
    { label: 'Centers for Disease Control and Prevention. Health data and statistics.', url: 'https://www.cdc.gov/' },
  ]
  const formula = def?.formula || 'Standard calculation'
  const interpretation = def?.interpretation || 'Health calculator for clinical assessment.'

  return (
    <FormProvider {...form}>
      <PremiumCalculatorShell
        calculator={calculator}
        form={formContent}
        result={result}
        charts={chartData.length > 0 ? <DynamicHealthBarChart data={chartData} /> : undefined}
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
        author={undefined}
        reviewer={undefined}
        references={healthReferences}
        example={undefined}
        userCount={7234}
        onReset={() => form.reset()}
        copyResultText={copyResultText}
        hubCategory="health"
        mainValue={mainValue}
      />
    </FormProvider>
  )
}

function getHealthComponentDef(slug: string): CalcDef | null {
  return calcDefs[slug] || null
}

export { GenericHealthCalculator }

