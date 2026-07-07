import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ radius: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), period: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'radius', label: 'Radius', type: 'number', unit: 'm', min: 0.001, step: '0.001' }, { name: 'period', label: 'Period', type: 'number', unit: 's', min: 0.001, step: '0.001' }],
  compute: (v) => { const speed = 2 * Math.PI * v.radius / v.period; const accel = speed * speed / v.radius; return { result: speed, label: 'Orbital Speed', unit: 'm/s', steps: [{ label: 'Formula', value: 'v = 2πr/T' }, { label: 'Speed', value: `${speed.toFixed(3)} m/s` }, { label: 'Centripetal acceleration', value: `${accel.toFixed(3)} m/s^2` }] } },
  description: 'Uniform circular motion: speed and centripetal acceleration for an object moving in a circle at constant speed.',
  formula: 'v = 2πr/T, a = v^2/r',
  interpretation: 'Even at constant speed, centripetal acceleration always points toward the center. The net centripetal force required is F = mv^2/r.'
}

export default calcDef
