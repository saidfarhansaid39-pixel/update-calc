import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ distance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0), ballWeight: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0), weight: z.string().optional().refine(v => !v || parseFloat(v) > 0) }),
  fields: [
    { name: 'distance', label: 'Throw Distance', type: 'number', unit: 'm', min: 0.5, step: '0.1' },
    { name: 'ballWeight', label: 'Ball Weight', type: 'number', unit: 'kg', min: 1, max: 20, step: '0.5' },
    { name: 'weight', label: 'Body Weight (optional)', type: 'number', unit: 'kg', min: 20, step: '0.5' },
  ],
  compute: (v) => {
    const vel = Math.sqrt(v.distance * 9.81 / Math.sin(2 * 35 * Math.PI / 180)); const power = 0.5 * v.ballWeight * vel * vel; const rel = v.weight ? power / v.weight : 0
    return { result: power, label: 'Estimated Power Output', unit: 'J', steps: [
      { label: 'Throw distance', value: v.distance+' m' }, { label: 'Ball weight', value: v.ballWeight+' kg' },
      { label: 'Est. release velocity', value: vel.toFixed(1)+' m/s' }, { label: 'Power', value: power.toFixed(0)+' J' },
      ...(v.weight ? [{ label: 'Relative power', value: rel.toFixed(1)+' J/kg' }] : []),
    ]}
  }, description: 'Calculate upper body power from the seated medicine ball chest throw test. Valid for assessing throwing athletes.', formula: 'Power = 0.5 × m_ball × (distance × g / sin(2θ))', interpretation: 'Higher throw power indicates greater upper body explosive strength. Track progress over training cycles.'
}

export default calcDef
