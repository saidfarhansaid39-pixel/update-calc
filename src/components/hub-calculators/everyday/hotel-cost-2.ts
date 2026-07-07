import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ nights: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), nightRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), taxRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), resortFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), parking: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), dining: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'nights', label: 'Number of Nights', type: 'number', min: 1, step: '1' },
    { name: 'nightRate', label: 'Nightly Room Rate ($)', type: 'number', min: 0, step: '25' },
    { name: 'taxRate', label: 'Hotel Tax Rate (%)', type: 'number', min: 0, step: '1' },
    { name: 'resortFee', label: 'Resort/Daily Fee ($)', type: 'number', min: 0, step: '10' },
    { name: 'parking', label: 'Daily Parking ($)', type: 'number', min: 0, step: '5' },
    { name: 'dining', label: 'Daily Dining/Incidentals ($)', type: 'number', min: 0, step: '20' },
  ],
  compute: (v) => { const baseRoom = v.nightRate * v.nights; const taxes = baseRoom * (v.taxRate / 100); const fees = v.resortFee * v.nights; const park = v.parking * v.nights; const dine = v.dining * v.nights; const total = baseRoom + taxes + fees + park + dine; return { result: total, label: 'Total Hotel Cost', unit: '$', steps: [{ label: 'Room Cost', value: `$${baseRoom.toFixed(0)} (${v.nights} nights × $${v.nightRate})` }, { label: 'Taxes', value: `$${taxes.toFixed(0)} (${v.taxRate}%)` }, { label: 'Fees', value: `$${fees.toFixed(0)}` }, { label: 'Parking + Dining', value: `$${(park + dine).toFixed(0)}` }, { label: 'Total', value: `$${total.toFixed(0)}` }] } },
  description: 'Calculate the total cost of a hotel stay including room rate, taxes, resort fees, parking, and daily expenses.',
  formula: 'Total = (Nights × Rate) + (Rate × Nights × Tax%) + Nights × (Resort Fee + Parking + Dining)',
  interpretation: 'Hotel taxes range from 10-18% in most cities. Resort fees average $25-50/night. Urban hotels often charge $30-60/night for parking.'
}

export default calcDef
