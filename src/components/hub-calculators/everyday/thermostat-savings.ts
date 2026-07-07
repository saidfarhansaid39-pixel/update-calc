import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ thsCurrentSetting: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), thsTargetSetting: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), thsMonthlyBill: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), thsSeason: z.string().min(1), thsHoursPerDay: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'thsCurrentSetting', label: 'Current Thermostat (F)', type: 'number', min: 50, max: 90, step: '1' },
    { name: 'thsTargetSetting', label: 'Target Setting (F)', type: 'number', min: 50, max: 90, step: '1' },
    { name: 'thsMonthlyBill', label: 'Current Monthly HVAC Bill ($)', type: 'number', min: 10, step: '25' },
    { name: 'thsSeason', label: 'Season', type: 'select', options: [{ label: 'Winter (Heating)', value: 'winter' }, { label: 'Summer (Cooling)', value: 'summer' }] },
    { name: 'thsHoursPerDay', label: 'HVAC Runs Hours/Day', type: 'number', min: 1, max: 24, step: '1' },
  ],
  compute: (v) => {
    const tempDiff = Math.abs(v.thsCurrentSetting - v.thsTargetSetting)
    const savingsPct = v.thsSeason === 'winter' ? tempDiff * 1.5 : tempDiff * 2
    const hoursFactor = v.thsHoursPerDay / 24
    const monthlySavings = v.thsMonthlyBill * (savingsPct / 100) * hoursFactor
    const annualSavings = monthlySavings * (v.thsSeason === 'winter' ? 5 : 4)
    return { result: monthlySavings, label: 'Estimated Monthly Savings', unit: '$', steps: [{ label: 'Temp Adjustment', value: tempDiff + 'F' }, { label: 'Savings Rate', value: savingsPct.toFixed(1) + '%' }, { label: 'Time Factor', value: (hoursFactor * 100).toFixed(0) + '% of day' }, { label: 'Monthly Savings', value: '$' + monthlySavings.toFixed(2) }, { label: 'Seasonal Savings', value: '$' + annualSavings.toFixed(2) }] }
  },
  description: 'Estimate energy savings from adjusting your thermostat. Every degree saves 1-3% on heating or cooling bills.',
  formula: 'Savings = Bill x (DeltaF x Rate%) x (Hours/24) | Heating: ~1.5%/F | Cooling: ~2%/F',
  interpretation: 'Set to 68F winter (save 5-15%), 78F summer (save 6-18%). A smart thermostat ($100-250) saves 10-15% annually. Programmable setbacks of 7-10F for 8 hours/day optimize savings. Annual savings: $100-200.'
}

export default calcDef
