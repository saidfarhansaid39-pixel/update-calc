import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), shape: z.string().min(1) }),
  defaults: { length: '80', width: '60', shape: 'rectangle' },
  presets: [
    { label: 'Small Lot (0.1 ac)', values: { length: '50', width: '40', shape: 'rectangle' } },
    { label: 'Average US Lot (0.25 ac)', values: { length: '80', width: '60', shape: 'rectangle' } },
    { label: 'Circular Garden', values: { length: '40', width: '40', shape: 'circle' } },
  ],
  fields: [
    { name: 'length', label: 'Length (ft)', type: 'number', min: 1, step: '10' },
    { name: 'width', label: 'Width (ft)', type: 'number', min: 1, step: '10' },
    { name: 'shape', label: 'Lawn Shape', type: 'select', options: [{ label: 'Rectangle', value: 'rectangle' }, { label: 'Triangle', value: 'triangle' }, { label: 'Circle', value: 'circle' }] },
  ],
  compute: (v) => {
    const L = parseFloat(v.length)||0; const W = parseFloat(v.width)||0
    let sqft = 0
    if (v.shape === 'rectangle') sqft = L * W
    else if (v.shape === 'triangle') sqft = 0.5 * L * W
    else if (v.shape === 'circle') sqft = Math.PI * Math.pow(L / 2, 2)
    const acres = sqft / 43560
    const hectares = sqft * 0.0000092903
    return { result: sqft, label: 'Lawn Area', unit: 'sq ft', steps: [
      { label: `1. Shape Formula`, value: `${v.shape === 'rectangle' ? `${L}×${W} = ` : v.shape === 'triangle' ? `½×${L}×${W} = ` : `π×(${L}/2)² = `} ${sqft.toFixed(0)} sq ft` },
      { label: '2. Convert to Acres', value: `${sqft.toFixed(0)} sq ft ÷ 43,560 = ${acres.toFixed(4)} acres` },
      { label: '3. Convert to Hectares', value: `${sqft.toFixed(0)} sq ft × 0.0000092903 = ${hectares.toFixed(4)} ha` },
      { label: '4. Mowing Time Est.', value: `${sqft.toFixed(0)} sq ft ÷ 5,000 sq ft/hr = ${(sqft/5000).toFixed(1)} hr (push mower)` },
    ] ,
    extras: [
      { label: 'Mowing Time Reference', value: 'Push mower: ~5,000 sq ft/hr. Riding mower: ~20,000 sq ft/hr. Robot mower: manages 10,000-25,000 sq ft/day (needs boundary wire installed).' },
      { label: 'Fertilizer Calculation', value: 'Standard lawn fertilizer: 1 lb N per 1,000 sq ft. A 5,000 sq ft lawn needs 5 lb of N per application. Apply 3-4×/year during growing season.' },
      { label: 'Water Needs', value: 'Lawns need 1-1.5 in of water per week (including rain). A 5,000 sq ft lawn needs 3,100 gal/week. Install a rain gauge to avoid overwatering.' },
      { label: 'Seed Coverage', value: 'Cool-season grass seed: 5-10 lb/1,000 sq ft. Warm-season: 2-5 lb/1,000 sq ft. Sod: priced per sq ft or pallet (400-500 sq ft per pallet).' },
      { label: 'Soil Testing', value: 'Test soil pH every 2-3 years. Optimal pH 6.0-7.0 for most lawns. Add lime to raise pH, sulfur to lower it. DIY test kits: $10-20. Lab tests: $20-50.' },
      { label: 'Aeration Schedule', value: 'Core aeration once per year for compacted soil. Best times: spring or fall. Aerate before fertilizing for better nutrient absorption.' },
      { label: 'Weed Prevention', value: 'Pre-emergent herbicide in spring (before soil temp reaches 55°F). Post-emergent for existing weeds. Pull dandelions by taproot — cut root at 2-3 in deep.' },
      { label: 'Grass Types by Region', value: 'North: Kentucky bluegrass, fescue, ryegrass (cool-season). South: Bermuda, Zoysia, St. Augustine (warm-season). Transition zone: tall fescue works best.' },
    ]}
  },
  description: 'Calculate lawn area in square feet, acres, and hectares for planning mowing, fertilizing, irrigation, and seeding. Supports rectangle, triangle, and circle shapes.',
  formula: 'Rectangle: L×W. Triangle: ½×L×W. Circle: π×(D/2)². 1 acre = 43,560 sq ft. 1 hectare = 107,639 sq ft. Mowing Time (hr) = Area / 5,000 (push) or / 20,000 (riding).',
  interpretation: 'Average US lawn: 0.2-0.5 acres (8,712-21,780 sq ft). A 5,000 sq ft rectangle lawn (80×62.5 ft) takes ~1 hr to mow with a push mower. Fertilizer: 1 lb N/1,000 sq ft. Irrigation: 1-1.5 in/week = ~3,100 gal/week per 5,000 sq ft.'
}

export default calcDef
