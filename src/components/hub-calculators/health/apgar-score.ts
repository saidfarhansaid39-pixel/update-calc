import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ appearance: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), pulse: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), grimace: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), activity: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), respiration: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'appearance', label:'Appearance (0-2)', type:'number', min:0, max:2, step:'1' }, { name:'pulse', label:'Pulse (0-2)', type:'number', min:0, max:2, step:'1' }, { name:'grimace', label:'Grimace (0-2)', type:'number', min:0, max:2, step:'1' }, { name:'activity', label:'Activity (0-2)', type:'number', min:0, max:2, step:'1' }, { name:'respiration', label:'Respiration (0-2)', type:'number', min:0, max:2, step:'1' }],
  compute: (v) => { const ap=parseInt(v.appearance)||0; const p=parseInt(v.pulse)||0; const gr=parseInt(v.grimace)||0; const ac=parseInt(v.activity)||0; const r=parseInt(v.respiration)||0; const total=ap+p+gr+ac+r; const status=total>=7?'Normal':total>=4?'Moderately Abnormal':'Severely Abnormal'; return { result:total, label:'APGAR Score', unit:'', steps:[{ label:'Appearance', value:ap.toString() },{ label:'Pulse', value:p.toString() },{ label:'Grimace', value:gr.toString() },{ label:'Activity', value:ac.toString() },{ label:'Respiration', value:r.toString() },{ label:'Total (0-10)', value:total.toString() }] } },
  description: 'APGAR newborn assessment across Appearance, Pulse, Grimace, Activity, Respiration.',
  formula: 'APGAR = Appearance + Pulse + Grimace + Activity + Respiration (each 0-2, total 0-10).',
  interpretation: '7-10: Normal; 4-6: Moderately abnormal, may need intervention; 0-3: Severely abnormal, resuscitation.'
}

export default calcDef
