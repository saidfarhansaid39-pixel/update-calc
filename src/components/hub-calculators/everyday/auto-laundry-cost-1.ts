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
  defaults: { alc2LoadsMonthly: '20', alc2WaterTemp: 'cold', alc2DryerSetting: 'auto', alc2MachineAge: '3', alc2SoftenerCost: '0.1' },
  presets: [
    { label: 'Eco-Friendly', values: { alc2LoadsMonthly: '16', alc2WaterTemp: 'cold', alc2DryerSetting: 'none', alc2MachineAge: '2', alc2SoftenerCost: '0.05' } },
    { label: 'Large Family', values: { alc2LoadsMonthly: '40', alc2WaterTemp: 'warm', alc2DryerSetting: 'high', alc2MachineAge: '5', alc2SoftenerCost: '0.15' } },
    { label: 'Single Minimalist', values: { alc2LoadsMonthly: '8', alc2WaterTemp: 'cold', alc2DryerSetting: 'auto', alc2MachineAge: '1', alc2SoftenerCost: '0' } },
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
    const airDrySavings = v.alc2DryerSetting !== 'none' ? (dryerEnergy * assumedRate * v.alc2LoadsMonthly) : 0
    const coldWaterSavings = v.alc2WaterTemp !== 'cold' ? ((tempEnergy[v.alc2WaterTemp] - 0.05) * assumedRate * v.alc2LoadsMonthly * 12) : 0
    return { result: monthlyTotal, label: 'Monthly Laundry Cost', unit: '$', steps: [{ label: 'Water Heating', value: `${energyPerLoad.toFixed(2)} kWh (${v.alc2WaterTemp})` }, { label: 'Dryer Energy', value: `${dryerEnergy.toFixed(1)} kWh (${v.alc2DryerSetting})` }, { label: 'Total Energy per Load', value: `(${energyPerLoad.toFixed(2)} + ${dryerEnergy.toFixed(1)}) × ${ageEfficiency.toFixed(3)} = ${totalKwh.toFixed(2)} kWh` }, { label: 'Energy Cost per Load', value: `${totalKwh.toFixed(2)} kWh × $0.13 = $${energyCost.toFixed(3)}` }, { label: 'Softener per Load', value: `$${v.alc2SoftenerCost.toFixed(2)}` }, { label: 'Cost per Load', value: `$${perLoad.toFixed(3)}` }, { label: 'Monthly Total', value: `$${monthlyTotal.toFixed(2)} (${v.alc2LoadsMonthly} loads)` }, { label: 'Annual Total', value: `$${annualTotal.toFixed(2)}` }] ,
    extras: [
      { label: 'Water Temperature Impact', value: `Hot water costs ${((0.35 - 0.05) / 0.05 * 100).toFixed(0)}× more than cold per load. Switching from ${v.alc2WaterTemp} to cold saves $${coldWaterSavings > 0 ? coldWaterSavings.toFixed(2) : '0'}/year. Most modern detergents work fine in cold water.` },
      { label: 'Air Dry Savings', value: `${v.alc2DryerSetting !== 'none' ? 'Switching from ' + v.alc2DryerSetting + ' drying to air drying would save $' + airDrySavings.toFixed(2) + '/month ($' + (airDrySavings * 12).toFixed(2) + '/year) and extend garment life by 2-3×.' : 'You already air dry — saving $' + (dryerSettings['high'] * assumedRate * v.alc2LoadsMonthly).toFixed(2) + '/month vs high heat drying.'}` },
      { label: 'Machine Age Efficiency Loss', value: `Your ${v.alc2MachineAge}-year-old machine operates at ${(ageEfficiency * 100).toFixed(1)}% efficiency. Each year adds ~1% more energy use. A new Energy Star washer uses 50% less energy and 40% less water.` },
      { label: 'Dryer Sensor vs Timed', value: `Auto dry sensors stop when clothes are dry, saving 30% energy vs timed high heat. At your ${v.alc2LoadsMonthly} loads/month, that is ~$${(dryerSettings['high'] * 0.3 * assumedRate * v.alc2LoadsMonthly).toFixed(2)}/month saved.` },
      { label: 'Fabric Softener Value', value: `At $${v.alc2SoftenerCost.toFixed(2)}/load, softener costs $${(v.alc2SoftenerCost * v.alc2LoadsMonthly).toFixed(2)}/month. White vinegar ($0.02/load) softens naturally without coating fibers. Dryer sheets ($0.05-0.10/load) can be replaced by wool dryer balls ($10, lasts 1000+ loads).` },
      { label: 'Load Size Optimization', value: 'A full load uses the same energy as a half load. Combining small loads into fewer full loads reduces per-item cost by up to 50%. At ' + `${v.alc2LoadsMonthly}` + ' loads/month, optimizing load size could save ~$' + `${(monthlyTotal * 0.2).toFixed(2)}` + '/month.' },
      { label: 'Off-Peak Timing', value: `Running your washer/dryer during off-peak hours (after 9 PM or before 7 AM) can save 10-30% on electricity if your utility has time-of-use rates. That is ~$${(monthlyTotal * 0.15).toFixed(2)}/month savings.` },
    ]}
  },
  description: 'Estimate your laundry costs based on water temperature, dryer settings, machine age, and fabric softener. Compare hot vs cold, air vs machine dry, and see efficiency savings from modern appliances.',
  formula: 'Per Load = ((Water kWh + Dryer kWh) × Age Efficiency × $0.13/kWh) + Softener Cost | Monthly = Per Load × Loads | Age Efficiency = 1 − Years × 0.01',
  interpretation: 'Hot water costs 7× more than cold per load — cold washing with modern detergent is just as effective and saves $30-50/year. Auto-dry sensors cut dryer energy by 30% vs timed high heat. Machines lose ~1% efficiency per year; a 10-year-old washer costs 10% more to run. Air drying saves $0.30-0.50/load and extends garment life 2-3×. Fabric softener ($0.10-0.15/load) can be replaced by vinegar ($0.02) or wool dryer balls. A typical family spends $15-30/month on laundry energy and supplies.'
}

export default calcDef
