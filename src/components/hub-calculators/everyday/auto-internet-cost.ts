import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ aicSpeedMbps: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), aicDataCap: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), aicProvider: z.string().min(1), aicContractMonths: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), aicEquipmentRental: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'aicSpeedMbps', label: 'Plan Speed (Mbps)', type: 'number', min: 10, step: '50' },
    { name: 'aicDataCap', label: 'Monthly Data Cap (GB)', type: 'number', min: 0, step: '100' },
    { name: 'aicProvider', label: 'Connection Type', type: 'select', options: [{ label: 'Fiber', value: 'fiber' }, { label: 'Cable', value: 'cable' }, { label: 'DSL', value: 'dsl' }, { label: '5G Home', value: '5g' }, { label: 'Satellite', value: 'satellite' }] },
    { name: 'aicContractMonths', label: 'Contract Length (months)', type: 'number', min: 1, step: '6' },
    { name: 'aicEquipmentRental', label: 'Equipment Rental ($/mo)', type: 'number', min: 0, step: '5' },
  ],
  compute: (v) => {
    const baseRates: Record<string, number> = { fiber: 0.05, cable: 0.08, dsl: 0.1, '5g': 0.06, satellite: 0.15 }
    const baseRate = baseRates[v.aicProvider] || 0.08
    const baseMonthly = baseRate * v.aicSpeedMbps
    const dataCapFee = v.aicDataCap > 0 ? 10 : 0
    const contractDiscount = v.aicContractMonths >= 24 ? 0.9 : v.aicContractMonths >= 12 ? 0.95 : 1
    const promoPeriod = v.aicContractMonths >= 12 ? 6 : 0
    const promoRate = promoPeriod > 0 ? baseMonthly * 0.8 : baseMonthly
    const promoAvg = promoPeriod > 0 ? (promoRate * promoPeriod + baseMonthly * contractDiscount * (v.aicContractMonths - promoPeriod)) / v.aicContractMonths : baseMonthly * contractDiscount
    const monthlyTotal = promoAvg + v.aicEquipmentRental + dataCapFee
    const annualTotal = monthlyTotal * 12
    const overContract = monthlyTotal * v.aicContractMonths
    return { result: monthlyTotal, label: 'Effective Monthly Cost', unit: '$', steps: [{ label: 'Base Rate', value: `${v.aicSpeedMbps} Mbps × $${baseRate.toFixed(3)} = $${baseMonthly.toFixed(2)}` }, { label: 'Promo Average', value: `$${promoAvg.toFixed(2)}` }, { label: 'Equipment Rental', value: `$${v.aicEquipmentRental.toFixed(2)}` }, { label: 'Data Cap Fee', value: `$${dataCapFee.toFixed(2)}` }, { label: 'Monthly Total', value: `$${monthlyTotal.toFixed(2)}` }, { label: 'Contract Total', value: `$${overContract.toFixed(2)}` }] }
  },
  description: 'Calculate your effective monthly internet cost factoring in speed, connection type, contract terms, equipment rental, and promotional pricing.',
  formula: 'Effective Monthly = (Speed × Provider Rate × Discount + Equipment + Data Fee) | Contract Total = Monthly × Months',
  interpretation: 'Fiber is fastest and cheapest per Mbps. 100 Mbps is sufficient for 4K streaming + gaming. Equipment rental ($10-15/mo) costs $120-180/year; buy your own modem/router ($60-150) to save. Promo rates expire after 6-12 months; negotiate at renewal.'
}

export default calcDef
