import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ packsPerDay: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), costPerPack: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), yearsSmoked: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), quitYears: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'packsPerDay', label: 'Packs per Day', type: 'number', min: 0.25, step: '0.25' },
    { name: 'costPerPack', label: 'Cost per Pack ($)', type: 'number', min: 5, step: '2' },
    { name: 'yearsSmoked', label: 'Years Smoked', type: 'number', min: 1, step: '1' },
    { name: 'quitYears', label: 'Years Since Quitting', type: 'number', min: 0, step: '1' },
  ],
  defaults: { packsPerDay: '1', costPerPack: '10', yearsSmoked: '10', quitYears: '0' },
  presets: [
    { label: 'Pack-a-Day Smoker', values: { packsPerDay: '1', costPerPack: '10', yearsSmoked: '20', quitYears: '0' } },
    { label: 'Half-Pack Smoker', values: { packsPerDay: '0.5', costPerPack: '12', yearsSmoked: '10', quitYears: '0' } },
    { label: 'Heavy Smoker Quit 5yr', values: { packsPerDay: '1.5', costPerPack: '9', yearsSmoked: '15', quitYears: '5' } },
    { label: 'Recent Quitter', values: { packsPerDay: '1', costPerPack: '11', yearsSmoked: '8', quitYears: '2' } },
  ],
  compute: (v) => {
    const annualCost = v.packsPerDay * v.costPerPack * 365
    const totalSpent = annualCost * v.yearsSmoked
    const moneySaved = annualCost * v.quitYears
    const cigarettes = v.packsPerDay * 20
    const totalCigarettes = cigarettes * 365 * v.yearsSmoked
    return { result: totalSpent, label: 'Total Spent on Cigarettes', unit: '$', steps: [{ label: 'Annual Cost', value: `$${annualCost.toFixed(2)}/yr` }, { label: 'Total Spent', value: `$${totalSpent.toFixed(2)}` }, { label: 'Total Cigarettes', value: `${totalCigarettes.toLocaleString()} smokes` }, { label: 'Money Saved by Quitting', value: `$${moneySaved.toFixed(2)} saved since quitting` }] ,
    extras: [
      { label: 'State Price Comparison', value: 'Cigarette prices vary widely: New York $14-16/pack, Missouri $6-7/pack, national average ~$8.50. Cross-border purchasing adds 30-50% savings' },
      { label: 'Compound Savings If Invested', value: 'A pack-a-day smoker ($10/pack, $3,650/yr) who invests savings in an S&P 500 index fund (7% return) would have $75,000 after 10 years, $220,000 after 20 years, $500,000 after 30 years' },
      { label: 'Health Cost Multiplier', value: 'Smoking-related healthcare costs: $2,500-5,000/yr per smoker beyond cigarette costs. Insurance premiums 20-50% higher for smokers' },
      { label: 'Life Expectancy Impact', value: 'Smoking reduces life expectancy by 10 years on average. Quitting before age 40 reduces smoking-related death risk by 90%. By age 50: 50%' },
      { label: 'Health Recovery Timeline', value: '20 min: HR normalizes. 12 hrs: CO levels normal. 2 wks-3 mo: circulation/lung function improve. 1 yr: heart disease risk drops 50%. 10 yrs: lung cancer risk drops 50%' },
      { label: 'Secondhand Smoke Cost', value: 'Secondhand smoke causes 41,000+ deaths/year in the US. Adding cleanup costs, property damage, and health impacts — total societal cost is $300+ billion/year' },
      { label: 'Quit Aid Cost Comparison', value: 'Nicotine patches: $30-60/month. Prescription meds (Chantix, Wellbutrin): $100-400/month. Vaping: $30-80/month. All cheaper than smoking at $300+/month' },
    ]}
  },
  description: 'Calculate the total financial cost of smoking over your lifetime — cigarettes purchased, money spent, and savings accumulated since quitting.',
  formula: 'AnnualCost = PacksPerDay × CostPerPack × 365. TotalSpent = AnnualCost × YearsSmoked. TotalCigarettes = PacksPerDay × 20 × 365 × YearsSmoked. MoneySaved = AnnualCost × QuitYears.',
  interpretation: 'A pack-a-day smoker at $10/pack spends $3,650/year, $36,500 over 10 years, $73,000 over 20 years, and $109,500 over 30 years. If that $3,650/year were instead invested with 7% annual returns, it would grow to $220,000+ after 20 years and $500,000+ after 30 years. Beyond direct costs: smokers pay 20-50% higher health insurance premiums, lose 10 years of life expectancy on average, and incur an estimated $2,500-5,000/year additional healthcare costs. Quitting before age 40 eliminates 90% of smoking-related mortality risk.'
}

export default calcDef
