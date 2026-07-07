import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ foodWeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ironPer100g: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), cookwareType: z.string().min(1) }),
  fields: [
    { name: 'foodWeight', label: 'Food Weight (g)', type: 'number', min: 1, step: '50' },
    { name: 'ironPer100g', label: 'Natural Iron (mg/100g)', type: 'number', min: 0, step: '0.5' },
    { name: 'cookwareType', label: 'Cookware Type', type: 'select', options: [{ label: 'Cast Iron', value: 'castIron' }, { label: 'Stainless Steel', value: 'stainless' }, { label: 'Non-Stick', value: 'nonstick' }, { label: 'Other', value: 'other' }] },
  ],
  compute: (v) => {
    const naturalIron = (v.ironPer100g / 100) * v.foodWeight
    const cookwareFactors: Record<string, number> = { castIron: 0.5, stainless: 0.1, nonstick: 0, other: 0.05 }
    const addedIron = v.foodWeight * (cookwareFactors[v.cookwareType as keyof typeof cookwareFactors] || 0)
    const totalIron = naturalIron + addedIron
    return { result: totalIron, label: 'Total Iron Content', unit: 'mg', steps: [{ label: 'Natural Iron', value: `${naturalIron.toFixed(2)} mg` }, { label: 'Iron from Cookware', value: `${addedIron.toFixed(2)} mg` }, { label: 'Total Iron', value: `${totalIron.toFixed(2)} mg` }] }
  },
  description: 'Estimate total iron content in cooked food including natural iron and iron leached from cookware, especially cast iron.',
  formula: 'Total Iron = (Iron/100g × Weight) + AddedIron(Weight, Cookware)',
  interpretation: 'Cast iron cookware can add 1-3 mg iron per 100g of acidic food. RDI for iron: 8 mg (men), 18 mg (women). Pair with vitamin C for better absorption.'
}

export default calcDef
