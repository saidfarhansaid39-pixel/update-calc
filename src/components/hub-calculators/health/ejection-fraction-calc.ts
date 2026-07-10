import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ strokeVolume: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), endDiastolicVolume: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'strokeVolume', label:'Stroke Volume (mL)', type:'number', min:10, max:200, step:'1' }, { name:'endDiastolicVolume', label:'End-Diastolic Volume (mL)', type:'number', min:50, max:300, step:'1' }],
  compute: (v) => { const sv=parseFloat(v.strokeVolume)||70; const edv=parseFloat(v.endDiastolicVolume)||140; const ef=(sv/edv)*100; return { result:ef, label:'Ejection Fraction', unit:'%', steps:[{ label:'Stroke Volume', value:sv.toFixed(0)+' mL' },{ label:'EDV', value:edv.toFixed(0)+' mL' },{ label:'Ejection Fraction', value:ef.toFixed(1)+'%' }] } },
  description: 'Ejection fraction measures the percentage of blood pumped out of the left ventricle with each contraction.',
  formula: 'EF = (SV / EDV) × 100%',
  interpretation: 'Normal: 50-70%. Mildly reduced: 40-49%. Moderately reduced: 30-39%. Severely reduced: <30%. EF <35% qualifies for ICD consideration. EF >70% may indicate hypertrophic cardiomyopathy.'
}
export default calcDef
