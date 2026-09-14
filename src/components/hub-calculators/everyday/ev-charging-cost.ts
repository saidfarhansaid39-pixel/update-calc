import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ batteryKwh: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), chargePct: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), electricityRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), chargeFreq: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'batteryKwh', label: 'Battery Capacity (kWh)', type: 'number', min: 10, step: '5' },
    { name: 'chargePct', label: 'Charge From (%)', type: 'number', min: 1, max: 100, step: '5' },
    { name: 'electricityRate', label: 'Electricity Rate ($/kWh)', type: 'number', min: 0.01, step: '0.01' },
    { name: 'chargeFreq', label: 'Charges per Week', type: 'number', min: 1, step: '1' },
  ],
  defaults: { batteryKwh: '75', chargePct: '60', electricityRate: '0.14', chargeFreq: '3' },
  presets: [
    { label: 'Tesla Model Y (Home TOU)', values: { batteryKwh: '75', chargePct: '60', electricityRate: '0.10', chargeFreq: '3' } },
    { label: 'F-150 Lightning (Large Pack)', values: { batteryKwh: '98', chargePct: '50', electricityRate: '0.16', chargeFreq: '4' } },
    { label: 'Nissan Leaf (Small Commute)', values: { batteryKwh: '40', chargePct: '70', electricityRate: '0.14', chargeFreq: '2' } },
    { label: 'DCFC Road Warrior', values: { batteryKwh: '85', chargePct: '80', electricityRate: '0.48', chargeFreq: '2' } },
  ],
  compute: (v) => {
    const kwhPerCharge = v.batteryKwh * (v.chargePct / 100)
    const costPerCharge = kwhPerCharge * v.electricityRate
    const weeklyCost = costPerCharge * v.chargeFreq
    const monthlyCost = weeklyCost * 4.33
    const annualCost = weeklyCost * 52
    const milesPerKwh = 3.5
    const milesPerCharge = kwhPerCharge * milesPerKwh
    const milesPerMonth = milesPerCharge * v.chargeFreq * 4.33
    const gasGalsEquivalent = milesPerMonth / 30
    const gasCostEquivalent = gasGalsEquivalent * 3.50
    const savingsVsGas = gasCostEquivalent - monthlyCost
    const costPerMile = monthlyCost > 0 ? monthlyCost / milesPerMonth : 0
    return { result: monthlyCost, label: 'Monthly Charging Cost', unit: '$', steps: [
      { label: 'Battery Capacity', value: `${v.batteryKwh} kWh` },
      { label: 'Energy per Charge', value: `${v.batteryKwh} kWh × ${v.chargePct}% = ${kwhPerCharge.toFixed(1)} kWh` },
      { label: 'Cost per Charge', value: `${kwhPerCharge.toFixed(1)} kWh × $${v.electricityRate.toFixed(2)} = $${costPerCharge.toFixed(2)}` },
      { label: 'Charges per Week', value: `${v.chargeFreq} × $${costPerCharge.toFixed(2)} = $${weeklyCost.toFixed(2)}` },
      { label: 'Monthly Cost', value: `$${monthlyCost.toFixed(2)}` },
      { label: 'Annual Cost', value: `$${annualCost.toFixed(2)}` },
      { label: 'Estimated Range per Charge', value: `~${milesPerCharge.toFixed(0)} miles (at ${milesPerKwh} mi/kWh)` },
      { label: 'Cost per Mile', value: `$${costPerMile.toFixed(3)}/mi (vs $0.12/mi for gas)` },
      { label: 'Savings vs Gas Car (30 MPG)', value: `$${savingsVsGas.toFixed(0)}/mo` },
    ] ,
    extras: [
      { label: "Home vs Public Charging Cost Gap", value: "Home charging at $0.14/kWh = ~$0.04/mi. Public Level 2 at $0.25-0.50/kWh = $0.07-0.14/mi. DCFC at $0.32-0.56/kWh = $0.10-0.20/mi. Home charging is 50-75% cheaper than DCFC. Always charge at home or work when possible. A 75 kWh battery at home ($0.14) costs $7.35 — at DCFC ($0.48) it's $25.20." },
      { label: "Time-of-Use (TOU) Rate Optimization", value: "TOU plans offer $0.08-0.12/kWh off-peak (typically 11 PM-6 AM) vs $0.25-0.45/kWh peak (4-9 PM). Charging an EV overnight on TOU saves $20-50/mo vs flat rate. Schedule charging via car or charger app. Some utilities offer EV-only TOU meters with ultra-low rates ($0.02-0.05/kWh overnight)." },
      { label: "Charging Efficiency Losses", value: "AC-to-DC conversion and battery thermal management cause 10-20% energy loss. For every 10 kWh from the wall, 8-9 kWh reaches the battery. Level 1 (120V) has 15-20% loss. Level 2 (240V) has 8-12% loss. DCFC has 5-8% loss but higher battery degradation risk above 80% SoC." },
      { label: "Gas Cost Equivalence", value: "At $0.14/kWh and 3.5 mi/kWh: EV cost = $0.04/mi. Gas car at 30 MPG and $3.50/gal: $0.117/mi. EV is 2.9× cheaper per mile. At $5/gal (CA) and $0.30/kWh (CA peak): EV $0.086/mi vs gas $0.167/mi — still 48% cheaper. Even DCFC at $0.48/kWh ($0.137/mi) beats $5/gal gas ($0.167/mi)." },
      { label: "Free Charging Opportunities", value: "Many employers offer free Level 2 charging — worth $500-1,500/yr if you charge 40-60 miles/day. Some hotels, malls, and grocery stores offer free L2. Tesla often provides 6 months free Supercharging with new vehicle purchases. PlugShare app maps all free public chargers." },
      { label: "Solar + EV Synergy", value: "A 7 kW solar system generating ~9,000 kWh/yr covers 12,000-15,000 miles of EV driving. Net metering: push excess daytime solar to the grid, pull at night for charging. Solar + EV eliminates both gas costs AND electricity costs for driving. Payback on combined system: 5-8 years (with IRA 30% tax credit)." },
      { label: "Battery Health & Charging Habits", value: "Best for battery longevity: keep SoC between 20-80%. Avoid charging to 100% daily (except LFP batteries). Avoid discharging below 5%. Minimize DCFC use — 2-3× faster battery degradation vs Level 2. Battery warranty covers 70-80% capacity retention for 8-10 yr / 100,000 mi. Calendar aging is 1-3%/yr regardless of use." },
      { label: "EV Charging & Road Trip Costing", value: "Cross-country (3,000 mi): ~$120-250 in DCFC (Tesla $0.25-0.35/kWh, EA $0.36-0.56/kWh). vs $350-500 in gas (30 MPG, $3.50-5/gal). Save $200-300 per road trip. Annual road trip savings: $500-1,500 for 5,000-15,000 highway miles. Factor hotel L2 charging for free overnight top-ups." },
    ]}
  },
  description: 'Determine the exact cost to charge your electric vehicle at home with breakdowns per charge, per week, per month, and per mile. Includes gas-equivalent savings comparison to show true fuel cost advantage.',
  formula: 'Cost = Battery(kWh) × (Charge%/100) × Rate($/kWh) | Weekly = Cost × Freq | Monthly = Weekly × 4.33 | $/mi = Monthly / (kWh/Charge × 3.5 mi/kWh × Freq × 4.33)',
  interpretation: 'Charging at home is dramatically cheaper than gas: at the US average $0.14/kWh, driving an EV costs ~$0.04/mi vs $0.12/mi for a 30 MPG gas car — a 66% fuel cost reduction. The real savings come from combining home charging (especially on TOU rates) with an EV that achieves 3.5+ mi/kWh. A typical EV owner saves $800-1,500/year on fuel vs gas at current prices. Even public DCFC ($0.40-0.56/kWh) is often cheaper than gas in high-price states like California.'
}

export default calcDef
