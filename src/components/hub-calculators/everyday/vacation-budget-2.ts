import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ vb2Transport: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), vb2Lodging: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), vb2Food: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), vb2Activities: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), vb2Souvenirs: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), vb2Travelers: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), vb2Days: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'vb2Transport', label: 'Transportation ($)', type: 'number', min: 0, step: '100' },
    { name: 'vb2Lodging', label: 'Lodging ($)', type: 'number', min: 0, step: '200' },
    { name: 'vb2Food', label: 'Food & Drinks ($)', type: 'number', min: 0, step: '100' },
    { name: 'vb2Activities', label: 'Activities/Excursions ($)', type: 'number', min: 0, step: '100' },
    { name: 'vb2Souvenirs', label: 'Souvenirs/Shopping ($)', type: 'number', min: 0, step: '50' },
    { name: 'vb2Travelers', label: 'Number of Travelers', type: 'number', min: 1, step: '1' },
    { name: 'vb2Days', label: 'Trip Duration (days)', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const subtotal = v.vb2Transport + v.vb2Lodging + v.vb2Food + v.vb2Activities + v.vb2Souvenirs
    const emergencyFund = subtotal * 0.1
    const total = subtotal + emergencyFund
    const perPerson = total / v.vb2Travelers
    const perDay = total / v.vb2Days
    return { result: total, label: 'Total Vacation Budget', unit: '$', steps: [{ label: 'Transportation', value: '$' + v.vb2Transport.toFixed(2) }, { label: 'Lodging', value: '$' + v.vb2Lodging.toFixed(2) }, { label: 'Food', value: '$' + v.vb2Food.toFixed(2) }, { label: 'Activities + Shopping', value: '$' + (v.vb2Activities + v.vb2Souvenirs).toFixed(2) }, { label: 'Emergency Fund (10%)', value: '$' + emergencyFund.toFixed(2) }, { label: 'Total Budget', value: '$' + total.toFixed(2) }, { label: 'Per Person', value: '$' + perPerson.toFixed(2) }, { label: 'Per Day', value: '$' + perDay.toFixed(2) }] }
  },
  description: 'Calculate a complete vacation budget including transport, lodging, food, activities, souvenirs, and emergency fund.',
  formula: 'Total = Transport + Lodging + Food + Activities + Souvenirs + 10% Buffer | PerPerson = Total / Travelers',
  interpretation: 'Typical vacation breakdown: transport 30%, lodging 35%, food 20%, activities 10%, souvenirs 5%. 7-day trip for 2 people: $3,000-7,000. Always include a 10% emergency buffer. Travel insurance: 4-10% of trip cost.'
}

export default calcDef
