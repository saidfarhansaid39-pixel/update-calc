import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ teOptimistic: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), teLikely: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tePessimistic: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), teTaskCount: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'teOptimistic', label: 'Optimistic (best case, hrs)', type: 'number', min: 0.25, step: '0.25' },
    { name: 'teLikely', label: 'Most Likely (hrs)', type: 'number', min: 0.25, step: '0.5' },
    { name: 'tePessimistic', label: 'Pessimistic (worst case, hrs)', type: 'number', min: 0.25, step: '1' },
    { name: 'teTaskCount', label: 'Number of Tasks', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const perTaskPert = (v.teOptimistic + 4 * v.teLikely + v.tePessimistic) / 6
    const perTaskStdDev = (v.tePessimistic - v.teOptimistic) / 6
    const totalPert = perTaskPert * v.teTaskCount
    const totalStdDev = perTaskStdDev * Math.sqrt(v.teTaskCount)
    const totalWorst = v.tePessimistic * v.teTaskCount
    const totalBest = v.teOptimistic * v.teTaskCount
    return { result: totalPert, label: 'PERT Estimate (total)', unit: 'hrs', steps: [{ label: 'PERT per Task', value: perTaskPert.toFixed(2) + ' hrs' }, { label: 'Std Dev', value: '+/-' + perTaskStdDev.toFixed(2) + ' hrs' }, { label: 'Tasks', value: '' + v.teTaskCount }, { label: 'Total PERT', value: totalPert.toFixed(1) + ' hrs' }, { label: 'Range (68%)', value: (totalPert - totalStdDev).toFixed(1) + ' - ' + (totalPert + totalStdDev).toFixed(1) + ' hrs' }] }
  },
  description: 'Estimate task duration using the PERT (Program Evaluation Review Technique) formula with three-point estimation.',
  formula: 'PERT = (Optimistic + 4x Likely + Pessimistic) / 6 | StdDev = (Pessimistic - Optimistic) / 6 | Total = PERT x Tasks',
  interpretation: 'PERT gives more realistic estimates than gut feeling. A task estimated at 2-4-8 hours -> PERT = 4.3 hrs. For multiple tasks, total uncertainty grows by sqrt(n). Buffer: add 1 std dev for 84% confidence.'
}

export default calcDef
