import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ pressure: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), height: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'pressure', label: 'Static Pressure', type: 'number', unit: 'Pa', min: 0, step: '100' }, { name: 'velocity', label: 'Fluid Velocity', type: 'number', unit: 'm/s', min: 0, step: '0.1' }, { name: 'height', label: 'Height', type: 'number', unit: 'm', min: 0, step: '0.1' }],
  compute: (v) => { const rho = 1000; const total = v.pressure + 0.5 * rho * v.velocity * v.velocity + rho * 9.81 * v.height; return { result: total, label: 'Total Bernoulli Constant', unit: 'Pa', steps: [{ label: 'Formula', value: 'P + ½ρv^2 + ρgh = constant' }, { label: 'Dynamic pressure', value: `${(0.5 * rho * v.velocity * v.velocity).toFixed(0)} Pa` }, { label: 'Hydrostatic', value: `${(rho * 9.81 * v.height).toFixed(0)} Pa` }, { label: 'Total', value: `${total.toFixed(0)} Pa` }] } },
  description: 'Bernoulli\'s equation relates pressure, velocity, and height in an ideal fluid. Total energy per unit volume is conserved.',
  formula: 'P + ½ρv^2 + ρgh = constant',
  interpretation: 'For water (ρ = 1000 kg/m^3), increasing velocity decreases pressure. This explains airplane wing lift and carburetor function.'
}

export default calcDef
