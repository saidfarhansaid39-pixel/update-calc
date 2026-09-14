import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ oddsNumerator: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), oddsDenominator: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), stake: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'oddsNumerator', label: 'Odds (numerator)', type: 'number', min: 1, step: '1' },
    { name: 'oddsDenominator', label: 'Odds (denominator)', type: 'number', min: 1, step: '1' },
    { name: 'stake', label: 'Stake ($)', type: 'number', min: 0.01, step: '1' },
  ],
  defaults: { oddsNumerator: "5", oddsDenominator: "1", stake: "10" },
  presets: [
    { label: "Heavy Favorite (1/4)", values: { oddsNumerator: "1", oddsDenominator: "4", stake: "20" } },
    { label: "Even Money (1/1)", values: { oddsNumerator: "1", oddsDenominator: "1", stake: "25" } },
    { label: "Long Shot (20/1)", values: { oddsNumerator: "20", oddsDenominator: "1", stake: "5" } },
    { label: "Each-Way Special (10/3)", values: { oddsNumerator: "10", oddsDenominator: "3", stake: "15" } },
  ],
  compute: (v) => {
    const n = v.oddsNumerator; const d = v.oddsDenominator; const s = v.stake
    const profit = s * (n / d)
    const totalReturn = s + profit
    const impliedProb = (d / (n + d)) * 100
    const decimalOdds = (n / d) + 1
    const americanOdds = n / d >= 1 ? `+${(n / d * 100).toFixed(0)}` : `${(-100 / (n / d)).toFixed(0)}`
    const vigFreeProb = impliedProb > 0 ? (d / (n + d)) * 100 : 0
    return { result: totalReturn, label: 'Total Return', unit: '$', steps: [{ label: 'Fractional Odds', value: `${n}/${d}` }, { label: 'Decimal Odds', value: `${decimalOdds.toFixed(2)}` }, { label: 'American Odds', value: americanOdds }, { label: 'Stake', value: `$${s.toFixed(2)}` }, { label: 'Profit if Win', value: `$${profit.toFixed(2)}` }, { label: 'Total Return if Win', value: `$${totalReturn.toFixed(2)}` }, { label: 'Implied Probability', value: `${impliedProb.toFixed(1)}%` }, { label: 'Fair Value Estimate', value: `${vigFreeProb.toFixed(1)}% (excl. bookmaker margin)` }] ,
    extras: [
      { label: "Fractional Odds Explained", value: "Shows profit relative to stake. 5/1 = win $5 for every $1 bet (stake returned). 1/4 = win $0.25 for every $1 bet. Always stated as numerator/denominator." },
      { label: "Decimal Odds Conversion", value: "Decimal = (Numerator ÷ Denominator) + 1. 5/1 → 6.0. Multiply decimal odds by stake for total return. Used widely in Europe, Australia, Canada." },
      { label: "American/Moneyline Odds", value: "Positive (+) shows profit on $100 bet. Negative (−) shows stake needed to win $100. 5/1 → +500. 1/4 → −400. Standard in US sportsbooks." },
      { label: "Implied Probability & Vig", value: "IP = Denominator ÷ (Numerator + Denominator). Sum of all outcomes' IP in a race exceeds 100% — the excess is the bookmaker's vigorish (vig/juice), typically 5-20%." },
      { label: "Each-Way Betting", value: "Half stake on Win, half on Place. Place terms vary (1/4 or 1/5 odds). Common for each-way: 10/3 odds, 1/5 place terms for top 3-4 finishers." },
      { label: "Odds Formats Comparison", value: "5/1 fractional = 6.0 decimal = +500 American. 1/1 (evens) = 2.0 decimal = +100. 1/4 = 1.25 decimal = −400." },
      { label: "Value Betting Concept", value: "A bet has value when your estimated probability exceeds the implied odds probability. If you think a horse has 30% chance but odds imply 20%, that's value." },
      { label: "Bankroll Management", value: "Never bet more than 1-2% of your bankroll on a single race. The Kelly Criterion suggests: stake = (odds × probability − 1) / (odds − 1) × bankroll." },
    ]}
  },
  description: 'Convert fractional horse racing odds to decimal and American formats. Calculate profit, total return, and implied probability for any stake. Understand each-way betting and bookmaker margin.',
  formula: 'Profit = Stake × (Numerator ÷ Denominator) | Total Return = Stake + Profit | Decimal Odds = (Numerator ÷ Denominator) + 1 | Implied Probability = Denominator ÷ (Numerator + Denominator) × 100%',
  interpretation: 'Fractional odds are the traditional UK format for horse racing: the numerator shows profit per denominator staked. For example, 5/1 means you win $5 profit for every $1 wagered (total return $6). The implied probability (denominator divided by numerator + denominator) shows the market-implied chance of winning — but bookmakers build in a margin (vig), so the sum of implied probabilities across all runners in a race exceeds 100%. Lower odds mean the horse is considered more likely to win. Always shop for the best odds across multiple bookmakers.'
}

export default calcDef
