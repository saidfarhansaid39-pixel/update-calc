import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ loanAmount: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'), initialRate: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 30, '0-30'), gradRate: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 20, '0-20'), gradPeriod: z.string().min(1, 'Required').refine(v => parseInt(v) > 0 && parseInt(v) <= 10, '1-10'), term: z.string().min(1, 'Required').refine(v => parseInt(v) > 0 && parseInt(v) <= 40, '1-40') }),
  fields: [{ name: 'loanAmount', label: 'Loan Amount ($)', type: 'number', min: 0, step: '1000' }, { name: 'initialRate', label: 'Initial Interest Rate (%)', type: 'number', min: 0, max: 30, step: '0.01' }, { name: 'gradRate', label: 'Annual Payment Increase (%)', type: 'number', min: 0, max: 20, step: '0.5' }, { name: 'gradPeriod', label: 'Graduation Period (years)', type: 'number', min: 1, max: 10, step: '1' }, { name: 'term', label: 'Total Loan Term (years)', type: 'number', min: 1, max: 40, step: '1' }],
  defaults: { loanAmount: '300000', initialRate: '4', gradRate: '5', gradPeriod: '5', term: '30' },
  presets: [
    { label: 'New Grad Starter', values: { loanAmount: '250000', initialRate: '4.5', gradRate: '5', gradPeriod: '5', term: '30' } },
    { label: 'Doctor\'s Mortgage', values: { loanAmount: '500000', initialRate: '4', gradRate: '7', gradPeriod: '7', term: '30' } },
    { label: 'Short Grad (3 yr)', values: { loanAmount: '200000', initialRate: '5', gradRate: '3', gradPeriod: '3', term: '25' } },
    { label: 'Low Start High Growth', values: { initialRate: '3.5', gradRate: '10', gradPeriod: '5', term: '30', loanAmount: '400000' } },
    { label: 'Conservative Grad', values: { loanAmount: '350000', initialRate: '5.5', gradRate: '2', gradPeriod: '10', term: '30' } },
  ],
  compute: (v) => { const p = parseFloat(v.loanAmount) || 0; const r = parseFloat(v.initialRate) || 0; const gr = parseFloat(v.gradRate) / 100 || 0; const gp = parseInt(v.gradPeriod) || 1; const t = parseInt(v.term) || 1; const mr = r / 100 / 12; const np = t * 12; if (mr <= 0 || np <= 0) return { result: p / np, label: 'Initial Monthly Payment', unit: '$', steps: [{ label: 'Flat monthly payment (no interest)', value: `$${(p / np).toFixed(2)}` }] ,
    extras: [
      { label: 'Strategy Note', value: 'Graduated payment mortgages start with lower payments that increase annually. Best for borrowers expecting steady income growth. Total interest is higher than a standard fixed-rate mortgage.' },
      { label: 'Tax Consideration', value: 'Mortgage interest is deductible up to $750k loan balance (2025–2026 TCJA limits). Early years have higher interest deductions due to slower principal amortization.' },
      { label: 'Risk Note', value: 'Negative amortization can occur in early years — your loan balance may increase before it decreases. Payment shock at the end of the graduation period can be severe.' },
      { label: 'Comparison', value: 'Vs. fixed-rate mortgage: lower initial payments but higher lifetime cost. Vs. ARM: graduates are predictable (fixed schedule) vs. ARMs which vary with market rates.' },
      { label: 'Real-World Example', value: 'A $300k loan at 4% with 5% annual increases over 5 years starts at $1,432/mo and graduates to $1,827/mo by year 6. Over 30 years: ~$260k in interest vs $215k fixed.' },
    ]}; const f = Math.pow(1 + mr, np); const basePmt = p * (mr * f) / (f - 1); const annualStep = 1 + gr; const pmt1 = basePmt; const pmt2 = basePmt * Math.pow(annualStep, Math.min(gp, t) - 1); const avgPmt = (pmt1 + pmt2) / 2; return { result: pmt1, label: 'Initial Monthly Payment', unit: '$', steps: [{ label: 'Initial monthly payment (year 1)', value: `$${pmt1.toFixed(2)}` }, { label: 'Final graduated payment at end of ramp', value: `$${pmt2.toFixed(2)}` }, { label: 'Average monthly payment during graduation', value: `$${avgPmt.toFixed(2)}` }] } },
  description: 'A graduated payment mortgage starts with lower initial payments that increase over time, designed for borrowers expecting rising future income.',
  formula: 'Initial: M = P × (r(1+r)^n) / ((1+r)^n - 1) | Payments increase by fixed % each year during graduation period',
  interpretation: 'Graduated payments allow lower initial payments but total interest cost is typically higher than a standard fixed-rate mortgage due to negative amortization in early years.'
}

export default calcDef
