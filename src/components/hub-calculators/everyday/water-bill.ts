import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wbUsage: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wbUnit: z.string().min(1), wbRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wbBaseFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wbSewerPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'wbUsage', label: 'Water Usage', type: 'number', min: 1, step: '100' },
    { name: 'wbUnit', label: 'Usage Unit', type: 'select', options: [{ label: 'Gallons', value: 'gal' }, { label: 'Cubic Feet (CCF)', value: 'ccf' }, { label: 'Liters', value: 'L' }, { label: 'Cubic Meters', value: 'm3' }] },
    { name: 'wbRate', label: 'Rate per 1000 Units ($)', type: 'number', min: 0.5, step: '1' },
    { name: 'wbBaseFee', label: 'Base/Meter Fee ($)', type: 'number', min: 0, step: '5' },
    { name: 'wbSewerPct', label: 'Sewer (% of Water Used)', type: 'number', min: 0, max: 100, step: '10' },
  ],
  defaults: { wbUsage: '4000', wbUnit: 'gal', wbRate: '8', wbBaseFee: '25', wbSewerPct: '80' },
  presets: [
    { label: 'Efficient Small Household', values: { wbUsage: '2000', wbUnit: 'gal', wbRate: '6', wbBaseFee: '15', wbSewerPct: '50' } },
    { label: 'Average Family Home', values: { wbUsage: '4000', wbUnit: 'gal', wbRate: '8', wbBaseFee: '25', wbSewerPct: '80' } },
    { label: 'Large Family High Usage', values: { wbUsage: '8000', wbUnit: 'gal', wbRate: '12', wbBaseFee: '35', wbSewerPct: '100' } },
  ],
  compute: (v) => {
    const unitConversions: Record<string, number> = { gal: 1000, ccf: 1, L: 1000, m3: 1 }
    const unitsInBilling = v.wbUsage / (unitConversions[v.wbUnit] || 1000)
    const waterCharge = unitsInBilling * v.wbRate
    const sewerCharge = waterCharge * (v.wbSewerPct / 100)
    const total = waterCharge + sewerCharge + v.wbBaseFee
    const effectiveRate = total / unitsInBilling
    return { result: total, label: 'Total Water Bill', unit: '$', steps: [{ label: 'Usage in Billing Units', value: `${v.wbUsage} ${v.wbUnit} = ${unitsInBilling.toFixed(2)} billing units` }, { label: 'Water Charge', value: `${unitsInBilling.toFixed(2)} × $${v.wbRate.toFixed(2)} = $${waterCharge.toFixed(2)}` }, { label: 'Sewer Charge', value: `${v.wbSewerPct}% of water charge = $${sewerCharge.toFixed(2)}` }, { label: 'Base/Meter Fee', value: `$${v.wbBaseFee.toFixed(2)}` }, { label: 'Total Bill', value: `$${total.toFixed(2)}` }, { label: 'Effective Rate', value: `$${effectiveRate.toFixed(2)} per billing unit (incl. sewer + fees)` }] ,
    extras: [
      { label: 'Water Billing Units Explained', value: '1 CCF = 100 cubic feet = 748 gallons. 1 m³ = 1,000 L = 264 gallons. US water bills use CCF or 1,000 gal increments. Always check your bill for the billing unit — comparing $/CCF vs $/kgal requires conversion (divide $/CCF by 0.748 for $/kgal).' },
      { label: 'Sewer Charges Insight', value: 'Sewer is typically 50-100% of the water charge because wastewater treatment is expensive. Some utilities cap sewer at winter avg consumption (since outdoor water doesn\'t enter sewers). Others charge flat sewer fees regardless of usage.' },
      { label: 'Tiered Water Rates', value: 'Many utilities use increasing block rates: Tier 1 (basic use) $3-6/CCF, Tier 2 (moderate) $6-12/CCF, Tier 3 (excessive) $12-20+/CCF. This calculator uses a flat rate — check if your utility has tiers that would change the calculation.' },
      { label: 'Leak Detection Saves Money', value: 'A running toilet wastes 200+ gal/day = $20-60/month on your bill. A leaking faucet (1 drip/sec) = 1,200 gal/year = $10-30/year. A burst pipe can add $500-2,000 to a single bill. Monitor your bill for unexplained increases.' },
      { label: 'Seasonal Usage Patterns', value: 'Summer water use is typically 30-50% higher due to lawn irrigation, pools, and kids home. In winter, usage drops but sewer charges may stay the same (based on winter average). Budget $60-120/month for water in summer vs $40-80 in winter.' },
      { label: 'Water Saving ROI', value: 'Low-flow showerhead ($25): saves 2,900 gal/yr = $23-58/yr. Dual-flush toilet ($150): saves 5,000-10,000 gal/yr = $40-120/yr. Rain barrel ($80): saves 1,300 gal/yr. Smart timer ($150): saves 30-50% on outdoor water. Payback: 6-24 months.' },
      { label: 'Regional Rate Comparisons', value: 'Cheapest US water: Chicago $3.50/CCF, Indianapolis $3.80/CCF. Most expensive: San Francisco $15-20/CCF, Santa Fe $14-18/CCF, Los Angeles $12-16/CCF. Average: $5-12/CCF. Southern drought-prone states have the fastest-rising rates (6-10%/year).' },
    ]}
  },
  description: 'Calculate your monthly water bill based on usage, unit rate, base fee, and sewer charges. Supports gallons, CCF (hundred cubic feet), liters, and cubic meters with automatic unit conversion.',
  formula: 'BillingUnits = Usage ÷ 1000 (for gal/L) or Usage ÷ 1 (for CCF/m³). WaterCharge = BillingUnits × RatePerThousand. SewerCharge = WaterCharge × SewerPct%. Total = WaterCharge + SewerCharge + BaseFee. EffectiveRate = Total ÷ BillingUnits.',
  interpretation: 'A household using 4,000 gal/month with a $8/kgal rate, $25 base fee, and 80% sewer charge pays: water = $32.00, sewer = $25.60, base = $25.00 → total = $82.60/month. The effective rate is $20.65 per 1,000 gal when including all charges. Sewer alone adds $25.60 — meaning 31% of the total bill goes to wastewater treatment. Low-flow fixtures can cut usage 20-30%, reducing the bill to ~$60-70/month. Always check for leaks by reading your meter during a period of no water use — a spinning dial indicates a leak costing you money.'
}

export default calcDef
