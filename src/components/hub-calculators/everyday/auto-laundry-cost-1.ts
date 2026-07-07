import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ alc2LoadsMonthly: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), alc2WaterTemp: z.string().min(1), alc2DryerSetting: z.string().min(1), alc2MachineAge: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), alc2SoftenerCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'alc2LoadsMonthly', label: 'Loads per Month', type: 'number', min: 1, step: '4' },
    { name: 'alc2WaterTemp', label: 'Water Temperature', type: 'select', options: [{ label: 'Cold (no heat)', value: 'cold' }, { label: 'Warm', value: 'warm' }, { label: 'Hot', value: 'hot' }] },
    { name: 'alc2DryerSetting', label: 'Dryer Setting', type: 'select', options: [{ label: 'Energy Star Auto Dry', value: 'auto' }, { label: 'Timed High Heat', value: 'high' }, { label: 'Low Heat/Delicate', value: 'low' }, { label: 'Air Dry / No Dryer', value: 'none' }] },
    { name: 'alc2MachineAge', label: 'Machine Age (years)', type: 'number', min: 0, step: '2' },
    { name: 'alc2SoftenerCost', label: 'Fabric Softener per Load ($)', type: 'number', min: 0, step: '0.05' },
  ],
  compute: (v) => {
    const tempEnergy: Record<string, number> = { cold: 0.05, warm: 0.15, hot: 0.35 }
    const energyPerLoad = tempEnergy[v.alc2WaterTemp] || 0.1
    const dryerSettings: Record<string, number> = { auto: 2.5, high: 4, low: 2, none: 0 }
    const dryerEnergy = dryerSettings[v.alc2DryerSetting] || 2.5
    const ageEfficiency = Math.min(1, 1 - v.alc2MachineAge * 0.01)
    const totalKwh = (energyPerLoad + dryerEnergy) * ageEfficiency
    const assumedRate = 0.13
    const energyCost = totalKwh * assumedRate
    const perLoad = energyCost + v.alc2SoftenerCost
    const monthlyTotal = perLoad * v.alc2LoadsMonthly
    const annualTotal = monthlyTotal * 12
    return { result: monthlyTotal, label: 'Monthly Laundry Cost', unit: '$', steps: [{ label: 'Energy per Load', value: `${totalKwh.toFixed(2)} kWh` }, { label: 'Energy Cost per Load', value: `$${energyCost.toFixed(3)}` }, { label: 'Softener per Load', value: `$${v.alc2SoftenerCost.toFixed(2)}` }, { label: 'Per Load Total', value: `$${perLoad.toFixed(3)}` }, { label: 'Monthly Total', value: `$${monthlyTotal.toFixed(2)}` }, { label: 'Annual Total', value: `$${annualTotal.toFixed(2)}` }] }
  },
  description: 'Estimate your laundry costs based on water temperature, dryer settings, machine age, and fabric softener usage. Older machines use more energy.',
  formula: 'Monthly = ((Water Temp KWH + Dryer KWH) × Age Factor × $0.13 + Softener) × Loads/Month',
  interpretation: 'Hot water costs 7× more than cold per load. Auto-dry sensors save 30% vs timed drying. Machines lose ~1% efficiency per year. Air drying saves $0.30-0.50/load and extends garment life.'
}

export default calcDef
