import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ homePrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), downPayment: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), rateAnnual: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), loanYears: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'homePrice', label: 'Home Price ($)', type: 'number', min: 50000, step: '10000' },
    { name: 'downPayment', label: 'Down Payment ($)', type: 'number', min: 0, step: '5000' },
    { name: 'rateAnnual', label: 'Annual Interest Rate (%)', type: 'number', min: 1, step: '0.25' },
    { name: 'loanYears', label: 'Loan Term (years)', type: 'number', min: 5, step: '5' },
  ],
  defaults: { homePrice: "350000", downPayment: "70000", rateAnnual: "6.5", loanYears: "30" },
  presets: [
    { label: "Starter Home", values: { homePrice: "250000", downPayment: "12500", rateAnnual: "6.75", loanYears: "30" } },
    { label: "Family Home (20% Down)", values: { homePrice: "450000", downPayment: "90000", rateAnnual: "6.25", loanYears: "30" } },
    { label: "15-Year Refinance", values: { homePrice: "350000", downPayment: "70000", rateAnnual: "5.5", loanYears: "15" } },
    { label: "Condominium", values: { homePrice: "200000", downPayment: "40000", rateAnnual: "6.5", loanYears: "30" } },
  ],
  compute: (v) => { const hp = parseFloat(v.homePrice)||0; const dp = parseFloat(v.downPayment)||0; const r = parseFloat(v.rateAnnual)||0 / 100 / 12; const n = (parseFloat(v.loanYears)||0) * 12; const pv = hp - dp; const m = pv * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1); const totalPaid = m * n; const totalInterest = totalPaid - pv; const downPct = hp > 0 ? (dp / hp) * 100 : 0; const interestPct = totalPaid > 0 ? (totalInterest / totalPaid) * 100 : 0; const year1Interest = pv * r * 12; const year1Principal = m * 12 - year1Interest; const closingCosts = hp * 0.03; const totalUpfront = dp + closingCosts; return { result: isNaN(m) ? 0 : m, label: 'Monthly Payment', unit: '$', steps: [{ label: 'Home Price', value: `$${hp.toLocaleString()}` }, { label: 'Down Payment', value: `$${dp.toLocaleString()} (${downPct.toFixed(0)}%)` }, { label: 'Loan Amount', value: `$${pv.toLocaleString()}` }, { label: 'Monthly P&I Payment', value: `$${(isNaN(m) ? 0 : m).toFixed(2)}` }, { label: 'Total Interest Over Term', value: `$${(isNaN(totalInterest) ? 0 : totalInterest).toFixed(2)} (${interestPct.toFixed(0)}% of total)` }, { label: 'Total Paid (P+I)', value: `$${(isNaN(totalPaid) ? 0 : totalPaid).toFixed(2)}` }, { label: 'Est. Closing Costs (3%)', value: `$${closingCosts.toFixed(0)}` }, { label: 'Total Upfront Needed', value: `$${totalUpfront.toFixed(0)}` }] ,
    extras: [
      { label: "PMI (Private Mortgage Insurance)", value: "Required when down payment < 20%. Costs 0.3-1.5% of loan annually. Automatically cancels at 78% LTV." },
      { label: "Property Tax Estimate", value: "Add 0.5-2.5% of home value annually. Paid via escrow (~1/12 added to monthly payment)." },
      { label: "Homeowners Insurance", value: "Average $800-1,500/yr. Required by lenders. Covers structure, liability, and personal property." },
      { label: "Rate vs APR", value: "APR includes points, origination fees, and other costs — always higher than the interest rate. Use APR to compare loans." },
      { label: "Points (Discount Points)", value: "Each point = 1% of loan amount, lowers rate by ~0.25%. Break-even takes 4-7 years. Worth it if you stay long-term." },
      { label: "Amortization Reality", value: "In early years, ~80% of payment goes to interest. Year 1 on a $350K loan at 6.5%: ~$22,500 interest vs ~$2,800 principal." },
      { label: "Extra Payment Impact", value: "Paying $100 extra/month on a $280K loan at 6.5% saves ~$85,000 in interest and shaves ~5 years off a 30-year term." },
      { label: "Escrow Account", value: "Lenders collect 1/12 of annual tax + insurance with each payment. This increases your monthly payment by 25-40%." },
    ]} },
  description: 'See the full cost of buying a home — monthly payment, total interest, closing costs, and total upfront cash needed. Compare 15-year vs 30-year terms and see how down payment size affects your loan.',
  formula: 'M = P × [r(1+r)^n] ÷ [(1+r)^n − 1] where P = Price − Down, r = monthly rate (annual ÷ 12), n = months (years × 12)',
  interpretation: 'The standard 30-year fixed-rate mortgage gives the lowest monthly payment but the highest total interest. With a 20% down payment, you avoid PMI entirely and build equity faster. Every 1% increase in interest rate adds about $50-100 per month per $100,000 borrowed. Closing costs typically add 2-5% of the home price to your upfront cash needed. A 15-year term roughly doubles your monthly payment but reduces total interest by 60% or more. Making one extra principal payment per year can cut your loan term by 4-6 years.'
}

export default calcDef
