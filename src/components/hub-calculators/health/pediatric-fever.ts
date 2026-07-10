import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseInt(v)>=0,'>=0'), temp: z.string().min(1,'Required').refine(v=>parseFloat(v)>=34,'>=34'), tempMethod: z.string().min(1), duration: z.string().min(1,'Required').refine(v=>parseInt(v)>=0,'>=0'), symptoms: z.string().min(1), immunization: z.string().min(1) }),
  fields: [
    { name:'age', label:'Age (months)', type:'number', min:0, max:216, step:'1' },
    { name:'temp', label:'Temperature (°C)', type:'number', min:34, max:43, step:'0.1' },
    { name:'tempMethod', label:'Temperature Measurement Method', type:'select', options:[{ label:'Rectal', value:'rectal' },{ label:'Oral', value:'oral' },{ label:'Axillary', value:'axillary' },{ label:'Tympanic', value:'tympanic' }] },
    { name:'duration', label:'Fever Duration (days)', type:'number', min:0, max:30, step:'1' },
    { name:'symptoms', label:'Any danger signs (lethargy, stiff neck, seizure, rash, breathing difficulty)?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] },
    { name:'immunization', label:'Recent immunization (<48h)?', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes', value:'yes' }] }
  ],
  compute: (v) => { const age=parseInt(v.age)||12; const temp=parseFloat(v.temp)||37; const dur=parseInt(v.duration)||1; const method=v.tempMethod||'rectal'; const danger=v.symptoms==='yes'; const recentImm=v.immunization==='yes'; let adjTemp=temp; if(method==='axillary') adjTemp=temp+0.5; else if(method==='oral') adjTemp=temp+0.3; else if(method==='tympanic') adjTemp=temp+0.2; const fever=adjTemp>=38; const feverCat=adjTemp>=41?'Hyperpyrexia':adjTemp>=39.5?'High fever':adjTemp>=39?'Moderate fever':adjTemp>=38?'Fever':'Normal'; let riskLevel='Low'; if(danger||(age<3&&fever)||adjTemp>=41) riskLevel='High'; else if(fever&&dur>3) riskLevel='Moderate'; return { result:adjTemp, label:'Adjusted Temperature', unit:'°C', steps:[{ label:'Measured Temp', value:temp+'°C ('+method+')' },{ label:'Adjusted Temp', value:adjTemp.toFixed(1)+'°C (rectal equivalent)' },{ label:'Fever Classification', value:feverCat },{ label:'Risk Level', value:riskLevel },{ label:'Recommendation', value:riskLevel==='High'?'Seek immediate medical attention':riskLevel==='Moderate'?'Monitor closely, consult pediatrician if worsening':'Symptomatic care' }] } },
  description: 'Pediatric fever assessment tool with temperature adjustment by measurement method and risk stratification.',
  formula: 'Temperature adjusted: axillary+0.5, oral+0.3, tympanic+0.2 to rectal equivalent.',
  interpretation: 'Fever ≥38°C (rectal). High risk: danger signs, age<3mo with fever, hyperpyrexia. Moderate: >3 days fever.'
}
export default calcDef
