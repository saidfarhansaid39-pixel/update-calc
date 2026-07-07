import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ afterTaxIncome: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'), needsPct: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 100, '0-100'), wantsPct: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 100, '0-100'), savingsPct: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 100, '0-100') }),
  fields: [{ name: 'afterTaxIncome', label: 'After-Tax Monthly Income ($)', type: 'number', min: 0, step: '100' }, { name: 'needsPct', label: 'Needs (%)', type: 'number', min: 0, max: 100, step: '1' }, { name: 'wantsPct', label: 'Wants (%)', type: 'number', min: 0, max: 100, step: '1' }, { name: 'savingsPct', label: 'Savings/Debt (%)', type: 'number', min: 0, max: 100, step: '1' }],
  compute: (v) => { const inc = parseFloat(v.afterTaxIncome) || 0; const np = parseFloat(v.needsPct) || 50; const wp = parseFloat(v.wantsPct) || 30; const sp = parseFloat(v.savingsPct) || 20; const needs = inc * (np / 100); const wants = inc * (wp / 100); const savings = inc * (sp / 100); const total = needs + wants + savings; const balance = inc - total; const isIdeal = Math.abs(np - 50) <= 5 && Math.abs(wp - 30) <= 5 && Math.abs(sp - 20) <= 5; return { result: needs, label: 'Needs Budget', unit: '$', steps: [{ label: 'Needs (50%)', value: `$${needs.toFixed(2)}` }, { label: 'Wants (30%)', value: `$${wants.toFixed(2)}` }, { label: 'Savings (20%)', value: `$${savings.toFixed(2)}` }, { label: 'Balance', value: `$${balance.toFixed(2)}` }, { label: 'Status', value: isIdeal ? 'Following 50/30/20!' : 'Adjust percentages' }] } },
  description: 'The 50/30/20 budget rule allocates after-tax income to three categories: 50% for needs, 30% for wants, and 20% for savings and debt repayment.',
  formula: 'Needs = Income × 50% | Wants = Income × 30% | Savings = Income × 20%',
  interpretation: 'The 50/30/20 rule is a simple budgeting framework. Needs include housing, utilities, groceries, and minimum debt payments. Wants are discretionary. Savings includes retirement and emergency fund.'
}

export default calcDef
