import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ unitSize: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), monthlyRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), months: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), insurance: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), adminFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), climateControl: z.string().min(1) }),
  fields: [
    { name: 'unitSize', label: 'Unit Size (sq ft)', type: 'number', min: 25, step: '25' },
    { name: 'monthlyRate', label: 'Monthly Rent ($)', type: 'number', min: 20, step: '10' },
    { name: 'months', label: 'Months Rented', type: 'number', min: 1, step: '1' },
    { name: 'insurance', label: 'Monthly Insurance ($)', type: 'number', min: 0, step: '5' },
    { name: 'adminFee', label: 'One-Time Admin Fee ($)', type: 'number', min: 0, step: '10' },
    { name: 'climateControl', label: 'Climate Control?', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
  ],
  compute: (v) => {
    const climateSurcharge = v.climateControl === 'yes' ? v.monthlyRate * 0.3 : 0
    const totalMonthly = v.monthlyRate + climateSurcharge + v.insurance
    const totalCost = totalMonthly * v.months + v.adminFee
    const perSqFt = totalMonthly / v.unitSize
    return { result: totalCost, label: 'Total Storage Cost', unit: '$', steps: [{ label: 'Base Rent', value: `$${v.monthlyRate.toFixed(2)}/mo` }, { label: 'Climate Control', value: `+$${climateSurcharge.toFixed(2)}/mo` }, { label: 'Insurance', value: `+$${v.insurance.toFixed(2)}/mo` }, { label: 'Total Monthly', value: `$${totalMonthly.toFixed(2)}/mo` }, { label: 'Total for Period', value: `$${totalCost.toFixed(2)}` }, { label: 'Cost per Sq Ft', value: `$${perSqFt.toFixed(2)}/sq ft/mo` }] }
  },
  description: 'Calculate total storage unit costs including rent, climate control, insurance, and admin fees over your rental period.',
  formula: 'Total = (Rent + ClimateSurcharge + Insurance) × Months + AdminFee',
  interpretation: 'Average US storage rate: $1-2/sq ft/month. Climate control adds 20-40%. Insurance: $10-15/mo through facility or your renters policy. First month often $1 promotions but read the fine print on rate increases.'
}

export default calcDef
