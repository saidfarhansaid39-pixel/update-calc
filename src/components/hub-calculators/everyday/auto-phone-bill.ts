import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ apbPlanCost: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), apbLines: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), apbPhonePayment: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), apbDataUsed: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), apbInsuranceMonthly: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), apbStreamingAddOns: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'apbPlanCost', label: 'Base Plan Cost per Line ($)', type: 'number', min: 10, step: '10' },
    { name: 'apbLines', label: 'Number of Lines', type: 'number', min: 1, step: '1' },
    { name: 'apbPhonePayment', label: 'Phone Payment per Line ($)', type: 'number', min: 0, step: '10' },
    { name: 'apbDataUsed', label: 'Data Used (GB/mo)', type: 'number', min: 0, step: '5' },
    { name: 'apbInsuranceMonthly', label: 'Insurance per Line ($)', type: 'number', min: 0, step: '5' },
    { name: 'apbStreamingAddOns', label: 'Streaming/Add-Ons Total ($)', type: 'number', min: 0, step: '5' },
  ],
  compute: (v) => {
    const lineCharges = v.apbPlanCost * v.apbLines
    const phonePayments = v.apbPhonePayment * v.apbLines
    const insurance = v.apbInsuranceMonthly * v.apbLines
    const dataOverage = Math.max(0, v.apbDataUsed - 50) * 10
    const taxesFees = (lineCharges + phonePayments + insurance) * 0.12
    const subtotal = lineCharges + phonePayments + insurance + dataOverage + v.apbStreamingAddOns
    const total = subtotal + taxesFees
    const perLine = total / v.apbLines
    const annualTotal = total * 12
    return { result: total, label: 'Total Monthly Phone Bill', unit: '$', steps: [{ label: 'Plan Charges', value: `${v.apbLines} × $${v.apbPlanCost} = $${lineCharges.toFixed(2)}` }, { label: 'Phone Payments', value: `${v.apbLines} × $${v.apbPhonePayment} = $${phonePayments.toFixed(2)}` }, { label: 'Insurance', value: `$${insurance.toFixed(2)}` }, { label: 'Data Overage', value: `$${dataOverage.toFixed(2)}` }, { label: 'Add-Ons', value: `$${v.apbStreamingAddOns.toFixed(2)}` }, { label: 'Taxes & Fees (12%)', value: `$${taxesFees.toFixed(2)}` }, { label: 'Total Bill', value: `$${total.toFixed(2)}` }, { label: 'Per Line', value: `$${perLine.toFixed(2)}` }] }
  },
  description: 'Calculate your total monthly phone bill including plan costs, device payments, insurance, data overages, streaming add-ons, and taxes.',
  formula: 'Total = (Plan × Lines + Phone × Lines + Insurance × Lines + Overage + Add-Ons) × 1.12',
  interpretation: 'Average US phone bill: $114/month per line. Taxes and fees add 12-25%. Buying phones outright saves $10-20/month vs financing. Unlimited data plans often throttle after 50GB. MVNOs (Mint, Visible) cost $15-30/month for similar service.'
}

export default calcDef
