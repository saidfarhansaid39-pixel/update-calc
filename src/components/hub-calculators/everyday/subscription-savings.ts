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
  compute: (v) => {
    const currentTotal = v.currentMonthly * v.months
    const proposeTotal = v.proposeMonthly * v.months + v.setupFee + v.cancelFee
    const savings = currentTotal - proposeTotal
    const savingsPct = (savings / currentTotal) * 100
    const breakEven = savings > 0 && (v.currentMonthly - v.proposeMonthly) > 0 ? Math.ceil((v.setupFee + v.cancelFee) / (v.currentMonthly - v.proposeMonthly)) : 0
    return { result: savings, label: 'Total Savings', unit: '$', steps: [{ label: 'Current Total', value: `$${currentTotal.toFixed(2)}` }, { label: 'Proposed Total', value: `$${proposeTotal.toFixed(2)}` }, { label: 'Savings', value: `$${savings.toFixed(2)} (${savingsPct.toFixed(1)}%)` }, { label: 'Break-Even', value: breakEven > 0 ? `${breakEven} months` : 'No break-even (costs more)' }] }
  },
  description: 'Compare subscription plans to see potential savings. Accounts for setup fees, cancellation fees, and break-even period.',
  formula: 'Savings = (Current×Months) - (Proposed×Months + Setup + CancelFee)',
  interpretation: 'Always calculate break-even period before switching. A $50 setup fee with $10/mo savings breaks even in 5 months. Bundling services can save 15-25%. Negotiate retention offers before cancelling current plan.'
}

export default calcDef
