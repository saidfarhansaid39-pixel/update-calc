import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wiWeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wiWeightUnit: z.string().min(1), wiActivityMin: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wiClimate: z.string().min(1) }),
  fields: [
    { name: 'wiWeight', label: 'Body Weight', type: 'number', min: 30, step: '10' },
    { name: 'wiWeightUnit', label: 'Unit', type: 'select', options: [{ label: 'kg', value: 'kg' }, { label: 'lb', value: 'lb' }] },
    { name: 'wiActivityMin', label: 'Daily Exercise (min)', type: 'number', min: 0, step: '10' },
    { name: 'wiClimate', label: 'Climate', type: 'select', options: [{ label: 'Cool/Mild', value: 'cool' }, { label: 'Warm/Hot', value: 'hot' }, { label: 'Very Hot/Humid', value: 'humid' }] },
  ],
  compute: (v) => {
    const weightKg = v.wiWeightUnit === 'lb' ? v.wiWeight * 0.453592 : v.wiWeight
    const weightOz = weightKg * 35.274
    const baseOz = weightOz * 0.5 / 35.274 * 1000
    const baseMl = weightKg * 30
    const activityMl = v.wiActivityMin * 12
    const climateFactors: Record<string, number> = { cool: 1, hot: 1.2, humid: 1.4 }
    const climateFactor = climateFactors[v.wiClimate] || 1
    const totalMl = (baseMl + activityMl) * climateFactor
    const totalOz = totalMl / 29.5735
    const totalCups = totalMl / 240
    return { result: totalMl, label: 'Daily Water Intake', unit: 'mL', steps: [{ label: 'Base (weight-based)', value: baseMl.toFixed(0) + ' mL' }, { label: 'Activity Adjustment', value: '+' + activityMl.toFixed(0) + ' mL' }, { label: 'Climate Factor', value: climateFactor + 'x' }, { label: 'Total (mL)', value: totalMl.toFixed(0) + ' mL' }, { label: 'Total (oz)', value: totalOz.toFixed(0) + ' oz' }, { label: 'Total (cups)', value: totalCups.toFixed(1) + ' cups (8 oz)' }] }
  },
  description: 'Calculate your daily water intake needs based on body weight, exercise, and climate. Follows medical hydration guidelines.',
  formula: 'Water (mL) = (Weightkg x 30 + ExerciseMin x 12) x ClimateFactor | 1 cup = 240 mL | Avg: 2-3 L/day',
  interpretation: 'General guideline: 30-35 mL per kg of body weight. Add 12 mL per minute of exercise. Hot/humid climates increase needs by 20-40%. Thirst is a late indicator of dehydration. Urine color should be pale yellow.'
}

export default calcDef
