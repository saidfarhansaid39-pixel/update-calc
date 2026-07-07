import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ shirtsPerWeek: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), suitsPerWeek: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), dressesPerWeek: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), pantsPerWeek: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), coatsPerWeek: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), weeksPerYear: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'shirtsPerWeek', label: 'Shirts/Week', type: 'number', min: 0, step: '1' },
    { name: 'suitsPerWeek', label: 'Suits/Week', type: 'number', min: 0, step: '1' },
    { name: 'dressesPerWeek', label: 'Dresses/Week', type: 'number', min: 0, step: '1' },
    { name: 'pantsPerWeek', label: 'Pants/Week', type: 'number', min: 0, step: '1' },
    { name: 'coatsPerWeek', label: 'Coats/Week', type: 'number', min: 0, step: '1' },
    { name: 'weeksPerYear', label: 'Weeks per Year', type: 'number', min: 1, max: 52, step: '1' },
  ],
  compute: (v) => {
    const shirtCost = 2.5; const suitCost = 12; const dressCost = 8; const pantsCost = 6; const coatCost = 15
    const weekly = v.shirtsPerWeek * shirtCost + v.suitsPerWeek * suitCost + v.dressesPerWeek * dressCost + v.pantsPerWeek * pantsCost + v.coatsPerWeek * coatCost
    const monthly = weekly * 4.33
    const annual = weekly * v.weeksPerYear
    return { result: monthly, label: 'Monthly Dry Cleaning Cost', unit: '$', steps: [{ label: 'Weekly Cost', value: `$${weekly.toFixed(2)}` }, { label: 'Monthly Cost', value: `$${monthly.toFixed(2)}` }, { label: 'Annual Cost', value: `$${annual.toFixed(2)}` }] }
  },
  description: 'Estimate your monthly and annual dry cleaning expenses based on items cleaned per week and average per-item pricing.',
  formula: 'Weekly = Shirts×$2.50 + Suits×$12 + Dresses×$8 + Pants×$6 + Coats×$15 | Annual = Weekly × Weeks/Year',
  interpretation: 'Dry cleaning costs vary by item and region. Shirts average $2-3, suits $10-15, dresses $6-12. Professional wardrobe care extends garment life by 2-3× vs home washing.'
}

export default calcDef
