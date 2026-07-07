import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ herbCount: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), pots: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), soilBags: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), seeds: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), growLight: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'herbCount', label: 'Herb Varieties', type: 'number', min: 1, step: '1' },
    { name: 'pots', label: 'Pots Needed', type: 'number', min: 0, step: '1' },
    { name: 'soilBags', label: 'Potting Soil Bags', type: 'number', min: 0, step: '1' },
    { name: 'seeds', label: 'Seed Packets', type: 'number', min: 0, step: '1' },
    { name: 'growLight', label: 'Grow Lights', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => { const potCost = v.pots * 5; const soilCost = v.soilBags * 8; const seedCost = v.seeds * 4; const lightCost = v.growLight * 30; const total = potCost + soilCost + seedCost + lightCost; return { result: total, label: 'Indoor Herb Setup Cost', unit: '$', steps: [{ label: 'Pots', value: `${v.pots} × $5 = $${potCost}` }, { label: 'Soil', value: `${v.soilBags} × $8 = $${soilCost}` }, { label: 'Seeds', value: `${v.seeds} × $4 = $${seedCost}` }, { label: 'Grow Lights', value: `${v.growLight} × $30 = $${lightCost}` }, { label: 'Total', value: `$${total.toFixed(0)}` }] } },
  description: 'Estimate the upfront cost of setting up an indoor herb garden with pots, soil, seeds, and grow lights.',
  formula: 'Total = (Pots × $5) + (Soil × $8) + (Seeds × $4) + (Lights × $30)',
  interpretation: 'Indoor herb gardens pay for themselves in 2-4 months vs store-bought herbs. Easy starters: basil, mint, chives, parsley, cilantro. Most herbs need 6+ hrs of light daily.'
}

export default calcDef
