import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ pressure: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), velocity: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), height: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'pressure', label: 'Static Pressure P', type: 'number', unit: 'Pa', min: 0, step: '100' }, { name: 'velocity', label: 'Flow Velocity v', type: 'number', unit: 'm/s', min: 0, step: '0.1' }, { name: 'height', label: 'Height h', type: 'number', unit: 'm', min: 0, step: '0.1' }],
  compute: (v) => { const rho = 1000; const P_total = v.pressure + 0.5 * rho * v.velocity * v.velocity + rho * 9.81 * v.height; return { result: P_total, label: 'Total Pressure (Bernoulli)', unit: 'Pa', steps: [{ label: 'Formula', value: 'P + ½ρv² + ρgh = constant' }, { label: 'Dynamic pressure', value: `${(0.5 * rho * v.velocity * v.velocity).toFixed(1)} Pa` }, { label: 'Hydrostatic', value: `${(rho * 9.81 * v.height).toFixed(1)} Pa` }, { label: 'Total', value: `${P_total.toFixed(1)} Pa` }] } },
  description: 'Bernoulli\'s equation for ideal fluid flow: the sum of static pressure, dynamic pressure, and hydrostatic pressure is constant along a streamline.',
  formula: 'P + ½ρv² + ρgh = constant',
  interpretation: 'For water (ρ = 1000 kg/m³), increasing flow velocity decreases static pressure. This explains lift on airplane wings (air moves faster over the top) and the operation of atomizers and Venturi meters.'
}

export default calcDef
