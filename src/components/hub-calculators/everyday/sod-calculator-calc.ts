import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'length', label: 'Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'width', label: 'Width (ft)', type: 'number', min: 1, step: '1' },
  ],
  defaults: { length: '20', width: '15' },
  presets: [
    { label: 'Small Front Lawn', values: { length: '25', width: '15' } },
    { label: 'Standard Backyard', values: { length: '40', width: '30' } },
    { label: 'Townhouse Patio', values: { length: '12', width: '10' } },
    { label: 'Large Property', values: { length: '80', width: '50' } },
  ],
  compute: (v) => {
    const sqft = v.length * v.width
    const pallets = Math.ceil(sqft / 500)
    const rolls = Math.ceil(sqft / 10)
    return { result: sqft, label: 'Sod Area', unit: 'sq ft', steps: [{ label: 'Area', value: `${sqft.toFixed(0)} sq ft` }, { label: 'Pallets (500 sq ft)', value: `${pallets} pallets` }, { label: 'Rolls (10 sq ft)', value: `${rolls} rolls` }] ,
    extras: [
      { label: 'Waste Factor', value: 'Order 5-10% extra for irregular shapes, curves, and cutting waste. For circular or L-shaped areas, add 10-15%. Simple rectangles: 5%' },
      { label: 'Sod Pallet Standard', value: 'Standard pallet: 500 sq ft (50 sq m), weighs ~1,500-2,000 lb. Rolls: typically 2 ft × 5 ft (10 sq ft) or 1.5 ft × 6 ft (9 sq ft)' },
      { label: 'Installation Timeline', value: 'Install sod within 24-48 hours of harvesting/delivery. In hot weather (>85°F), install within 12 hours. Keep rolls shaded and moist' },
      { label: 'Soil Preparation Steps', value: 'Grade away from foundation (1-2% slope). Remove debris. Till 4-6 in deep. Add 1-2 in compost. Level. Roll surface before laying sod' },
      { label: 'Watering Schedule', value: 'Week 1: water 2-3x daily (keep sod spongy). Week 2: 1x daily (deep watering). Week 3: every other day. After establishment: 1-2x/week' },
      { label: 'Best Sod Varieties', value: 'Cool season (north): Kentucky Bluegrass, Fescue, Ryegrass. Warm season (south): Bermuda, Zoysia, St. Augustine, Centipede. Choose by climate' },
      { label: 'Sod vs Seed Cost', value: 'Sod: $0.35-0.85/sq ft installed. Seed: $0.05-0.15/sq ft. Sod gives instant lawn, seed takes 6-12 weeks. Sod wins for erosion control' },
    ]}
  },
  description: 'Calculate the exact amount of sod needed for your lawn project — area in square feet, number of pallets, and individual rolls. Add 5-10% for waste on irregular shapes.',
  formula: 'SodArea(sq ft) = Length(ft) × Width(ft). Pallets = Ceil(Area ÷ 500). Rolls = Ceil(Area ÷ 10). Waste adjustment: multiply area by 1.05-1.10 for odd shapes.',
  interpretation: 'A standard 20×15 ft lawn (300 sq ft) needs 1 pallet and 30 rolls. A 40×30 ft lawn (1,200 sq ft) needs 3 pallets. Standard pallets cover 500 sq ft and weigh ~1,500 lb. Order at least 5-10% extra for irregular shapes — curved beds, walkways, and tree circles add significant waste. Sod must be installed within 24-48 hours of delivery; start soil preparation at least 2 weeks before delivery. Cost comparison: sod at $0.35-0.85/sq ft installed vs seed at $0.05-0.15/sq ft DIY.'
}

export default calcDef
