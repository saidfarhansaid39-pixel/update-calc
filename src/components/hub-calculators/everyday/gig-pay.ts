import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hoursWorked: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hourlyRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), expenses: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), taxRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'hoursWorked', label: 'Hours Worked', type: 'number', min: 1, step: '1' },
    { name: 'hourlyRate', label: 'Hourly Rate ($)', type: 'number', min: 1, step: '5' },
    { name: 'expenses', label: 'Business Expenses ($)', type: 'number', min: 0, step: '10' },
    { name: 'taxRate', label: 'Self-Employment Tax (%)', type: 'number', min: 0, max: 50, step: '1' },
  ],
  compute: (v) => { const h = parseFloat(v.hoursWorked)||0; const r = parseFloat(v.hourlyRate)||0; const e = parseFloat(v.expenses)||0; const tr = parseFloat(v.taxRate)||0; const gross = h * r; const netBeforeTax = gross - e; const tax = netBeforeTax * (tr / 100); const net = netBeforeTax - tax; const effectiveHourly = net / h; return { result: net, label: 'Net Pay', unit: '$', steps: [{ label: 'Gross Pay', value: `$${gross.toFixed(2)}` }, { label: 'Expenses', value: `-$${e.toFixed(2)}` }, { label: 'Taxes', value: `-$${tax.toFixed(2)}` }, { label: 'Net Pay', value: `$${net.toFixed(2)}` }, { label: 'Effective Hourly', value: `$${effectiveHourly.toFixed(2)}/hr` }] } },
  description: 'Calculate net gig economy pay after expenses and self-employment taxes. Enter hours, rate, expenses, and estimated tax rate.',
  formula: 'Net = (Hours × Rate) − Expenses − Taxes | Effective Hourly = Net ÷ Hours',
  interpretation: 'Self-employment tax is ~15.3% (Social Security + Medicare). Deduct legitimate business expenses to lower taxable income. Set aside 25-30% for taxes.'
}

export default calcDef
