import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'velocity', label: 'Velocity', type: 'number', unit: 'm/s', min: 0, step: '0.1' }],
  defaults: { mass: '70', velocity: '10' },
  presets: [
    { label: 'Runner (70 kg @ 10 m/s)', values: { mass: '70', velocity: '10' } },
    { label: 'Car (1500 kg @ 20 m/s)', values: { mass: '1500', velocity: '20' } },
    { label: 'Baseball (0.145 kg @ 40 m/s)', values: { mass: '0.145', velocity: '40' } },
    { label: 'Bullet (0.004 kg @ 800 m/s)', values: { mass: '0.004', velocity: '800' } },
  ],
  compute: (v) => {
    const p = v.mass * v.velocity
    const ke = 0.5 * v.mass * v.velocity * v.velocity
    const impulse = p
    const lbf_s = p * 0.224809
    return {
      result: p, label: 'Momentum', unit: 'kg·m/s',
      steps: [
        { label: 'Formula', value: 'p = mv' },
        { label: 'Substitute', value: `${Number(v.mass).toExponential(3)} × ${Number(v.velocity).toExponential(3)}` },
        { label: 'Momentum', value: `${p.toFixed(2)} kg·m/s` },
        { label: 'Kinetic Energy (KE = ½mv²)', value: `${ke.toFixed(2)} J` },
        { label: 'Impulse (Δp)', value: `${impulse.toFixed(2)} N·s` },
        { label: 'Impulse (lbf·s)', value: `${lbf_s.toFixed(2)} lbf·s` },
      ],
      extras: [
        { label: 'Momentum', value: p.toFixed(2) + ' kg·m/s' },
        { label: 'Kinetic Energy', value: ke.toFixed(2) + ' J' },
        { label: 'Impulse (N·s)', value: impulse.toFixed(2) },
        { label: 'Impulse (lbf·s)', value: lbf_s.toFixed(2) },
        { label: 'Real-world comparison', value: v.mass > 100 ? `Equivalent to a ${v.mass.toFixed(0)} kg object` : `Similar momentum to a ${(p / 10).toFixed(1)} kg object at 10 m/s` },
        { label: 'Conservation note', value: 'In closed systems, total momentum before = total momentum after' },
        { label: 'Relativistic note', value: 'Formula p=mv is accurate for v < 0.1c. For relativistic speeds, use p = γmv' },
      ],
    }
  },
  description: 'Momentum is the product of mass and velocity, conserved in isolated systems. Also calculates kinetic energy and impulse.',
  formula: 'p = mv | KE = ½mv² | Impulse = Δp = FΔt',
  interpretation: 'Momentum is conserved in collisions. A 70 kg runner at 10 m/s has 700 kg·m/s of momentum — stopping requires an equal impulse.'
}

export default calcDef
