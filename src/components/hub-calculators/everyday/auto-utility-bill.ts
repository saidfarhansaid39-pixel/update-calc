import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ autElectric: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), autGas: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), autWater: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), autInternet: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), autTrash: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'autElectric', label: 'Electricity ($/mo)', type: 'number', min: 0, step: '25' },
    { name: 'autGas', label: 'Gas ($/mo)', type: 'number', min: 0, step: '10' },
    { name: 'autWater', label: 'Water/Sewer ($/mo)', type: 'number', min: 0, step: '10' },
    { name: 'autInternet', label: 'Internet/Cable ($/mo)', type: 'number', min: 0, step: '10' },
    { name: 'autTrash', label: 'Trash/Recycling ($/mo)', type: 'number', min: 0, step: '5' },
  ],
  defaults: { autElectric: '120', autGas: '70', autWater: '40', autInternet: '60', autTrash: '25' },
  presets: [
    { label: '1BR Apartment (Solo)', values: { autElectric: '60', autGas: '30', autWater: '25', autInternet: '50', autTrash: '15' } },
    { label: '3BR Family Home', values: { autElectric: '160', autGas: '90', autWater: '55', autInternet: '70', autTrash: '30' } },
    { label: 'Electric-Only (No Gas)', values: { autElectric: '150', autGas: '0', autWater: '40', autInternet: '60', autTrash: '20' } },
    { label: 'All Bills Included', values: { autElectric: '200', autGas: '120', autWater: '70', autInternet: '80', autTrash: '35' } },
  ],
  compute: (v) => {
    const monthlyTotal = v.autElectric + v.autGas + v.autWater + v.autInternet + v.autTrash
    const annualTotal = monthlyTotal * 12
    return { result: monthlyTotal, label: 'Total Monthly Utilities', unit: '$', steps: [
      { label: 'Electricity', value: `$${v.autElectric.toFixed(2)}/mo` },
      { label: 'Gas', value: `$${v.autGas.toFixed(2)}/mo` },
      { label: 'Water & Sewer', value: `$${v.autWater.toFixed(2)}/mo` },
      { label: 'Internet & Cable', value: `$${v.autInternet.toFixed(2)}/mo` },
      { label: 'Trash & Recycling', value: `$${v.autTrash.toFixed(2)}/mo` },
      { label: 'Monthly Total', value: `$${v.autElectric.toFixed(2)} + $${v.autGas.toFixed(2)} + $${v.autWater.toFixed(2)} + $${v.autInternet.toFixed(2)} + $${v.autTrash.toFixed(2)} = $${monthlyTotal.toFixed(2)}` },
      { label: 'Annual Total', value: `$${monthlyTotal.toFixed(2)} × 12 = $${annualTotal.toFixed(2)}` },
    ] ,
    extras: [
      { label: "Electricity saving levers", value: "HVAC accounts for 45–55% of electric bills. Set thermostat to 78°F in summer (saves 6–8%/degree) and 68°F in winter. LED bulbs use 75% less energy than incandescent. Unplug vampire electronics (TV, computer, chargers) — they draw 5–10% of household power when 'off'." },
      { label: "Gas bill seasonality", value: "Heating dominates gas bills: summer $20–40 (water heater only) vs winter $80–200. Lower water heater to 120°F (saves 6–10%). Insulate pipes and water heater tank. A smart thermostat ($130–250) pays for itself in 1–2 heating seasons." },
      { label: "Water bill breakdown", value: "Sewer is often 50–70% of your water bill (it's calculated on water usage). Toilet flushing: 27% of indoor water. Low-flow showerheads ($15–30) save 2,900+ gallons/year. Fixing a leaky toilet ($20 repair) can save $50–100/month." },
      { label: "Internet speed needs", value: "Single user: 25 Mbps ($30–50). Family streaming: 100 Mbps ($50–70). Heavy gaming/4K: 500+ Mbps ($70–100+). Most people pay for speeds they don't need — you probably don't need gigabit. Negotiate with provider yearly or switch to keep promo rates." },
      { label: "Trash/recycling optimization", value: "Trash service: $15–35/month. Composting reduces trash volume by 25–40% (can lower to smallest bin size). Some cities offer pay-as-you-throw (lower cost for less trash). Bundling trash with recycling pickup saves 10–20%." },
      { label: "Seasonal utility patterns", value: "Summer peak (A/C): 1.5–2× spring/fall usage. Winter peak (heating): 1.3–2× spring/fall usage. Budget billing (average yearly cost split into 12 equal payments) smooths out $100–200 spikes. Enroll with your utility provider for free." },
      { label: "Renewable energy options", value: "Many utilities offer 100% renewable electricity for $5–15/month extra. Community solar subscriptions save 5–15% vs grid. Federal solar tax credit (30%) + state incentives make rooftop solar a 5–8 year payback in most states." },
      { label: "Energy audit ROI", value: "Free utility energy audits identify: air leaks (15–30% of heat loss), insufficient attic insulation (add R-38–60 for $1,000–2,000 = 15–20% HVAC savings), old appliances (replace 15+ yr fridge: save $100–200/year). Average audit: $0–100. First-year savings: $200–600." },
    ]}
  },
  description: 'Track your full monthly utility profile — electricity, gas, water/sewer, internet/cable, and trash/recycling — with annual projections. Compare your bills to national averages.',
  formula: 'Monthly = Electric + Gas + Water + Internet + Trash | Annual = Monthly × 12',
  interpretation: 'National average: ~$315/month ($3,780/year). A solo 1BR apartment: ~$180/month ($2,160/year). A 3BR family home: ~$405/month ($4,860/year). Energy-efficient upgrades (LEDs, smart thermostat, low-flow fixtures, attic insulation) save 20–30% — that\'s $750–1,100/year for an average home.'
}

export default calcDef
