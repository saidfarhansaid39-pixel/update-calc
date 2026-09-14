import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ salePrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), commissionRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), baseSalary: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tierThreshold: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tierRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), splitPct: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'salePrice', label: 'Sale Price ($)', type: 'number', min: 1, step: '100' },
    { name: 'commissionRate', label: 'Commission Rate (%)', type: 'number', min: 0.1, step: '0.5' },
    { name: 'baseSalary', label: 'Base Salary ($/mo)', type: 'number', min: 0, step: '500' },
    { name: 'tierThreshold', label: 'Tier Threshold ($)', type: 'number', min: 0, step: '10000' },
    { name: 'tierRate', label: 'Above-Threshold Rate (%)', type: 'number', min: 0, step: '1' },
    { name: 'splitPct', label: 'Your Split (%)', type: 'number', min: 1, max: 100, step: '5' },
  ],
  defaults: { salePrice: '350000', commissionRate: '3', baseSalary: '3000', tierThreshold: '500000', tierRate: '5', splitPct: '100' },
  presets: [
    { label: 'Real Estate Agent (single sale)', values: { salePrice: '450000', commissionRate: '3', baseSalary: '0', tierThreshold: '0', tierRate: '0', splitPct: '70' } },
    { label: 'Car Salesperson (one vehicle)', values: { salePrice: '35000', commissionRate: '25', baseSalary: '2000', tierThreshold: '50000', tierRate: '30', splitPct: '100' } },
    { label: 'Software Sales AE', values: { salePrice: '50000', commissionRate: '10', baseSalary: '8000', tierThreshold: '100000', tierRate: '15', splitPct: '100' } },
    { label: 'Retail Commission Associate', values: { salePrice: '2000', commissionRate: '5', baseSalary: '2500', tierThreshold: '10000', tierRate: '7', splitPct: '100' } },
  ],
  compute: (v) => {
    const baseCommission = v.salePrice * (v.commissionRate / 100)
    const tierCommission = v.salePrice > v.tierThreshold && v.tierRate > 0
      ? (v.salePrice - v.tierThreshold) * ((v.tierRate - v.commissionRate) / 100)
      : 0
    const grossCommission = baseCommission + Math.max(0, tierCommission)
    const yourCommission = grossCommission * (v.splitPct / 100)
    const totalEarnings = yourCommission + v.baseSalary
    const effectiveRate = (yourCommission / v.salePrice) * 100
    const totalComp = yourCommission + v.baseSalary
    const commissionVsBase = v.baseSalary > 0 ? (yourCommission / totalComp) * 100 : 100
    return { result: yourCommission, label: 'Your Commission', unit: '$', steps: [
      { label: 'Sale Price', value: `$${v.salePrice.toLocaleString('en-US', {minimumFractionDigits: 2})}` },
      { label: `Base Rate (${v.commissionRate}%)`, value: `$${v.salePrice.toLocaleString()} × ${v.commissionRate}% = $${baseCommission.toFixed(2)}` },
      { label: 'Tier Acceleration', value: v.tierThreshold > 0 && v.tierRate > 0 && v.salePrice > v.tierThreshold ? `$${(v.salePrice - v.tierThreshold).toLocaleString()} above $${v.tierThreshold.toLocaleString()} @ ${v.tierRate}% = +$${tierCommission.toFixed(2)}` : 'No tier exceeded' },
      { label: 'Gross Commission', value: `$${grossCommission.toFixed(2)}` },
      { label: `Split (${v.splitPct}%)`, value: v.splitPct < 100 ? `$${grossCommission.toFixed(2)} × ${v.splitPct}% = $${yourCommission.toFixed(2)}` : '100% — no split' },
      { label: 'Base Salary (this period)', value: `+$${v.baseSalary.toFixed(2)}` },
      { label: 'Total Compensation', value: `$${totalEarnings.toFixed(2)}` },
      { label: 'Effective Commission Rate', value: `${effectiveRate.toFixed(2)}% of sale price (${commissionVsBase.toFixed(0)}% of comp from commission)` },
    ] ,
    extras: [
      { label: 'Tiered Commission Impact', value: v.tierThreshold > 0 && v.tierRate > 0 ? `Your tier kicks in above $${v.tierThreshold.toLocaleString()}. On this $${v.salePrice.toLocaleString()} deal, you earned $${tierCommission.toFixed(2)} in tier acceleration ($${grossCommission.toFixed(2)} total). That's ${(tierCommission / grossCommission * 100).toFixed(0)}% of commission from the tier — showing the value of exceeding quota.` : 'Tiered/accelerated commissions reward overperformance. If you exceed $50k in monthly sales, a rate jump from 10% to 15% on the overage can add $2,500 on a $100k month. Always negotiate accelerators above quota.' },
      { label: 'Split/Co-Broke Economics', value: `At ${v.splitPct}% split, you keep $${(grossCommission * v.splitPct / 100).toFixed(2)} and the house/broker keeps $${(grossCommission * (1 - v.splitPct / 100)).toFixed(2)}. A 70/30 split is typical for new agents; top producers negotiate 85-95%. Each 5% you negotiate costs/earns you $${(grossCommission * 0.05).toFixed(2)} on this deal.` },
      { label: 'Commission vs Base Salary Ratio', value: `Commission makes up ${commissionVsBase.toFixed(0)}% of your total comp. At ${commissionVsBase > 80 ? 'this high ratio (80%+), you own your income — no cap on earnings but risk of dry spells. Build a 3-month expense reserve.' : commissionVsBase > 50 ? 'a balanced mix, you have stability plus upside. Guard your base salary as it funds your pipeline during slow months.' : 'a base-heavy mix, you have stability but limited upside. Consider negotiating for higher commission rates or a lower base with uncapped commission.'}` },
      { label: 'Draw Against Commission', value: 'If you\'re on a draw system (recoverable advance), this $' + `${v.baseSalary.toFixed(2)}` + ` base may be recoverable. A $3,000/mo draw means the first $3,000 in commission each month goes to repaying the draw. Your net after draw: $${(totalComp - v.baseSalary).toFixed(2)} if draw applies. Check your comp plan — non-recoverable draws are better for cash flow.` },
      { label: 'Tax Withholding Strategy', value: v.baseSalary > 0 ? `Your $${v.baseSalary.toFixed(0)} base is taxed at your marginal rate (22-32% typical). Commission ($${yourCommission.toFixed(2)}) may be withheld at 22% supplemental rate. Set aside 30-35% of commission for taxes + self-employment if 1099. Consider quarterly estimated payments.` : 'As a 100% commission earner, you\'re likely 1099. Set aside 30% of each commission for taxes (federal + self-employment + state). Pay quarterly estimated taxes to avoid penalties. A SEP IRA allows 25% tax-deductible retirement contributions on commission income.' },
      { label: 'Annual Run-Rate Projection', value: `If this $${v.salePrice.toLocaleString()} sale is typical, and you close ${v.baseSalary > 0 ? '4 deals/month' : '2 deals/month'}, your annual projection: $${((totalEarnings) * (v.baseSalary > 0 ? 12 : 24)).toLocaleString('en-US', {minimumFractionDigits: 0})}/year (before taxes). Top 20% of salespeople close at 3× the average — skill development and lead generation compound income.` },
      { label: 'Pipeline & Effort Ratio', value: `On average, salespeople spend 40% of time prospecting, 25% on meetings, 20% on admin, 15% closing. Commission of $${yourCommission.toFixed(2)} on this deal required ~${Math.round(3 + v.salePrice / 100000)} hours of work = ~$${(yourCommission / (3 + v.salePrice / 100000)).toFixed(2)}/hour effective. Top performers focus 60%+ on high-value activities.` },
      { label: 'Industry Benchmark Comparison', value: `Your ${v.commissionRate}% rate on a $${v.salePrice.toLocaleString()} sale: ${v.salePrice > 100000 ? 'Real estate avg: 2.5-3% (but 30-50% goes to broker).' : v.salePrice > 10000 ? 'B2B SaaS avg: 8-15% with accelerators up to 20%.' : 'Retail avg: 2-8% of total sale.'} Your effective rate (after split/tier) is ${effectiveRate.toFixed(2)}%. Compare with industry averages to negotiate your next comp plan.` },
    ]}
  },
  description: 'Calculate commission earnings from a sale including base salary, tiered/accelerated commission rates, and broker splits. Supports real estate, car sales, software sales, and retail commission structures with annual run-rate projections.',
  formula: 'Commission = Sale × Rate% + Tier acceleration (Sale − Threshold) × (TierRate − BaseRate)%. Your Commission = Gross × Split%. Total = Commission + Base. Effective Rate = Your Commission ÷ Sale × 100.',
  interpretation: 'Tiered commission structures reward exceeding quota with higher marginal rates. Typical splits: new agents 50-70%, top producers 80-95%. A draw against commission provides guaranteed minimum but must be repaid from future commissions. Annual run-rate: multiply typical monthly comp by 12. Set aside 30-35% of commission for taxes (higher for 1099). The effective commission rate (after splits and tiers) matters more than the headline rate. Top-performing salespeople earn 3× the average through skill development and pipeline management.'
}

export default calcDef
