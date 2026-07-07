import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ueHomeSqft: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ueOccupants: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), ueClimate: z.string().min(1), ueIncludeInternet: z.string().min(1) }),
  fields: [
    { name: 'ueHomeSqft', label: 'Home Size (sq ft)', type: 'number', min: 300, step: '200' },
    { name: 'ueOccupants', label: 'Number of Occupants', type: 'number', min: 1, step: '1' },
    { name: 'ueClimate', label: 'Climate Region', type: 'select', options: [{ label: 'Cold (Northeast/Midwest)', value: 'cold' }, { label: 'Moderate (Pacific/Mountain)', value: 'moderate' }, { label: 'Hot (South/Southwest)', value: 'hot' }] },
    { name: 'ueIncludeInternet', label: 'Include Internet/Cable', type: 'select', options: [{ label: 'Yes (+$65)', value: 'yes' }, { label: 'No', value: 'no' }] },
  ],
  compute: (v) => {
    const sqftFactor = v.ueHomeSqft / 1000
    const occupantFactor = 1 + (v.ueOccupants - 1) * 0.2
    const climateBase: Record<string, any> = { cold: { electric: 80, gas: 90 }, moderate: { electric: 90, gas: 40 }, hot: { electric: 130, gas: 25 } }
    const base = climateBase[v.ueClimate] || climateBase.moderate
    const electric = base.electric * sqftFactor * occupantFactor
    const gas = base.gas * sqftFactor * occupantFactor
    const water = 30 * occupantFactor
    const trash = 25
    const internet = v.ueIncludeInternet === 'yes' ? 65 : 0
    const total = electric + gas + water + trash + internet
    return { result: total, label: 'Estimated Monthly Utilities', unit: '$', steps: [{ label: 'Electricity', value: '$' + electric.toFixed(0) }, { label: 'Gas', value: '$' + gas.toFixed(0) }, { label: 'Water/Sewer', value: '$' + water.toFixed(0) }, { label: 'Trash', value: '$' + trash.toFixed(0) }, { label: 'Internet', value: '$' + internet.toFixed(0) }, { label: 'Total Estimated', value: '$' + total.toFixed(0) }] }
  },
  description: 'Estimate monthly utility costs based on home size, number of occupants, climate region, and whether internet is included.',
  formula: 'Electric = BaseElec x (Sqft/1000) x (1+(Occupants-1)x0.2) | Same for gas | Water = $30 x OccupantFactor',
  interpretation: 'Smaller homes and moderate climates have lower costs ($150-250/month). Large homes in hot/cold climates: $350-600/month. Each additional occupant adds ~20% to usage. Internet adds $50-80/month.'
}

export default calcDef
