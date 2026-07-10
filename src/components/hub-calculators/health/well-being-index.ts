import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ cheerful: z.string().min(1), calm: z.string().min(1), active: z.string().min(1), fresh: z.string().min(1), interesting: z.string().min(1) }),
  fields: [
    { name:'cheerful', label:'I have felt cheerful and in good spirits', type:'select', options:[{ label:'All of the time (5)', value:'5' },{ label:'Most of the time (4)', value:'4' },{ label:'More than half (3)', value:'3' },{ label:'Less than half (2)', value:'2' },{ label:'Some of the time (1)', value:'1' },{ label:'At no time (0)', value:'0' }] },
    { name:'calm', label:'I have felt calm and relaxed', type:'select', options:[{ label:'All of the time (5)', value:'5' },{ label:'Most of the time (4)', value:'4' },{ label:'More than half (3)', value:'3' },{ label:'Less than half (2)', value:'2' },{ label:'Some of the time (1)', value:'1' },{ label:'At no time (0)', value:'0' }] },
    { name:'active', label:'I have felt active and vigorous', type:'select', options:[{ label:'All of the time (5)', value:'5' },{ label:'Most of the time (4)', value:'4' },{ label:'More than half (3)', value:'3' },{ label:'Less than half (2)', value:'2' },{ label:'Some of the time (1)', value:'1' },{ label:'At no time (0)', value:'0' }] },
    { name:'fresh', label:'I woke up feeling fresh and rested', type:'select', options:[{ label:'All of the time (5)', value:'5' },{ label:'Most of the time (4)', value:'4' },{ label:'More than half (3)', value:'3' },{ label:'Less than half (2)', value:'2' },{ label:'Some of the time (1)', value:'1' },{ label:'At no time (0)', value:'0' }] },
    { name:'interesting', label:'My daily life has been interesting', type:'select', options:[{ label:'All of the time (5)', value:'5' },{ label:'Most of the time (4)', value:'4' },{ label:'More than half (3)', value:'3' },{ label:'Less than half (2)', value:'2' },{ label:'Some of the time (1)', value:'1' },{ label:'At no time (0)', value:'0' }] }
  ],
  compute: (v) => { const s=parseInt(v.cheerful||'3')+parseInt(v.calm||'3')+parseInt(v.active||'3')+parseInt(v.fresh||'3')+parseInt(v.interesting||'3'); const pct=s*4; let status='Good'; if(pct<=28) status='Poor'; else if(pct<=50) status='Fair'; return { result:pct, label:'WHO-5 Well-Being Index', unit:'%', steps:[{ label:'Raw Score', value:s+'/25' },{ label:'Percentage', value:pct+'%' },{ label:'Well-Being', value:status }] } },
  description: 'WHO-5 Well-Being Index screening for psychological well-being over the past two weeks.',
  formula: 'Raw score = sum of 5 items (0-5 each). Percentage = raw score × 4. Range 0-100%.',
  interpretation: '<28% indicates likely depression. 28-50% suggests possible distress. >50% is adequate well-being.'
}
export default calcDef
