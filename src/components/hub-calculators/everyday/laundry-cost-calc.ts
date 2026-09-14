import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ loadsPerWeek: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), costPerLoad: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), detergent: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), dryerSheets: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  defaults: { loadsPerWeek: '8', costPerLoad: '0.50', detergent: '0.25', dryerSheets: '0.10' },
  presets: [
    { label: 'Family of 4', values: { loadsPerWeek: '10', costPerLoad: '0.50', detergent: '0.25', dryerSheets: '0.10' } },
    { label: 'Single Person', values: { loadsPerWeek: '3', costPerLoad: '0.75', detergent: '0.30', dryerSheets: '0.10' } },
    { label: 'Air-Drying Saver', values: { loadsPerWeek: '8', costPerLoad: '0.30', detergent: '0.20', dryerSheets: '0' } },
  ],
  fields: [
    { name: 'loadsPerWeek', label: 'Loads per Week', type: 'number', min: 0, step: '1' },
    { name: 'costPerLoad', label: 'Water & Energy per Load ($)', type: 'number', min: 0, step: '0.25' },
    { name: 'detergent', label: 'Detergent per Load ($)', type: 'number', min: 0, step: '0.1' },
    { name: 'dryerSheets', label: 'Dryer Sheets per Load ($)', type: 'number', min: 0, step: '0.05' },
  ],
  compute: (v) => { const L = parseFloat(v.loadsPerWeek)||0; const C = parseFloat(v.costPerLoad)||0; const D = parseFloat(v.detergent)||0; const S = parseFloat(v.dryerSheets)||0; const perLoad = C + D + S; const weekly = perLoad * L; const monthly = weekly * 4.33; const annual = weekly * 52; return { result: annual, label: 'Annual Laundry Cost', unit: '$', steps: [
    { label: '1. Cost per Load', value: `$${C.toFixed(2)} + $${D.toFixed(2)} + $${S.toFixed(2)} = $${perLoad.toFixed(2)}` },
    { label: '2. Weekly Cost', value: `$${perLoad.toFixed(2)} × ${L} = $${weekly.toFixed(2)}` },
    { label: '3. Monthly Cost', value: `$${weekly.toFixed(2)} × 4.33 = $${monthly.toFixed(2)}` },
    { label: '4. Annual Cost', value: `$${weekly.toFixed(2)} × 52 = $${annual.toFixed(2)}` },
  ] ,
    extras: [
      { label: 'Water Usage', value: 'Standard top-loader: 30-45 gal/load. HE front-loader: 13-17 gal/load. Switching to HE saves 15-30 gal/load = $50-100/yr on water bill.' },
      { label: 'Energy Cost Breakdown', value: 'Water heating accounts for 80-90% of laundry energy cost. Washing in cold water saves $0.10-0.25/load vs hot water. 8 loads/wk = $40-100/yr saved.' },
      { label: 'Dryer Efficiency', value: 'Dryers consume 3-5 kWh/load = $0.36-0.60/load at $0.12/kWh. Cleaning the lint filter every load improves efficiency by 30%.' },
      { label: 'Air Drying Savings', value: 'Air drying saves $0.25-0.50/load in electricity. 8 loads/wk × $0.35 × 52 = $145.60/yr. Plus, clothes last 2-3× longer without heat damage.' },
      { label: 'Detergent Dosage', value: 'Most people use 2-3× the recommended amount. HE washers need only 1-2 tbsp of HE detergent. Over-sudsing damages machines and wastes $20-40/yr.' },
      { label: 'Dryer Balls vs Sheets', value: 'Wool dryer balls cost $10-15/pair, last 1,000+ loads. Dryer sheets cost $0.05-0.10/load. Switching saves $30-50/yr and reduces chemical exposure.' },
      { label: 'Machine Efficiency', value: 'Modern HE machines use 50% less water and 30% less energy than 10-year-old models. Upgrade saves $100-200/yr. Look for Energy Star Most Efficient.' },
      { label: 'Laundry at Peak Hours', value: 'Running washer/dryer during off-peak hours (after 9 PM) can save 10-30% on electricity if your utility has time-of-use rates. Check your utility plan.' },
    ]} },
  description: 'Calculate total laundry cost including water, energy, detergent, and dryer supplies on weekly, monthly, and annual basis. Includes comparison of air drying, cold washing, and HE machines.',
  formula: 'Annual Cost = (Water&Energy + Detergent + DryerSupplies) × Loads/Week × 52. Example: ($0.50 + $0.25 + $0.10) × 8 × 52 = $353.60/yr.',
  interpretation: 'Average US household does 8-10 loads/week costing $0.50-1.50/load. Annual cost ranges $200-800 depending on machine efficiency and drying method. Front-loaders use 50-60% less water than top-loaders. Air drying saves $100-200/year. Cold water washing saves $40-100/year. Switch to HE detergent and dryer balls to save another $30-50/year.'
}

export default calcDef
