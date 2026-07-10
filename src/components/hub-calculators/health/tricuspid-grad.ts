import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ trVelocity: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'trVelocity', label:'Tricuspid Regurgitation Velocity (m/s)', type:'number', min:0.5, max:6, step:'0.1' }],
  compute: (v) => { const vel=parseFloat(v.trVelocity)||2.8; const grad=4*vel*vel; return { result:grad, label:'Tricuspid Regurgitation Gradient', unit:'mmHg', steps:[{ label:'TR Velocity', value:vel.toFixed(1)+' m/s' },{ label:'TR Gradient (4V²)', value:grad.toFixed(1)+' mmHg' }] } },
  description: 'The tricuspid regurgitation gradient estimates pulmonary artery systolic pressure using Doppler echocardiography.',
  formula: 'TR Gradient = 4 × (TR Velocity)² (Bernoulli equation)',
  interpretation: 'Normal: <25 mmHg. Mild pulmonary HTN: 25-35 mmHg. Moderate: 35-45 mmHg. Severe: >45 mmHg. Adding estimated RAP gives pulmonary artery systolic pressure (PASP).'
}
export default calcDef
