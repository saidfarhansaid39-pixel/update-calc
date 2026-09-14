import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ outs: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), cardsRemaining: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), streetsLeft: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'outs', label: 'Number of Outs', type: 'number', min: 1, max: 21, step: '1' },
    { name: 'cardsRemaining', label: 'Cards Remaining in Deck', type: 'number', min: 1, max: 52, step: '1' },
    { name: 'streetsLeft', label: 'Streets Left (1=river, 2=turn+river)', type: 'number', min: 1, max: 2, step: '1' },
  ],
  defaults: { outs: '9', cardsRemaining: '47', streetsLeft: '2' },
  presets: [
    { label: 'Flush Draw (9 outs)', values: { outs: '9', cardsRemaining: '47', streetsLeft: '2' } },
    { label: 'Open-Ended Straight (8 outs)', values: { outs: '8', cardsRemaining: '47', streetsLeft: '2' } },
    { label: 'Gutshot Straight (4 outs)', values: { outs: '4', cardsRemaining: '47', streetsLeft: '2' } },
    { label: 'Set to Full House (10 outs)', values: { outs: '10', cardsRemaining: '46', streetsLeft: '2' } },
  ],
  compute: (v) => {
    const unknown = v.cardsRemaining
    const pctOneStreet = (v.outs / unknown) * 100
    const pctTwoStreets = v.streetsLeft === 2 ? (1 - Math.pow(1 - v.outs / unknown, 2)) * 100 : pctOneStreet
    const oddsOne = pctOneStreet > 0 ? `${(1 / (pctOneStreet / 100)).toFixed(1)}:1` : '0:1'
    const oddsTwo = pctTwoStreets > 0 ? `${((100 - pctTwoStreets) / pctTwoStreets).toFixed(1)}:1` : '0:1'
    const rule2 = v.outs * 2
    const rule4 = v.outs * 4
    return { result: pctOneStreet, label: 'Hit on Next Street', unit: '%',
      steps: [
        { label: 'Your Outs', value: `${v.outs} cards that improve your hand` },
        { label: 'Unknown Cards', value: `${unknown} cards left in deck` },
        { label: 'Next Street Odds', value: `${v.outs} ÷ ${unknown} = ${pctOneStreet.toFixed(1)}% (${oddsOne})` },
        { label: 'Rule of 2 Check', value: `${v.outs} × 2 = ${rule2}% (actual: ${pctOneStreet.toFixed(1)}%)` },
        { label: v.streetsLeft === 2 ? 'By River Odds' : 'One Street Only', value: v.streetsLeft === 2 ? `1 − (1 − ${v.outs}/${unknown})² = ${pctTwoStreets.toFixed(1)}% (${oddsTwo})` : 'Only one street remaining' },
        { label: 'Rule of 4 Check', value: v.streetsLeft === 2 ? `${v.outs} × 4 = ${rule4}% (actual: ${pctTwoStreets.toFixed(1)}%)` : 'N/A — only one street' },
        { label: 'Pot Odds Comparison', value: `Need pot odds better than ${oddsTwo} to call profitably` },
        { label: 'Recommendation', value: pctTwoStreets >= 36 ? 'Strong drawing hand — bet/raise for value' : pctTwoStreets >= 20 ? 'Decent draw — call if pot odds favorable' : 'Weak draw — fold unless getting great odds' },
      ],
      extras: [
        { label: '♠️ The Rule of 2 and 4', value: 'Quick estimation: On the flop, multiply outs by 4 for by-river %. On the turn, multiply by 2 for river %. Accuracy: within 2-3% for up to 12 outs.' },
        { label: '🎯 Common Drawing Hands', value: 'Flush draw: 9 outs (35% to hit by river). Open-ended straight draw: 8 outs (31%). Gutshot straight: 4 outs (16%). Flush + straight draw: 15 outs (54% — favored!).' },
        { label: '💰 Pot Odds Basics', value: 'Compare the chance of hitting (%) to the pot odds offered. If pot is $100 and opponent bets $50, you\'re getting 3:1 (need 25%). A flush draw (35%) is a profitable call here.' },
        { label: '🃏 Implied Odds Matter', value: 'If you expect to win more chips when you hit (implied odds), you can call with slightly worse pot odds. Strong draws are more valuable against deep stacks (many bets behind).' },
        { label: '🔄 Reverse Implied Odds', value: 'Some draws (like straight draws to a one-card straight) can hit but still lose to a better hand. Discount these outs. The nut flush draw is much more valuable than a non-nut draw.' },
        { label: '📊 Hand Odds Reference', value: 'Pre-flop odds: Pair vs 2 undercards (80-20). Pair vs 2 overcards (55-45). Two overs vs two unders (63-37). AK vs QQ (43-57). Pocket aces vs random: 85%.' },
        { label: '🧮 Adjusting for Opponents', value: 'With multiple opponents, adjust outs down — some outs may be in opponents\' hands. Against 3 opponents, discount flush draw from 9 to ~6.5 outs. Subtract 1-2 outs per extra player.' },
        { label: '📱 Quick Reference', value: 'Flush draw on flop: 35% to hit. OESD: 31%. Gutshot: 16%. Two pair to full house: 17%. Set to full house/quad: 33%. Memorize these and you\'ll rarely need to calculate mid-hand.' },
      ]
    }
  },
  description: 'Calculate poker hand odds based on your outs, remaining cards, and streets left. Uses precise probability formulas plus the Rule of 2 and 4 for quick estimation. Includes pot odds comparison and drawing hand recommendations.',
  formula: 'Next Street: Hit% = Outs ÷ Unknown × 100 | By River (flop): Hit% = 1 − (1 − Outs/Unknown)² × 100 | Odds = (100% − Hit%) ÷ Hit% : 1 | Rule of 2: Outs × 2 (≈ next street %) | Rule of 4: Outs × 4 (≈ by river %)',
  interpretation: 'The Rule of 2 and 4 is accurate within 2-3% for up to 12 outs. Key drawing hands: flush draw (9 outs, 35% by river), open-ended straight draw (8 outs, 31%), gutshot (4 outs, 16%). Unsuited overcards (6 outs, 24%). To profitably call a bet, compare your hit% to the pot odds offered. For example, facing a half-pot bet (3:1 odds, need 25%), a flush draw (35%) is a clear call. Discount your outs when you suspect opponents hold some of them.'
}

export default calcDef
