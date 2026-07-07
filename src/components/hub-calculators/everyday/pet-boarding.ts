import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ nightlyRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), nights: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), additionalServices: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), pickupFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'nightlyRate', label: 'Nightly Boarding Rate ($)', type: 'number', min: 0, step: '10' },
    { name: 'nights', label: 'Number of Nights', type: 'number', min: 1, step: '1' },
    { name: 'additionalServices', label: 'Additional Services ($)', type: 'number', min: 0, step: '10' },
    { name: 'pickupFee', label: 'Admin/Pickup Fee ($)', type: 'number', min: 0, step: '10' },
  ],
  compute: (v) => { const base = v.nightlyRate * v.nights; const total = base + v.additionalServices + v.pickupFee; return { result: total, label: 'Total Boarding Cost', unit: '$', steps: [{ label: 'Base Boarding', value: `${v.nights} nights × $${v.nightlyRate} = $${base.toFixed(0)}` }, { label: 'Additional Services', value: `$${v.additionalServices.toFixed(0)}` }, { label: 'Fees', value: `$${v.pickupFee.toFixed(0)}` }, { label: 'Total', value: `$${total.toFixed(0)}` }] } },
  description: 'Calculate total pet boarding cost including nightly rates, additional services, and any admin or pickup fees.',
  formula: 'Total = (Nights × Nightly Rate) + Additional Services + Fees',
  interpretation: 'Pet boarding averages $25-85/night for dogs, $15-40/night for cats. Holiday rates are 25-50% higher. Additional services: walks, playtime, grooming, medication administration.'
}

export default calcDef
