import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalHarvest: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), harvestUnit: z.string().min(1), area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), areaUnit: z.string().min(1) }),
  fields: [
    { name: 'totalHarvest', label: 'Total Harvest', type: 'number', min: 1, step: '10' },
    { name: 'harvestUnit', label: 'Harvest Unit', type: 'select', options: [{ label: 'Bushels', value: 'bushel' }, { label: 'Pounds', value: 'lb' }, { label: 'Tons', value: 'ton' }, { label: 'Kilograms', value: 'kg' }] },
    { name: 'area', label: 'Field Area', type: 'number', min: 0.1, step: '0.5' },
    { name: 'areaUnit', label: 'Area Unit', type: 'select', options: [{ label: 'Acres', value: 'acre' }, { label: 'Hectares', value: 'ha' }] },
  ],
  compute: (v) => {
    const areaAcres = v.areaUnit === 'ha' ? v.area * 2.471 : v.area
    const yieldPerAcre = v.totalHarvest / areaAcres
    return { result: yieldPerAcre, label: 'Yield per Acre', unit: `per acre`, steps: [{ label: 'Total Harvest', value: `${v.totalHarvest} ${v.harvestUnit}` }, { label: 'Field Area', value: `${areaAcres.toFixed(2)} acres` }, { label: 'Yield per Acre', value: `${yieldPerAcre.toFixed(2)} ${v.harvestUnit}/acre` }] }
  },
  description: 'Calculate crop yield per acre or hectare from total harvest and field area. Compare yields across fields and against regional averages.',
  formula: 'Yield per Acre = Total Harvest / Field Area(acres)',
  interpretation: 'Typical yields: corn 150-200 bu/acre, soybeans 40-70 bu/acre, wheat 40-80 bu/acre. Yield is the primary driver of farm profitability. Test soil and optimize inputs to maximize yield per dollar spent.'
}

export default calcDef
