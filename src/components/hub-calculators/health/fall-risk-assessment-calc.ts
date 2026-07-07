import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=18,'≥18'), fallsHistory: z.enum(['none','one','multiple']), gait: z.enum(['normal','unsteady','impaired']), medications: z.enum(['none','1-3','4plus']), sensory: z.enum(['normal','impaired','severe']) }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:18, max:110, step:'1' }, { name:'fallsHistory', label:'Falls in Past Year', type:'select', options:[{ label:'None', value:'none' },{ label:'One', value:'one' },{ label:'Multiple', value:'multiple' }] }, { name:'gait', label:'Gait/Balance', type:'select', options:[{ label:'Normal', value:'normal' },{ label:'Unsteady', value:'unsteady' },{ label:'Impaired', value:'impaired' }] }, { name:'medications', label:'Medications (>4 = high risk)', type:'select', options:[{ label:'None', value:'none' },{ label:'1-3', value:'1-3' },{ label:'4+', value:'4plus' }] }, { name:'sensory', label:'Vision/Hearing', type:'select', options:[{ label:'Normal', value:'normal' },{ label:'Impaired', value:'impaired' },{ label:'Severe', value:'severe' }] }],
  compute: (v) => { const a=parseFloat(v.age)||40; const f=v.fallsHistory||'none'; const g=v.gait||'normal'; const m=v.medications||'none'; const s=v.sensory||'normal'; const score=(a>80?3:a>65?2:0)+(f==='multiple'?3:f==='one'?1:0)+(g==='impaired'?3:g==='unsteady'?2:0)+(m==='4plus'?2:m==='1-3'?1:0)+(s==='severe'?2:s==='impaired'?1:0); const risk=score>=8?'High - multifactorial intervention':score>=4?'Moderate - fall prevention program':'Low - universal precautions'; return { result:score, label:'Fall Risk Score', unit:'', steps:[{ label:'Age', value:(a>80?3:a>65?2:0).toString() },{ label:'Falls Hx', value:(f==='multiple'?3:f==='one'?1:0).toString() },{ label:'Gait', value:(g==='impaired'?3:g==='unsteady'?2:0).toString() },{ label:'Medications', value:(m==='4plus'?2:m==='1-3'?1:0).toString() },{ label:'Sensory', value:(s==='severe'?2:s==='impaired'?1:0).toString() },{ label:'Total', value:score.toString() }] } },
  description: 'Multifactorial fall risk assessment for older adults (adapted from CDC STEADI).',
  formula: 'Age+Falls+Gait+Medications+Sensory. Range 0-13. STEADI algorithm: screen, assess, intervene.',
  interpretation: '<4: Low, universal prevention. 4-7: Moderate, refer to PT. ≥8: High, comprehensive geriatric assessment.'
}

export default calcDef
