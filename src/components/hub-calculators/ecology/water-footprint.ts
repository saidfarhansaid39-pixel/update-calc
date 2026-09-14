import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ showers: z.string().optional(), laundry: z.string().optional(), dishes: z.string().optional(), food: z.string().optional() }),
  fields: [
    { name: 'showers', label: 'Shower minutes/day', type: 'number', min: 0, step: '1' },
    { name: 'laundry', label: 'Laundry loads/week', type: 'number', min: 0, step: '0.5' },
    { name: 'dishes', label: 'Dish loads/week', type: 'number', min: 0, step: '0.5' },
    { name: 'food', label: 'Diet type', type: 'select', options: [{ label: 'Meat-heavy', value: 'meat' }, { label: 'Average', value: 'avg' }, { label: 'Vegetarian', value: 'veg' }, { label: 'Vegan', value: 'vegan' }] },
    ],
  presets: [
    { label: 'US average', values: { cropland: '0.5', pasture: '0.3', forest: '0.2', fishing: '0.1', builtUp: '0.15' } },
    { label: 'EU average', values: { cropland: '0.4', pasture: '0.15', forest: '0.25', fishing: '0.05', builtUp: '0.1' } },
    { label: 'Global average', values: { cropland: '0.3', pasture: '0.1', forest: '0.1', fishing: '0.05', builtUp: '0.05' } },
    { label: 'Developing nation', values: { cropland: '0.2', pasture: '0.05', forest: '0.1', fishing: '0.02', builtUp: '0.02' } },
    { label: 'One-planet living', values: { cropland: '0.25', pasture: '0.05', forest: '0.1', fishing: '0.02', builtUp: '0.05' } }
    ],
  compute: (v) => { const showerWater = (parseFloat(v.showers)||0) * 9.5 * 365; const laundryWater = (parseFloat(v.laundry)||0) * 50 * 52; const dishWater = (parseFloat(v.dishes)||0) * 25 * 52; const foodMap: Record<string, number> = { meat: 5400, avg: 3800, veg: 2600, vegan: 1800 }; const foodWater = foodMap[v.food||'avg']; const total = (showerWater + laundryWater + dishWater) / 1000 + foodWater; return { result: total, label: 'Annual Water Footprint', unit: 'm³', steps: [{ label: 'Showers', value: `${(showerWater/1000).toFixed(1)} m³` }, { label: 'Laundry', value: `${(laundryWater/1000).toFixed(1)} m³` }, { label: 'Dishes', value: `${(dishWater/1000).toFixed(1)} m³` }, { label: 'Food production', value: `${foodWater} m³` }, { label: 'Total', value: `${total.toFixed(0)} m³` }] ,
    extras: [
      { label: "Environmental Context", value: "Ecological footprint measures human demand on nature. Humanity currently uses ~1.75 Earths annually — an overshoot that depletes natural capital." },
      { label: "Measurement Method", value: "National Footprint Accounts use UN data on production, trade, and land use. Biocapacity calculated from crop, forest, grazing, and fishing area × yield factors." },
      { label: "Conservation Note", value: "Reducing per-capita footprint from 2.7 to <1.6 gha is essential for sustainability. High-income countries have 3-5× the global average footprint." },
      { label: "Typical Ranges", value: "World average: 2.7 gha/person. US: 8.1, EU: 4.5, China: 3.4, India: 1.1. Biocapacity per person declining as population grows." },
      { label: "Related Concepts", value: "Planetary boundaries, doughnut economics, one-planet living, circular economy, natural capital accounting, SDGs." }
    ]} },
  description: 'Calculates water consumption including direct use and virtual water from food.',
  formula: 'Water = direct use (L) + food water footprint (m³)',
  interpretation: 'Global average: ~1,385 m³/yr per person. Food accounts for ~70% of total water footprint.'
}

export default calcDef
