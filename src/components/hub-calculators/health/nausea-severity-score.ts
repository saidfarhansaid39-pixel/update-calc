import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ nauseaFreq: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), vomitingFreq: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), appetiteLoss: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), retchingDistress: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), interference: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4') }),
  fields: [
    { name:'nauseaFreq', label:'Nausea Frequency (0=never, 4=constant)', type:'number', min:0, max:4, step:'1' },
    { name:'vomitingFreq', label:'Vomiting Episodes (0=none, 4=severe)', type:'number', min:0, max:4, step:'1' },
    { name:'appetiteLoss', label:'Appetite Loss (0=none, 4=complete)', type:'number', min:0, max:4, step:'1' },
    { name:'retchingDistress', label:'Retching/Dry Heaves (0=none, 4=severe)', type:'number', min:0, max:4, step:'1' },
    { name:'interference', label:'Interference with Daily Life (0=none, 4=severe)', type:'number', min:0, max:4, step:'1' }
  ],
  compute: (v) => { const s=parseInt(v.nauseaFreq||'0')+parseInt(v.vomitingFreq||'0')+parseInt(v.appetiteLoss||'0')+parseInt(v.retchingDistress||'0')+parseInt(v.interference||'0'); let sev='Mild'; if(s>=15) sev='Severe'; else if(s>=9) sev='Moderate'; return { result:s, label:'Nausea Severity Score', unit:'/20', steps:[{ label:'Score', value:s+'/20' },{ label:'Severity', value:sev }] } },
  description: 'Assessment of nausea and vomiting severity across frequency and impact domains.',
  formula: 'Sum of 5 domains scored 0-4 each. Range 0-20.',
  interpretation: '0-4 Mild, 5-8 Moderate, 9-14 Moderately Severe, 15-20 Severe nausea/vomiting.'
}
export default calcDef
