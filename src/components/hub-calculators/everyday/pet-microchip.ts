import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ implantCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), registrationFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), vetVisit: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), yearsOwned: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), lostPetCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'implantCost', label: 'Microchip Implant Cost ($)', type: 'number', min: 0, step: '10' },
    { name: 'registrationFee', label: 'Registration Fee ($)', type: 'number', min: 0, step: '10' },
    { name: 'vetVisit', label: 'Vet Visit for Implant ($)', type: 'number', min: 0, step: '20' },
    { name: 'yearsOwned', label: 'Expected Years Owned', type: 'number', min: 1, step: '5' },
    { name: 'lostPetCost', label: 'Cost if Lost (flyers, reward, etc.)', type: 'number', min: 0, step: '100' },
  ],
  compute: (v) => { const chipTotal = v.implantCost + v.registrationFee + v.vetVisit; const annualCost = chipTotal / v.yearsOwned; const avoidedLossCost = v.lostPetCost; const potentialSavings = avoidedLossCost - chipTotal; const roiPct = chipTotal > 0 ? (potentialSavings / chipTotal) * 100 : 0; return { result: chipTotal, label: 'Total Microchip Cost', unit: '$', steps: [{ label: 'Implant + Reg + Visit', value: `$${chipTotal.toFixed(0)}` }, { label: 'Annualized Cost', value: `$${annualCost.toFixed(2)}/yr over ${v.yearsOwned} yrs` }, { label: 'Cost if Pet Lost', value: `$${v.lostPetCost.toFixed(0)}` }, { label: 'Potential Savings', value: `$${potentialSavings.toFixed(0)} (${roiPct.toFixed(0)}% ROI)` }] } },
  description: 'Calculate the cost of microchipping your pet including implant, registration, vet visit, and long-term value as lost pet prevention.',
  formula: 'Total Cost = Implant + Registration + Vet Visit | ROI = (Lost Pet Cost − Total) / Total × 100%',
  interpretation: 'Microchipping costs $25-60 one-time. Shelters and vets universally scan for chips. Found pets with chips have a 52%+ return rate vs 14% without. Registration requires keeping contact info current.'
}

export default calcDef
