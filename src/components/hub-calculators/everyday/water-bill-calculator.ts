import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wbc2Gallons: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wbc2RatePerKgal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wbc2SewerRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wbc2FixedFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wbc2People: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'wbc2Gallons', label: 'Water Used (gallons)', type: 'number', min: 100, step: '500' },
    { name: 'wbc2RatePerKgal', label: 'Rate per 1000 gal ($)', type: 'number', min: 1, step: '2' },
    { name: 'wbc2SewerRate', label: 'Sewer Rate ($)', type: 'number', min: 0, step: '2' },
    { name: 'wbc2FixedFee', label: 'Base/Fixed Fee ($)', type: 'number', min: 0, step: '5' },
    { name: 'wbc2People', label: 'Household Size', type: 'number', min: 1, step: '1' },
  ],
  defaults: { wbc2Gallons: '9000', wbc2RatePerKgal: '8', wbc2SewerRate: '6', wbc2FixedFee: '20', wbc2People: '3' },
  presets: [
    { label: 'Single Person Efficient', values: { wbc2Gallons: '2500', wbc2RatePerKgal: '6', wbc2SewerRate: '4', wbc2FixedFee: '15', wbc2People: '1' } },
    { label: 'Family of 4 Average', values: { wbc2Gallons: '12000', wbc2RatePerKgal: '8', wbc2SewerRate: '6', wbc2FixedFee: '25', wbc2People: '4' } },
    { label: 'Large Family High Use', values: { wbc2Gallons: '18000', wbc2RatePerKgal: '10', wbc2SewerRate: '8', wbc2FixedFee: '30', wbc2People: '5' } },
  ],
  compute: (v) => {
    const kgal = v.wbc2Gallons / 1000
    const waterCost = kgal * v.wbc2RatePerKgal
    const sewerCost = kgal * v.wbc2SewerRate
    const total = waterCost + sewerCost + v.wbc2FixedFee
    const perPerson = total / v.wbc2People
    const gallonsPerPerson = v.wbc2Gallons / v.wbc2People
    return { result: total, label: 'Total Water Bill', unit: '$', steps: [{ label: 'Usage in 1,000 gal units', value: `${v.wbc2Gallons.toFixed(0)} gal ÷ 1,000 = ${kgal.toFixed(2)} kgal` }, { label: 'Water Charge', value: `${kgal.toFixed(2)} × $${v.wbc2RatePerKgal.toFixed(2)} = $${waterCost.toFixed(2)}` }, { label: 'Sewer Charge', value: `${kgal.toFixed(2)} × $${v.wbc2SewerRate.toFixed(2)} = $${sewerCost.toFixed(2)}` }, { label: 'Fixed/Meter Fee', value: `$${v.wbc2FixedFee.toFixed(2)}` }, { label: 'Total Monthly Bill', value: `$${total.toFixed(2)}` }, { label: 'Cost per Person', value: `$${total.toFixed(2)} ÷ ${v.wbc2People} = $${perPerson.toFixed(2)}/person` }, { label: 'Usage per Person', value: `${gallonsPerPerson.toFixed(0)} gal/person` }, { label: 'Effective Cost per Gal', value: `$${total.toFixed(2)} ÷ ${v.wbc2Gallons.toFixed(0)} gal = $${(total / v.wbc2Gallons * 100).toFixed(2)}¢/gal` }] ,
    extras: [
      { label: 'Typical Water Rates', value: 'US average: $4-15 per 1,000 gallons. Sewer rates: $4-12 per 1,000 gallons. Combined with fixed fees ($15-40/month), total bill for a family of 4 averages $70-120/month. Rates rising 5-8% annually in most areas.' },
      { label: 'Sewer Cost Breakdown', value: 'Sewer charges often equal or exceed water charges because wastewater treatment is energy-intensive and infrastructure-heavy. Some utilities bill sewer as a percentage of water usage (80-100%), others at a flat per-1,000-gal rate.' },
      { label: 'Usage Patterns by Family Size', value: '1 person: 2,000-3,000 gal/mo. 2 people: 5,000-7,000 gal/mo. 3 people: 7,000-10,000 gal/mo. 4 people: 10,000-14,000 gal/mo. 5+ people: 14,000-20,000 gal/mo. Each additional person adds ~2,000-3,000 gal/month.' },
      { label: 'Water-Saving Appliance ROI', value: 'HE washer ($600-1,000): saves 3,000-5,000 gal/yr = $30-60/yr. Low-flow toilet ($150-300): saves 5,000-10,000 gal/yr = $50-120/yr. Dishwasher ($500-800): uses 6 gal/load vs hand washing 20 gal. Total annual savings from all upgrades: $200-400.' },
      { label: 'Leak Impact on Bill', value: 'A toilet flapper leak (silent): wastes 30-200 gal/day = $10-60/month extra. A faucet drip: 1,200-5,000 gal/yr = $10-50/yr. A slab leak: 500+ gal/day = $150-500/month. Check your bill trend — a sudden 20%+ increase likely means a leak.' },
      { label: 'Summer vs Winter Usage', value: 'Summer water bills are 30-60% higher due to lawn watering, pools, car washing, and outdoor use. In drought-prone areas, summer rates may double under tiered pricing. Budget $80-150/month summer vs $50-80/month winter for a typical family.' },
      { label: 'Utility Assistance Programs', value: 'LIHEAP and LIHWAP provide water bill assistance for low-income households. Many utilities offer budget billing (average monthly payments). Some cities have senior/disabled discounts of 10-25%. Late fees: 5-10% of bill after 15-30 days.' },
    ]}
  },
  description: 'Calculate your water bill from total gallons used, rate per thousand gallons, sewer charges, fixed fees, and household size. Get per-person cost and effective per-gallon rate for informed budgeting.',
  formula: 'Bill = (Gallons ÷ 1,000) × (WaterRate + SewerRate) + FixedFee. PerPerson = Total ÷ People. GallonsPerPerson = Gallons ÷ People. EffectiveRate¢ = (Total ÷ Gallons) × 100¢.',
  interpretation: 'A family of 3 using 9,000 gal/month with $8/kgal water rate, $6/kgal sewer rate, and $20 fixed fee pays: water $72.00 + sewer $54.00 + fixed $20.00 = $146.00/month total. That is $48.67/person and 1.62¢/gallon. The combined rate of $14/kgal (water + sewer) is typical for US metropolitan areas. Reducing usage by 20% (eliminating leaks, shorter showers, efficient laundry) would save ~$29/month or $350/year. Over 5 years, that\'s $1,750 — enough to fund water-efficient appliance upgrades across the entire home.'
}

export default calcDef
