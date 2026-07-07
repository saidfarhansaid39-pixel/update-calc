import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ currentTuition: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'), childAge: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0 && parseInt(v) <= 18, '0-18'), contractType: z.string().min(1), monthlyPayment: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'), yearsUntil: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0 && parseInt(v) <= 18, '0-18') }),
  fields: [{ name: 'currentTuition', label: 'Current Annual Tuition ($)', type: 'number', min: 0, step: '1000' }, { name: 'childAge', label: "Child's Current Age", type: 'number', min: 0, max: 18, step: '1' }, { name: 'yearsUntil', label: 'Years Until College', type: 'number', min: 0, max: 18, step: '1' }, { name: 'contractType', label: 'Contract Type', type: 'select', options: [{ label: 'Full Tuition (4 years)', value: 'full' }, { label: 'Partial (2 years)', value: 'partial' }, { label: 'Custom', value: 'custom' }] }, { name: 'monthlyPayment', label: 'Monthly Payment ($)', type: 'number', min: 0, step: '50' }],
  compute: (v) => { const ct = parseFloat(v.currentTuition) || 0; const y = parseInt(v.yearsUntil) || 1; const mp = parseFloat(v.monthlyPayment) || 0; const inflation = 0.05; const futureTuition = ct * Math.pow(1 + inflation, y) * (v.contractType === 'full' ? 4 : v.contractType === 'partial' ? 2 : 1); const totalPayments = mp * 12 * y; const remaining = Math.max(0, futureTuition - totalPayments); return { result: futureTuition, label: 'Projected Tuition Cost', unit: '$', steps: [{ label: 'Current Annual Tuition', value: `$${ct.toFixed(2)}` }, { label: 'Projected Total Cost', value: `$${futureTuition.toFixed(2)}` }, { label: 'Total Prepaid Payments', value: `$${totalPayments.toFixed(2)}` }, { label: 'Remaining (if any)', value: `$${remaining.toFixed(2)}` }] } },
  description: '529 prepaid tuition plans allow you to lock in current tuition rates for future college attendance, protecting against tuition inflation.',
  formula: 'Future Cost = Current Tuition × (1 + inflation)^years × (years of tuition)',
  interpretation: 'Prepaid tuition plans lock in today rates, protecting against tuition inflation. They are guaranteed by the state but typically only cover in-state public school tuition.'
}

export default calcDef
