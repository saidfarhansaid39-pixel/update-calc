import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ outs: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), cardsRemaining: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), streetsLeft: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'outs', label: 'Number of Outs', type: 'number', min: 1, max: 21, step: '1' },
    { name: 'cardsRemaining', label: 'Cards Remaining in Deck', type: 'number', min: 1, max: 52, step: '1' },
    { name: 'streetsLeft', label: 'Streets Left (1=river, 2=turn+river)', type: 'number', min: 1, max: 2, step: '1' },
  ],
  compute: (v) => {
    const unknown = v.cardsRemaining
    const pctOneStreet = (v.outs / unknown) * 100
    const pctTwoStreets = v.streetsLeft === 2 ? (1 - Math.pow(1 - v.outs / unknown, 2)) * 100 : pctOneStreet
    const oddsOne = pctOneStreet > 0 ? `${(1 / (pctOneStreet / 100)).toFixed(1)}:1` : '0:1'
    const oddsTwo = pctTwoStreets > 0 ? `${((100 - pctTwoStreets) / pctTwoStreets).toFixed(1)}:1` : '0:1'
    return { result: pctOneStreet, label: 'Hit on Next Street', unit: '%', steps: [{ label: 'Current Street', value: `${pctOneStreet.toFixed(1)}% (${oddsOne})` }, { label: v.streetsLeft === 2 ? 'By the River' : 'One Street', value: v.streetsLeft === 2 ? `${pctTwoStreets.toFixed(1)}% (${oddsTwo})` : '-' }] }
  },
  description: 'Calculate poker hand odds based on your outs, cards remaining, and streets left. Uses the rule of 2 and 4 for quick estimates.',
  formula: 'Hit% = Outs/Unknown × 100 (one street) | Hit% = 1 - (1 - Outs/Unknown)² (two streets)',
  interpretation: 'Rule of 2: multiply outs by 2 for ~% on next street. Rule of 4: multiply outs by 4 for ~% by river. 4 outs (gutshot): 16% by river. 9 outs (flush draw): 36% by river.'
}

export default calcDef
