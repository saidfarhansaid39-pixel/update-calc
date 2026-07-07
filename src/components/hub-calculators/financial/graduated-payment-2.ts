import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ loanAmount: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'), initialRate: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 30, '0-30'), gradRate: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 20, '0-20'), gradPeriod: z.string().min(1, 'Required').refine(v => parseInt(v) > 0 && parseInt(v) <= 10, '1-10'), term: z.string().min(1, 'Required').refine(v => parseInt(v) > 0 && parseInt(v) <= 40, '1-40') }),
  fields: [{ name: 'loanAmount', label: 'Loan Amount ($)', type: 'number', min: 0, step: '1000' }, { name: 'initialRate', label: 'Initial Interest Rate (%)', type: 'number', min: 0, max: 30, step: '0.01' }, { name: 'gradRate', label: 'Annual Payment Increase (%)', type: 'number', min: 0, max: 20, step: '0.5' }, { name: 'gradPeriod', label: 'Graduation Period (years)', type: 'number', min: 1, max: 10, step: '1' }, { name: 'term', label: 'Total Loan Term (years)', type: 'number', min: 1, max: 40, step: '1' }],
  compute: (v) => { const p = parseFloat(v.loanAmount) || 0; const r = parseFloat(v.initialRate) || 0; const gr = parseFloat(v.gradRate) / 100 || 0; const gp = parseInt(v.gradPeriod) || 1; const t = parseInt(v.term) || 1; const mr = r / 100 / 12; const np = t * 12; if (mr <= 0 || np <= 0) return { result: p / np, label: 'Initial Monthly Payment', unit: '$', steps: [] }; const f = Math.pow(1 + mr, np); const basePmt = p * (mr * f) / (f - 1); const annualStep = 1 + gr; const pmt1 = basePmt; const pmt2 = basePmt * Math.pow(annualStep, Math.min(gp, t) - 1); const avgPmt = (pmt1 + pmt2) / 2; return { result: pmt1, label: 'Initial Monthly Payment', unit: '$', steps: [{ label: 'Initial Payment', value: `$${pmt1.toFixed(2)}` }, { label: 'Final Graduated Payment', value: `$${pmt2.toFixed(2)}` }, { label: 'Average Payment', value: `$${avgPmt.toFixed(2)}` }] } },
  description: 'A graduated payment mortgage starts with lower initial payments that increase over time, designed for borrowers expecting rising future income.',
  formula: 'Initial: M = P × (r(1+r)^n) / ((1+r)^n - 1) | Payments increase by fixed % each year during graduation period',
  interpretation: 'Graduated payments allow lower initial payments but total interest cost is typically higher than a standard fixed-rate mortgage due to negative amortization in early years.'
}

export default calcDef
