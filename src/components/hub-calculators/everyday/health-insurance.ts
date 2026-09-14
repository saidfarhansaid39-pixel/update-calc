import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ monthlyPremium: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), annualDeductible: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), copay: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), visitsPerYear: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'monthlyPremium', label: 'Monthly Premium ($)', type: 'number', min: 50, step: '50' },
    { name: 'annualDeductible', label: 'Annual Deductible ($)', type: 'number', min: 0, step: '500' },
    { name: 'copay', label: 'Copay per Visit ($)', type: 'number', min: 0, step: '10' },
    { name: 'visitsPerYear', label: 'Doctor Visits per Year', type: 'number', min: 0, step: '1' },
  ],
  defaults: { monthlyPremium: "450", annualDeductible: "3000", copay: "30", visitsPerYear: "4" },
  presets: [
    { label: "Bronze HDHP (Young Adult)", values: { monthlyPremium: "350", annualDeductible: "6000", copay: "40", visitsPerYear: "2" } },
    { label: "Silver Plan (Family)", values: { monthlyPremium: "650", annualDeductible: "4000", copay: "30", visitsPerYear: "8" } },
    { label: "Gold PPO (Frequent Care)", values: { monthlyPremium: "850", annualDeductible: "1500", copay: "20", visitsPerYear: "12" } },
    { label: "Catastrophic (Under 30)", values: { monthlyPremium: "200", annualDeductible: "9000", copay: "50", visitsPerYear: "1" } },
  ],
  compute: (v) => { const p = parseFloat(v.monthlyPremium)||0; const d = parseFloat(v.annualDeductible)||0; const c = parseFloat(v.copay)||0; const vis = parseFloat(v.visitsPerYear)||0; const premiumTotal = p * 12; const copayTotal = c * vis; const total = premiumTotal + d + copayTotal; const moAvg = total / 12; const premiumPct = total > 0 ? (premiumTotal / total) * 100 : 0; const deductiblePct = total > 0 ? (d / total) * 100 : 0; return { result: total, label: 'Annual Health Cost', unit: '$', steps: [{ label: 'Annual Premium', value: `$${premiumTotal.toFixed(2)} ($${p.toFixed(0)}/mo × 12)` }, { label: 'Annual Deductible', value: `$${d.toFixed(2)}` }, { label: 'Copay Total', value: `$${copayTotal.toFixed(2)} ($${c.toFixed(0)} × ${vis} visits)` }, { label: 'Total Annual Cost', value: `$${total.toFixed(2)}` }, { label: 'Monthly Average', value: `$${moAvg.toFixed(2)}/mo` }, { label: 'Cost Breakdown', value: `${premiumPct.toFixed(0)}% premium / ${deductiblePct.toFixed(0)}% deductible / ${(100-premiumPct-deductiblePct).toFixed(0)}% copays` }] ,
    extras: [
      { label: "Metal Tier Comparison", value: "Bronze: ~$350/mo (60% avg coverage) | Silver: ~$550/mo (70%) | Gold: ~$800/mo (80%) | Platinum: ~$1000/mo (90%)" },
      { label: "HSA vs FSA", value: "HSA: triple tax-advantaged, funds roll over, requires HDHP | FSA: use-it-or-lose-it, up to $3,200/yr limit" },
      { label: "Out-of-Pocket Maximum", value: "2025 limits: $9,200 individual / $18,400 family. Once hit, plan pays 100%" },
      { label: "Network Considerations", value: "PPO: higher premium, choose any doctor | HMO: lower cost, need referrals, in-network only" },
      { label: "Prescription Coverage", value: "Tiered formularies: Generic ($10-15) → Preferred Brand ($30-50) → Non-Preferred ($60-100)" },
      { label: "Open Enrollment Timing", value: "Marketplace: Nov 1 - Jan 15 | Employer: usually 2-week window in Oct/Nov" },
      { label: "Subsidy Eligibility", value: "Households earning 100-400% of FPL may qualify for premium tax credits on marketplace plans" },
      { label: "COBRA & Gaps", value: "COBRA: 18-36 months at full premium (102%). Short-term plans bridge gaps but exclude pre-existing" },
    ]} },
  description: 'Compare total annual health insurance costs across plans — premiums, deductibles, and copays. Make informed decisions between Bronze, Silver, Gold, and HDHP options.',
  formula: 'Annual Cost = (Monthly Premium × 12) + Annual Deductible + (Copay × Visits) | Monthly Avg = Annual ÷ 12',
  interpretation: 'When choosing a plan, consider both the premium and how much care you actually use. A lower-premium HDHP with HSA can save thousands if you rarely visit the doctor, while a Gold PPO makes sense for those with ongoing medical needs. The 2025 out-of-pocket maximum caps your total risk at $9,200 individual / $18,400 family. Always verify your doctors are in-network before enrolling.'
}

export default calcDef
