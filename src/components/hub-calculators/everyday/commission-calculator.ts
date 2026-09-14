import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ salePrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), commissionRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), baseSalary: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), quotaMonthly: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), dealsPerMonth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), taxRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'salePrice', label: 'Sale Price ($)', type: 'number', min: 1, step: '100' },
    { name: 'commissionRate', label: 'Commission Rate (%)', type: 'number', min: 0.1, step: '0.5' },
    { name: 'baseSalary', label: 'Base Salary ($/mo)', type: 'number', min: 0, step: '500' },
    { name: 'quotaMonthly', label: 'Monthly Quota ($)', type: 'number', min: 0, step: '10000' },
    { name: 'dealsPerMonth', label: 'Deals Closed per Month', type: 'number', min: 1, step: '1' },
    { name: 'taxRate', label: 'Estimated Tax Rate (%)', type: 'number', min: 0, max: 50, step: '5' },
  ],
  defaults: { salePrice: '250000', commissionRate: '5', baseSalary: '4000', quotaMonthly: '200000', dealsPerMonth: '3', taxRate: '25' },
  presets: [
    { label: 'Realtor with Team Split', values: { salePrice: '500000', commissionRate: '5', baseSalary: '0', quotaMonthly: '0', dealsPerMonth: '2', taxRate: '30' } },
    { label: 'Tech Sales BDR', values: { salePrice: '25000', commissionRate: '8', baseSalary: '6000', quotaMonthly: '100000', dealsPerMonth: '6', taxRate: '22' } },
    { label: 'Pharma Sales Rep', values: { salePrice: '15000', commissionRate: '12', baseSalary: '7500', quotaMonthly: '180000', dealsPerMonth: '15', taxRate: '28' } },
    { label: 'Freelance Agent', values: { salePrice: '300000', commissionRate: '3.5', baseSalary: '0', quotaMonthly: '0', dealsPerMonth: '1', taxRate: '30' } },
  ],
  compute: (v) => {
    const perDealCommission = v.salePrice * (v.commissionRate / 100)
    const monthlyCommission = perDealCommission * v.dealsPerMonth
    const monthlyGross = monthlyCommission + v.baseSalary
    const annualGross = monthlyGross * 12
    const monthlyTax = monthlyGross * (v.taxRate / 100)
    const monthlyNet = monthlyGross - monthlyTax
    const annualNet = annualGross * (1 - v.taxRate / 100)
    const quotaAttainment = v.quotaMonthly > 0 ? (v.salePrice * v.dealsPerMonth / v.quotaMonthly) * 100 : 0
    const effectiveHourly = monthlyGross / (160)
    const annualTakeHome = annualNet
    const fmt = (n: number, d: number = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
    const f2 = (n: number) => n.toFixed(2)
    const aloc = fmt(annualNet, 2)
    const agloc = fmt(annualGross, 0)
    const taxloc = fmt(annualGross * v.taxRate / 100, 0)
    const perDealX12loc = fmt(perDealCommission * 12, 0)
    const salePriceloc = fmt(v.salePrice, 0)
    const v1_2loc = fmt(v.salePrice * 1.2, 0)
    const addIncomeLoc = fmt(v.salePrice * 0.2 * v.dealsPerMonth * 12 * v.commissionRate / 100, 0)
    const totalAnnualLoc = fmt(v.salePrice * v.dealsPerMonth * 12, 0)
    const quotaAdvice = v.quotaMonthly > 0
      ? `At ${v.dealsPerMonth} deals/mo averaging $${salePriceloc}, you're at ${quotaAttainment.toFixed(0)}% of your $${fmt(v.quotaMonthly, 0)} quota. ${quotaAttainment >= 100 ? 'Hitting quota! Accelerators may kick in \u2014 check your comp plan.' : 'Below quota \u2014 consider: increasing deal size, closing more units, or negotiating a lower quota target.'} Each additional deal adds $${f2(perDealCommission)} to monthly income.`
      : 'No quota set. With no target, you have flexibility but no accelerator upside. Consider asking for a quota + tier structure \u2014 it often comes with higher rates for overperformance.'
    const scalingAdvice = v.dealsPerMonth < 5
      ? 'Focus on: shortening sales cycle, improving lead qualification, reducing admin work.'
      : `At your volume, even a 10% close rate improvement = ${fmt(perDealCommission * v.dealsPerMonth * 0.1 * 12, 0)}/year. Invest in CRM automation and sales training for the highest ROI.`
    const compBenchmark = `Your total comp (base + commission): $${f2(monthlyGross)}/mo = $${agloc}/yr. Compare: real estate agents median $62k (top 10%: $160k). B2B SaaS AE median $120k, top 10%: $250k+. Car sales median $55k, top 10%: $120k. If you're below median for your industry, consider job-hopping (10-20% comp bump typical) or negotiating a comp plan redesign.`
    return { result: monthlyCommission, label: 'Monthly Commission', unit: '$', steps: [
      { label: 'Per-Deal Commission', value: `$${f2(perDealCommission)} × ${v.commissionRate}% on $${salePriceloc}` },
      { label: 'Deals per Month', value: `${v.dealsPerMonth} deal${v.dealsPerMonth > 1 ? 's' : ''}` },
      { label: 'Monthly Commission', value: `$${f2(perDealCommission)} × ${v.dealsPerMonth} = $${f2(monthlyCommission)}` },
      { label: 'Base Salary (monthly)', value: `$${f2(v.baseSalary)}` },
      { label: 'Monthly Gross Income', value: `$${f2(monthlyCommission)} + $${f2(v.baseSalary)} = $${f2(monthlyGross)}` },
      { label: `Taxes (${v.taxRate}%)`, value: `−$${f2(monthlyTax)}` },
      { label: 'Monthly Net (after tax)', value: `$${f2(monthlyNet)}` },
      { label: 'Annual Net Income', value: `$${aloc}` },
    ] ,
    extras: [
      { label: 'Quota Attainment Analysis', value: quotaAdvice },
      { label: 'Effective Hourly Rate', value: `Based on a 40-hr work week, your effective hourly rate before tax is $${f2(effectiveHourly)}/hr. ${effectiveHourly > 50 ? 'Top-tier — you\'re earning like a specialist consultant.' : effectiveHourly > 30 ? 'Solid income — equivalent to a $' + f2(effectiveHourly * 2080 / 1000) + 'k salaried role.' : 'Below $30/hr — consider improving close rate or targeting higher-value deals to boost your effective earnings.'} Commission roles often work 50+ hrs/week; adjust hours in your calculation.` },
      { label: 'After-Tax Annual View', value: `Your annual net take-home: $${aloc}. At ${v.taxRate}% effective rate, you pay $${taxloc}/year in taxes. ${v.taxRate > 25 ? 'Consider maxing out 401(k) ($23,000/yr for 2024) to save $5,060-6,440 in taxes at your bracket.' : 'Your tax rate is moderate. A Roth IRA may be attractive — pay taxes now at lower bracket, withdraw tax-free later.'} Self-employed (1099): deduct home office, mileage, health insurance, and retirement plan contributions.'` },
      { label: 'Scaling Through Deal Volume', value: `Adding 1 more deal per month increases annual income by $${perDealX12loc}. ${scalingAdvice}` },
      { label: 'Sales Cycle & Commission Timing', value: 'Commission is typically paid 30-60 days after the deal closes (after delivery, refund period, and payment clearance). On a $' + salePriceloc + ' deal, expect a 45-day gap between closing and cash in hand. Maintain 3 months\' living expenses as a buffer — especially if you\'re 100% commission. Cash flow management is critical.' },
      { label: 'Tax Planning for Commission Earners', value: `Your $${f2(monthlyGross)}/mo varies with deal flow. Avoid tax surprises: set aside ${v.taxRate}% ($${f2(monthlyTax)}) of each commission in a separate savings account. Make quarterly estimated tax payments if self-employed (deadlines: Apr 15, Jun 15, Sep 15, Jan 15). A SEP IRA allows 25% of self-employment income as tax-deductible contributions — up to $69,000 for 2024.` },
      { label: 'Deal Size vs Volume Strategy', value: `At $${salePriceloc} average deal with ${v.dealsPerMonth}/mo: annually = $${totalAnnualLoc}. A 20% increase in deal size ($${v1_2loc}) adds $${addIncomeLoc}/year without more work. A 20% increase in volume (${f2(v.dealsPerMonth * 1.2)}/mo) adds similar but costs more effort. Prioritize deal size growth first — it compounds.` },
      { label: 'Total Compensation Benchmarking', value: compBenchmark },
    ]}
  },
  description: 'Calculate monthly and annual commission earnings including base salary, quota attainment, deal volume, and tax estimates. Supports real estate, SaaS, pharma, car sales, and freelance commission structures with after-tax annual income projections.',
  formula: 'Per-deal Commission = Sale × Rate%. Monthly Commission = Per-deal × Deals/mo. Gross = Commission + Base. Net = Gross × (1 − Tax%). Quota % = (Deal Value × Deals) ÷ Quota × 100. Effective Hourly = Gross ÷ 160 hours.',
  interpretation: 'Common commission structures: real estate 2.5-6% (split with broker), B2B SaaS 8-15% with accelerators, car sales 20-30% of gross profit, retail 2-10%. Deal volume compounds: adding one extra deal/month at $250k/3% = $90k/year additional income. Set aside 25-35% of commission for taxes. Commission timing lags 30-60 days behind deal close — maintain cash reserves. Quota-based plans with accelerators reward overperformance with higher marginal rates on excess. Negotiate comp plans annually based on your performance data.'
}

export default calcDef
