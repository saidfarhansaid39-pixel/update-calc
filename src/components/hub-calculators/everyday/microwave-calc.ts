import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ recipeWatts: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), myMicrowaveWatts: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), recipeMinutes: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), recipeSeconds: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'recipeWatts', label: 'Recipe Wattage', type: 'number', min: 200, max: 1500, step: '100' },
    { name: 'myMicrowaveWatts', label: 'Your Microwave Wattage', type: 'number', min: 200, max: 1500, step: '100' },
    { name: 'recipeMinutes', label: 'Recipe Time (minutes)', type: 'number', min: 0, step: '1' },
    { name: 'recipeSeconds', label: 'Extra Seconds', type: 'number', min: 0, max: 59, step: '10' },
  ],
  defaults: { recipeWatts: '700', myMicrowaveWatts: '900', recipeMinutes: '5', recipeSeconds: '0' },
  presets: [
    { label: 'Frozen Dinner', values: { recipeWatts: '1100', myMicrowaveWatts: '900', recipeMinutes: '5', recipeSeconds: '30' } },
    { label: 'Popcorn Bag', values: { recipeWatts: '1000', myMicrowaveWatts: '700', recipeMinutes: '3', recipeSeconds: '0' } },
    { label: 'Leftover Reheat', values: { recipeWatts: '700', myMicrowaveWatts: '1100', recipeMinutes: '2', recipeSeconds: '0' } },
    { label: 'Baked Potato', values: { recipeWatts: '800', myMicrowaveWatts: '1000', recipeMinutes: '8', recipeSeconds: '0' } },
  ],
  compute: (v) => {
    const recipeSecs = v.recipeMinutes * 60 + v.recipeSeconds
    const adjustedSecs = recipeSecs * (v.recipeWatts / v.myMicrowaveWatts)
    const adjMinutes = Math.floor(adjustedSecs / 60)
    const adjSeconds = Math.round(adjustedSecs % 60)
    const pctDiff = ((v.recipeWatts / v.myMicrowaveWatts) - 1) * 100
    return { result: adjustedSecs, label: 'Adjusted Time', unit: 'sec', steps: [
      { label: 'Original Recipe Time', value: `${v.recipeMinutes}m ${v.recipeSeconds}s = ${recipeSecs} seconds` },
      { label: 'Recipe Wattage', value: `${v.recipeWatts}W` },
      { label: 'Your Microwave', value: `${v.myMicrowaveWatts}W` },
      { label: 'Power Ratio', value: `${v.recipeWatts}W / ${v.myMicrowaveWatts}W = ${(v.recipeWatts / v.myMicrowaveWatts).toFixed(3)}` },
      { label: 'Adjustment Factor', value: `${pctDiff > 0 ? '+' : ''}${pctDiff.toFixed(0)}% (${v.recipeWatts < v.myMicrowaveWatts ? 'less time needed' : 'more time needed'})` },
      { label: 'Adjusted Time (calc)', value: `${recipeSecs}s × ${(v.recipeWatts / v.myMicrowaveWatts).toFixed(3)} = ${adjustedSecs.toFixed(0)}s` },
      { label: 'Adjusted Time (display)', value: `${adjMinutes}m ${adjSeconds}s` },
      { label: 'Original vs Adjusted', value: `${v.recipeMinutes}m ${v.recipeSeconds}s → ${adjMinutes}m ${adjSeconds}s` },
    ] ,
    extras: [
      { label: 'Common Wattages', value: '700-800W (compact/budget), 900W (standard), 1100W (high-power), 1200W+ (commercial). Most recipes assume 700-800W.' },
      { label: 'Find Your Wattage', value: 'Check the manual, the sticker inside the door, or do the water boil test: 1 cup water at high should boil in ~2 min for 1000W, ~3 min for 700W.' },
      { label: 'Power Level Adjustments', value: 'Microwave power levels (1-10) typically correspond to 10% increments of full power. Level 7 = ~70% of max wattage.' },
      { label: 'Cooking Tips', value: 'Stir food halfway through cooking for even results. Let food stand 1-2 min after cooking — internal temp continues rising by conduction.' },
      { label: 'Food Density Matters', value: 'Dense foods (meat, potatoes) take longer than porous foods (vegetables, rice) at the same wattage. Always check internal temperature.' },
      { label: 'Water Boil Test', value: 'Boil 1 cup (8 oz) cold water on high: 700W ≈ 3 min, 900W ≈ 2.5 min, 1100W ≈ 2 min, 1200W+ ≈ 1.5 min.' },
    ]}
  },
  description: 'Adjust microwave cooking times when your microwave wattage differs from the recipe wattage. Lower wattage = longer cooking time. Higher wattage = shorter time. Works for any recipe and microwave combination.',
  formula: 'AdjustedSeconds = RecipeSeconds × (RecipeWatts / YourMicrowaveWatts) | TimeRatio = SourceWatts / TargetWatts',
  interpretation: 'Common microwave wattages: 700W (compact), 900W (standard), 1100W (high-power), 1200W+ (commercial). If a recipe says 5 minutes at 700W but your microwave is 900W, cook for 5 × (700/900) = 3 min 53 seconds — about 1 minute less. Always check food doneness with a thermometer (165°F for poultry, 145°F for meats) rather than relying solely on time, as microwaves vary significantly.'
}

export default calcDef
