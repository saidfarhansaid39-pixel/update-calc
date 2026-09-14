import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ kwhUsedMonthly: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ratePerKwh: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), serviceFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), taxPercent: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'kwhUsedMonthly', label: 'Monthly kWh Usage', type: 'number', min: 1, step: '50' },
    { name: 'ratePerKwh', label: 'Rate per kWh ($)', type: 'number', min: 0.01, step: '0.01' },
    { name: 'serviceFee', label: 'Monthly Service Fee ($)', type: 'number', min: 0, step: '5' },
    { name: 'taxPercent', label: 'Tax Rate (%)', type: 'number', min: 0, step: '0.5' },
  ],
  defaults: { kwhUsedMonthly: '900', ratePerKwh: '0.14', serviceFee: '10', taxPercent: '5' },
  presets: [
    { label: 'Efficient 1BR Apartment', values: { kwhUsedMonthly: '350', ratePerKwh: '0.17', serviceFee: '8', taxPercent: '3' } },
    { label: 'Standard Suburban Home', values: { kwhUsedMonthly: '900', ratePerKwh: '0.14', serviceFee: '12', taxPercent: '5' } },
    { label: 'Texas Summer (AC All Day)', values: { kwhUsedMonthly: '2400', ratePerKwh: '0.12', serviceFee: '10', taxPercent: '6' } },
    { label: 'All-Electric + EV', values: { kwhUsedMonthly: '1800', ratePerKwh: '0.11', serviceFee: '15', taxPercent: '4' } },
  ],
  compute: (v) => {
    const usageCharge = v.kwhUsedMonthly * v.ratePerKwh
    const subtotal = usageCharge + v.serviceFee
    const taxes = subtotal * (v.taxPercent / 100)
    const total = subtotal + taxes
    const dailyUsage = v.kwhUsedMonthly / 30.44
    const costPerDay = dailyUsage * v.ratePerKwh
    const costPerHourRunning = v.ratePerKwh * 1
    const annualTotal = total * 12
    const pctServiceFee = (v.serviceFee / total) * 100
    const pctTax = (taxes / total) * 100
    const pctUsage = (usageCharge / total) * 100
    return { result: total, label: 'Total Electric Bill', unit: '$', steps: [
      { label: 'Monthly Consumption', value: `${v.kwhUsedMonthly} kWh` },
      { label: 'Usage Charge', value: `${v.kwhUsedMonthly} kWh × $${v.ratePerKwh.toFixed(3)} = $${usageCharge.toFixed(2)}` },
      { label: 'Service/Connection Fee', value: `$${v.serviceFee.toFixed(2)}` },
      { label: 'Taxes & Surcharges', value: `${v.taxPercent}% = $${taxes.toFixed(2)}` },
      { label: 'Total Due', value: `$${total.toFixed(2)}` },
      { label: 'Daily Avg Cost', value: `$${costPerDay.toFixed(2)}/day` },
      { label: 'Annual Projection', value: `$${annualTotal.toFixed(0)}/yr` },
      { label: 'Bill Breakdown', value: `Usage ${pctUsage.toFixed(0)}% | Fee ${pctServiceFee.toFixed(0)}% | Tax ${pctTax.toFixed(0)}%` },
    ] ,
    extras: [
      { label: "Tiered Rate Structures", value: "Many utilities charge increasing rates per tier. Example: Tier 1 (0-500 kWh) at $0.12, Tier 2 (501-1000 kWh) at $0.16, Tier 3 (1000+) at $0.22. This calculator uses a single blended rate — your actual bill may be higher with tiered pricing. Check your bill for 'baseline' vs 'over baseline' rates." },
      { label: "Deregulated Energy Markets", value: "15 US states + DC have deregulated electricity markets (TX, PA, OH, IL, NY, MA, CT, RI, NH, ME, MD, DE, NJ, MI, VA). You can choose your supplier (not the delivery company). Rates vary from $0.06-0.20/kWh for fixed 12-36 month plans. Use sites like powertochoose.org (TX) to compare." },
      { label: "Summer vs Winter Usage Patterns", value: "Summer peak usage (July-Aug) is 40-80% higher than spring/fall. AC accounts for 60-70% of summer bills. Winter peak (Dec-Jan) adds 20-40% for electric heating. Heat pump homes use 30-50% less winter energy than resistance heating. Spring/Fall shoulder months are cheapest — make energy upgrades then." },
      { label: "Appliance-Specific Energy Monitoring", value: "Use a $20-40 Kill-A-Watt meter to measure individual appliance consumption. Typical findings: old fridge 150-200W ($15-25/mo), new Energy Star fridge 40-60W ($5-8/mo), gaming PC 200-500W ($15-40/mo), space heater 1500W ($50-100/mo if used 8 hrs/day)." },
      { label: "Community Solar & Green Power", value: "If you can't install rooftop solar, community solar subscriptions save 5-15% on your bill by buying into a shared solar farm. Green power programs (paying a premium for renewable energy credits) add $5-20/mo. Both options have no installation cost and are available in 40+ states." },
      { label: "Income-Based Bill Assistance", value: "LIHEAP: up to $1,000/yr for heating/cooling bill assistance (income < 150% FPL). Percentage of Income Payment Plans (PIPP): cap bills at 4-10% of income in some states (CA, NY, OH, PA, IL). Medical baseline allowance: extra 300-500 kWh/mo at lowest tier for medical equipment (CPAP, oxygen concentrator)." },
      { label: "Prepaid vs Postpaid Billing", value: "Prepaid electricity (TX, GA, OH, MD): pay-as-you-go at $0.10-0.18/kWh, no deposit, no credit check, but often higher per-kWh rates. Postpaid: monthly billing, requires deposit ($100-500 for new customers). Smart thermostats with utility rebates ($50-100) reduce both." },
      { label: "Energy Burden by Income Level", value: "Low-income households (bottom 20%) spend 6-10% of income on electricity vs 1-2% for top 20%. Energy burden >6% is considered 'high.' Median US energy burden: 3.1%. Worst states: MS (4.8%), SC (4.5%), AL (4.3%). Best: WA (1.8%), OR (1.9%), CA (2.1%)." },
    ]}
  },
  description: 'Calculate your monthly and annual electricity bill from kWh usage, blended rate per kWh, service connection fee, and taxes. Visualizes the proportional breakdown of usage vs fixed charges.',
  formula: 'Total = (kWh × Rate) + Service Fee + [(kWh × Rate + Service Fee) × Tax%] | Daily Cost = (kWh/30.44) × Rate',
  interpretation: 'While the average US household uses ~900 kWh/month at ~$0.14/kWh for a ~$140/month bill, individual situations vary enormously. Your bill has three layers: usage (80-90% of total), fixed fees (5-10%), and taxes (3-8%). The usage portion is the only part you can control — via efficiency, thermostat programming, and shifting heavy loads to off-peak hours. In deregulated states, a 15-minute rate comparison could save $200-500/year.'
}

export default calcDef
