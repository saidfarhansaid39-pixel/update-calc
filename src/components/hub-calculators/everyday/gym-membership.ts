import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ membershipFee: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), contractMonths: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), initiationFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), cancellationFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'membershipFee', label: 'Monthly Fee ($)', type: 'number', min: 1, step: '10' },
    { name: 'contractMonths', label: 'Contract Length (months)', type: 'number', min: 1, step: '1' },
    { name: 'initiationFee', label: 'Initiation Fee ($)', type: 'number', min: 0, step: '50' },
    { name: 'cancellationFee', label: 'Cancellation Fee ($)', type: 'number', min: 0, step: '25' },
  ],
  compute: (v) => {
    const totalPayments = v.membershipFee * v.contractMonths
    const totalCost = totalPayments + v.initiationFee
    const effectiveMonthly = totalCost / v.contractMonths
    const costWithCancel = totalCost + v.cancellationFee
    return { result: totalCost, label: 'Total Contract Cost', unit: '$', steps: [{ label: 'Monthly Payments', value: `$${v.membershipFee.toFixed(2)} × ${v.contractMonths} = $${totalPayments.toFixed(2)}` }, { label: 'Initiation Fee', value: `$${v.initiationFee.toFixed(2)}` }, { label: 'Total Cost', value: `$${totalCost.toFixed(2)}` }, { label: 'Effective Monthly', value: `$${effectiveMonthly.toFixed(2)}` }, { label: 'If You Cancel', value: `$${costWithCancel.toFixed(2)}` }] }
  },
  description: 'Evaluate total gym membership cost including monthly fees, initiation fees, and potential cancellation penalties.',
  formula: 'Total = (Monthly × Contract Months) + Initiation Fee | Effective Monthly = Total / Months',
  interpretation: 'Avoid long-term contracts if possible. Month-to-month costs more but offers flexibility. Cancel within the first 3 days for a full refund (right of rescission).'
}

export default calcDef
