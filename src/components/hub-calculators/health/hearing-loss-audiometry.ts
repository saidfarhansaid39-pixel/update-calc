import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ freq500: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), freq1000: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), freq2000: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), freq4000: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), age: z.string().min(1,'Required').refine(v=>parseFloat(v)>=1,'≥1') }),
  fields: [{ name:'freq500', label:'500 Hz (dB HL)', type:'number', min:0, max:120, step:'5' }, { name:'freq1000', label:'1000 Hz (dB HL)', type:'number', min:0, max:120, step:'5' }, { name:'freq2000', label:'2000 Hz (dB HL)', type:'number', min:0, max:120, step:'5' }, { name:'freq4000', label:'4000 Hz (dB HL)', type:'number', min:0, max:120, step:'5' }, { name:'age', label:'Age (years)', type:'number', min:1, max:120, step:'1' }],
  compute: (v) => { const f5=parseFloat(v.freq500)||0; const f1=parseFloat(v.freq1000)||0; const f2=parseFloat(v.freq2000)||0; const f4=parseFloat(v.freq4000)||0; const pta=(f5+f1+f2)/3; const highFreq=(f2+f4)/2; const sev=pta<=20?'Normal':pta<=40?'Mild loss':pta<=55?'Moderate':pta<=70?'Moderately Severe':pta<=90?'Severe':'Profound'; return { result:pta, label:'PTA (dB HL)', unit:'dB', steps:[{ label:'PTA (500+1000+2000)/3', value:pta.toFixed(0) },{ label:'High Freq Avg', value:highFreq.toFixed(0) },{ label:'Severity', value:sev }] } },
  description: 'Pure-tone audiometry average (PTA) for hearing loss classification.',
  formula: 'PTA = (500+1000+2000 Hz)/3. Normal ≤20, Mild 21-40, Moderate 41-55, Mod-Sev 56-70, Severe 71-90, Profound >90.',
  interpretation: 'PTA used for hearing aid candidacy (≥40 dB). High-frequency loss common in presbycusis.'
}

export default calcDef
