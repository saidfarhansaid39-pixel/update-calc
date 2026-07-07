import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ uesHouseSize: z.string().min(1), uesSeason: z.string().min(1), uesPeople: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), uesHeatingType: z.string().min(1) }),
  fields: [
    { name: 'uesHouseSize', label: 'Home Size', type: 'select', options: [{ label: 'Apartment (<750 sqft)', value: 'apt' }, { label: 'Small Home (750-1,200 sqft)', value: 'small' }, { label: 'Medium Home (1,201-2,000 sqft)', value: 'medium' }, { label: 'Large Home (2,001-3,000 sqft)', value: 'large' }, { label: 'Mansion (3,000+ sqft)', value: 'mansion' }] },
    { name: 'uesSeason', label: 'Season', type: 'select', options: [{ label: 'Winter (peak)', value: 'winter' }, { label: 'Summer (peak)', value: 'summer' }, { label: 'Spring/Fall (mild)', value: 'mild' }] },
    { name: 'uesPeople', label: 'Number of People', type: 'number', min: 1, step: '1' },
    { name: 'uesHeatingType', label: 'Heating/Cooling Type', type: 'select', options: [{ label: 'Electric (HVAC/Heat Pump)', value: 'electric' }, { label: 'Natural Gas Furnace', value: 'gas' }, { label: 'Oil/Propane', value: 'oil' }, { label: 'Geothermal/Solar', value: 'green' }] },
  ],
  compute: (v) => {
    const sizeBase: Record<string, number> = { apt: 80, small: 120, medium: 170, large: 230, mansion: 350 }
    const seasonFactors: Record<string, number> = { winter: 1.4, summer: 1.3, mild: 0.85 }
    const heatingCostFactors: Record<string, number> = { electric: 1, gas: 0.8, oil: 1.2, green: 0.5 }
    const base = sizeBase[v.uesHouseSize] || 170
    const seasonAdj = seasonFactors[v.uesSeason] || 1
    const heatingAdj = heatingCostFactors[v.uesHeatingType] || 1
    const peopleFactor = 1 + (v.uesPeople - 1) * 0.15
    const estimatedBill = base * seasonAdj * heatingAdj * peopleFactor
    const low = estimatedBill * 0.85
    const high = estimatedBill * 1.15
    return { result: estimatedBill, label: 'Estimated Utility Bill', unit: '$', steps: [{ label: 'Base by Size', value: '$' + base.toFixed(0) }, { label: 'Season Adjustment', value: seasonAdj + 'x' }, { label: 'Heating Type', value: heatingAdj + 'x' }, { label: 'Occupant Factor', value: peopleFactor.toFixed(2) + 'x' }, { label: 'Estimated Bill', value: '$' + estimatedBill.toFixed(0) }, { label: 'Typical Range', value: '$' + low.toFixed(0) + ' - $' + high.toFixed(0) }] }
  },
  description: 'Quick utility bill estimate based on home size, season, occupant count, and heating/cooling type. Get a realistic monthly range.',
  formula: 'Estimate = Base(by size) x Season x HeatingType x Occupants | Range = Estimate +/- 15%',
  interpretation: 'Gas heat is typically 20% cheaper than electric in winter. Geothermal/solar halves utility costs. Summer electric peaks with AC ($150-400). Insulation and programmable thermostats reduce bills 10-20%.'
}

export default calcDef
