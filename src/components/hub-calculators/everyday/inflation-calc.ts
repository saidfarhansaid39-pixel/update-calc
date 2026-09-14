import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ amount: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), inflationRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), years: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'amount', label: 'Current Amount ($)', type: 'number', min: 1, step: '100' },
    { name: 'inflationRate', label: 'Annual Inflation Rate (%)', type: 'number', min: 0.1, step: '0.5' },
    { name: 'years', label: 'Number of Years', type: 'number', min: 1, step: '1' },
  ],
  defaults: { amount: "100", inflationRate: "3", years: "10" },
  presets: [
    { label: "Fed Target Scenario", values: { amount: "50000", inflationRate: "2", years: "20" } },
    { label: "Historical Average", values: { amount: "100000", inflationRate: "3.2", years: "30" } },
    { label: "High Inflation (1970s Style)", values: { amount: "10000", inflationRate: "7", years: "5" } },
    { label: "Retirement Projection", values: { amount: "75000", inflationRate: "3", years: "25" } },
  ],
  compute: (v) => { const a = parseFloat(v.amount)||0; const ir = parseFloat(v.inflationRate)||0 / 100; const y = parseFloat(v.years)||0; const adjusted = a * Math.pow(1 + ir, y); const pctLost = adjusted > 0 ? ((adjusted - a) / adjusted) * 100 : 0; const doublingYears = ir > 0 ? Math.log(2) / Math.log(1 + ir) : 0; const halvingYears = ir > 0 ? Math.log(0.5) / Math.log(1 / (1 + ir)) : 0; return { result: adjusted, label: 'Future Value Needed', unit: '$', steps: [{ label: 'Current Value (Today)', value: `$${a.toFixed(2)}` }, { label: 'Annual Inflation Rate', value: `${(ir * 100).toFixed(1)}%` }, { label: 'Time Horizon', value: `${y} years` }, { label: 'Future Value Needed', value: `$${adjusted.toFixed(2)}` }, { label: 'Purchasing Power Lost', value: `$${(adjusted - a).toFixed(2)} (${pctLost.toFixed(1)}% of future value)` }, { label: 'Price Doubling Time', value: `~${doublingYears.toFixed(1)} years at this rate` }, { label: 'Purchasing Power Half-Life', value: `~${halvingYears.toFixed(1)} years` }] ,
    extras: [
      { label: "Historical Inflation (US)", value: "1913-2025 average: ~3.2%/year | 1980s peak: 14.8% (1980) | 2022 peak: 9.1% | 2010s average: ~1.8% | 2020-2024 average: ~4.5% | The Fed targets 2%." },
      { label: "Rule of 72 for Inflation", value: "Divide 72 by the inflation rate to see how long until prices double. At 3% inflation: 72 ÷ 3 = 24 years to double. At 6%: just 12 years. A $5 coffee becomes $10 in 24 years at 3%." },
      { label: "Inflation by Category", value: "Medical care: 4-6%/yr (outpacing general inflation) | Education: 4-5%/yr | Housing: 3-4%/yr | Food: 2-3%/yr | Electronics: −2-0%/yr (deflation) | Clothing: 0-1%/yr" },
      { label: "Impact on Retirement Savings", value: "At 3% inflation, $1 million today is worth only $412,000 in 30 years. Your retirement target needs to account for this — a 4% withdrawal rate on $1M today = $40K/yr, but in 30 years that $40K buys only ~$16K worth of goods." },
      { label: "Wage vs Inflation Gap", value: "Since 1970, productivity has grown ~150% while real wages (after inflation) have grown only ~30%. This 'wage gap' means many households feel inflation more acutely than the official CPI suggests." },
      { label: "Investment Hedges Against Inflation", value: "TIPS (Treasury Inflation-Protected Securities): principal adjusts with CPI | Real estate: rents and values tend to rise with inflation | Stocks: equities historically outpace inflation by 6-8%/year | I Bonds: series I savings bonds track inflation + fixed rate" },
      { label: "Deflation Risk", value: "While inflation gets headlines, deflation (negative inflation) can be more dangerous. It delays purchases (waiting for lower prices), causes wage cuts, and increases real debt burdens. Japan experienced deflation throughout the 1990s-2010s." },
      { label: "Inflation Calculation Methods", value: "CPI-U: Consumer Price Index for All Urban Consumers (headline) | Core CPI: excludes food and energy (volatile items) | PCE: Personal Consumption Expenditures (Fed's preferred measure) | Chained CPI: accounts for substitution effects (gives slightly lower inflation rates)." },
    ]} },
  description: 'See exactly how inflation erodes your purchasing power over time. Calculate future dollar values, price doubling time, and the real cost of inflation on savings and retirement goals.',
  formula: 'Future Value = Present Value × (1 + Inflation Rate)^Years | Rule of 72: Doubling Years = 72 ÷ (Rate × 100) | Purchasing Power Half-Life = ln(0.5) ÷ ln(1 ÷ (1 + Rate))',
  interpretation: 'At the historical average inflation rate of 3.2%, the purchasing power of your dollar halves every ~22 years. A $100,000 salary today needs to become $219,000 in 25 years just to maintain the same standard of living. The Federal Reserve targets 2% inflation as optimal — low enough to avoid eroding savings but high enough to discourage deflation. The most important implication is for long-term retirement planning: a $1 million nest egg today will have the purchasing power of only about $400,000 in 30 years at 3% inflation. Always factor inflation into investment return expectations — a 7% nominal return is really only ~4% real return at 3% inflation.'
}

export default calcDef
