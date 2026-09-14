import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalNumbers: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), numbersMarked: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), numbersToWin: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'totalNumbers', label: 'Total Numbers on Card', type: 'number', min: 15, max: 75, step: '1' },
    { name: 'numbersMarked', label: 'Numbers Already Marked', type: 'number', min: 0, step: '1' },
    { name: 'numbersToWin', label: 'Numbers Needed to Win', type: 'number', min: 1, step: '1' },
  ],
  defaults: { totalNumbers: '24', numbersMarked: '12', numbersToWin: '14' },
  presets: [
    { label: 'Standard 75-Ball Mid-Game', values: { totalNumbers: '24', numbersMarked: '10', numbersToWin: '14' } },
    { label: 'Blackout Coverall', values: { totalNumbers: '24', numbersMarked: '5', numbersToWin: '24' } },
    { label: 'One Away', values: { totalNumbers: '24', numbersMarked: '23', numbersToWin: '24' } },
    { label: 'Early Single Bingo', values: { totalNumbers: '24', numbersMarked: '3', numbersToWin: '5' } },
  ],
  compute: (v) => {
    const remaining = v.totalNumbers - v.numbersMarked
    const needed = Math.max(0, v.numbersToWin - v.numbersMarked)
    const prob = needed <= 0 ? 1 : needed > remaining ? 0 : 1 / (remaining / needed)
    const safeProb = Math.max(0, Math.min(1, prob))
    const odds = safeProb > 0 && safeProb < 1 ? (1 / safeProb).toFixed(0) : '—'
    const pctFormatted = (safeProb * 100).toFixed(2)
    return {
      result: safeProb * 100, label: 'Win Probability', unit: '%',
      steps: [
        { label: 'Total Card Numbers', value: `${v.totalNumbers}` },
        { label: 'Already Marked', value: `${v.numbersMarked}` },
        { label: 'Numbers Remaining', value: `${remaining}` },
        { label: 'Still Needed to Win', value: `${needed}` },
        { label: 'Probability Formula', value: needed <= remaining ? `1 / (${remaining} / ${needed})` : '0 (impossible)' },
        { label: 'Win Probability', value: `${pctFormatted}%` },
        { label: 'Odds (1 in X)', value: odds === '—' ? (safeProb === 1 ? 'Certain' : 'Impossible') : `1 in ${odds}` },
        { label: 'Confidence Level', value: safeProb >= 0.5 ? 'Favorable' : safeProb >= 0.25 ? 'Possible' : safeProb > 0 ? 'Long Shot' : 'No Chance' },
      ],
      extras: [
        { label: 'Standard Card Structure', value: 'A 75-ball bingo card has 5×5 = 25 squares: 24 numbers (B:1-15, I:16-30, N:31-45, G:46-60, O:61-75) plus a FREE center space.' },
        { label: '75-Ball vs 90-Ball Odds', value: '75-ball (American): 24 numbers per card, 1 free space. 90-ball (UK): 27 numbers per card, 3 rows × 9 columns, no free space. 90-ball has 3 prize tiers.' },
        { label: 'Blackout Coverall Odds', value: 'Dauber all 24 numbers odds: 1 in ~3.5 septillion for the first winner. Most halls call coverall only after ~45-50 numbers are called.' },
        { label: 'Multi-Card Strategy', value: 'Playing multiple cards increases odds linearly (2 cards = 2× odds) but each card is an independent probability. Most players manage 4-6 cards.' },
        { label: 'Pattern Types', value: 'Common patterns: Single Line (5 numbers), X Pattern (8 numbers), Four Corners (4 numbers), Blackout (24 numbers), Frame (16 numbers). Pattern complexity affects odds.' },
        { label: 'House Edge and Payouts', value: 'Bingo halls typically retain 20-40% of ticket sales. Understanding probability helps you choose games with fewer players and better payout structures.' },
        { label: 'Call Speed Factor', value: 'Typical call speed: 6-8 numbers per minute. Faster calling favors players with more dauber control. Slower speeds help organized daubers.' },
        { label: 'Bingo Etiquette', value: 'Always verify your win before shouting "BINGO!" False calls disrupt gameplay. Most halls require a floor worker verification before payout.' },
      ]
    }
  },
  description: 'Calculate your probability of winning a bingo game based on numbers marked, numbers needed, and total numbers on your card. Essential for understanding your odds in any bingo pattern or game variant.',
  formula: 'P = 1 / (Remaining / Needed) when needed ≤ remaining; P = 1 if needed ≤ 0; P = 0 if needed > remaining',
  interpretation: 'Standard 75-ball bingo has 24 numbers per card (plus free space). Single-line win probability increases as more numbers are called. Early-game probabilities are very low; late-game probabilities approach certainty. Play more cards to increase odds linearly.'
}

export default calcDef
