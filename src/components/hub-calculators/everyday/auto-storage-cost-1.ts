import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ asc2UnitSize: z.string().min(1), asc2Months: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), asc2Climate: z.string().min(1), asc2Insurance: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), asc2Access: z.string().min(1), asc2Vehicle: z.string().min(1) }),
  fields: [
    { name: 'asc2UnitSize', label: 'Unit Size', type: 'select', options: [{ label: 'Small (5x5)', value: '5x5' }, { label: 'Medium (5x10)', value: '5x10' }, { label: 'Large (10x10)', value: '10x10' }, { label: 'XL (10x15)', value: '10x15' }, { label: 'Jumbo (10x20)', value: '10x20' }, { label: 'Vehicle (10x20)', value: 'vehicle' }] },
    { name: 'asc2Months', label: 'Months of Storage', type: 'number', min: 1, step: '1' },
    { name: 'asc2Climate', label: 'Climate Controlled', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
    { name: 'asc2Insurance', label: 'Monthly Insurance ($)', type: 'number', min: 0, step: '5' },
    { name: 'asc2Access', label: '24/7 Access', type: 'select', options: [{ label: 'Yes (+$15)', value: 'yes' }, { label: 'No', value: 'no' }] },
    { name: 'asc2Vehicle', label: 'Vehicle Storage', type: 'select', options: [{ label: 'None', value: 'none' }, { label: 'Car ($75/mo)', value: 'car' }, { label: 'RV/Boat ($150/mo)', value: 'rv' }] },
  ],
  compute: (v) => {
    const baseRates: Record<string, number> = { '5x5': 45, '5x10': 65, '10x10': 95, '10x15': 130, '10x20': 170, vehicle: 120 }
    const base = baseRates[v.asc2UnitSize] || 95
    const climateFactor = v.asc2Climate === 'yes' ? 1.25 : 1
    const accessFee = v.asc2Access === 'yes' ? 15 : 0
    const vehicleCosts: Record<string, number> = { none: 0, car: 75, rv: 150 }
    const vehicleFee = vehicleCosts[v.asc2Vehicle] || 0
    const monthly = base * climateFactor + v.asc2Insurance + accessFee + vehicleFee
    const adminFee = 30
    const firstMonth = monthly + adminFee
    const total = firstMonth + monthly * (v.asc2Months - 1)
    const avgMonthly = total / v.asc2Months
    return { result: avgMonthly, label: 'Avg Monthly Cost', unit: '$', steps: [{ label: 'Base Rate', value: '$' + base.toFixed(2) }, { label: 'Climate Factor', value: climateFactor + 'x' }, { label: 'Fees', value: '$' + (accessFee + v.asc2Insurance + vehicleFee).toFixed(2) }, { label: 'Monthly Total', value: '$' + monthly.toFixed(2) }, { label: 'First Month + Admin', value: '$' + firstMonth.toFixed(2) }, { label: 'Total for Stay', value: '$' + total.toFixed(2) }] }
  },
  description: 'Auto storage cost estimator including climate control, insurance, 24/7 access fees, and vehicle storage options.',
  formula: 'Avg Monthly = (Base x Climate + Insurance + Access + Vehicle) / Months with first-month admin fee',
  interpretation: 'Vehicle storage adds $75-150/month. Climate control is recommended for electronics, wood furniture, and documents. First month includes $30 admin fee. Rates vary 20-40% between facilities.'
}

export default calcDef
