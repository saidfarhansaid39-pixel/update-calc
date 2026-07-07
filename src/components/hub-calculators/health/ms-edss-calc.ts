import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ pyramidalScore: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), cerebellarScore: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), brainstemScore: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), sensoryScore: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0') }),
  fields: [{ name:'pyramidalScore', label:'Pyramidal (0-5)', type:'number', min:0, max:5, step:'1' }, { name:'cerebellarScore', label:'Cerebellar (0-5)', type:'number', min:0, max:5, step:'1' }, { name:'brainstemScore', label:'Brainstem (0-5)', type:'number', min:0, max:5, step:'1' }, { name:'sensoryScore', label:'Sensory (0-5)', type:'number', min:0, max:5, step:'1' }],
  compute: (v) => { const py=parseFloat(v.pyramidalScore)||0; const cb=parseFloat(v.cerebellarScore)||0; const bs=parseFloat(v.brainstemScore)||0; const se=parseFloat(v.sensoryScore)||0; const maxFs=Math.max(py,cb,bs,se); let edss=0; if(maxFs===0)edss=0; else if(maxFs===1)edss=1+(py+cb+bs+se>1?0.5:0); else if(maxFs<=2)edss=2+(py+cb+bs+se>2?1:0); else if(maxFs<=3)edss=3+(py+cb+bs+se>3?0.5:0); else if(maxFs<=4)edss=4+Math.floor((py+cb+bs+se)/4); else if(maxFs===5)edss=5; else edss=Math.min(maxFs+2,10); return { result:edss, label:'EDSS Score', unit:'', steps:[{ label:'Pyramidal', value:py.toFixed(0) },{ label:'Cerebellar', value:cb.toFixed(0) },{ label:'Brainstem', value:bs.toFixed(0) },{ label:'Sensory', value:se.toFixed(0) },{ label:'EDSS (estimated)', value:edss.toFixed(1) }] } },
  description: 'EDSS (Expanded Disability Status Scale) estimates MS disability from functional system scores.',
  formula: 'EDSS derived from functional system scores (0-5 per system). Higher scores represent greater disability.',
  interpretation: '0: Normal; 1-1.5: No disability/minimal signs; 2-2.5: Minimal disability; 3-4.5: Moderate disability (fully ambulatory); 5-7.5: Increasing ambulatory impairment; 8-9.5: Restricted to bed/chair; 10: Death from MS.'
}

export default calcDef
