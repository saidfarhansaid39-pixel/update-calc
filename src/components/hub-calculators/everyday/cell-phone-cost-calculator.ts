import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ phonePrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), monthlyPlan: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), monthsOwned: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), accessories: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tradeInValue: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), screenProtector: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'phonePrice', label: 'Phone Purchase Price ($)', type: 'number', min: 100, step: '100' },
    { name: 'monthlyPlan', label: 'Monthly Plan ($)', type: 'number', min: 10, step: '10' },
    { name: 'monthsOwned', label: 'Months You Keep It', type: 'number', min: 12, step: '6' },
    { name: 'accessories', label: 'Accessories (case/screen protector) ($)', type: 'number', min: 0, step: '10' },
    { name: 'tradeInValue', label: 'Trade-In/Resale Value ($)', type: 'number', min: 0, step: '50' },
    { name: 'screenProtector', label: 'Screen Repair Fund ($)', type: 'number', min: 0, step: '50' },
  ],
  defaults: { phonePrice: '800', monthlyPlan: '50', monthsOwned: '36', accessories: '40', tradeInValue: '150', screenProtector: '100' },
  presets: [
    { label: 'Flagship iPhone 3yr', values: { phonePrice: '1100', monthlyPlan: '60', monthsOwned: '36', accessories: '50', tradeInValue: '250', screenProtector: '200' } },
    { label: 'Mid-Range Android 2yr', values: { phonePrice: '450', monthlyPlan: '40', monthsOwned: '24', accessories: '25', tradeInValue: '100', screenProtector: '0' } },
    { label: 'Budget Phone 4yr', values: { phonePrice: '200', monthlyPlan: '30', monthsOwned: '48', accessories: '15', tradeInValue: '0', screenProtector: '0' } },
    { label: 'Carrier Finance Plan', values: { phonePrice: '1000', monthlyPlan: '75', monthsOwned: '30', accessories: '45', tradeInValue: '200', screenProtector: '150' } },
  ],
  compute: (v) => {
    const planTotal = v.monthlyPlan * v.monthsOwned
    const totalCostBeforeResale = v.phonePrice + planTotal + v.accessories + v.screenProtector
    const totalCost = totalCostBeforeResale - v.tradeInValue
    const costPerMonth = totalCost / v.monthsOwned
    const planPct = (planTotal / totalCostBeforeResale) * 100
    const phonePct = (v.phonePrice / totalCostBeforeResale) * 100
    const dailyEquivalent = costPerMonth / 30
    const breakevenMonths = v.phonePrice / (v.monthlyPlan * 0.3)
    return { result: costPerMonth, label: 'Cost per Month', unit: '$', steps: [
      { label: 'Upfront Phone Cost', value: `$${v.phonePrice.toFixed(0)}` },
      { label: 'Accessories & Repairs', value: `$${(v.accessories + v.screenProtector).toFixed(0)} (case + screen repair fund)` },
      { label: 'Plan Charges Over Ownership', value: `$${v.monthlyPlan.toFixed(0)}/mo × ${v.monthsOwned}mo = $${planTotal.toFixed(0)}` },
      { label: 'Gross Cost', value: `$${totalCostBeforeResale.toFixed(0)}` },
      { label: 'Minus Trade-In/Resale', value: `-$${v.tradeInValue.toFixed(0)}` },
      { label: 'Net Total Cost', value: `$${totalCost.toFixed(0)}` },
      { label: 'Effective Monthly Cost', value: `$${totalCost.toFixed(0)} ÷ ${v.monthsOwned}mo = $${costPerMonth.toFixed(2)}/mo` },
      { label: 'Daily Equivalent', value: `$${dailyEquivalent.toFixed(2)}/day` },
    ] ,
    extras: [
      { label: 'Plan Dominates Total Cost', value: `Your plan ($${v.monthlyPlan.toFixed(0)}/mo) accounts for ${planPct.toFixed(0)}% of your total phone cost vs ${phonePct.toFixed(0)}% for the device itself. Choosing a $25/mo MVNO (Mint, Visible, US Mobile) instead cuts your lifetime cost by ~$${(v.monthlyPlan - 25) * v.monthsOwned}.toFixed(0)}.` },
      { label: 'Buying vs Financing Math', value: 'Financing through a carrier adds 0% APR on the phone but locks you into their plan — often $20-40/mo more than MVNOs. Buying unlocked gives you freedom to switch plans. Savings: $30-60/mo × 24mo = $720-1,440.' },
      { label: 'Trade-In Timing Strategy', value: `Trading in after ${v.monthsOwned} months nets $${v.tradeInValue.toFixed(0)}. Optimal trade-in windows: iPhone (2-3 years, retain 35-50%), Samsung (1-2 years, retain 25-35%), Google Pixel (1 year, retain 30-40%). After 4 years, trade-in value approaches $0.` },
      { label: 'Screen Repair Cost Analysis', value: `With a $${v.screenProtector.toFixed(0)} repair fund, you are self-insuring. Average screen replacement: iPhone ($200-350), Android ($150-250). A $15-30 tempered glass protector reduces crack risk by 70-85% and is cheaper than any insurance plan.` },
      { label: 'Early Upgrade Penalty', value: 'Upgrading every 2 years instead of 3 effectively adds $150-300/year to your phone cost. Every extra year you keep a phone saves 25-50% of the annualized device cost. The iPhone 6s got 7 years of updates — modern phones last 4-6 years easily.' },
      { label: 'Accessories Trap', value: 'Average phone accessory spend is $150-300 over a device lifetime (cases, chargers, wireless buds, popsockets). Buying a quality $30 case upfront vs $8 cases that fail saves $40-60 over 3 years. Use one good USB-C cable instead of replacing $10 cables every 6 months.' },
      { label: 'Total Cost of Ownership Perspective', value: 'Your true TCO across plan, phone, accessories, and repairs is $' + `${totalCostBeforeResale.toFixed(0)}` + ' over ' + `${v.monthsOwned}` + ` months. That's equivalent to ${(totalCostBeforeResale / 12 / 1000).toFixed(1)} months of rent or ${(totalCostBeforeResale / 5).toFixed(0)} cups of coffee per month.` },
      { label: 'Breakeven Against a Cheaper Plan', value: `Switching to a $25/mo plan saves $${(v.monthlyPlan - 25).toFixed(0)}/mo. That covers your phone's cost in ${breakevenMonths.toFixed(0)} months — after that, the savings are pure profit. If you keep the phone ${v.monthsOwned} months, total savings = $${((v.monthlyPlan - 25) * v.monthsOwned - v.phonePrice).toFixed(0)}.` },
    ]}
  },
  description: 'Calculate the true total cost of cell phone ownership including purchase price, monthly plan fees, accessories, screen protection, and resale value over the full ownership period. Compare financing strategies and plan types to find your lowest-cost option.',
  formula: 'True Cost/Month = (Phone Price + Plan Total + Accessories + Screen Fund − Trade-In) ÷ Months Owned. Plan share = Plan Total ÷ Gross Cost × 100. Breakeven = Phone Price ÷ (Plan Savings/mo).',
  interpretation: 'Your monthly plan cost dominates total ownership — often 60-80% of lifetime spend. A $1,000 phone on a $75/mo plan for 3 years costs $3,700 total ($103/mo). Switching to a $25/mo MVNO with the same phone cuts lifetime cost by $1,800. Keeping a phone 3 years instead of 2 saves $200-500/year. Buying unlocked and using an MVNO typically saves $600-1,500 over 3 years vs carrier financing.'
}

export default calcDef
