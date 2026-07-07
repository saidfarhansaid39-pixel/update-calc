import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ watts: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), runtime: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fuelTank: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'watts', label: 'Total Load (watts)', type: 'number', min: 100, step: '100' },
    { name: 'runtime', label: 'Runtime at 50% Load (hours)', type: 'number', min: 1, step: '1' },
    { name: 'fuelTank', label: 'Fuel Tank Capacity (gallons)', type: 'number', min: 0.5, step: '0.5' },
  ],
  compute: (v) => {
    const kva = v.watts / 1000
    const fuelPerHour = v.fuelTank / v.runtime
    const fuelPerDay = fuelPerHour * 24
    return { result: kva, label: 'Generator Size Needed', unit: 'kVA', steps: [{ label: 'Load', value: `${v.watts} W` }, { label: 'kVA', value: `${kva.toFixed(2)} kVA` }, { label: 'Fuel Consumption', value: `${fuelPerHour.toFixed(2)} gal/hr` }, { label: 'Runtime per Tank', value: `${v.runtime} hrs` }] }
  },
  description: 'Calculate generator size needed for your appliances and tools. Enter total wattage of devices you want to power, expected runtime, and fuel tank capacity.',
  formula: 'kVA = Watts / 1000 | Fuel Rate = Tank / Runtime',
  interpretation: 'Add 20% headroom for motor startup surges. Critical loads (fridge, lights, sump pump) typically need 3000-5000W. Whole house: 15000-30000W. Running a generator at >90% load reduces efficiency and lifespan.'
}

export default calcDef
