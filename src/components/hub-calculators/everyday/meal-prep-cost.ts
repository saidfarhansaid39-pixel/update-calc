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
  defaults: { recipes: '3', portionsPer: '4', costPerRecipe: '12', packaging: '5', prepHours: '2', hourlyWage: '25' },
  presets: [
    { label: 'Budget Batch Cook', values: { recipes: '2', portionsPer: '6', costPerRecipe: '8', packaging: '3', prepHours: '1.5', hourlyWage: '20' } },
    { label: 'Healthy Meal Prep', values: { recipes: '3', portionsPer: '4', costPerRecipe: '12', packaging: '5', prepHours: '2', hourlyWage: '25' } },
    { label: 'Premium Ingredients', values: { recipes: '4', portionsPer: '3', costPerRecipe: '18', packaging: '6', prepHours: '3', hourlyWage: '30' } },
    { label: 'Freezer Stock-Up', values: { recipes: '5', portionsPer: '6', costPerRecipe: '10', packaging: '10', prepHours: '4', hourlyWage: '25' } },
  ],
  compute: (v) => { const totalPortions = v.recipes * v.portionsPer; const foodCost = v.recipes * v.costPerRecipe; const laborCost = v.prepHours * v.hourlyWage; const totalCost = foodCost + v.packaging + laborCost; const costPerPortion = totalCost / totalPortions; const foodCostPerPortion = foodCost / totalPortions; const laborPerPortion = laborCost / totalPortions; const packagingPerPortion = v.packaging / totalPortions; const restaurantCost = totalPortions * 14; const vsRestaurantSavings = restaurantCost - totalCost; return { result: costPerPortion, label: 'True Cost per Portion', unit: '$', steps: [
    { label: 'Recipes Made', value: `${v.recipes} recipes` },
    { label: 'Total Portions', value: `${v.recipes} × ${v.portionsPer} = ${totalPortions} portions` },
    { label: 'Ingredient Cost', value: `${v.recipes} × $${v.costPerRecipe.toFixed(2)} = $${foodCost.toFixed(2)}` },
    { label: 'Packaging Cost', value: `$${v.packaging.toFixed(2)}` },
    { label: 'Labor Value', value: `${v.prepHours} hrs × $${v.hourlyWage.toFixed(2)}/hr = $${laborCost.toFixed(2)}` },
    { label: 'Total Cost', value: `$${totalCost.toFixed(2)}` },
    { label: 'Cost per Portion', value: `$${totalCost.toFixed(2)} / ${totalPortions} = $${costPerPortion.toFixed(2)}` },
    { label: 'Breakdown per Portion', value: `Food: $${foodCostPerPortion.toFixed(2)} | Labor: $${laborPerPortion.toFixed(2)} | Packaging: $${packagingPerPortion.toFixed(2)}` },
  ] ,
    extras: [
      { label: 'True Cost Analysis', value: `Each portion costs $${costPerPortion.toFixed(2)} (food: $${foodCostPerPortion.toFixed(2)}, labor: $${laborPerPortion.toFixed(2)}, packaging: $${packagingPerPortion.toFixed(2)}). The same meal at a restaurant: ~$14.` },
      { label: 'Savings vs Eating Out', value: `Restaurant equivalent: ~$${restaurantCost.toFixed(0)}. You save $${vsRestaurantSavings.toFixed(0)} this batch ($${(vsRestaurantSavings / totalPortions).toFixed(2)}/portion).` },
      { label: 'Economies of Scale', value: 'Doubling recipes often increases ingredient cost by only ~60% (bulk discounts and using shared ingredients like spices, oils).' },
      { label: 'Is Your Labor Worth It?', value: `At $${v.hourlyWage.toFixed(2)}/hr, your labor adds $${laborPerPortion.toFixed(2)}/portion. If $$<${(14 - foodCostPerPortion - packagingPerPortion).toFixed(2)}, it is cheaper than restaurant delivery.` },
      { label: 'Packaging Savings', value: 'Reusable glass containers ($5-8 each) pay for themselves after 3-5 uses vs disposable plastic containers ($1-2 each).' },
      { label: 'Meal Prep Services Comparison', value: 'Services like HelloFresh ($8-12/serving) or Factor ($11-15/meal) include ingredient + delivery costs. Your per-portion cost includes your labor — compare apples to apples.' },
      { label: 'Time Trade-Off', value: `${v.prepHours} hrs of prep saves an estimated ${(v.recipes * 0.75).toFixed(1)} hrs of daily cooking throughout the week (not included in the formula).` },
    ]} },
  description: 'Calculate the true cost per meal portion for meal prep, including ingredients, packaging, and the value of your prep time. Compare against restaurant costs to see your true savings.',
  formula: 'CostPerPortion = (Recipes × CostPerRecipe + Packaging + PrepHours × HourlyWage) / (Recipes × PortionsPerRecipe) | FoodCost% = (Recipes × CostPerRecipe) / TotalCost | Labor% = (PrepHours × HourlyWage) / TotalCost',
  interpretation: 'Meal prep saves 30-60% compared to eating out. A batch of 3 recipes × 4 portions each ($12/recipe) costs $36 in ingredients + $5 packaging + $50 labor (2 hrs × $25/hr) = $91 total, or ~$7.58/portion. Compare to $14/portion at a restaurant = $168, saving $77. The true cost includes your labor — if you enjoy cooking, consider it a hobby, not a cost. If you value your time at $25/hr, meal prep is still 46% cheaper than restaurant dining.'
}

export default calcDef
