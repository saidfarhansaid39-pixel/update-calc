import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ salePrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), commissionRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), baseSalary: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'salePrice', label: 'Sale Price ($)', type: 'number', min: 1, step: '100' },
    { name: 'commissionRate', label: 'Commission Rate (%)', type: 'number', min: 0.1, step: '0.5' },
    { name: 'baseSalary', label: 'Base Salary ($/mo)', type: 'number', min: 0, step: '500' },
  ],
  compute: (v) => {
    const commission = v.salePrice * (v.commissionRate / 100)
    const totalEarnings = commission + v.baseSalary
    return { result: commission, label: 'Commission Earned', unit: '$', steps: [{ label: 'Commission', value: `$${commission.toFixed(2)}` }, { label: 'Plus Base', value: `$${v.baseSalary.toFixed(2)}` }, { label: 'Total Earnings', value: `$${totalEarnings.toFixed(2)}` }] }
  },
  description: 'Calculate commission earnings from a sale or deal. Enter the sale price, commission rate, and any base salary to see total compensation.',
  formula: 'Commission = Sale × Rate% | Total = Commission + Base Salary',
  interpretation: 'Common commission rates: real estate 5-6% (split with broker), car sales 20-30% of gross profit, retail 2-10%. Some plans use tiered rates or accelerators for exceeding quota.'
}

export default calcDef
