import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    showers: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0'),
    laundry: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0'),
    dishes: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0'),
    diet: z.string().optional()
}),
  fields: [
    { name: 'showers', label: 'Minutes of Showering/week', type: 'number', min: 0, step: '5', unit: 'min' },
    { name: 'laundry', label: 'Laundry Loads/week', type: 'number', min: 0, step: '1' },
    { name: 'dishes', label: 'Dishwasher Loads/week', type: 'number', min: 0, step: '1' },
    { name: 'diet', label: 'Diet Type', type: 'select', options: [
      { label: 'Meat-heavy (5,000 L/day)', value: '5000' },
      { label: 'Average diet (3,500 L/day)', value: '3500' },
      { label: 'Vegetarian (2,500 L/day)', value: '2500' },
      { label: 'Vegan (2,000 L/day)', value: '2000' },
    ] },
  ],
  compute: (v) => {
    const shower = (v.showers || 0) * 9.5 * 4.33
    const laundry = (v.laundry || 0) * 60 * 4.33
    const dishes = (v.dishes || 0) * 15 * 4.33
    const direct = shower + laundry + dishes
    const diet = parseFloat(v.diet) || 3500
    const total = direct + diet
    return {
      result: total, label: 'Daily Water Footprint', unit: 'L/day',
      steps: [
        ...(v.showers ? [{ label: 'Showering', value: `${shower.toFixed(0)} L/day` }] : []),
        ...(v.laundry ? [{ label: 'Laundry', value: `${laundry.toFixed(0)} L/day` }] : []),
        ...(v.dishes ? [{ label: 'Dishes', value: `${dishes.toFixed(0)} L/day` }] : []),
        { label: 'Diet water footprint', value: `${diet.toFixed(0)} L/day` },
        { label: 'Total', value: `${total.toFixed(0)} L/day (${(total * 365 / 1000).toFixed(1)} m³/yr)` },
      ]
}
  },
  description: 'Your water footprint includes direct water use (showers, laundry) and indirect use (food production). Diet accounts for ~70% of the average person\'s water footprint.',
  formula: 'Direct = Σ(Activity × Water use per unit × Frequency) | Diet water varies by food choices',
  interpretation: 'Global average: 3,500 L/day. US average: 7,500 L/day. Food production dominates, especially beef (15,000 L/kg) compared to vegetables (300 L/kg).'
}

export default calcDef
