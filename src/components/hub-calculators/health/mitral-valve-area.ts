import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ pht: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'pht', label:'Pressure Half-Time (ms)', type:'number', min:0, step:'1' }],
  compute: (v) => { const pht=parseFloat(v.pht)||220; const area=220/pht; const severity=area>1.5?'Mild':area>1?'Moderate':'Severe'; return { result:area, label:'Mitral Valve Area', unit:'cm²', steps:[{ label:'Pressure Half-Time', value:pht.toFixed(0)+' ms' },{ label:'MVA (PHT Method)', value:area.toFixed(2)+' cm²' },{ label:'Severity', value:severity }] } },
  description: 'Mitral valve area calculated from pressure half-time (PHT) by Doppler echocardiography.',
  formula: 'MVA = 220 / PHT (Pressure Half-Time in ms). Validated Hatle formula.',
  interpretation: 'Normal: 4-6 cm². Mild MS: >1.5 cm². Moderate MS: 1.0-1.5 cm². Severe MS: <1.0 cm².'
}

export default calcDef
