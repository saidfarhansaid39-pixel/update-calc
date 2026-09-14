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
  defaults: { alcLoadsPerWeek: '6', alcWasherType: 'front', alcDryerType: 'electric', alcDetergentCost: '0.25', alcWaterRate: '8', alcElectricRate: '0.14' },
  presets: [
    { label: 'Old Top-Loader', values: { alcLoadsPerWeek: '8', alcWasherType: 'top', alcDryerType: 'electric', alcDetergentCost: '0.3', alcWaterRate: '8', alcElectricRate: '0.14' } },
    { label: 'Efficient Front-Load', values: { alcLoadsPerWeek: '6', alcWasherType: 'front', alcDryerType: 'electric', alcDetergentCost: '0.2', alcWaterRate: '8', alcElectricRate: '0.12' } },
    { label: 'Gas Dryer + Air Dry', values: { alcLoadsPerWeek: '5', alcWasherType: 'front', alcDryerType: 'gas', alcDetergentCost: '0.15', alcWaterRate: '6', alcElectricRate: '0.14' } },
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
    const annualWater = waterGalVal * v.alcLoadsPerWeek * 52
    const annualKwh = totalKwh * v.alcLoadsPerWeek * 52
    return { result: monthly, label: 'Monthly Laundry Cost', unit: '$', steps: [{ label: 'Washer Energy', value: `${kwh.toFixed(1)} kWh (${v.alcWasherType})` }, { label: 'Dryer Energy', value: `${dryerKwhVal.toFixed(1)} kWh (${v.alcDryerType})` }, { label: 'Total Energy', value: `${totalKwh.toFixed(1)} kWh × $${v.alcElectricRate.toFixed(2)} = $${energyCost.toFixed(3)}` }, { label: 'Water Cost', value: `${waterGalVal} gal / 1000 × $${v.alcWaterRate.toFixed(2)} = $${waterCost.toFixed(3)}` }, { label: 'Detergent', value: `$${v.alcDetergentCost.toFixed(2)}` }, { label: 'Per Load Total', value: `$${energyCost.toFixed(3)} + $${waterCost.toFixed(3)} + $${v.alcDetergentCost.toFixed(2)} = $${perLoad.toFixed(3)}` }, { label: 'Monthly (${v.alcLoadsPerWeek} loads/wk)', value: `$${perLoad.toFixed(3)} × ${v.alcLoadsPerWeek} × 4.33 = $${monthly.toFixed(2)}` }, { label: 'Annual Cost', value: `$${annual.toFixed(2)}` }] ,
    extras: [
      { label: 'Washer Type Comparison', value: `Front-loaders use ${((30 - 12) / 30 * 100).toFixed(0)}% less water and ${((0.5 - 0.2) / 0.5 * 100).toFixed(0)}% less energy than top-loaders. Annual water savings: ${(30 - 12) * v.alcLoadsPerWeek * 52} gal = ~$${((30 - 12) / 1000 * v.alcWaterRate * v.alcLoadsPerWeek * 52).toFixed(0)}/year.` },
      { label: 'Gas vs Electric Dryer', value: `Gas dryers use ${((3.5 - 0.8) / 3.5 * 100).toFixed(0)}% less electricity. At $${v.alcElectricRate.toFixed(2)}/kWh, gas saves $${((3.5 - 0.8) * v.alcElectricRate * v.alcLoadsPerWeek * 52).toFixed(0)}/year. But gas dryers cost $50-100 more upfront — payback in ${(((3.5 - 0.8) * v.alcElectricRate * v.alcLoadsPerWeek * 52) > 0 ? (75 / ((3.5 - 0.8) * v.alcElectricRate * v.alcLoadsPerWeek * 52) * 12).toFixed(1) : 'N/A')} months.` },
      { label: 'Air Drying Math', value: `Switching from electric to air drying saves $${(3.5 * v.alcElectricRate * v.alcLoadsPerWeek * 52).toFixed(0)}/year. Bonus: clothes last 2-3× longer, saving $100-500/year on replacing faded/shrunken items.` },
      { label: 'Detergent Cost per Load', value: `At $${v.alcDetergentCost.toFixed(2)}/load, detergent costs $${(v.alcDetergentCost * v.alcLoadsPerWeek * 52).toFixed(0)}/year. Buying concentrated detergent in bulk ($0.10-0.15/load) vs pods ($0.25-0.50/load) saves $20-50/year.` },
      { label: 'Water + Sewer Reality', value: `Your washer uses ${waterGalVal} gal/load, costing $${waterCost.toFixed(3)}/load for water + sewer. Annual water: ~${annualWater.toFixed(0)} gal ($${(annualWater / 1000 * v.alcWaterRate).toFixed(0)}/year). Sewer rates are typically 1-2× water rates — check your bill.` },
      { label: 'Energy Consumption', value: `Laundry uses ${annualKwh.toFixed(0)} kWh/year — that is ${(annualKwh / 11000 * 100).toFixed(1)}% of an average US home's electricity (11,000 kWh/year). The dryer accounts for ${(dryerKwhVal / totalKwh * 100).toFixed(0)}% of laundry energy.` },
      { label: 'Cold Water Switch', value: 'Washing in cold water (rather than warm) saves the washer heating energy entirely — ~0.10-0.30 kWh/load. With modern detergents (Tide, Persil) formulated for cold, there is no cleaning trade-off. Savings: ~$' + `${(0.15 * v.alcElectricRate * v.alcLoadsPerWeek * 52).toFixed(0)}` + '/year.' },
    ]}
  },
  description: 'Calculate the true cost per load of laundry including washer type (top-load, front-load, HE), dryer type (electric, gas, air dry), detergent cost, water rates, and electricity rates. Compare appliance efficiency to find savings.',
  formula: 'Per Load = (Washer kWh + Dryer kWh) × Electric Rate + (Water Gal ÷ 1000 × Water Rate) + Detergent | Washer kWh: Top 0.5, HE Top 0.3, Front 0.2 | Dryer kWh: Electric 3.5, Gas 0.8, Air 0',
  interpretation: 'Front-load washers use 60% less water (12 vs 30 gal) and 40% less energy than standard top-loaders — saving $80-150/year. Gas dryers cost 50% less to run than electric (0.8 vs 3.5 kWh/load), saving $60-120/year. Air drying eliminates the $100-200/year dryer cost and extends garment life. A typical household (6 loads/week) spends $20-40/month on laundry energy, water, and detergent. Switching to a front-loader, gas dryer or air drying, and cold water can cut costs by 60%.'
}

export default calcDef
