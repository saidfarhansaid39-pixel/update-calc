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
  defaults: { trays: '10', trayCost: '3', seedCost: '4', mediumCost: '1.5', lightCost: '2', harvestOz: '8', pricePerOz: '4' },
  presets: [
    { label: 'Home Hobbyist', values: { trays: '5', trayCost: '3', seedCost: '4', mediumCost: '1.5', lightCost: '2', harvestOz: '6', pricePerOz: '4' } },
    { label: 'Small Business', values: { trays: '20', trayCost: '2.5', seedCost: '3.5', mediumCost: '1', lightCost: '1.5', harvestOz: '8', pricePerOz: '4' } },
    { label: 'Farmers Market Seller', values: { trays: '40', trayCost: '2', seedCost: '3', mediumCost: '0.75', lightCost: '1', harvestOz: '10', pricePerOz: '5' } },
    { label: 'Premium Microgreens', values: { trays: '10', trayCost: '5', seedCost: '6', mediumCost: '2', lightCost: '3', harvestOz: '8', pricePerOz: '6' } },
  ],
  compute: (v) => { const setupCost = v.trays * (v.trayCost + v.lightCost); const perCycleCost = v.trays * (v.seedCost + v.mediumCost); const totalCost = setupCost + perCycleCost; const totalOz = v.trays * v.harvestOz; const totalLb = totalOz / 16; const revenue = totalOz * v.pricePerOz; const profit = revenue - perCycleCost - setupCost; const roi = setupCost > 0 ? ((revenue - perCycleCost) / setupCost) * 100 : 0; const breakEvenCycles = perCycleCost > 0 && (revenue - perCycleCost) > 0 ? Math.ceil(setupCost / (revenue - perCycleCost)) : Infinity; const annualProfit = profit * 12; const costPerOz = totalOz > 0 ? perCycleCost / totalOz : 0; return { result: profit, label: 'Profit (1 cycle)', unit: '$', steps: [
    { label: 'Setup Cost (trays + lights)', value: `${v.trays} × ($${v.trayCost.toFixed(2)} + $${v.lightCost.toFixed(2)}) = $${setupCost.toFixed(2)}` },
    { label: 'Operating Cost/Cycle', value: `${v.trays} × ($${v.seedCost.toFixed(2)} + $${v.mediumCost.toFixed(2)}) = $${perCycleCost.toFixed(2)}` },
    { label: 'Total Harvest', value: `${v.trays} × ${v.harvestOz} oz = ${totalOz} oz (${totalLb.toFixed(1)} lbs)` },
    { label: 'Revenue', value: `${totalOz} oz × $${v.pricePerOz.toFixed(2)} = $${revenue.toFixed(2)}` },
    { label: 'Net Profit (1 cycle)', value: `$${revenue.toFixed(2)} − $${perCycleCost.toFixed(2)} − $${setupCost.toFixed(2)} = $${profit.toFixed(2)}` },
    { label: 'Profit Margin', value: revenue > 0 ? `${((profit / revenue) * 100).toFixed(0)}%` : 'N/A' },
    { label: 'Cost per Oz', value: `$${costPerOz.toFixed(2)}/oz (sale price: $${v.pricePerOz.toFixed(2)}/oz)` },
    { label: 'Breakeven', value: isFinite(breakEvenCycles) ? `${breakEvenCycles} cycles ($${(breakEvenCycles * perCycleCost + setupCost).toFixed(0)} total cost)` : 'Revenue does not cover costs' },
  ] ,
    extras: [
      { label: 'Annual Revenue Potential', value: `At 1 cycle/month: ~$${annualProfit.toFixed(0)}/yr profit. Top growers do 12-18 cycles/year with staggered planting.` },
      { label: 'Best Varieties', value: 'Sunflower (highest yield), pea shoots (fastest), radish (spiciest), broccoli (most nutrients). Sunflower yields 8-12 oz per 10×20 tray.' },
      { label: 'Growing Cycle', value: 'Most microgreens: 7-14 days from seed to harvest. Sunflower: 7-10 days. Pea shoots: 8-12 days. Radish: 6-10 days.' },
      { label: 'Market Prices', value: 'Farmers markets: $25-40/lb ($1.50-2.50/oz). Wholesale: $15-25/lb. Restaurants: $20-35/lb. Premium varieties (red amaranth, basil) fetch highest prices.' },
      { label: 'Space Requirements', value: `${v.trays} trays: ~${(v.trays * 1.5).toFixed(0)} sq ft (10×20 trays). Can stack vertically for 3× density.` },
      { label: 'ROI Analysis', value: setupCost > 0 ? `ROI: ${roi.toFixed(0)}% per cycle. At ${breakEvenCycles === Infinity ? 'N/A' : breakEvenCycles} cycles, you break even on setup.` : 'No setup cost calculated.' },
      { label: 'Seed Density', value: 'Standard: 1-2 oz of seed per 10×20 tray. Proper density = even growth. Too dense = mold risk. Too sparse = low yield.' },
      { label: 'Common Issues', value: 'Mold (increase airflow), uneven germination (pre-soak seeds), leggy growth (more light), foul smell (overwatering).' },
    ]} },
  description: 'Estimate microgreens growing business profitability with a complete financial breakdown. Input your tray count, costs, yield, and sale price to see profit per cycle, ROI, breakeven, and annual projections.',
  formula: 'Profit = (Trays × Oz/Tray × Price/Oz) − SetupCost − (Trays × (SeedCost + MediumCost)) | ROI% = (Revenue − OpCost) / SetupCost × 100 | Breakeven = Ceil(SetupCost / (Revenue − OpCost)) | Cycle: ~7-14 days',
  interpretation: 'Microgreens can generate $25-50/sq ft annually, making them one of the most profitable crops per square foot. A 10-tray home setup with sunflower microgreens ($4/oz) costs ~$50 setup + ~$55/cycle operating, yielding 80 oz/cycle worth $320 — a profit of ~$215/cycle or ~$2,580/year. Popular varieties: sunflower, pea shoots, radish, broccoli. Farmers market retail: $25-40/lb. Profit margins typically range 50-70% once setup costs are recovered.'
}

export default calcDef
