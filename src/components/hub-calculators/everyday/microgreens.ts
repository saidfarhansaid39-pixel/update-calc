import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ trays: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), trayCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), seedCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), mediumCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), lightCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), harvestOz: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), pricePerOz: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'trays', label: 'Number of Trays', type: 'number', min: 1, step: '1' },
    { name: 'trayCost', label: 'Cost per Tray ($)', type: 'number', min: 0, step: '1' },
    { name: 'seedCost', label: 'Seed Cost per Tray ($)', type: 'number', min: 0, step: '1' },
    { name: 'mediumCost', label: 'Growing Medium per Tray ($)', type: 'number', min: 0, step: '0.5' },
    { name: 'lightCost', label: 'Lighting Cost per Tray ($)', type: 'number', min: 0, step: '1' },
    { name: 'harvestOz', label: 'Harvest per Tray (oz)', type: 'number', min: 0, step: '2' },
    { name: 'pricePerOz', label: 'Sale Price per Oz ($)', type: 'number', min: 0, step: '2' },
  ],
  compute: (v) => { const setupCost = v.trays * (v.trayCost + v.lightCost); const perCycleCost = v.trays * (v.seedCost + v.mediumCost); const totalCost = setupCost + perCycleCost; const totalOz = v.trays * v.harvestOz; const revenue = totalOz * v.pricePerOz; const profit = revenue - perCycleCost - setupCost; const roi = setupCost > 0 ? ((revenue - perCycleCost) / setupCost) * 100 : 0; const breakEvenCycles = Math.ceil(setupCost / (revenue - perCycleCost)); return { result: profit, label: 'Profit (1 cycle)', unit: '$', steps: [{ label: 'Setup Cost', value: `$${setupCost.toFixed(2)}` }, { label: 'Operating Cost/Cycle', value: `$${perCycleCost.toFixed(2)}` }, { label: 'Total Harvest', value: `${totalOz} oz` }, { label: 'Revenue', value: `$${revenue.toFixed(2)}` }, { label: 'Profit/Cycle', value: `$${profit.toFixed(2)}` }, { label: 'Breakeven', value: `${isFinite(breakEvenCycles) ? breakEvenCycles : 'N/A'} cycles` }] } },
  description: 'Estimate microgreens growing business profitability including setup costs, operating expenses, harvest yield, and revenue per cycle.',
  formula: 'Profit = (Trays × Oz/Tray × Price/Oz) − Setup Costs − (Trays × (Seed + Medium))',
  interpretation: 'Microgreens can generate $25-50/sq ft annually. Popular varieties: sunflower, pea shoots, radish, broccoli. Farmers markets sell microgreens for $25-40/lb wholesale.'
}

export default calcDef
