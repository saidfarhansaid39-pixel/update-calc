import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ annualIncome: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), monthlyDebts: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), rentRatio: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'annualIncome', label: 'Annual Gross Income ($)', type: 'number', min: 10000, step: '5000' },
    { name: 'monthlyDebts', label: 'Monthly Debt Payments ($)', type: 'number', min: 0, step: '50' },
    { name: 'rentRatio', label: 'Max Rent % of Income', type: 'number', min: 10, max: 50, step: '5' },
  ],
  defaults: { annualIncome: '60000', monthlyDebts: '400', rentRatio: '30' },
  presets: [
    { label: 'Recent Grad (25% rule)', values: { annualIncome: '40000', monthlyDebts: '200', rentRatio: '25' } },
    { label: 'Mid-Career (30% rule)', values: { annualIncome: '80000', monthlyDebts: '600', rentRatio: '30' } },
    { label: 'High Earner (28% rule)', values: { annualIncome: '120000', monthlyDebts: '1200', rentRatio: '28' } },
  ],
  compute: (v) => {
    const monthlyIncome = v.annualIncome / 12
    const maxRent = monthlyIncome * (v.rentRatio / 100)
    const safeRent = Math.max(0, maxRent - v.monthlyDebts)
    const backEndRatio = maxRent + v.monthlyDebts > 0 ? ((safeRent + v.monthlyDebts) / monthlyIncome) * 100 : 0
    const landlordMultiple = maxRent > 0 ? monthlyIncome / maxRent : 0
    return { result: safeRent, label: 'Max Affordable Rent', unit: '$/mo', steps: [{ label: 'Annual Income', value: `$${v.annualIncome.toFixed(0)}/year` }, { label: 'Monthly Income', value: `$${v.annualIncome.toFixed(0)} ÷ 12 = $${monthlyIncome.toFixed(0)}` }, { label: `Rent Budget (${v.rentRatio}%)`, value: `$${monthlyIncome.toFixed(0)} × ${v.rentRatio}% = $${maxRent.toFixed(0)}` }, { label: 'Subtract Monthly Debts', value: `$${maxRent.toFixed(0)} - $${v.monthlyDebts.toFixed(0)} = $${safeRent.toFixed(0)}` }, { label: 'Income-to-Rent Multiple', value: `${landlordMultiple.toFixed(0)}× (landlords want 3×)` }, { label: 'Back-End DTI', value: `${backEndRatio.toFixed(0)}% (target ≤36%)` }, { label: 'Monthly after rent + debts', value: `$${(monthlyIncome - safeRent - v.monthlyDebts).toFixed(0)} remaining` }] ,
    extras: [
      { label: 'Income-to-Rent Multiple', value: 'Landlord standard: monthly income must be 3× the rent. If rent is $1,500, need $4,500/month ($54K/year). Some landlords accept 2.5× ($3,750/month) with good credit or a guarantor. Luxury buildings may require 3.5-4×. This calculator checks the 3× requirement automatically.' },
      { label: 'Rent Ratio Comparison', value: '25% rule: conservative — leaves room for savings and irregular expenses. 30% rule: standard guideline from HUD — what most financial advisors recommend. 35-40%: common in high-cost cities but risky — leaves little for savings. 50%+: rent-burdened — 35% of US households fall in this category.' },
      { label: 'Debt Impact on Rent Budget', value: 'High debt payments significantly reduce affordable rent. With $60K/year ($5,000/mo) and 30% rule: max rent = $1,500. With $0 debt: full $1,500 available. With $500/mo debt: only $1,000 available — 33% less apartment. Snowballing debt before apartment hunting expands options.' },
      { label: 'Total Housing Cost Budget', value: 'This calculator covers rent only. Total housing budget = rent + utilities ($100-300) + renter\'s insurance ($15-30) + parking ($0-300) + pet fees ($25-100). A $1,200 rent often means $1,400-1,700 total monthly housing cost. Budget 35-40% of income for total housing, not just rent.' },
      { label: 'Salary Negotiation Targets', value: 'Use this calculator in reverse: decide what rent you want and calculate needed salary. For $1,800 rent at 30%: need $6,000/month ($72K/year). For $2,500 at 30%: $8,333/month ($100K/year). This helps set salary negotiation targets when relocating for work.' },
      { label: 'Roommate Affordability', value: 'With roommates: divide rent by number of people. Two people each earning $50K ($100K total): combined max rent at 30% = $2,500/month ($1,250 each). Three people ($150K combined): $3,750/month ($1,250 each). Roommates allow higher quality apartments at the same personal rent burden.' },
      { label: 'Rent Burden Statistics', value: 'HUD defines cost-burdened as spending >30% on housing, severely burdened as >50%. As of 2024: 35% of US households are cost-burdened. In NYC: 52%. In LA: 48%. In Miami: 55%. Rent-burdened households save 50-80% less for retirement and emergencies than those below the 30% threshold.' },
    ]}
  },
  description: 'Calculate maximum affordable monthly rent from annual income, current debt payments, and desired rent-to-income ratio. Includes landlord 3× income requirement check and back-end DTI analysis.',
  formula: 'MonthlyIncome = AnnualIncome ÷ 12. MaxRent = MonthlyIncome × (RentRatio% ÷ 100). AffordableRent = MaxRent - MonthlyDebts. BackEndDTI = (AffordableRent + MonthlyDebts) ÷ MonthlyIncome × 100. LandlordMultiple = MonthlyIncome ÷ MaxRent.',
  interpretation: 'With a $60,000 annual income ($5,000/month), $400 monthly debts, and the 30% rule: max rent is $1,500. After debts: $1,100/month is your safe rent. The 3× income test: $5,000 ÷ $1,500 = 3.33× — you pass. Back-end DTI: ($1,100 + $400) ÷ $5,000 = 30% — well under the 36% maximum. After rent and debts: $5,000 - $1,100 - $400 = $3,500 remaining for utilities, food, transport, savings, and discretionary spending. If you increase rent ratio to 35%: max rent = $1,750, after debts = $1,350, DTI = 35% — still acceptable but leaves only $3,250 for other expenses.'
}

export default calcDef
