import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ monthlyIncome: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mortgage: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), carLoan: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), studentLoan: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), creditCard: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), otherDebt: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'monthlyIncome', label: 'Gross Monthly Income ($)', type: 'number', min: 500, step: '500' },
    { name: 'mortgage', label: 'Mortgage/Rent ($/mo)', type: 'number', min: 0, step: '100' },
    { name: 'carLoan', label: 'Car Loan ($/mo)', type: 'number', min: 0, step: '50' },
    { name: 'studentLoan', label: 'Student Loans ($/mo)', type: 'number', min: 0, step: '50' },
    { name: 'creditCard', label: 'Credit Card Payments ($/mo)', type: 'number', min: 0, step: '25' },
    { name: 'otherDebt', label: 'Other Debt ($/mo)', type: 'number', min: 0, step: '25' },
  ],
  compute: (v) => {
    const totalDebt = v.mortgage + v.carLoan + v.studentLoan + v.creditCard + v.otherDebt
    const dti = (totalDebt / v.monthlyIncome) * 100
    const frontEnd = (v.mortgage / v.monthlyIncome) * 100
    return { result: dti, label: 'DTI Ratio', unit: '%', steps: [{ label: 'Total Monthly Debt', value: `$${totalDebt.toFixed(0)}` }, { label: 'Monthly Income', value: `$${v.monthlyIncome.toFixed(0)}` }, { label: 'Front-End Ratio (Housing)', value: `${frontEnd.toFixed(1)}%` }, { label: 'Back-End Ratio (Total)', value: `${dti.toFixed(1)}%` }] }
  },
  description: 'Calculate your debt-to-income ratio for mortgage applications and financial health assessment. Includes front-end and back-end DTI calculations.',
  formula: 'DTI = Total Monthly Debt / Gross Monthly Income × 100%',
  interpretation: 'Lenders prefer DTI ≤43% for qualified mortgages. Front-end (housing) ratio should be ≤28%. DTI >50% is considered over-leveraged and may indicate financial stress. Paying down high-interest credit cards is the fastest way to lower DTI.'
}

export default calcDef
