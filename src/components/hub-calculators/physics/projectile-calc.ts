import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ velocity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), angle: z.string().min(1).refine(v => { const n = parseFloat(v); return n > 0 && n < 90 }, '0-90') }),
  fields: [{ name: 'velocity', label: 'Initial Velocity', type: 'number', unit: 'm/s', min: 0.1, step: '0.1' }, { name: 'angle', label: 'Launch Angle', type: 'number', unit: 'degrees', min: 1, max: 89, step: '1' }],
  defaults: { velocity: '50', angle: '45' },
  presets: [
    { label: 'Cannonball (45°, 100 m/s)', values: { velocity: '100', angle: '45' } },
    { label: 'Soccer kick (30°, 20 m/s)', values: { velocity: '20', angle: '30' } },
    { label: 'Basketball shot (55°, 8 m/s)', values: { velocity: '8', angle: '55' } },
  ],
  compute: (v) => { const rad = v.angle * Math.PI / 180; const range = v.velocity * v.velocity * Math.sin(2 * rad) / 9.81; const maxH = (v.velocity * v.velocity * Math.sin(rad) * Math.sin(rad)) / (2 * 9.81); const time = 2 * v.velocity * Math.sin(rad) / 9.81; return { result: range, label: 'Range', unit: 'm', steps: [{ label: 'Range', value: `${range.toFixed(2)} m` }, { label: 'Max Height', value: `${maxH.toFixed(2)} m` }, { label: 'Time of Flight', value: `${time.toFixed(2)} s` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Projectile motion governs sports (basketball, soccer, golf), ballistics, and fireworks. A 45° launch angle gives maximum range in a vacuum.' },
        { label: 'Common Values', value: 'Basketball free throw: ~8 m/s at 55°. Soccer goal kick: ~25 m/s at 30-40°. Golf drive: ~70 m/s at 10-15°.' },
        { label: 'Precision Tip', value: 'Air resistance is ignored in basic models. Real projectiles have lower range and asymmetric trajectories, especially at high speeds.' },
        { label: 'Related Formula', value: 'Range R = v²sin(2θ)/g. Max height H = v²sin²(θ)/(2g). Time of flight T = 2v sin(θ)/g.' },
        { label: 'Unit Conversion Note', value: 'Angle in degrees. g = 9.81 m/s². Convert mph to m/s: multiply by 0.447. Convert km/h to m/s: divide by 3.6.' }
      ]} },
  description: 'Projectile motion describes the trajectory of an object launched at an angle under gravity, assuming no air resistance.',
  formula: 'R = v^2 sin(2θ)/g',
  interpretation: 'The range is maximized at a 45° launch angle. The trajectory follows a parabolic path in ideal conditions.'
}

export default calcDef
