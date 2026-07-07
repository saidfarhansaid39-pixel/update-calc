import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ elec: z.string().optional(), gas: z.string().optional(), miles: z.string().optional(), diet: z.string().optional() }),
  fields: [
    { name: 'elec', label: 'Electricity (kWh/month)', type: 'number', min: 0, step: '1' },
    { name: 'gas', label: 'Natural gas (therms/month)', type: 'number', min: 0, step: '1' },
    { name: 'miles', label: 'Car miles/year', type: 'number', min: 0, step: '1' },
    { name: 'diet', label: 'Diet type', type: 'select', options: [{ label: 'Meat-heavy', value: 'meat' }, { label: 'Average', value: 'avg' }, { label: 'Vegetarian', value: 'veg' }, { label: 'Vegan', value: 'vegan' }] },
  ],
  compute: (v) => { const elecCO2 = (parseFloat(v.elec)||0) * 0.92 * 12; const gasCO2 = (parseFloat(v.gas)||0) * 5.3 * 12; const carCO2 = (parseFloat(v.miles)||0) * 0.4; const dietMap: Record<string, number> = { meat: 2400, avg: 1600, veg: 900, vegan: 600 }; const dietCO2 = dietMap[v.diet||'avg']; const total = elecCO2 + gasCO2 + carCO2 + dietCO2; return { result: total, label: 'Annual Carbon Footprint', unit: 'kg CO₂e', steps: [{ label: 'Electricity', value: `${elecCO2.toFixed(0)} kg` }, { label: 'Gas', value: `${gasCO2.toFixed(0)} kg` }, { label: 'Car travel', value: `${carCO2.toFixed(0)} kg` }, { label: 'Diet', value: `${dietCO2} kg` }, { label: 'Total', value: `${total.toFixed(0)} kg` }] } },
  description: 'Estimates personal annual carbon footprint from energy, transportation, and diet.',
  formula: 'CO₂e = Σ(sources) using standard emission factors',
  interpretation: 'Average US: ~16,000 kg/yr. EU: ~6,800 kg/yr. Global target: ~2,000 kg/yr by 2050.'
}

export default calcDef
