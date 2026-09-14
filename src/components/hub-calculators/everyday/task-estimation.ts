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
  defaults: { teOptimistic: '2', teLikely: '4', tePessimistic: '8', teTaskCount: '5' },
  presets: [
    { label: 'Software Feature (2-4-8h)', values: { teOptimistic: '2', teLikely: '4', tePessimistic: '8', teTaskCount: '1' } },
    { label: 'Project Phase (10-20-40h)', values: { teOptimistic: '10', teLikely: '20', tePessimistic: '40', teTaskCount: '1' } },
    { label: 'Sprint Planning (5 tasks)', values: { teOptimistic: '3', teLikely: '5', tePessimistic: '10', teTaskCount: '5' } },
    { label: 'Construction Job (40-60-120h)', values: { teOptimistic: '40', teLikely: '60', tePessimistic: '120', teTaskCount: '1' } },
  ],
  compute: (v) => {
    const perTaskPert = (v.teOptimistic + 4 * v.teLikely + v.tePessimistic) / 6
    const perTaskStdDev = (v.tePessimistic - v.teOptimistic) / 6
    const totalPert = perTaskPert * v.teTaskCount
    const totalStdDev = perTaskStdDev * Math.sqrt(v.teTaskCount)
    const totalWorst = v.tePessimistic * v.teTaskCount
    const totalBest = v.teOptimistic * v.teTaskCount
    return { result: totalPert, label: 'PERT Estimate (total)', unit: 'hrs', steps: [
      { label: 'Formula', value: 'PERT = (O + 4M + P) ÷ 6. StdDev = (P - O) ÷ 6' },
      { label: 'Three-Point Values', value: 'O=' + v.teOptimistic + 'h, M=' + v.teLikely + 'h, P=' + v.tePessimistic + 'h' },
      { label: 'PERT per Task', value: '(' + v.teOptimistic + ' + 4×' + v.teLikely + ' + ' + v.tePessimistic + ') ÷ 6 = ' + perTaskPert.toFixed(2) + ' hrs' },
      { label: 'Std Dev per Task', value: '+/-(' + v.tePessimistic + ' - ' + v.teOptimistic + ') ÷ 6 = ' + perTaskStdDev.toFixed(2) + ' hrs' },
      { label: 'Tasks', value: '' + v.teTaskCount },
      { label: 'Total PERT Estimate', value: perTaskPert.toFixed(2) + ' × ' + v.teTaskCount + ' = ' + totalPert.toFixed(1) + ' hrs' },
      { label: 'Range (68% confidence)', value: (totalPert - totalStdDev).toFixed(1) + ' - ' + (totalPert + totalStdDev).toFixed(1) + ' hrs' },
      { label: 'Range (95% confidence)', value: (totalPert - 2 * totalStdDev).toFixed(1) + ' - ' + (totalPert + 2 * totalStdDev).toFixed(1) + ' hrs' },
    ] ,
    extras: [
      { label: 'What is PERT?', value: 'Program Evaluation Review Technique — developed by US Navy in 1957 for the Polaris missile project. Weighs the most likely estimate 4× to reduce optimism bias' },
      { label: 'Confidence Levels', value: '±1 StdDev = 68% confidence. ±2 StdDev = 95% confidence. Add 1 StdDev to your estimate for 84% confidence of on-time completion' },
      { label: 'The Planning Fallacy', value: 'Humans systematically underestimate task time by 20-40%. PERT counters this by weighting the pessimistic end. 2-4-8h → PERT = 4.3h (vs gut feel of 4h)' },
      { label: 'Multiple Tasks Risk', value: 'Total StdDev = PerTask StdDev × √(Task Count). 5 tasks each with 1h StdDev = 2.24h total StdDev. Uncertainty grows, but slower than linear' },
      { label: 'Hofstadter\'s Law', value: '"It always takes longer than you expect, even when you take into account Hofstadter\'s Law." PERT helps but add a 20% buffer for complex projects' },
      { label: 'Agile Estimation', value: 'PERT mapping: 1 Story Point ≈ 4-6 hours. A 13-point story with 1-3-5 day estimates → PERT = 3 days (24 hours)' },
      { label: 'Historical Calibration', value: 'Track actual vs PERT estimates. If your PERT is consistently 80% of actual, adjust: Calibrated Estimate = PERT × 1.25' },
      { label: 'Task Granularity', value: 'Break tasks under 40 hours. Tasks > 80 hours are too coarse — split into subtasks. Best PERT accuracy: 4-40 hour tasks with clear deliverables' },
    ]}
  },
  description: 'Estimate task duration using the PERT (Program Evaluation Review Technique) three-point estimation formula. Combines optimistic, most likely, and pessimistic estimates into a statistically weighted value with standard deviation and confidence ranges.',
  formula: 'PERT Estimate = (Optimistic + 4 × Most Likely + Pessimistic) ÷ 6. Standard Deviation = (Pessimistic - Optimistic) ÷ 6. Total Estimate = PERT × Number of Tasks. Total StdDev = Per-Task StdDev × √(Task Count).',
  interpretation: 'A task estimated at 2h (best), 4h (likely), 8h (worst) yields a PERT of 4.33h with 1h standard deviation. At 68% confidence, the task takes 3.33-5.33h. At 95% confidence: 2.33-6.33h. For 5 similar tasks, total PERT = 21.7h with 2.24h StdDev. PERT produces more realistic estimates than gut feelings by mathematically accounting for uncertainty and weighing the pessimistic scenario.'
}

export default calcDef
