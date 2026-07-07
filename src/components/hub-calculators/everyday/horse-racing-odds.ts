import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ oddsNumerator: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), oddsDenominator: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), stake: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'oddsNumerator', label: 'Odds (numerator)', type: 'number', min: 1, step: '1' },
    { name: 'oddsDenominator', label: 'Odds (denominator)', type: 'number', min: 1, step: '1' },
    { name: 'stake', label: 'Stake ($)', type: 'number', min: 0.01, step: '1' },
  ],
  compute: (v) => {
    const profit = v.stake * (v.oddsNumerator / v.oddsDenominator)
    const totalReturn = v.stake + profit
    const impliedProb = (v.oddsDenominator / (v.oddsNumerator + v.oddsDenominator)) * 100
    return { result: totalReturn, label: 'Total Return', unit: '$', steps: [{ label: 'Profit', value: `$${profit.toFixed(2)}` }, { label: 'Total Return', value: `$${totalReturn.toFixed(2)}` }, { label: 'Implied Probability', value: `${impliedProb.toFixed(1)}%` }] }
  },
  description: 'Calculate horse racing bet returns from fractional odds. Enter odds as numerator/denominator (e.g., 5/1) and your stake to get profit, total return, and implied probability.',
  formula: 'Profit = Stake × (Numerator/Denominator) | Total = Stake + Profit | Implied Prob = Denominator / (Numerator + Denominator) × 100%',
  interpretation: 'Fractional odds (e.g., 5/1) show profit per unit staked. 5/1 means you win $5 for every $1 wagered. Lower odds = less profit but higher probability. Each Way bets include place terms.'
}

export default calcDef
