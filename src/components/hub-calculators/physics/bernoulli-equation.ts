import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ pressure: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), velocity: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), height: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'pressure', label: 'Static Pressure P', type: 'number', unit: 'Pa', min: 0, step: '100' }, { name: 'velocity', label: 'Flow Velocity v', type: 'number', unit: 'm/s', min: 0, step: '0.1' }, { name: 'height', label: 'Height h', type: 'number', unit: 'm', min: 0, step: '0.1' }],
  defaults: { velocity: '5', pressure: '200000', height: '0' },
  presets: [
    { label: 'Water pipe (2 m/s, 300 kPa)', values: { velocity: '2', pressure: '300000', height: '0' } },
    { label: 'Airplane wing (80 m/s, 101 kPa)', values: { velocity: '80', pressure: '101325', height: '10000' } },
    { label: 'Venturi tube (10 m/s, 200 kPa)', values: { velocity: '10', pressure: '200000', height: '0' } },
  ],
  compute: (v) => { const rho = 1000; const P_total = v.pressure + 0.5 * rho * v.velocity * v.velocity + rho * 9.81 * v.height; return { result: P_total, label: 'Total Pressure (Bernoulli)', unit: 'Pa', steps: [{ label: 'Formula', value: 'P + ½ρv² + ρgh = constant' }, { label: 'Dynamic pressure', value: `${(0.5 * rho * v.velocity * v.velocity).toFixed(1)} Pa` }, { label: 'Hydrostatic', value: `${(rho * 9.81 * v.height).toFixed(1)} Pa` }, { label: 'Total', value: `${P_total.toFixed(1)} Pa` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Bernoulli\'s principle explains airplane lift (faster air over curved wing = lower pressure), atomizers, and chimney drafts.' },
        { label: 'Common Values', value: 'Air density at sea level: 1.225 kg/m³. Water density: 1000 kg/m³. Typical water main pressure: 300-500 kPa.' },
        { label: 'Precision Tip', value: 'Bernoulli assumes steady, incompressible, inviscid flow along a streamline. Real fluids have viscosity — use Bernoulli with the Darcy-Weisbach correction for pipes.' },
        { label: 'Related Formula', value: 'P + ½ρv² + ρgh = constant. Continuity equation: A₁v₁ = A₂v₂. Venturi effect: P decreases where velocity increases.' },
        { label: 'Unit Conversion Note', value: 'Pressure in Pa. 1 atm = 101325 Pa. 1 bar = 10⁵ Pa. 1 psi = 6895 Pa. Velocity in m/s.' }
      ]} },
  description: 'Bernoulli\'s equation for ideal fluid flow: the sum of static pressure, dynamic pressure, and hydrostatic pressure is constant along a streamline.',
  formula: 'P + ½ρv² + ρgh = constant',
  interpretation: 'For water (ρ = 1000 kg/m³), increasing flow velocity decreases static pressure. This explains lift on airplane wings (air moves faster over the top) and the operation of atomizers and Venturi meters.'
}

export default calcDef
