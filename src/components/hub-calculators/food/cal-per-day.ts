import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'weight', label: 'Current Weight', type: 'number', unit: 'kg', units: [{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }], defaultUnit: 'kg', min: 20, step: '0.1' },
      { name: 'goalWeight', label: 'Goal Weight', type: 'number', unit: 'kg', units: [{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }], defaultUnit: 'kg', min: 20, step: '0.1' },
      { name: 'timeline', label: 'Timeline', type: 'select', options: [{ label: '2 weeks', value: '14' }, { label: '1 month', value: '30' }, { label: '2 months', value: '60' }, { label: '3 months', value: '90' }, { label: '6 months', value: '180' }] },
      { name: 'gender', label: 'Sex', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
    ],
    compute: (v) => {
      const diff = v.weight - v.goalWeight; const dailyDeficit = Math.abs(diff) * 7700 / v.timeline; const maint = 10 * v.weight + 6.25 * 170 - 5 * 30 + (v.gender === 'female' ? -161 : 5); const calGoal = diff > 0 ? maint - dailyDeficit : maint + dailyDeficit
      return { result: Math.max(1200, calGoal), label: 'Daily Calorie Goal', unit: 'kcal/day', steps: [
        { label: 'Current weight', value: `${v.weight} kg` },
        { label: 'Goal weight', value: `${v.goalWeight} kg` },
        { label: 'Weight change needed', value: `${diff > 0 ? 'Lose' : 'Gain'} ${Math.abs(diff).toFixed(1)} kg` },
        { label: 'Timeline', value: `${v.timeline} days` },
        { label: 'Daily deficit/surplus', value: `${dailyDeficit.toFixed(0)} kcal/day` },
        { label: 'Estimated maintenance', value: `${maint.toFixed(0)} kcal/day` },
        { label: 'Target daily calories', value: `${Math.max(1200, calGoal).toFixed(0)} kcal/day` },
      ]}
    },
    description: 'Set a daily calorie target based on your goal weight and desired timeline. Uses 7,700 kcal per kg of body weight as the energy equivalent of fat loss.',
    example: { label: '70kg → 65kg in 1 month', value: '~1,700 kcal/day' }
}

export default calcDef
