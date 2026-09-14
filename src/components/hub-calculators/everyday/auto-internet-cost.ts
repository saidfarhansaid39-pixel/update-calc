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
  defaults: { aicSpeedMbps: '300', aicDataCap: '0', aicProvider: 'fiber', aicContractMonths: '12', aicEquipmentRental: '15' },
  presets: [
    { label: 'Budget Fiber', values: { aicSpeedMbps: '100', aicDataCap: '0', aicProvider: 'fiber', aicContractMonths: '24', aicEquipmentRental: '10' } },
    { label: 'Cable Gamer', values: { aicSpeedMbps: '500', aicDataCap: '1000', aicProvider: 'cable', aicContractMonths: '12', aicEquipmentRental: '15' } },
    { label: 'Rural Satellite', values: { aicSpeedMbps: '50', aicDataCap: '150', aicProvider: 'satellite', aicContractMonths: '24', aicEquipmentRental: '15' } },
    { label: '5G Home Early Adopter', values: { aicSpeedMbps: '200', aicDataCap: '0', aicProvider: '5g', aicContractMonths: '6', aicEquipmentRental: '0' } },
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
    const costPerMbps = monthlyTotal / v.aicSpeedMbps
    const ownEquipmentSavings = v.aicEquipmentRental * 12
    return { result: monthlyTotal, label: 'Effective Monthly Cost', unit: '$', steps: [{ label: 'Base Rate', value: `${v.aicSpeedMbps} Mbps × $${baseRate.toFixed(3)}/Mbps = $${baseMonthly.toFixed(2)}` }, { label: 'Contract Discount', value: `${contractDiscount.toFixed(2)}× (${v.aicContractMonths}mo)` }, { label: 'Promo Avg (first 6mo at 80%)', value: `$${promoAvg.toFixed(2)}` }, { label: 'Equipment Rental', value: `$${v.aicEquipmentRental.toFixed(2)}` }, { label: 'Data Cap Fee', value: `$${dataCapFee.toFixed(2)}` }, { label: 'Monthly Total', value: `$${monthlyTotal.toFixed(2)}` }, { label: 'Contract Total', value: `$${overContract.toFixed(2)} over ${v.aicContractMonths}mo` }, { label: 'Cost per Mbps', value: `$${costPerMbps.toFixed(4)}` }] ,
    extras: [
      { label: 'Connection Type Value', value: `Fiber ($${(0.05 * v.aicSpeedMbps).toFixed(2)}/mo for ${v.aicSpeedMbps} Mbps) is cheapest per Mbps. Satellite costs 3× more per Mbps ($${(0.15 / 0.05).toFixed(0)}×). Cable and 5G offer the best balance of speed and availability.` },
      { label: 'Equipment Rental Trap', value: `Renting at $${v.aicEquipmentRental.toFixed(2)}/mo costs $${ownEquipmentSavings.toFixed(0)}/year. Buying a modem ($60-80) + router ($50-100) pays for itself in ${(150 / v.aicEquipmentRental).toFixed(0)} months. After that, pure savings.` },
      { label: 'Negotiation Strategy', value: `At month ${v.aicContractMonths - 6 > 0 ? v.aicContractMonths - 6 : 11} of ${v.aicContractMonths}, call to cancel. Retention offers typically reduce rates by $10-20/mo for 12 months. That saves $${(15 * 12).toFixed(0)}-${(20 * 12).toFixed(0)}/year.` },
      { label: 'Data Cap Math', value: `${v.aicDataCap > 0 ? 'Your ' + v.aicDataCap + ' GB cap adds $' + dataCapFee.toFixed(2) + '/mo. 4K streaming uses ~7 GB/hr — you hit the cap after ' + (v.aicDataCap > 0 ? Math.floor(v.aicDataCap / 7).toFixed(0) + ' hours of 4K content.' : 'no cap is ideal for heavy users.') : 'No data cap — ideal for heavy streaming, gaming, and WFH. Uncapped plans are typically $10-20 more but worth it if you exceed 500 GB/month.'}` },
      { label: 'Speed You Actually Need', value: '25 Mbps: 1 person, browsing + email. 100 Mbps: 4K streaming + 1 gamer. 300 Mbps: 2-3 streamers + gaming + WFH. 500+ Mbps: 4+ heavy users. You have ' + `${v.aicSpeedMbps}` + ' Mbps — ' + (v.aicSpeedMbps >= 300 ? 'more than enough for most households.' : v.aicSpeedMbps >= 100 ? 'good for 2-3 simultaneous heavy users.' : 'sufficient for light use.') },
      { label: 'Promo Period Trap', value: `Your ${v.aicContractMonths}-mo contract has a 6-month promo rate at 80%. After promo: $${(baseMonthly * contractDiscount + v.aicEquipmentRental + dataCapFee).toFixed(2)}/mo. That is $${((baseMonthly * contractDiscount + v.aicEquipmentRental + dataCapFee) - monthlyTotal).toFixed(2)}/mo more. Mark your calendar to renegotiate.` },
      { label: 'Bundling Savings', value: 'Internet + TV + phone bundles save $10-30/mo but lock you in. At $' + `${monthlyTotal.toFixed(0)}` + '/mo for internet only, a bundle with basic TV ($30-50) might cost ~$' + `${(monthlyTotal + 20).toFixed(0)}` + '/mo — worth it if you watch live TV.' },
    ]}
  },
  description: 'Calculate your effective monthly internet cost factoring in speed tier, connection type (fiber, cable, DSL, 5G, satellite), contract length, promotional pricing, equipment rental, and data cap fees. Find the cheapest plan for your needs.',
  formula: 'Effective Monthly = (Speed × Provider Rate × Avg Discount + Equipment Rental + Data Cap Fee) | Avg Discount blends 6-month promo (80%) + contract discount (90% at 24mo, 95% at 12mo, 100% under 12mo)',
  interpretation: 'Fiber is the best value at $0.05/Mbps — a 300 Mbps fiber plan costs ~$15 base + $15 equipment = $30/month. Cable ($0.08/Mbps) and 5G ($0.06/Mbps) are competitive alternatives. DSL and satellite are 2-3× more expensive per Mbps. Equipment rental ($10-15/mo) is a $120-180/year sink — buy your own gear ($80-150 one-time). Promo rates expire after 6-12 months; set a calendar reminder to call and negotiate at renewal. Data caps (typically 1-1.5 TB) add $10-30/month in overage if exceeded — uncapped plans are worth the premium for heavy users.'
}

export default calcDef
