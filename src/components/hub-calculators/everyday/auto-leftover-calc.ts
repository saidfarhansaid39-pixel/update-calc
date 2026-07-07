import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ alcPortionsMade: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), alcPortionsEaten: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), alcCostPerPortion: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), alcDaysStored: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), alcFreezeSome: z.string().min(1) }),
  fields: [
    { name: 'alcPortionsMade', label: 'Portions Cooked', type: 'number', min: 1, step: '2' },
    { name: 'alcPortionsEaten', label: 'Portions Eaten Fresh', type: 'number', min: 0, step: '1' },
    { name: 'alcCostPerPortion', label: 'Cost per Portion ($)', type: 'number', min: 0.5, step: '0.5' },
    { name: 'alcDaysStored', label: 'Days Until Eaten as Leftovers', type: 'number', min: 0, step: '1' },
    { name: 'alcFreezeSome', label: 'Freeze Extra Portions', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
  ],
  compute: (v) => {
    const leftoverPortions = Math.max(0, v.alcPortionsMade - v.alcPortionsEaten)
    let frozenPortions = 0
    let eatenLeftover = leftoverPortions
    if (v.alcFreezeSome === 'yes') {
      frozenPortions = Math.ceil(leftoverPortions / 2)
      eatenLeftover = leftoverPortions - frozenPortions
    }
    const freshCost = v.alcPortionsEaten * v.alcCostPerPortion
    const leftoverCost = eatenLeftover * v.alcCostPerPortion
    const frozenValue = frozenPortions * v.alcCostPerPortion
    const totalValue = freshCost + leftoverCost + frozenValue
    const wastePct = 100
    const savingsVsTakeout = totalValue * 2.5
    return { result: totalValue, label: 'Total Meal Value', unit: '$', steps: [{ label: 'Fresh Portions Cost', value: `$${freshCost.toFixed(2)}` }, { label: 'Leftovers Eaten', value: `${eatenLeftover} portions = $${leftoverCost.toFixed(2)}` }, { label: 'Frozen for Later', value: `${frozenPortions} portions = $${frozenValue.toFixed(2)}` }, { label: 'Total Value', value: `$${totalValue.toFixed(2)}` }, { label: 'vs Takeout (2.5× cost)', value: `Save ~$${savingsVsTakeout.toFixed(2)}` }] }
  },
  description: 'Calculate the value of cooking extra portions and using leftovers. See how much you save by repurposing leftovers instead of ordering takeout.',
  formula: 'Total Value = Fresh Cost + Leftover Value + Frozen Value | Savings vs Takeout = Total × 2.5',
  interpretation: 'Cook once, eat twice: meal prep saves 50% on food costs. Leftovers are safe 3-4 days in the fridge. Freeze portions for up to 3 months. Repurpose leftovers into new meals (roast chicken → chicken salad → soup) to maximize value.'
}

export default calcDef
