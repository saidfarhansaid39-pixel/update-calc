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
  defaults: { alcPortionsMade: '8', alcPortionsEaten: '2', alcCostPerPortion: '4', alcDaysStored: '3', alcFreezeSome: 'yes' },
  presets: [
    { label: 'Sunday Batch Cook', values: { alcPortionsMade: '12', alcPortionsEaten: '2', alcCostPerPortion: '3.5', alcDaysStored: '4', alcFreezeSome: 'yes' } },
    { label: 'Quick Dinner for 2', values: { alcPortionsMade: '4', alcPortionsEaten: '2', alcCostPerPortion: '5', alcDaysStored: '2', alcFreezeSome: 'no' } },
    { label: 'Freezer Stock-Up', values: { alcPortionsMade: '16', alcPortionsEaten: '2', alcCostPerPortion: '3', alcDaysStored: '4', alcFreezeSome: 'yes' } },
    { label: 'Single Serve', values: { alcPortionsMade: '4', alcPortionsEaten: '1', alcCostPerPortion: '4.5', alcDaysStored: '3', alcFreezeSome: 'yes' } },
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
    const savingsVsTakeout = totalValue * 2.5
    const wasteIfNoLeftovers = leftoverPortions * v.alcCostPerPortion
    const costPerServingLeftover = totalValue / v.alcPortionsMade
    return { result: totalValue, label: 'Total Meal Value', unit: '$', steps: [{ label: 'Portions Cooked', value: `${v.alcPortionsMade} total` }, { label: 'Eaten Fresh', value: `${v.alcPortionsEaten} portions × $${v.alcCostPerPortion.toFixed(2)} = $${freshCost.toFixed(2)}` }, { label: 'Leftover Portions', value: `${v.alcPortionsMade} − ${v.alcPortionsEaten} = ${leftoverPortions}` }, { label: 'Eaten as Leftovers', value: `${eatenLeftover} portions = $${leftoverCost.toFixed(2)}` }, { label: 'Frozen Portions', value: `${frozenPortions} portions = $${frozenValue.toFixed(2)}` }, { label: 'Total Value', value: `$${freshCost.toFixed(2)} + $${leftoverCost.toFixed(2)} + $${frozenValue.toFixed(2)} = $${totalValue.toFixed(2)}` }, { label: 'Effective Cost/Serving', value: `$${costPerServingLeftover.toFixed(2)} per portion` }, { label: 'vs Takeout Value', value: `$${savingsVsTakeout.toFixed(2)} (2.5× your cost)` }] ,
    extras: [
      { label: 'Leftover ROI', value: `Cooking ${v.alcPortionsMade} portions at $${v.alcCostPerPortion.toFixed(2)}/ea yields $${totalValue.toFixed(2)} of meals. The ${leftoverPortions} leftover portions represent $${wasteIfNoLeftovers.toFixed(2)} in potential value — $${(wasteIfNoLeftovers - (frozenPortions > 0 ? frozenValue + leftoverCost : leftoverCost)).toFixed(2)} 'rescued' from being wasted.` },
      { label: 'Takeout Comparison', value: `The same ${v.alcPortionsMade} portions from takeout/restaurant would cost ~$${savingsVsTakeout.toFixed(0)} (at 2.5× home cooking). Home prepping saves $${(savingsVsTakeout - totalValue).toFixed(0)} — or $${((savingsVsTakeout - totalValue) / v.alcPortionsMade).toFixed(2)} per portion.` },
      { label: 'Food Waste Prevention', value: `${v.alcFreezeSome === 'yes' ? 'Freezing ' + frozenPortions + ' portions prevents $' + frozenValue.toFixed(2) + ' of food waste. Frozen food lasts 3 months at 0°F — label with dates and rotate your freezer stock.' : 'Without freezing, ' + leftoverPortions + ' leftovers must be eaten within 3-4 days. After that, the $' + wasteIfNoLeftovers.toFixed(2) + ' in food may go to waste.'}` },
      { label: 'Leftover Transformation Ideas', value: `${v.alcPortionsMade} portions can become: ${Math.floor(v.alcPortionsMade / 2)} different meals by repurposing. Example: roast chicken → chicken tacos → chicken salad → chicken soup. Each transformation extends shelf life by 2-3 days.` },
      { label: 'Cost per Day of Cooking', value: `At $${v.alcCostPerPortion.toFixed(2)}/portion, eating ${v.alcPortionsMade} portions over ${v.alcDaysStored + (frozenPortions > 0 ? 30 : 0)} days costs $${(v.alcCostPerPortion * v.alcPortionsMade).toFixed(2)} total. That is $${((v.alcCostPerPortion * v.alcPortionsMade) / (v.alcDaysStored + (frozenPortions > 0 ? 30 : v.alcDaysStored))).toFixed(2)}-$${((v.alcCostPerPortion * v.alcPortionsMade) / Math.max(1, v.alcDaysStored)).toFixed(2)}/day.` },
      { label: 'Freezer Efficiency', value: `Frozen portions cost $0.20-0.50/day to store (freezer electricity). Your ${frozenPortions} frozen portions at $${frozenValue.toFixed(2)} value cost ~$${(frozenPortions * 0.35 / 30).toFixed(2)}/day to store — well worth it. Vacuum sealing ($0.30-0.50/bag) extends freezer life to 12+ months vs 3 months in bags.` },
      { label: 'Portion Control Benefit', value: `Cooking in batches of ${v.alcPortionsMade} naturally controls portion sizes. Pre-portioned leftovers = pre-portioned meals. Studies show batch cooking leads to 15-20% fewer calories consumed vs cooking single meals impulsively.` },
    ]}
  },
  description: 'Calculate the total value of cooking in bulk — including fresh meals, leftover reuse, and frozen portions. See how much you save by planning leftovers instead of ordering takeout, and track your effective cost per serving.',
  formula: 'Total Value = (Eaten Fresh × Cost/Portion) + (Leftover × Cost/Portion) + (Frozen × Cost/Portion) | Savings vs Takeout = Total Value × 2.5',
  interpretation: 'Cook once, eat twice (or three times): a batch of 8 portions at $4 each creates $32 in meals. Eat 2 fresh, 3 as leftovers (3-4 days in fridge), freeze 3 for later (up to 3 months). The same 8 portions as takeout would cost ~$80 (2.5× home cost). Leftover transformation (roast chicken → chicken tacos → chicken soup) stretches each portion further. Frozen portions cost pennies/day to store and provide emergency meals. Batch cooking is the single biggest money-saver in the kitchen — cutting food costs by 50-60% compared to cooking single meals.'
}

export default calcDef
