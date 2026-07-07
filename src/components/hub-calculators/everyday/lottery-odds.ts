import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mainBalls: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), mainRange: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), extraBalls: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), extraRange: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tickets: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'mainBalls', label: 'Main Balls Drawn', type: 'number', min: 1, step: '1' },
    { name: 'mainRange', label: 'Main Ball Range (1 to X)', type: 'number', min: 1, step: '10' },
    { name: 'extraBalls', label: 'Extra/Euro Balls Drawn', type: 'number', min: 0, step: '1' },
    { name: 'extraRange', label: 'Extra Ball Range (1 to X)', type: 'number', min: 0, step: '10' },
    { name: 'tickets', label: 'Tickets Purchased', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => { const m = v.mainBalls; const n = v.mainRange; let mainCombos = 1; for (let i = 0; i < m; i++) { mainCombos *= (n - i) / (i + 1) } let extraCombos = 1; if (v.extraBalls > 0) { const e = v.extraBalls; const en = v.extraRange; for (let i = 0; i < e; i++) { extraCombos *= (en - i) / (i + 1) } } const totalCombos = mainCombos * extraCombos; const oddsPerTicket = 1 / totalCombos; const oddsWithTickets = totalCombos / v.tickets; const oneInX = totalCombos; return { result: oddsWithTickets, label: '1 in X Odds of Jackpot', unit: '', steps: [{ label: 'Main Combinations', value: `${mainCombos.toFixed(0)} (choose ${m} from ${n})` }, { label: 'Extra Combinations', value: `${extraCombos.toFixed(0)}` }, { label: 'Total Combinations', value: `${totalCombos.toFixed(0)}` }, { label: 'Odds per Ticket', value: `1 in ${totalCombos.toFixed(0)}` }, { label: 'Odds with ${v.tickets} Tickets', value: `1 in ${(totalCombos / v.tickets).toFixed(0)}` }] } },
  description: 'Calculate the exact odds of winning a lottery jackpot based on ball count, number range, and number of tickets purchased.',
  formula: 'Odds = 1 / [C(mainRange, mainBalls) × C(extraRange, extraBalls) / Tickets]',
  interpretation: 'Powerball odds: 1 in 292 million. Mega Millions: 1 in 302 million. Buying more tickets linearly improves odds, but expected value remains negative. Lotteries return ~50% of ticket sales as prizes.'
}

export default calcDef
