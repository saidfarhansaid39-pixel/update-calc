import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalLoan: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'), numProperties: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, '>0'), avgRate: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 30, '0-30'), term: z.string().min(1, 'Required').refine(v => parseInt(v) > 0 && parseInt(v) <= 40, '1-40') }),
  fields: [{ name: 'totalLoan', label: 'Total Loan Amount ($)', type: 'number', min: 0, step: '1000' }, { name: 'numProperties', label: 'Number of Properties', type: 'number', min: 1, step: '1' }, { name: 'avgRate', label: 'Average Interest Rate (%)', type: 'number', min: 0, max: 30, step: '0.01' }, { name: 'term', label: 'Loan Term (years)', type: 'number', min: 1, max: 40, step: '1' }],
  defaults: { totalLoan: '500000', numProperties: '3', avgRate: '6.5', term: '25' },
  presets: [
    { label: '3-Property Rental Portfolio', values: { totalLoan: '450000', numProperties: '3', avgRate: '6.75', term: '30' } },
    { label: '5-Unit Small Multifamily', values: { totalLoan: '1200000', numProperties: '5', avgRate: '6.25', term: '25' } },
    { label: 'Fix-and-Flip Portfolio', values: { totalLoan: '300000', numProperties: '2', avgRate: '8.5', term: '15' } },
    { label: '10-Property Commercial', values: { totalLoan: '3500000', numProperties: '10', avgRate: '5.5', term: '20' } },
    { label: 'Duplex Starter', values: { totalLoan: '200000', numProperties: '2', avgRate: '7', term: '30' } },
  ],
  compute: (v) => { const loan = parseFloat(v.totalLoan) || 0; const props = parseInt(v.numProperties) || 1; const r = parseFloat(v.avgRate) || 0; const t = parseInt(v.term) || 1; const mr = r / 100 / 12; const np = t * 12; let mp = 0; if (mr > 0 && np > 0) { const f = Math.pow(1 + mr, np); mp = loan * (mr * f) / (f - 1) } else if (np > 0) mp = loan / np; const total = mp * np; return { result: mp, label: 'Monthly Payment', unit: '$', steps: [{ label: 'Total blanket loan amount', value: `$${loan.toFixed(2)}` }, { label: 'Number of properties covered', value: `${props}` }, { label: 'Monthly payment for blanket loan', value: `$${mp.toFixed(2)}` }, { label: 'Per-property monthly cost', value: `$${(mp / props).toFixed(2)}` }, { label: 'Total cost over full loan term', value: `$${total.toFixed(2)}` }] ,
    extras: [
      { label: 'Strategy Note', value: 'Blanket loans simplify portfolio management with one payment but often have slightly higher rates than individual mortgages. Use a release clause to sell properties individually.' },
      { label: 'Tax Consideration', value: 'Interest on blanket loans is tax-deductible as investment property expense. Each property\'s share of interest is deductible against its rental income.' },
      { label: 'Risk Note', value: 'Default on one property jeopardizes the entire portfolio. Cross-collateralization means the lender can foreclose on all properties if the loan defaults.' },
      { label: 'Comparison', value: 'Vs. individual mortgages: fewer closing costs but less flexibility. Vs. portfolio loan: similar concept but blanket loans are typically for smaller portfolios.' },
      { label: 'Real-World Example', value: 'A $500k blanket loan at 6.5% over 25 years on 3 properties costs $3,376/mo total, or $1,125/property. Each rental needs $1,400/mo to cash flow.' },
    ]} },
  description: 'A blanket loan is a single mortgage that covers multiple properties. Real estate investors use blanket loans to finance portfolios with one loan rather than separate mortgages.',
  formula: 'M = P × (r(1+r)^n) / ((1+r)^n - 1) applied to the blanket loan covering all properties',
  interpretation: 'Blanket loans simplify portfolio financing with one payment. The per-property cost can be calculated by dividing total payment by the number of properties.'
}

export default calcDef
