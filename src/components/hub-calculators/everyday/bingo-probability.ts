import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalNumbers: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), numbersMarked: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), numbersToWin: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'totalNumbers', label: 'Total Numbers on Card', type: 'number', min: 15, max: 75, step: '1' },
    { name: 'numbersMarked', label: 'Numbers Already Marked', type: 'number', min: 0, step: '1' },
    { name: 'numbersToWin', label: 'Numbers Needed to Win', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const remaining = v.totalNumbers - v.numbersMarked
    const needed = v.numbersToWin - v.numbersMarked
    const prob = needed <= 0 ? 1 : needed > remaining ? 0 : 1 / (remaining / needed)
    const safeProb = Math.max(0, Math.min(1, prob))
    return { result: safeProb * 100, label: 'Probability', unit: '%', steps: [{ label: 'Numbers Remaining', value: `${remaining}` }, { label: 'Still Needed', value: `${Math.max(0, needed)}` }, { label: 'Win Probability', value: `${(safeProb * 100).toFixed(1)}%` }] }
  },
  description: 'Calculate your probability of winning a bingo game based on numbers marked, numbers needed, and total numbers on your card.',
  formula: 'P = 1 / (Remaining / Needed) when needed ≤ remaining',
  interpretation: 'Standard 75-ball bingo has 24 numbers per card (plus free space). Blackout (coverall) odds: 1 in ~3.5 septillion for the first winner. Early games have higher win probability.'
}

export default calcDef
