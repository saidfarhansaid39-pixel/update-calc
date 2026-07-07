import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weightLoss: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), thirst: z.enum(['normal','increased','very-thirsty']), urine: z.enum(['normal','dark','very-dark']), skinTurgor: z.enum(['normal','reduced','tenting']) }),
  fields: [{ name:'weightLoss', label:'Weight Loss % (e.g., 3 = 3%)', type:'number', min:0, max:20, step:'0.5' }, { name:'thirst', label:'Thirst', type:'select', options:[{ label:'Normal', value:'normal' },{ label:'Increased', value:'increased' },{ label:'Very Thirsty', value:'very-thirsty' }] }, { name:'urine', label:'Urine Color', type:'select', options:[{ label:'Normal', value:'normal' },{ label:'Dark', value:'dark' },{ label:'Very Dark', value:'very-dark' }] }, { name:'skinTurgor', label:'Skin Turgor', type:'select', options:[{ label:'Normal', value:'normal' },{ label:'Reduced', value:'reduced' },{ label:'Tenting', value:'tenting' }] }],
  compute: (v) => { const wl=parseFloat(v.weightLoss)||0; const t=v.thirst||'normal'; const u=v.urine||'normal'; const s=v.skinTurgor||'normal'; const pts=wl+(t==='increased'?1:t==='very-thirsty'?2:0)+(u==='dark'?1:u==='very-dark'?2:0)+(s==='reduced'?1:s==='tenting'?2:0); const sev=pts<=2?'Minimal - maintain hydration':pts<=5?'Mild - increase fluid intake':pts<=8?'Moderate - consider ORS':pts<=11?'Severe - IV fluids indicated':'Critical - urgent IV fluids'; return { result:pts, label:'Dehydration Severity', unit:'', steps:[{ label:'Weight Loss %', value:wl.toString() },{ label:'Signs Score', value:(pts-wl).toString() },{ label:'Total', value:pts.toString() },{ label:'Severity', value:sev }] } },
  description: 'Dehydration assessment using weight loss percentage and clinical signs.',
  formula: 'Score = weight loss % + thirst + urine + skin turgor. Mild <5%, Moderate 5-10%, Severe >10%.',
  interpretation: 'Early: thirst, dark urine. Moderate: dry mucous membranes, tachycardia. Severe: hypotension, oliguria, confusion.'
}

export default calcDef
