import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    miles: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0'),
    mpg: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0'),
    kwh: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0'),
    diet: z.string().optional()
}),
  fields: [
    { name: 'miles', label: 'Annual Miles Driven', type: 'number', min: 0, step: '100' },
    { name: 'mpg', label: 'Fuel Economy (mpg)', type: 'number', min: 1, step: '1' },
    { name: 'kwh', label: 'Annual Electricity (kWh)', type: 'number', min: 0, step: '100' },
    { name: 'diet', label: 'Diet Type', type: 'select', options: [
      { label: 'Meat-heavy (3.3 tons/yr)', value: '3.3' },
      { label: 'Average (2.5 tons/yr)', value: '2.5' },
      { label: 'Vegetarian (1.7 tons/yr)', value: '1.7' },
      { label: 'Vegan (1.5 tons/yr)', value: '1.5' },
    ] },
  ],
  compute: (v) => {
    const miles = v.miles || 0
    const mpg = v.mpg || 25
    const kwh = v.kwh || 0
    const diet = parseFloat(v.diet) || 2.5
    const transport = miles > 0 && mpg > 0 ? (miles / mpg) * 8.887 / 1000 : 0
    const electricity = kwh * 0.00092
    const total = transport + electricity + diet
    return {
      result: total, label: 'Total Carbon Footprint', unit: 'tons CO₂/yr',
      steps: [
        ...(miles > 0 ? [{ label: 'Transport', value: `${transport.toFixed(2)} tons CO₂/yr` }] : []),
        ...(kwh > 0 ? [{ label: 'Electricity', value: `${electricity.toFixed(2)} tons CO₂/yr` }] : []),
        { label: 'Diet', value: `${diet.toFixed(1)} tons CO₂/yr` },
        { label: 'Total', value: `${total.toFixed(2)} tons CO₂/yr` },
        { label: 'VS US avg (16 tons)', value: total < 16 ? `${((1 - total/16)*100).toFixed(0)}% below average` : `${((total/16 - 1)*100).toFixed(0)}% above average` },
      ]
}
  },
  description: 'Your carbon footprint is the total CO₂ emissions from transportation, energy use, diet, and lifestyle. The US average is ~16 tons CO₂ per person per year.',
  formula: 'Transport = (miles/mpg) × 8.887 kg/gal ÷ 1000 | Electricity = kWh × 0.00092 tons/kWh',
  interpretation: 'Global target: ~2 tons CO₂/person/year by 2050 (Paris Agreement). US average: 16 tons. EU average: 8 tons. World average: 5 tons.'
}

export default calcDef
