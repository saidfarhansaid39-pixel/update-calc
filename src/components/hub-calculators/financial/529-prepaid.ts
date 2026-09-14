import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ currentTuition: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'), childAge: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0 && parseInt(v) <= 18, '0-18'), contractType: z.string().min(1), monthlyPayment: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'), yearsUntil: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0 && parseInt(v) <= 18, '0-18') }),
  fields: [{ name: 'currentTuition', label: 'Current Annual Tuition ($)', type: 'number', min: 0, step: '1000' }, { name: 'childAge', label: "Child's Current Age", type: 'number', min: 0, max: 18, step: '1' }, { name: 'yearsUntil', label: 'Years Until College', type: 'number', min: 0, max: 18, step: '1' }, { name: 'contractType', label: 'Contract Type', type: 'select', options: [{ label: 'Full Tuition (4 years)', value: 'full' }, { label: 'Partial (2 years)', value: 'partial' }, { label: 'Custom', value: 'custom' }] }, { name: 'monthlyPayment', label: 'Monthly Payment ($)', type: 'number', min: 0, step: '50' }],
  defaults: { currentTuition: '12000', childAge: '4', yearsUntil: '14', contractType: 'full', monthlyPayment: '300' },
  presets: [
    { label: 'Newborn Full Tuition', values: { currentTuition: '11000', childAge: '0', yearsUntil: '18', contractType: 'full', monthlyPayment: '250' } },
    { label: 'Partial Contract (2 yr)', values: { currentTuition: '14000', childAge: '6', yearsUntil: '12', contractType: 'partial', monthlyPayment: '150' } },
    { label: 'Lock-In Mid School', values: { currentTuition: '13000', childAge: '10', yearsUntil: '8', contractType: 'full', monthlyPayment: '400' } },
    { label: 'Custom Semester Plan', values: { currentTuition: '10000', childAge: '5', yearsUntil: '13', contractType: 'custom', monthlyPayment: '200' } },
    { label: 'Late Start Prepay', values: { currentTuition: '15000', childAge: '12', yearsUntil: '6', contractType: 'full', monthlyPayment: '600' } },
  ],
  compute: (v) => { const ct = parseFloat(v.currentTuition) || 0; const y = parseInt(v.yearsUntil) || 1; const mp = parseFloat(v.monthlyPayment) || 0; const inflation = 0.05; const futureTuition = ct * Math.pow(1 + inflation, y) * (v.contractType === 'full' ? 4 : v.contractType === 'partial' ? 2 : 1); const totalPayments = mp * 12 * y; const remaining = Math.max(0, futureTuition - totalPayments); return { result: futureTuition, label: 'Projected Tuition Cost', unit: '$', steps: [{ label: 'Current annual tuition rate', value: `$${ct.toFixed(2)}` }, { label: 'Projected total tuition at 5% inflation', value: `$${futureTuition.toFixed(2)}` }, { label: 'Total prepaid contributions over term', value: `$${totalPayments.toFixed(2)}` }, { label: 'Remaining tuition gap (if any)', value: `$${remaining.toFixed(2)}` }] ,
    extras: [
      { label: 'Strategy Note', value: 'Prepaid plans lock in current tuition rates, protecting against tuition inflation which historically runs 5–8% annually. Best for families sure child will attend an in-state public school.' },
      { label: 'Tax Consideration', value: 'Prepaid 529 plans offer tax-free growth and withdrawals for qualified expenses. Some states guarantee the contracts, but refunds may be limited to contributions (not the locked-in rate).' },
      { label: 'Risk Note', value: 'Prepaid plans typically cover only in-state public schools. Using funds for private/out-of-state schools may forfeit the rate guarantee. Changing beneficiaries is restricted.' },
      { label: 'Comparison', value: 'Vs. 529 savings plan: prepaid locks in rates but is less flexible. Vs. savings account: prepaid offers tuition inflation protection that cash cannot match.' },
      { label: 'Real-World Example', value: 'Locking in today\'s $12k/yr tuition ($48k total) vs. projected $115k in 18 years at 5% inflation. Prepaid saves $67k in future tuition costs.' },
    ]} },
  description: '529 prepaid tuition plans allow you to lock in current tuition rates for future college attendance, protecting against tuition inflation.',
  formula: 'Future Cost = Current Tuition × (1 + inflation)^years × (years of tuition)',
  interpretation: 'Prepaid tuition plans lock in today rates, protecting against tuition inflation. They are guaranteed by the state but typically only cover in-state public school tuition.'
}

export default calcDef
