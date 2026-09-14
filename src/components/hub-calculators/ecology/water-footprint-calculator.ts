import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

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
  presets: [
    { label: 'US average', values: { cropland: '0.5', pasture: '0.3', forest: '0.2', fishing: '0.1', builtUp: '0.15' } },
    { label: 'EU average', values: { cropland: '0.4', pasture: '0.15', forest: '0.25', fishing: '0.05', builtUp: '0.1' } },
    { label: 'Global average', values: { cropland: '0.3', pasture: '0.1', forest: '0.1', fishing: '0.05', builtUp: '0.05' } },
    { label: 'Developing nation', values: { cropland: '0.2', pasture: '0.05', forest: '0.1', fishing: '0.02', builtUp: '0.02' } },
    { label: 'One-planet living', values: { cropland: '0.25', pasture: '0.05', forest: '0.1', fishing: '0.02', builtUp: '0.05' } }
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
,
    extras: [
      { label: "Environmental Context", value: "Ecological footprint measures human demand on nature. Humanity currently uses ~1.75 Earths annually — an overshoot that depletes natural capital." },
      { label: "Measurement Method", value: "National Footprint Accounts use UN data on production, trade, and land use. Biocapacity calculated from crop, forest, grazing, and fishing area × yield factors." },
      { label: "Conservation Note", value: "Reducing per-capita footprint from 2.7 to <1.6 gha is essential for sustainability. High-income countries have 3-5× the global average footprint." },
      { label: "Typical Ranges", value: "World average: 2.7 gha/person. US: 8.1, EU: 4.5, China: 3.4, India: 1.1. Biocapacity per person declining as population grows." },
      { label: "Related Concepts", value: "Planetary boundaries, doughnut economics, one-planet living, circular economy, natural capital accounting, SDGs." }
    ]}
  },
  description: 'Your water footprint includes direct water use (showers, laundry) and indirect use (food production). Diet accounts for ~70% of the average person\'s water footprint.',
  formula: 'Direct = Σ(Activity × Water use per unit × Frequency) | Diet water varies by food choices',
  interpretation: 'Global average: 3,500 L/day. US average: 7,500 L/day. Food production dominates, especially beef (15,000 L/kg) compared to vegetables (300 L/kg).'
}

export default calcDef
