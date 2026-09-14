import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), height: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'height', label: 'Height', type: 'number', unit: 'm', min: 0, step: '0.1' }],
  defaults: { mass: '70', height: '5' },
  presets: [
    { label: 'Lift 10 kg to 2 m', values: { mass: '10', height: '2' } },
    { label: 'Climb stairs (70 kg, 10 m)', values: { mass: '70', height: '10' } },
    { label: 'Elevator (1000 kg, 50 m)', values: { mass: '1000', height: '50' } },
  ],
  compute: (v) => ({ result: v.mass * 9.81 * v.height, label: 'Potential Energy', unit: 'J', steps: [{ label: 'Formula', value: 'PE = mgh' }, { label: 'g', value: '9.81 m/s^2' }, { label: 'Substitute', value: `${v.mass} × 9.81 × ${v.height}` }, { label: 'Result', value: `${(v.mass * 9.81 * v.height).toFixed(2)} J` }],
      extras: [
        { label: 'Real-World Application', value: 'Gravitational potential energy powers hydroelectric dams. Water stored at height converts PE to KE then electricity. A 100 m dam stores ~1 MJ per m³ of water.' },
        { label: 'Common Values', value: 'Person climbing 10 m: ~6.9 kJ. 1 L water at 100 m: ~981 J. Apple on a tree (0.2 kg, 2 m): ~3.9 J.' },
        { label: 'Precision Tip', value: 'PE reference point is arbitrary. Only changes in PE matter physically. Earth surface is the usual reference, but any level works.' },
        { label: 'Related Formula', value: 'PE = mgh. Elastic PE: PE_spring = ½kx². Gravitational PE general: U = -GMm/r. Conversion: PE → KE as object falls.' },
        { label: 'Unit Conversion Note', value: 'g = 9.81 m/s² (varies slightly by location). 1 J lifts ~0.102 kg by 1 m. 1 kWh = 3.6 MJ = lifting ~367 tons 1 m.' }
      ] }),
  description: 'Gravitational potential energy is the energy stored by an object due to its height above a reference point. PE = mgh.',
  formula: 'PE = mgh',
  interpretation: 'Potential energy depends on mass, gravitational acceleration (9.81 m/s^2 on Earth), and height. It converts to kinetic energy when the object falls.'
}

export default calcDef
