import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ homeGymBudget: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), cardioEquip: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), strengthEquip: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), accessoryBudget: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), gymLifeYears: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'homeGymBudget', label: 'Total Budget ($)', type: 'number', min: 100, step: '100' },
    { name: 'cardioEquip', label: 'Cardio Equipment ($)', type: 'number', min: 0, step: '100' },
    { name: 'strengthEquip', label: 'Strength Equipment ($)', type: 'number', min: 0, step: '100' },
    { name: 'accessoryBudget', label: 'Accessories ($)', type: 'number', min: 0, step: '50' },
    { name: 'gymLifeYears', label: 'Equipment Lifespan (years)', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const totalCost = v.cardioEquip + v.strengthEquip + v.accessoryBudget
    const remaining = v.homeGymBudget - totalCost
    const annualCost = totalCost / v.gymLifeYears
    const vsGymMembership = v.gymLifeYears * 12 * 50
    const savings = vsGymMembership - totalCost
    return { result: annualCost, label: 'Annual Equipment Cost', unit: '$', steps: [{ label: 'Total Setup Cost', value: `$${totalCost.toFixed(0)}` }, { label: 'Annualized Cost', value: `$${annualCost.toFixed(0)}/yr` }, { label: 'vs Gym ($50/mo)', value: vsGymMembership > totalCost ? `Save $${savings.toFixed(0)}` : `Cost $${Math.abs(savings).toFixed(0)} more` }, { label: 'Remaining Budget', value: `$${remaining.toFixed(0)}` }] }
  },
  description: 'Plan your home gym budget across cardio, strength, and accessory equipment. Compare lifetime cost vs a commercial gym membership.',
  formula: 'Annual Cost = Total Equipment / Lifespan | vs Gym = (50×12×Years) - Total',
  interpretation: 'Basic home gym: $300-500 (dumbbells, bench, bands). Mid-range: $1000-3000 (rack, barbell, plates, cardio). Premium: $3000+ (functional trainer, treadmill, bike). Home gyms pay for themselves in 1-3 years.'
}

export default calcDef
