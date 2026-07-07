import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ alcLoadsPerWeek: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), alcWasherType: z.string().min(1), alcDryerType: z.string().min(1), alcDetergentCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), alcWaterRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), alcElectricRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'alcLoadsPerWeek', label: 'Loads per Week', type: 'number', min: 1, step: '1' },
    { name: 'alcWasherType', label: 'Washing Machine Type', type: 'select', options: [{ label: 'Standard Top-Load', value: 'top' }, { label: 'High-Efficiency Front-Load', value: 'front' }, { label: 'HE Top-Load', value: 'he-top' }] },
    { name: 'alcDryerType', label: 'Dryer Type', type: 'select', options: [{ label: 'Electric (standard)', value: 'electric' }, { label: 'Gas Dryer', value: 'gas' }, { label: 'No Dryer (air dry)', value: 'none' }] },
    { name: 'alcDetergentCost', label: 'Detergent Cost per Load ($)', type: 'number', min: 0, step: '0.05' },
    { name: 'alcWaterRate', label: 'Water/Sewer Rate per 1000 gal ($)', type: 'number', min: 0, step: '2' },
    { name: 'alcElectricRate', label: 'Electricity Rate ($/kWh)', type: 'number', min: 0.01, step: '0.01' },
  ],
  compute: (v) => {
    const washerKwh: Record<string, number> = { top: 0.5, front: 0.2, 'he-top': 0.3 }
    const dryerKwh: Record<string, number> = { electric: 3.5, gas: 0.8, none: 0 }
    const waterGal: Record<string, number> = { top: 30, front: 12, 'he-top': 15 }
    const kwh = washerKwh[v.alcWasherType] || 0.5
    const dryerKwhVal = dryerKwh[v.alcDryerType] || 0
    const waterGalVal = waterGal[v.alcWasherType] || 30
    const totalKwh = kwh + dryerKwhVal
    const energyCost = totalKwh * v.alcElectricRate
    const waterCost = (waterGalVal / 1000) * v.alcWaterRate
    const perLoad = energyCost + waterCost + v.alcDetergentCost
    const weekly = perLoad * v.alcLoadsPerWeek
    const monthly = weekly * 4.33
    const annual = weekly * 52
    return { result: monthly, label: 'Monthly Laundry Cost', unit: '$', steps: [{ label: 'Energy per Load', value: `${totalKwh.toFixed(1)} kWh = $${energyCost.toFixed(3)}` }, { label: 'Water per Load', value: `${waterGalVal} gal = $${waterCost.toFixed(3)}` }, { label: 'Detergent per Load', value: `$${v.alcDetergentCost.toFixed(2)}` }, { label: 'Per Load Total', value: `$${perLoad.toFixed(3)}` }, { label: 'Monthly Cost', value: `$${monthly.toFixed(2)}` }, { label: 'Annual Cost', value: `$${annual.toFixed(2)}` }] }
  },
  description: 'Calculate the true cost per load of laundry including energy, water, detergent, and dryer type. Switch to high-efficiency appliances to save money.',
  formula: 'Per Load = (Washer kWh + Dryer kWh) × Electric Rate + (Water Gal/1000 × Water Rate) + Detergent',
  interpretation: 'Front-loaders use 60% less water and 40% less energy than top-loaders. Air drying saves $100-200/year on electricity. Gas dryers cost 50% less to run than electric. Washing in cold water saves $30-50/year.'
}

export default calcDef
