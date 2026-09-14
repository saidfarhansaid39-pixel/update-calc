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
  defaults: { thsCurrentSetting: '72', thsTargetSetting: '68', thsMonthlyBill: '150', thsSeason: 'winter', thsHoursPerDay: '10' },
  presets: [
    { label: 'Winter: 72F → 68F', values: { thsCurrentSetting: '72', thsTargetSetting: '68', thsMonthlyBill: '150', thsSeason: 'winter', thsHoursPerDay: '12' } },
    { label: 'Summer: 74F → 78F', values: { thsCurrentSetting: '74', thsTargetSetting: '78', thsMonthlyBill: '200', thsSeason: 'summer', thsHoursPerDay: '10' } },
    { label: 'Winter: 70F → 65F (deep setback)', values: { thsCurrentSetting: '70', thsTargetSetting: '65', thsMonthlyBill: '180', thsSeason: 'winter', thsHoursPerDay: '16' } },
    { label: 'Summer: 76F → 80F', values: { thsCurrentSetting: '76', thsTargetSetting: '80', thsMonthlyBill: '170', thsSeason: 'summer', thsHoursPerDay: '8' } },
  ],
  compute: (v) => {
    const tempDiff = Math.abs(v.thsCurrentSetting - v.thsTargetSetting)
    const savingsPct = v.thsSeason === 'winter' ? tempDiff * 1.5 : tempDiff * 2
    const hoursFactor = v.thsHoursPerDay / 24
    const monthlySavings = v.thsMonthlyBill * (savingsPct / 100) * hoursFactor
    const annualSavings = monthlySavings * (v.thsSeason === 'winter' ? 5 : 4)
    return { result: monthlySavings, label: 'Estimated Monthly Savings', unit: '$', steps: [
      { label: 'Formula', value: 'Savings = Bill × (ΔF × Rate%) × (Hours/24)' },
      { label: 'Temp Adjustment', value: v.thsCurrentSetting + 'F → ' + v.thsTargetSetting + 'F = ' + tempDiff + 'F change' },
      { label: 'Savings Rate', value: v.thsSeason === 'winter' ? '1.5% per °F (heating)' : '2% per °F (cooling)' },
      { label: 'Gross Savings Rate', value: tempDiff + 'F × ' + (v.thsSeason === 'winter' ? '1.5%' : '2%') + ' = ' + savingsPct.toFixed(1) + '%' },
      { label: 'Time Factor', value: v.thsHoursPerDay + 'h ÷ 24h = ' + (hoursFactor * 100).toFixed(0) + '% of day' },
      { label: 'Monthly Savings', value: '$' + v.thsMonthlyBill.toFixed(2) + ' × ' + savingsPct.toFixed(1) + '% × ' + (hoursFactor * 100).toFixed(0) + '% = $' + monthlySavings.toFixed(2) },
      { label: 'Seasonal Savings', value: '$' + monthlySavings.toFixed(2) + ' × ' + (v.thsSeason === 'winter' ? '5' : '4') + ' months = $' + annualSavings.toFixed(2) },
    ] ,
    extras: [
      { label: 'DOE Guidelines', value: 'US Dept of Energy: 68°F winter (save 5-15%), 78°F summer (save 6-18%). Each degree setback saves 1-3% on heating/cooling' },
      { label: 'Smart Thermostat ROI', value: 'A $150-250 smart thermostat saves 10-15% on HVAC costs annually. Payback period: 1-3 years. Nest/Ecobee: ~$50/year savings' },
      { label: 'Nighttime Setback', value: 'Set back 7-10°F for 8 hours overnight. A 68°F → 58°F setback saves 10-15% on heating. Use programmable or smart thermostat' },
      { label: 'Ceiling Fan Strategy', value: 'Ceiling fans make a room feel 4-5°F cooler for $0.01-0.02/hour. Reverse direction in winter to push warm air down' },
      { label: 'Insulation Check', value: 'Poor insulation costs 20-30% more in HVAC. Attic insulation to R-49 saves $200-600/year depending on climate zone' },
      { label: 'Window Treatments', value: 'Blinds/curtains reduce heat gain by 30-50% in summer. In winter, open south-facing curtains for passive solar heating' },
      { label: 'HVAC Maintenance', value: 'Change air filters monthly (dirty filter costs 5-15% efficiency). Annual HVAC tune-up saves 5-10% on operating costs' },
      { label: 'Zoning Savings', value: 'Zoned HVAC systems save 20-30% by heating/cooling only occupied rooms. Mini-splits for additions avoid duct losses' },
    ]}
  },
  description: 'Estimate energy savings from adjusting your thermostat based on the Department of Energy guidelines. Each degree Fahrenheit saves 1-3% on heating or cooling bills. Calculate monthly and seasonal savings.',
  formula: 'Savings Rate = Temperature Difference × Rate Per Degree. Heating: 1.5% per °F. Cooling: 2% per °F. Monthly Savings = Current Bill × Savings Rate × (HVAC Hours ÷ 24). Seasonal Savings = Monthly Savings × Season Months (5 winter / 4 summer).',
  interpretation: 'Setting your thermostat from 72°F to 68°F in winter (4°F change) with a $150 monthly bill and 12h/day runtime saves $4.50/month and $22.50 over the 5-month heating season. The biggest savings come from overnight setbacks of 7-10°F — a programmable or smart thermostat makes this effortless. Combined with ceiling fans, proper insulation, and regular filter changes, annual HVAC savings of $200-500 are achievable.'
}

export default calcDef
