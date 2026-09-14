import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ currentMonthly: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), proposeMonthly: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), months: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), setupFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), cancelFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'currentMonthly', label: 'Current Monthly Cost ($)', type: 'number', min: 1, step: '10' },
    { name: 'proposeMonthly', label: 'Proposed Monthly Cost ($)', type: 'number', min: 1, step: '5' },
    { name: 'months', label: 'Months to Compare', type: 'number', min: 1, step: '6' },
    { name: 'setupFee', label: 'Setup/Activation Fee ($)', type: 'number', min: 0, step: '10' },
    { name: 'cancelFee', label: 'Cancellation Fee ($)', type: 'number', min: 0, step: '10' },
  ],
  defaults: { currentMonthly: '80', proposeMonthly: '50', months: '12', setupFee: '0', cancelFee: '0' },
  presets: [
    { label: 'Gym Membership Switch', values: { currentMonthly: '80', proposeMonthly: '40', months: '12', setupFee: '0', cancelFee: '0' } },
    { label: 'Phone Carrier Switch', values: { currentMonthly: '90', proposeMonthly: '65', months: '24', setupFee: '35', cancelFee: '0' } },
    { label: 'Insurance Bundle', values: { currentMonthly: '200', proposeMonthly: '160', months: '12', setupFee: '0', cancelFee: '50' } },
    { label: 'Software Plan Upgrade', values: { currentMonthly: '30', proposeMonthly: '50', months: '6', setupFee: '0', cancelFee: '0' } },
  ],
  compute: (v) => {
    const currentTotal = v.currentMonthly * v.months
    const proposeTotal = v.proposeMonthly * v.months + v.setupFee + v.cancelFee
    const savings = currentTotal - proposeTotal
    const savingsPct = (savings / currentTotal) * 100
    const breakEven = savings > 0 && (v.currentMonthly - v.proposeMonthly) > 0 ? Math.ceil((v.setupFee + v.cancelFee) / (v.currentMonthly - v.proposeMonthly)) : 0
    return { result: savings, label: 'Total Savings', unit: '$', steps: [{ label: 'Current Total', value: `$${currentTotal.toFixed(2)}` }, { label: 'Proposed Total', value: `$${proposeTotal.toFixed(2)}` }, { label: 'Savings', value: `$${savings.toFixed(2)} (${savingsPct.toFixed(1)}%)` }, { label: 'Break-Even', value: breakEven > 0 ? `${breakEven} months` : 'No break-even (costs more)' }] ,
    extras: [
      { label: 'Break-Even Rule', value: `Break-even = (SetupFee + CancelFee) ÷ (Current - Proposed). A $50 fee with $10/mo savings = 5-month break-even` },
      { label: 'Retention Offers', value: 'Before cancelling, ask your current provider for retention offers — many will match or beat competitor pricing to keep you' },
      { label: 'Bundling Savings', value: 'Bundling internet, phone, and TV typically saves 15-25% vs separate plans. Insurance multi-policy discounts: 10-20%' },
      { label: 'Annual vs Monthly', value: 'Annual billing saves 10-20% on most subscription plans. Use this calculator to compare the effective monthly cost' },
      { label: 'Hidden Fee Check', value: 'Watch for activation fees ($20-50), early termination fees ($100-400), equipment rental, and auto-renewal price hikes' },
      { label: 'Three-Year View', value: 'Extend your comparison to 24-36 months for services with intro pricing that increases after the first year' },
      { label: 'Credit Card Benefits', value: 'Check if your credit card offers subscription credits or cell phone insurance that can offset costs' },
    ]}
  },
  description: 'Compare current and proposed subscription plans to calculate total savings, savings percentage, and break-even period including setup and cancellation fees.',
  formula: 'Savings = (CurrentMonthly × Months) − (ProposedMonthly × Months + SetupFee + CancelFee). BreakEvenMonths = Ceil((SetupFee + CancelFee) ÷ (CurrentMonthly − ProposedMonthly)).',
  interpretation: 'Always calculate break-even period before switching — it tells you when the switch becomes profitable. A $50 activation fee with $10/mo savings breaks even in 5 months. If break-even exceeds your expected time with the service, the switch may not be worth it. Bundle discounts of 15-25% make multi-service packages appealing, but compare total cost including fees. US average: households spend $200-300/mo on subscriptions — regular audits can save $30-50/mo.'
}

export default calcDef
