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
  compute: (v) => {
    const recipeSecs = v.recipeMinutes * 60 + v.recipeSeconds
    const adjustedSecs = recipeSecs * (v.recipeWatts / v.myMicrowaveWatts)
    const adjMinutes = Math.floor(adjustedSecs / 60)
    const adjSeconds = Math.round(adjustedSecs % 60)
    return { result: adjustedSecs, label: 'Adjusted Cooking Time', unit: 'sec', steps: [{ label: 'Original Time', value: `${v.recipeMinutes}m ${v.recipeSeconds}s (${recipeSecs}s)` }, { label: 'Power Ratio', value: `${v.recipeWatts}W / ${v.myMicrowaveWatts}W = ${(v.recipeWatts / v.myMicrowaveWatts).toFixed(3)}` }, { label: 'Adjusted Time', value: `${adjMinutes}m ${adjSeconds}s (${adjustedSecs.toFixed(0)}s)` }] }
  },
  description: 'Adjust microwave cooking times when your microwave wattage differs from the recipe wattage. Lower wattage = longer cooking time.',
  formula: 'AdjustedTime = RecipeTime × RecipeWatts / YourWatts',
  interpretation: 'Common wattages: 700W (compact), 900W (standard), 1100W (high-power), 1200W+ (commercial). A 900W microwave: cook 700W items ~28% longer. Check your manual or do a water boil test to find actual wattage.'
}

export default calcDef
