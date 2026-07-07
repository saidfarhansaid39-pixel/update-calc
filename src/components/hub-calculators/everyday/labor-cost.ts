import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hourlyRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hours: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), workers: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), overheadPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'hourlyRate', label: 'Hourly Rate ($)', type: 'number', min: 1, step: '5' },
    { name: 'hours', label: 'Hours per Worker', type: 'number', min: 0.5, step: '1' },
    { name: 'workers', label: 'Number of Workers', type: 'number', min: 1, step: '1' },
    { name: 'overheadPct', label: 'Overhead (%)', type: 'number', min: 0, max: 100, step: '5' },
  ],
  compute: (v) => {
    const baseLabor = v.hourlyRate * v.hours * v.workers
    const overhead = baseLabor * (v.overheadPct / 100)
    const totalCost = baseLabor + overhead
    return { result: totalCost, label: 'Total Labor Cost', unit: '$', steps: [{ label: 'Base Labor', value: `$${baseLabor.toFixed(2)}` }, { label: 'Overhead', value: `$${overhead.toFixed(2)}` }, { label: 'Total Cost', value: `$${totalCost.toFixed(2)}` }] }
  },
  description: 'Calculate total labor costs including base wages and overhead for a team of workers.',
  formula: 'Total = (Rate × Hours × Workers) × (1 + Overhead%/100)',
  interpretation: 'Typical overhead rates: 20-40% for payroll taxes, insurance, equipment, and management. Adjust for your industry standards.'
}

export default calcDef
