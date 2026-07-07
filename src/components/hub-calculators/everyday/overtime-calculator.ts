import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hourlyRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), regularHours: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), overtimeHours: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), otMultiplier: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'hourlyRate', label: 'Hourly Rate ($)', type: 'number', min: 0, step: '5' },
    { name: 'regularHours', label: 'Regular Hours', type: 'number', min: 0, step: '8' },
    { name: 'overtimeHours', label: 'Overtime Hours', type: 'number', min: 0, step: '2' },
    { name: 'otMultiplier', label: 'Overtime Multiplier (e.g., 1.5)', type: 'number', min: 1, step: '0.5' },
  ],
  compute: (v) => { const regularPay = v.hourlyRate * v.regularHours; const otRate = v.hourlyRate * v.otMultiplier; const otPay = otRate * v.overtimeHours; const totalPay = regularPay + otPay; const totalHours = v.regularHours + v.overtimeHours; const effectiveRate = totalPay / totalHours; return { result: totalPay, label: 'Total Pay (Regular + OT)', unit: '$', steps: [{ label: 'Regular Pay', value: `${v.regularHours}hrs × $${v.hourlyRate} = $${regularPay.toFixed(2)}` }, { label: 'OT Rate', value: `$${v.hourlyRate} × ${v.otMultiplier} = $${otRate.toFixed(2)}` }, { label: 'Overtime Pay', value: `${v.overtimeHours}hrs × $${otRate.toFixed(2)} = $${otPay.toFixed(2)}` }, { label: 'Total Pay', value: `$${totalPay.toFixed(2)}` }, { label: 'Effective Hourly Rate', value: `$${effectiveRate.toFixed(2)}` }] } },
  description: 'Calculate overtime pay based on hourly rate, regular hours, overtime hours, and overtime multiplier (standard: 1.5x for US FLSA).',
  formula: 'Total = (Rate × Regular Hrs) + (Rate × OT Multiplier × OT Hrs)',
  interpretation: 'US FLSA requires 1.5× pay for hours over 40/week. Some states have daily overtime. Effective rate allows comparison with other jobs. Consider that overtime is taxed at marginal rate.'
}

export default calcDef
