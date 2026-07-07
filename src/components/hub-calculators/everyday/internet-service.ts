import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ monthlyFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), setupFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), equipmentFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), contractMonths: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'monthlyFee', label: 'Monthly Fee ($)', type: 'number', min: 0, step: '10' },
    { name: 'setupFee', label: 'Setup/Installation Fee ($)', type: 'number', min: 0, step: '25' },
    { name: 'equipmentFee', label: 'Monthly Equipment Fee ($)', type: 'number', min: 0, step: '5' },
    { name: 'contractMonths', label: 'Contract Length (months)', type: 'number', min: 0, step: '6' },
  ],
  compute: (v) => { const totalMonthly = v.monthlyFee + v.equipmentFee; const contractTotal = totalMonthly * v.contractMonths + v.setupFee; const annual = totalMonthly * 12 + v.setupFee; const avgMonthly = v.contractMonths > 0 ? contractTotal / v.contractMonths : totalMonthly; return { result: contractTotal, label: 'Total Contract Cost', unit: '$', steps: [{ label: 'Monthly (inc. equipment)', value: `$${totalMonthly.toFixed(2)}` }, { label: 'Annual Cost', value: `$${annual.toFixed(2)}` }, { label: 'Contract Total', value: `$${contractTotal.toFixed(2)} (${v.contractMonths} mo)` }, { label: 'Effective Monthly Avg', value: `$${avgMonthly.toFixed(2)}` }] } },
  description: 'Calculate the true cost of an internet service plan including monthly fees, equipment, setup, and contract commitments.',
  formula: 'Total = (Monthly Fee + Equipment) × Contract Months + Setup Fee',
  interpretation: 'Promotional rates often expire after 12 months. Factor in price increases. Equipment fees ($10-15/mo) can be avoided with your own modem/router.'
}

export default calcDef
