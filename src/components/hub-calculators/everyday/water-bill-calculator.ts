import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wbc2Gallons: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wbc2RatePerKgal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wbc2SewerRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wbc2FixedFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wbc2People: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'wbc2Gallons', label: 'Water Used (gallons)', type: 'number', min: 100, step: '500' },
    { name: 'wbc2RatePerKgal', label: 'Rate per 1000 gal ($)', type: 'number', min: 1, step: '2' },
    { name: 'wbc2SewerRate', label: 'Sewer Rate ($)', type: 'number', min: 0, step: '2' },
    { name: 'wbc2FixedFee', label: 'Base/Fixed Fee ($)', type: 'number', min: 0, step: '5' },
    { name: 'wbc2People', label: 'Household Size', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const kgal = v.wbc2Gallons / 1000
    const waterCost = kgal * v.wbc2RatePerKgal
    const sewerCost = kgal * v.wbc2SewerRate
    const total = waterCost + sewerCost + v.wbc2FixedFee
    const perPerson = total / v.wbc2People
    const gallonsPerPerson = v.wbc2Gallons / v.wbc2People
    return { result: total, label: 'Total Water Bill', unit: '$', steps: [{ label: 'Usage', value: v.wbc2Gallons.toFixed(0) + ' gal (' + kgal.toFixed(2) + ' kgal)' }, { label: 'Water Cost', value: kgal.toFixed(2) + ' x $' + v.wbc2RatePerKgal.toFixed(2) + ' = $' + waterCost.toFixed(2) }, { label: 'Sewer Cost', value: '$' + sewerCost.toFixed(2) }, { label: 'Fixed Fee', value: '$' + v.wbc2FixedFee.toFixed(2) }, { label: 'Total', value: '$' + total.toFixed(2) }, { label: 'Per Person', value: '$' + perPerson.toFixed(2) + ' (' + gallonsPerPerson.toFixed(0) + ' gal/person)' }] }
  },
  description: 'Calculate water bill from gallons used, rate per thousand gallons, sewer charges, fixed fees, and household size.',
  formula: 'Bill = (Gal/1000) x (WaterRate + SewerRate) + FixedFee | PerPerson = Total / People',
  interpretation: 'Average person uses 80-100 gal/day. Family of 4: ~12,000 gal/month. Water rates: $4-15/kgal. Sewer: $4-12/kgal. Fixing a leaky toilet saves $50-100/year. Water-efficient appliances reduce bills 20-30%.'
}

export default calcDef
