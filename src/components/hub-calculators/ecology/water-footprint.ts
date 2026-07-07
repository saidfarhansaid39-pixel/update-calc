import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ showers: z.string().optional(), laundry: z.string().optional(), dishes: z.string().optional(), food: z.string().optional() }),
  fields: [
    { name: 'showers', label: 'Shower minutes/day', type: 'number', min: 0, step: '1' },
    { name: 'laundry', label: 'Laundry loads/week', type: 'number', min: 0, step: '0.5' },
    { name: 'dishes', label: 'Dish loads/week', type: 'number', min: 0, step: '0.5' },
    { name: 'food', label: 'Diet type', type: 'select', options: [{ label: 'Meat-heavy', value: 'meat' }, { label: 'Average', value: 'avg' }, { label: 'Vegetarian', value: 'veg' }, { label: 'Vegan', value: 'vegan' }] },
  ],
  compute: (v) => { const showerWater = (parseFloat(v.showers)||0) * 9.5 * 365; const laundryWater = (parseFloat(v.laundry)||0) * 50 * 52; const dishWater = (parseFloat(v.dishes)||0) * 25 * 52; const foodMap: Record<string, number> = { meat: 5400, avg: 3800, veg: 2600, vegan: 1800 }; const foodWater = foodMap[v.food||'avg']; const total = (showerWater + laundryWater + dishWater) / 1000 + foodWater; return { result: total, label: 'Annual Water Footprint', unit: 'm³', steps: [{ label: 'Showers', value: `${(showerWater/1000).toFixed(1)} m³` }, { label: 'Laundry', value: `${(laundryWater/1000).toFixed(1)} m³` }, { label: 'Dishes', value: `${(dishWater/1000).toFixed(1)} m³` }, { label: 'Food production', value: `${foodWater} m³` }, { label: 'Total', value: `${total.toFixed(0)} m³` }] } },
  description: 'Calculates water consumption including direct use and virtual water from food.',
  formula: 'Water = direct use (L) + food water footprint (m³)',
  interpretation: 'Global average: ~1,385 m³/yr per person. Food accounts for ~70% of total water footprint.'
}

export default calcDef
