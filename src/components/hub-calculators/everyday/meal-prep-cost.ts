import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ recipes: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), portionsPer: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), costPerRecipe: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), packaging: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), prepHours: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), hourlyWage: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'recipes', label: 'Number of Recipes', type: 'number', min: 1, step: '1' },
    { name: 'portionsPer', label: 'Portions per Recipe', type: 'number', min: 1, step: '1' },
    { name: 'costPerRecipe', label: 'Cost per Recipe ($)', type: 'number', min: 0, step: '5' },
    { name: 'packaging', label: 'Packaging Cost ($)', type: 'number', min: 0, step: '2' },
    { name: 'prepHours', label: 'Prep Hours', type: 'number', min: 0, step: '0.5' },
    { name: 'hourlyWage', label: 'Hourly Wage ($)', type: 'number', min: 0, step: '5' },
  ],
  compute: (v) => { const totalPortions = v.recipes * v.portionsPer; const foodCost = v.recipes * v.costPerRecipe; const totalCost = foodCost + v.packaging + (v.prepHours * v.hourlyWage); const costPerPortion = totalCost / totalPortions; const costPerMeal = costPerPortion; return { result: costPerMeal, label: 'Cost per Meal Portion', unit: '$', steps: [{ label: 'Total Portions', value: `${totalPortions}` }, { label: 'Ingredient Cost', value: `$${foodCost.toFixed(2)}` }, { label: 'Packaging', value: `$${v.packaging.toFixed(2)}` }, { label: 'Labor', value: `${v.prepHours}hrs × $${v.hourlyWage} = $${(v.prepHours * v.hourlyWage).toFixed(2)}` }, { label: 'Cost per Portion', value: `$${costPerPortion.toFixed(2)}` }] } },
  description: 'Calculate cost per meal portion for meal prep including ingredients, packaging, and the value of your prep time.',
  formula: 'Cost/Meal = (Recipes × Cost/Recipe + Packaging + Prep Hours × Hourly Wage) / (Recipes × Portions/Recipe)',
  interpretation: 'Meal prep typically saves 30-50% vs eating out. Homemade meals average $3-6 per portion vs $12-18 restaurant. Include labor to see true cost and decide if meal prep services are worth it.'
}

export default calcDef
