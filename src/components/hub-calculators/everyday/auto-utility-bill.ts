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
  compute: (v) => {
    const monthlyTotal = v.autElectric + v.autGas + v.autWater + v.autInternet + v.autTrash
    const annualTotal = monthlyTotal * 12
    return { result: monthlyTotal, label: 'Total Monthly Utilities', unit: '$', steps: [{ label: 'Electricity', value: '$' + v.autElectric.toFixed(2) }, { label: 'Gas', value: '$' + v.autGas.toFixed(2) }, { label: 'Water/Sewer', value: '$' + v.autWater.toFixed(2) }, { label: 'Internet/Cable', value: '$' + v.autInternet.toFixed(2) }, { label: 'Trash', value: '$' + v.autTrash.toFixed(2) }, { label: 'Monthly Total', value: '$' + monthlyTotal.toFixed(2) }, { label: 'Annual Total', value: '$' + annualTotal.toFixed(2) }] }
  },
  description: 'Track and total all your monthly utility bills including electricity, gas, water, internet, and trash services.',
  formula: 'Total = Electric + Gas + Water + Internet + Trash | Annual = Monthly x 12',
  interpretation: 'Average US utility costs: electric $120, gas $70, water $40, internet $60, trash $25. Total: ~$315/month or ~$3,780/year. Energy-efficient appliances can reduce electric by 20-30%.'
}

export default calcDef
