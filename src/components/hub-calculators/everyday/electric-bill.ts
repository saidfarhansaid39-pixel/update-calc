import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ kwhUsed: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), baseFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), taxRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'kwhUsed', label: 'Electricity Used (kWh)', type: 'number', min: 1, step: '50' },
    { name: 'rate', label: 'Rate per kWh ($)', type: 'number', min: 0.01, step: '0.01' },
    { name: 'baseFee', label: 'Monthly Base Fee ($)', type: 'number', min: 0, step: '5' },
    { name: 'taxRate', label: 'Tax Rate (%)', type: 'number', min: 0, step: '1' },
  ],
  defaults: { kwhUsed: '900', rate: '0.14', baseFee: '10', taxRate: '5' },
  presets: [
    { label: 'Small Apartment (1BR)', values: { kwhUsed: '400', rate: '0.16', baseFee: '8', taxRate: '3' } },
    { label: 'Average Family Home', values: { kwhUsed: '900', rate: '0.14', baseFee: '12', taxRate: '5' } },
    { label: 'Large Home (AC Heavy)', values: { kwhUsed: '1800', rate: '0.22', baseFee: '15', taxRate: '7' } },
    { label: 'All-Electric Home (No Gas)', values: { kwhUsed: '2500', rate: '0.12', baseFee: '20', taxRate: '4' } },
  ],
  compute: (v) => {
    const usageCharge = v.kwhUsed * v.rate
    const subtotal = usageCharge + v.baseFee
    const tax = subtotal * (v.taxRate / 100)
    const total = subtotal + tax
    const avgDailyKwh = v.kwhUsed / 30
    const costPerDay = avgDailyKwh * v.rate
    const costPerHourRunning = v.rate * 1
    const annualEstimate = total * 12
    const tier2Kwh = Math.max(0, v.kwhUsed - 500)
    const tier2Charge = tier2Kwh * v.rate * 1.2
    return { result: total, label: 'Total Electric Bill', unit: '$', steps: [
      { label: 'Monthly Usage', value: `${v.kwhUsed} kWh` },
      { label: 'Usage Charge', value: `${v.kwhUsed} kWh × $${v.rate.toFixed(3)} = $${usageCharge.toFixed(2)}` },
      { label: 'Base Service Fee', value: `$${v.baseFee.toFixed(2)}` },
      { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` },
      { label: 'Taxes & Surcharges', value: `${v.taxRate}% = $${tax.toFixed(2)}` },
      { label: 'Total Monthly Bill', value: `$${total.toFixed(2)}` },
      { label: 'Avg Daily Cost', value: `$${costPerDay.toFixed(2)}/day (${avgDailyKwh.toFixed(0)} kWh/day)` },
      { label: 'Annual Projection', value: `$${annualEstimate.toFixed(0)}/yr` },
      { label: 'Effective Rate (incl. fees)', value: `$${(total / v.kwhUsed).toFixed(4)}/kWh` },
    ] ,
    extras: [
      { label: "Rate Comparison by State", value: "US average: $0.16/kWh. Highest states: HI $0.44, CA $0.30, MA $0.28, CT $0.27, NY $0.24. Lowest: LA $0.12, ID $0.11, ND $0.12, UT $0.12, WA $0.13. Deregulated states (TX, PA, OH, IL) allow supplier switching — shop at powertochoose.org (TX) or paenergyratings.com (PA)." },
      { label: "Time-of-Use (TOU) Savings", value: "TOU plans charge $0.10-0.12/kWh off-peak (9 PM-4 PM) vs $0.25-0.45/kWh peak (4-9 PM). Running dishwasher, laundry, and EV charging overnight can save $20-60/mo. 3-5× higher during summer peak hours. Some TOU plans have free weekends." },
      { label: "Appliance Energy Breakdown", value: "HVAC: 45-50% of bill ($60-100/mo avg). Water heater: 12-15% ($15-25/mo). Refrigerator: 8-10% ($10-15/mo). Washer/Dryer: 5-8% ($8-12/mo). Lighting: 5-10% ($6-12/mo). Electronics: 5-8% ($6-10/mo). Cooking: 3-5% ($4-7/mo)." },
      { label: "Seasonal Bill Variability", value: "Winter (gas heat): ~$80-140/mo electric. Summer (AC): $150-400/mo in hot climates. Spring/Fall: $60-100/mo. The AC season is 4-7 months in southern US vs 1-3 months in northern. A 3-ton AC running 12 hrs/day adds $120-250/mo at $0.15/kWh." },
      { label: "Energy Efficiency ROI", value: "LED bulbs: $3-5 each, save $100-200 over 10-yr life vs incandescent. Smart thermostat (e.g., Nest/EcoBee): $200-250, saves $130-150/yr — payback in 1.5-2 yrs. Energy Star refrigerator: $800-1,200, saves $70-100/yr vs 10-yr-old unit. Attic insulation R30→R60: $0.50-1/sq ft, saves 15-25% on HVAC." },
      { label: "Phantom Load (Vampire Power)", value: "Devices in standby consume 5-15% of total household electricity (~$100-200/yr). Top vampires: cable box (15-30W), gaming console (8-15W idle), computer (5-10W), phone charger (0.5-2W). Use smart power strips to cut standby to zero — saves $40-80/yr." },
      { label: "Solar Break-Even Analysis", value: "At $0.14/kWh and $2.50-3.50/W installed, a 6 kW solar system ($15-21k) generates ~8,000 kWh/yr saving $1,120/yr. Federal ITC (30%) + state incentives reduce net cost to $8-15k. Break-even: 7-12 years. Solar panels last 25-30 years = $15-35k net savings." },
      { label: "Income-Based Assistance", value: "LIHEAP provides $300-1,000/yr for qualifying households (income <150% federal poverty level). Weatherization Assistance Program (WAP) provides free energy upgrades worth $3,500-7,000. Some states (CA, NY, MN) cap energy bills at 4-6% of income for low-income households." },
    ]}
  },
  description: 'Calculate your total monthly electric bill from kWh usage, rate per kWh, base connection fee, and applicable taxes. Includes daily cost breakdown, annual projection, and effective blended rate analysis.',
  formula: 'Total = (kWh × Rate/kWh) + Base Fee + [(kWh × Rate + Base Fee) × Tax%] | Effective Rate = Total / kWh',
  interpretation: 'The average US household uses ~886 kWh/month at $0.16/kWh, yielding a $142/month bill — but this varies dramatically by region and season. Your bill has three layers: usage (60-80% of total), fixed fees (5-15%), and taxes/surcharges (5-15%). The biggest lever is HVAC, which drives 45-50% of annual costs. A programmable thermostat alone can save 10-15% on heating and cooling. For most households, the most impactful single change is sealing air leaks ($200 DIY) which can reduce bills by 15-25%.'
}

export default calcDef
