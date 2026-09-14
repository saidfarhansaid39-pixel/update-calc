import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mainBalls: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), mainRange: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), extraBalls: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), extraRange: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tickets: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  defaults: { mainBalls: '5', mainRange: '69', extraBalls: '1', extraRange: '26', tickets: '1' },
  presets: [
    { label: 'Powerball', values: { mainBalls: '5', mainRange: '69', extraBalls: '1', extraRange: '26', tickets: '1' } },
    { label: 'Mega Millions', values: { mainBalls: '5', mainRange: '70', extraBalls: '1', extraRange: '25', tickets: '1' } },
    { label: 'EuroMillions', values: { mainBalls: '5', mainRange: '50', extraBalls: '2', extraRange: '12', tickets: '1' } },
  ],
  fields: [
    { name: 'mainBalls', label: 'Main Balls Drawn', type: 'number', min: 1, step: '1' },
    { name: 'mainRange', label: 'Main Ball Range (1 to X)', type: 'number', min: 1, step: '10' },
    { name: 'extraBalls', label: 'Extra/Euro Balls Drawn', type: 'number', min: 0, step: '1' },
    { name: 'extraRange', label: 'Extra Ball Range (1 to X)', type: 'number', min: 0, step: '10' },
    { name: 'tickets', label: 'Tickets Purchased', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => { const m = parseFloat(v.mainBalls)||0; const n = parseFloat(v.mainRange)||0; let mainCombos = 1; for (let i = 0; i < m; i++) { mainCombos *= (n - i) / (i + 1) } let extraCombos = 1; if (v.extraBalls > 0) { const e = parseFloat(v.extraBalls)||0; const en = parseFloat(v.extraRange)||0; for (let i = 0; i < e; i++) { extraCombos *= (en - i) / (i + 1) } } const totalCombos = mainCombos * extraCombos; const tix = parseFloat(v.tickets)||1; const oddsWithTickets = totalCombos / tix; return { result: oddsWithTickets, label: '1 in X Odds', unit: '', steps: [
    { label: '1. Choose Formula', value: `C(${n}, ${m}) = ${n}! / (${m}! × ${n-m}!)` },
    { label: '2. Main Combinations', value: `C(${n}, ${m}) = ${mainCombos.toFixed(0)} ways to pick ${m} from ${n}` },
    { label: '3. Extra Combos', value: `${extraCombos > 1 ? `C(${v.extraRange}, ${v.extraBalls}) = ${extraCombos.toFixed(0)} ways` : 'No extra balls — multiplier = 1'}` },
    { label: '4. Total Combos', value: `${mainCombos.toFixed(0)} × ${extraCombos.toFixed(0)} = ${totalCombos.toFixed(0)}` },
    { label: '5. Odds per Ticket', value: `1 in ${totalCombos.toFixed(0)}` },
    { label: `6. ${tix} Ticket${tix > 1 ? 's' : ''}`, value: `${totalCombos.toFixed(0)} ÷ ${tix} = 1 in ${oddsWithTickets.toFixed(0)}` },
  ] ,
    extras: [
      { label: 'Expected Value', value: 'Lotteries return ~50% of ticket sales as prizes. A $2 Powerball ticket has an expected value of ~$0.50. Jackpot chasers lose money on average.' },
      { label: 'Lower Tier Prizes', value: 'Powerball odds for any prize: 1 in 24.9. Mega Millions: 1 in 24. Most wins are small ($2-7). The jackpot is only ~33% of the prize pool.' },
      { label: 'Cash vs Annuity', value: 'Advertised jackpot is annuity value over 30 years. Cash lump sum is typically 60-65% of advertised. Most winners take cash.' },
      { label: 'Tax Impact', value: 'Federal withholding is 24% upfront, but top marginal rate is 37%. Additional state tax: 0-10.9%. You also owe in the year you claim — plan ahead.' },
      { label: 'Quick Pick vs Own Numbers', value: 'No statistical difference — Quick Picks win at the same rate as self-chosen numbers. 70-80% of players use Quick Pick.' },
      { label: 'Lottery Pools', value: 'Office pools improve odds but create legal issues. Have a written agreement: disputes over non-contractual pools end up in court ~50% of the time.' },
      { label: 'Number Selection', value: 'Avoid patterns (1-2-3-4-5), birthdays (1-31), and lucky numbers (7). These are commonly chosen, so you\'d split the prize if they hit.' },
      { label: 'State Lottery Returns', value: 'State lotteries allocate ~50% to prizes, ~40% to state programs (education, infrastructure), and ~10% to administration and retailer commissions.' },
    ]} },
  description: 'Calculate the exact odds of winning a lottery jackpot based on ball count, number range, and number of tickets purchased. Includes combinatorial formula with extra ball multiplier.',
  formula: 'Odds = 1 / [C(n, k) × C(en, ek)]. Where C(n,k) = n!/(k!(n-k)!). For Powerball: C(69,5) × 26 = 292,201,338 combinations = 1 in 292M odds.',
  interpretation: 'Powerball odds: 1 in 292 million. Mega Millions: 1 in 302 million. Buying more tickets linearly improves odds but expected value remains negative (~$0.50 per $2 ticket). Lotteries return ~50% of ticket sales as prizes. Lower-tier prize odds are much better (1 in 25 for any prize).'
}

export default calcDef
