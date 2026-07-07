import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ monthlyPlan: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), lines: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), devicePayment: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), insurance: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'monthlyPlan', label: 'Plan Cost per Line ($)', type: 'number', min: 10, step: '10' },
    { name: 'lines', label: 'Number of Lines', type: 'number', min: 1, step: '1' },
    { name: 'devicePayment', label: 'Device Payment per Line ($)', type: 'number', min: 0, step: '10' },
    { name: 'insurance', label: 'Insurance per Line ($)', type: 'number', min: 0, step: '5' },
  ],
  compute: (v) => {
    const planTotal = v.monthlyPlan * v.lines
    const deviceTotal = v.devicePayment * v.lines
    const insuranceTotal = v.insurance * v.lines
    const monthlyTotal = planTotal + deviceTotal + insuranceTotal
    const annualTotal = monthlyTotal * 12
    return { result: monthlyTotal, label: 'Monthly Phone Bill', unit: '$', steps: [{ label: 'Plan Charges', value: `$${planTotal.toFixed(2)}` }, { label: 'Device Payments', value: `+$${deviceTotal.toFixed(2)}` }, { label: 'Insurance', value: `+$${insuranceTotal.toFixed(2)}` }, { label: 'Monthly Total', value: `$${monthlyTotal.toFixed(2)}` }, { label: 'Annual Total', value: `$${annualTotal.toFixed(2)}` }] }
  },
  description: 'Calculate total monthly cell phone bill including plan costs, device payments, and insurance for multiple lines.',
  formula: 'Total = (Plan + Device + Insurance) × Lines',
  interpretation: 'Family plans typically save $10-20 per line vs individual plans. Device payments add $20-45/line/month. Insurance costs $7-17/line/month. Consider MVNOs (Mint, Visible) for lower rates.'
}

export default calcDef
