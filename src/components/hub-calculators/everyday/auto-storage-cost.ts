import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ascUnitSize: z.string().min(1), ascMonthCount: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ascClimateControl: z.string().min(1), ascInsuranceMonthly: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ascAccess24hr: z.string().min(1) }),
  fields: [
    { name: 'ascUnitSize', label: 'Unit Size', type: 'select', options: [{ label: 'Small (5×5) - Closet', value: '5x5' }, { label: 'Medium (5×10) - 1BR Apt', value: '5x10' }, { label: 'Large (10×10) - 2BR Apt', value: '10x10' }, { label: 'Extra Large (10×15) - 3BR House', value: '10x15' }, { label: 'Jumbo (10×20) - Full House', value: '10x20' }, { label: 'Super Jumbo (10×30) - Large House', value: '10x30' }] },
    { name: 'ascMonthCount', label: 'Months of Storage', type: 'number', min: 1, step: '1' },
    { name: 'ascClimateControl', label: 'Climate Control', type: 'select', options: [{ label: 'No (standard)', value: 'no' }, { label: 'Yes (+20%)', value: 'yes' }] },
    { name: 'ascInsuranceMonthly', label: 'Insurance per Month ($)', type: 'number', min: 0, step: '5' },
    { name: 'ascAccess24hr', label: '24/7 Access', type: 'select', options: [{ label: 'No (standard hours)', value: 'no' }, { label: 'Yes (+$10/mo)', value: 'yes' }] },
  ],
  compute: (v) => {
    const baseRates: Record<string, number> = { '5x5': 45, '5x10': 65, '10x10': 95, '10x15': 130, '10x20': 170, '10x30': 250 }
    const baseRate = baseRates[v.ascUnitSize] || 95
    const climateAdj = v.ascClimateControl === 'yes' ? 1.2 : 1
    const accessAdj = v.ascAccess24hr === 'yes' ? 10 : 0
    const monthlyRate = baseRate * climateAdj + v.ascInsuranceMonthly + accessAdj
    const adminFee = 25
    const lockFee = 12
    const firstMonth = monthlyRate + adminFee + lockFee
    const totalBill = firstMonth + monthlyRate * (v.ascMonthCount - 1)
    const averageMonthly = totalBill / v.ascMonthCount
    const annualRate = monthlyRate * 12
    return { result: averageMonthly, label: 'Average Monthly Cost', unit: '$', steps: [{ label: 'Base Rate', value: `$${baseRate.toFixed(2)}` }, { label: 'Climate Control', value: `${climateAdj.toFixed(1)}×` }, { label: 'Access + Insurance', value: `$${(v.ascInsuranceMonthly + accessAdj).toFixed(2)}` }, { label: 'Monthly Rate', value: `$${monthlyRate.toFixed(2)}` }, { label: 'First Month (fees)', value: `$${firstMonth.toFixed(2)}` }, { label: 'Total for Stay', value: `$${totalBill.toFixed(2)}` }, { label: 'Avg/Month', value: `$${averageMonthly.toFixed(2)}` }] }
  },
  description: 'Auto storage unit cost calculator that estimates monthly rates including climate control, insurance, 24/7 access fees, and one-time administrative charges.',
  formula: 'Monthly = Base × Climate + Insurance + Access | First Month = Monthly + Admin + Lock | Total = First Month + Monthly × (Months - 1)',
  interpretation: 'Storage unit costs $45-250/month depending on size. Climate control adds 20% but protects against temperature extremes. Admin fees ($15-35) and lock purchases ($8-15) add to first-month costs. Shop around: prices vary 30%+ between facilities.'
}

export default calcDef
