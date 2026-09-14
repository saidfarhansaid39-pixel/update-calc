import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ monthlyFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), setupFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), equipmentFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), contractMonths: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  defaults: { monthlyFee: '49.99', setupFee: '49.99', equipmentFee: '15', contractMonths: '12' },
  presets: [
    { label: 'Promo Year 1', values: { monthlyFee: '49.99', setupFee: '49.99', equipmentFee: '15', contractMonths: '12' } },
    { label: 'No-Contract Plan', values: { monthlyFee: '69.99', setupFee: '0', equipmentFee: '10', contractMonths: '0' } },
    { label: 'Fiber 2-Year', values: { monthlyFee: '79.99', setupFee: '0', equipmentFee: '10', contractMonths: '24' } },
  ],
  fields: [
    { name: 'monthlyFee', label: 'Monthly Fee ($)', type: 'number', min: 0, step: '10' },
    { name: 'setupFee', label: 'Setup/Installation Fee ($)', type: 'number', min: 0, step: '25' },
    { name: 'equipmentFee', label: 'Monthly Equipment Fee ($)', type: 'number', min: 0, step: '5' },
    { name: 'contractMonths', label: 'Contract Length (months)', type: 'number', min: 0, step: '6' },
  ],
  compute: (v) => { const M = parseFloat(v.monthlyFee)||0; const S = parseFloat(v.setupFee)||0; const E = parseFloat(v.equipmentFee)||0; const C = parseFloat(v.contractMonths)||0; const totalMonthly = M + E; const contractTotal = totalMonthly * C + S; const annual = totalMonthly * 12 + S; const avgMonthly = C > 0 ? contractTotal / C : totalMonthly; return { result: contractTotal, label: 'Total Contract Cost', unit: '$', steps: [
    { label: '1. Monthly + Equipment', value: `$${M.toFixed(2)} + $${E.toFixed(2)} = $${totalMonthly.toFixed(2)}` },
    { label: '2. Annual Cost', value: `$${totalMonthly.toFixed(2)} × 12 + $${S.toFixed(2)} = $${annual.toFixed(2)}` },
    { label: '3. Contract Total', value: `$${totalMonthly.toFixed(2)} × ${C}mo + $${S.toFixed(2)} = $${contractTotal.toFixed(2)}` },
    { label: '4. Effective Monthly Avg', value: `$${contractTotal.toFixed(2)} ÷ ${C > 0 ? C : 1}mo = $${avgMonthly.toFixed(2)}/mo` },
  ] ,
    extras: [
      { label: 'Promo Rate Trap', value: 'Intro rates expire after 12 months, often increasing $20-40/mo. A $49.99 promo becoming $79.99 in year 2 means real 2-year cost is $779.76 + $0 setup = $1,679.52 total.' },
      { label: 'Equipment Fee Avoidance', value: 'Buy your own modem ($50-100) and router ($60-200) to save $10-15/mo = $120-180/yr. Payback is 4-8 months. Most ISPs provide compatible modem lists.' },
      { label: 'Installation Fee Waiver', value: 'Self-installation is free at most ISPs (retail kit shipped). Professional install costs $50-100. Ask for a waiver — many ISPs waive during promotions.' },
      { label: 'Early Termination Fee', value: 'ETFs: $10-15 per remaining month up to $200-300 max. Moving to an area without service usually waives the ETF. Read the fine print before signing a 2-year contract.' },
      { label: 'Bundling Savings', value: 'Internet + TV: save $20-40/mo. Internet + phone: save $5-15/mo. Triple-play (internet+TV+phone): save $40-80/mo. But streaming + internet is usually cheaper than cable bundles.' },
      { label: 'Government Assistance', value: 'ACP (Affordable Connectivity Program): up to $30/mo discount for qualifying households ($75 on tribal lands). Income <200% of poverty line or enrolled in SNAP/Medicaid.' },
      { label: 'Speed Upgrade Cost', value: 'ISPs charge $10-20/mo to jump from 100 Mbps to 500 Mbps, and another $10-20 for 1 Gbps. Test if you actually need the speed before paying more.' },
      { label: 'Business vs Residential', value: 'Business plans cost 1.5-3× more but offer static IP, 24/7 support, faster repair SLAs, and better upload speeds. Most homes don\'t need business plans.' },
    ]} },
  description: 'Calculate the true cost of an internet service plan including monthly fees, equipment, setup, and contract commitments. Includes promo rate impact, ETF, and equipment savings.',
  formula: 'Total = (MonthlyFee + EquipmentFee) × ContractMonths + SetupFee. Effective Monthly Average = Total / ContractMonths. Annual Cost = (M+E) × 12 + S. Compare at least 3 ISPs.',
  interpretation: 'Promotional rates often expire after 12 months — factor in the post-promo price for true cost comparison. Equipment fees ($10-15/mo) add $120-180/yr — buy your own modem/router to save. A $50/mo promo plan with $15 equipment fee and $50 setup costs $830 over 12 months ($69.17/mo effective). Always check for early termination fees before signing contracts.'
}

export default calcDef
