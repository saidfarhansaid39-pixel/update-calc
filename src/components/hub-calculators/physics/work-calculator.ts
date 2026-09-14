import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ force: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'force', label: 'Force', type: 'number', unit: 'N', min: 0.001, step: '0.001' }, { name: 'distance', label: 'Distance', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  defaults: { force: '100', distance: '2' },
  presets: [
    { label: 'Lift 10 kg 1 m', values: { force: '98.1', distance: '1' } },
    { label: 'Push car 10 m (500 N)', values: { force: '500', distance: '10' } },
    { label: 'Climb stairs (70 kg, 3 m)', values: { force: '686.7', distance: '3' } },
  ],
  compute: (v) => {
    const w = v.force * v.distance
    const cal = w / 4.184
    const wh = w / 3600
    const btu = w / 1055.06
    const liftMass = w / 9.80665
    return {
      result: w, label: 'Work', unit: 'J',
      steps: [
        { label: 'Formula', value: 'W = F × d' },
        { label: 'Substitute', value: `${Number(v.force).toFixed(2)} × ${Number(v.distance).toFixed(2)}` },
        { label: 'Work', value: `${w.toFixed(2)} J` },
        { label: 'Energy (calories)', value: `${cal.toFixed(4)} cal (${(cal / 1000).toFixed(6)} kcal)` },
        { label: 'Energy (watt-hours)', value: `${wh.toFixed(6)} Wh` },
        { label: 'Energy (BTU)', value: `${btu.toFixed(6)} BTU` },
        { label: 'Lift equivalent', value: `${liftMass.toFixed(2)} kg lifted 1 m against gravity` },
      ],
      extras: [
        { label: 'Work (J)', value: w.toFixed(2) },
        { label: 'Calories', value: (cal / 1000).toFixed(4) + ' kcal' },
        { label: 'Watt-hours', value: wh.toFixed(4) + ' Wh' },
        { label: 'BTU', value: btu.toFixed(4) },
        { label: 'Lift equivalent', value: liftMass.toFixed(2) + ' kg lifted 1 m' },
        { label: '1 kWh = 3.6 MJ', value: '1 kWh = 3.6 × 10⁶ J = 860 kcal ≈ 860 food calories' },
        { label: 'Human efficiency', value: '~25% metabolic → mechanical. 100 kcal expended ≈ 25 kcal of work' },
      ],
    }
  },
  description: 'Work is the energy transferred when a force moves an object through a distance. Converts to calories, watt-hours, and BTU for real-world context.',
  formula: 'W = F × d | 1 cal = 4.184 J | 1 Wh = 3600 J | 1 BTU = 1055 J',
  interpretation: 'Lifting a 10 kg mass 1 m requires ~98 J of work (~23 cal metabolic energy at 25% efficiency). 1 kWh of electricity is ~860 kcal.'
}

export default calcDef
