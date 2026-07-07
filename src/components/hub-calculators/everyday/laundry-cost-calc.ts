import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ loadsPerWeek: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), costPerLoad: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), detergent: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), dryerSheets: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'loadsPerWeek', label: 'Loads per Week', type: 'number', min: 0, step: '1' },
    { name: 'costPerLoad', label: 'Water & Energy per Load ($)', type: 'number', min: 0, step: '0.25' },
    { name: 'detergent', label: 'Detergent per Load ($)', type: 'number', min: 0, step: '0.1' },
    { name: 'dryerSheets', label: 'Dryer Sheets per Load ($)', type: 'number', min: 0, step: '0.05' },
  ],
  compute: (v) => { const perLoad = v.costPerLoad + v.detergent + v.dryerSheets; const weekly = perLoad * v.loadsPerWeek; const monthly = weekly * 4.33; const annual = weekly * 52; return { result: annual, label: 'Annual Laundry Cost', unit: '$', steps: [{ label: 'Cost per Load', value: `$${perLoad.toFixed(2)}` }, { label: 'Weekly', value: `$${weekly.toFixed(2)}` }, { label: 'Monthly', value: `$${monthly.toFixed(2)}` }, { label: 'Annual', value: `$${annual.toFixed(2)}` }] } },
  description: 'Calculate total laundry cost including water, energy, detergent, and dryer supplies on weekly, monthly, and annual basis.',
  formula: 'Annual Cost = (Water & Energy + Detergent + Dryer Sheets) × Loads/Week × 52',
  interpretation: 'Average US household does 8-10 loads/week costing $0.50-1.50/load. Front-loaders use less water. Air drying saves $0.25-0.50/load in energy costs.'
}

export default calcDef
