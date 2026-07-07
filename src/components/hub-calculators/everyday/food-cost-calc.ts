import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ingredientCost: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), servings: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), markupPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'ingredientCost', label: 'Total Ingredient Cost ($)', type: 'number', min: 0.5, step: '1' },
    { name: 'servings', label: 'Number of Servings', type: 'number', min: 1, step: '1' },
    { name: 'markupPct', label: 'Markup (%)', type: 'number', min: 0, max: 500, step: '5' },
  ],
  compute: (v) => { const ic = parseFloat(v.ingredientCost)||0; const s = parseFloat(v.servings)||0; const mp = parseFloat(v.markupPct)||0; const perServing = ic / s; const sellPrice = perServing * (1 + mp / 100); const totalRevenue = sellPrice * s; return { result: perServing, label: 'Cost per Serving', unit: '$', steps: [{ label: 'Cost per Serving', value: `$${perServing.toFixed(2)}` }, { label: 'Sell Price per Serving', value: `$${sellPrice.toFixed(2)}` }, { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}` }] } },
  description: 'Calculate per-serving food cost and suggested menu pricing with markup. Essential for restaurant menu planning and home batch cooking.',
  formula: 'Cost/Serving = Total Ingredients ÷ Servings | Sell Price = Cost/Serving × (1 + Markup%)',
  interpretation: 'Restaurant target food cost: 25-35% of menu price. 300% markup (4× cost) is standard. Premium ingredients may require lower margins.'
}

export default calcDef
