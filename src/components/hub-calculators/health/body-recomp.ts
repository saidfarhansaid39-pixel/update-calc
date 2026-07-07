import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), bodyFatPct: z.string().min(1,'Required').refine(v=>parseFloat(v)>=2,'≥2'), goalWeight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'weight', label:'Current Weight (kg)', type:'number', min:30, step:'0.1' }, { name:'bodyFatPct', label:'Body Fat %', type:'number', min:2, max:60, step:'0.1' }, { name:'goalWeight', label:'Goal Weight (kg)', type:'number', min:30, step:'0.1' }],
  compute: (v) => { const w=parseFloat(v.weight)||70; const bf=parseFloat(v.bodyFatPct)||15; const gw=parseFloat(v.goalWeight)||65; const fm=w*bf/100; const ffm=w-fm; const goalFm=gw*bf/100; const goalFfm=gw-goalFm; const diff=goalFfm-ffm; return { result:ffm, label:'Current FFM', unit:'kg', steps:[{ label:'Fat Mass', value:fm.toFixed(1) },{ label:'Fat-Free Mass', value:ffm.toFixed(1) },{ label:'Target FFM', value:goalFfm.toFixed(1) },{ label:'Change Needed', value:diff>=0?'Gain '+diff.toFixed(1):'Lose '+Math.abs(diff).toFixed(1) }] } },
  description: 'Body recomposition analysis of fat vs lean mass changes for goal weight.',
  formula: 'Fat Mass = W×BF%, FFM = W-FM. Recomp requires protein-sparing deficit + resistance training.',
  interpretation: 'Preserve or gain muscle while losing fat. Adequate protein (1.6-2.2 g/kg), 10-20% deficit, progressive overload.'
}

export default calcDef
