import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hourlyRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hours: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), workers: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), overheadPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  defaults: { hourlyRate: '50', hours: '8', workers: '2', overheadPct: '30' },
  presets: [
    { label: 'Contractor 1 Day', values: { hourlyRate: '75', hours: '8', workers: '1', overheadPct: '25' } },
    { label: 'Team of 3 / Week', values: { hourlyRate: '45', hours: '40', workers: '3', overheadPct: '35' } },
    { label: 'Freelance Hourly', values: { hourlyRate: '100', hours: '1', workers: '1', overheadPct: '15' } },
  ],
  fields: [
    { name: 'hourlyRate', label: 'Hourly Rate ($)', type: 'number', min: 1, step: '5' },
    { name: 'hours', label: 'Hours per Worker', type: 'number', min: 0.5, step: '1' },
    { name: 'workers', label: 'Number of Workers', type: 'number', min: 1, step: '1' },
    { name: 'overheadPct', label: 'Overhead (%)', type: 'number', min: 0, max: 100, step: '5' },
  ],
  compute: (v) => {
    const R = parseFloat(v.hourlyRate)||0; const H = parseFloat(v.hours)||0; const W = parseFloat(v.workers)||0; const O = parseFloat(v.overheadPct)||0
    const baseLabor = R * H * W
    const overhead = baseLabor * (O / 100)
    const totalCost = baseLabor + overhead
    return { result: totalCost, label: 'Total Labor Cost', unit: '$', steps: [
      { label: '1. Base Wages', value: `$${R}/hr × ${H}hr × ${W} worker${W > 1 ? 's' : ''} = $${baseLabor.toFixed(2)}` },
      { label: '2. Overhead Rate', value: `${O}%` },
      { label: '3. Overhead Cost', value: `$${baseLabor.toFixed(2)} × ${O}% = $${overhead.toFixed(2)}` },
      { label: '4. Total Cost', value: `$${baseLabor.toFixed(2)} + $${overhead.toFixed(2)} = $${totalCost.toFixed(2)}` },
    ] ,
    extras: [
      { label: 'Overhead Breakdown', value: 'Payroll taxes (7.65% FICA), workers comp (2-10%), liability insurance (3-5%), equipment/tools (5-15%), management (5-10%), office (3-8%).' },
      { label: 'Burdened Rate', value: 'True cost of an employee = hourly wage × 1.25-1.4 (overhead). A $50/hr employee costs $62.50-70/hr including taxes, benefits, insurance, and PTO.' },
      { label: 'Industry Benchmarks', value: 'Construction: 25-40% overhead. IT consulting: 30-50%. Freelance: 15-25% (lower overhead, no benefits). Healthcare: 35-60%.' },
      { label: 'Minimum Wage Impact', value: 'Federal minimum wage: $7.25/hr. Living wage (US average): $16-24/hr depending on location. Minimum wage employee costs employer ~$9.50-10/hr with overhead.' },
      { label: 'Overtime Premium', value: 'OT (1.5×) and double time (2×) significantly increase costs. A $30/hr worker on OT costs $45/hr base + 30% overhead = $58.50/hr effective.' },
      { label: 'Bid Estimations', value: 'Always add 10-15% contingency to labor estimates for scope changes, delays, and unexpected conditions. Underbidding labor is the #1 cause of project losses.' },
      { label: 'Prevailing Wage', value: 'Government projects require prevailing wage (Davis-Bacon). Rates vary by county and trade: typically $30-80/hr for construction. Check sam.gov for rates.' },
      { label: '1099 vs W-2', value: 'Independent contractors (1099) cost 15-30% less than employees (W-2) for the same hourly rate. But contractors can\'t be directed how to work — risk of misclassification penalties.' },
    ]}
  },
  description: 'Calculate total labor costs including base wages and overhead for a team of workers. Includes burden rate, OT premium, and industry benchmarks for accurate project estimates.',
  formula: 'Total = (Rate × Hours × Workers) × (1 + Overhead%/100). Burdened Rate = Rate × (1 + Overhead%/100). Example: ($50 × 8 × 2) × 1.3 = $1,040 total for 2 workers.',
  interpretation: 'Typical overhead rates: 20-40% for payroll taxes, insurance, equipment, and management. A $50/hr employee with 30% overhead costs $65/hr effective. Always include 10-15% contingency in labor estimates for scope changes and delays.'
}

export default calcDef
