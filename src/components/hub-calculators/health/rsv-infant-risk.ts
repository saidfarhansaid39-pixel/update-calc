import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ gestationalAge: z.string().min(1,'Required').refine(v=>parseInt(v)>=20,'>=20'), birthMonth: z.string().min(1,'Required').refine(v=>parseInt(v)>=1&&parseInt(v)<=12,'1-12'), prematurity: z.string().min(1), nicuStay: z.string().min(1), siblings: z.string().min(1,'Required').refine(v=>parseInt(v)>=0,'>=0'), smokeExposure: z.string().min(1), breastfeeding: z.string().min(1), cardiacDisease: z.string().min(1) }),
  fields: [
    { name:'gestationalAge', label:'Gestational Age at Birth (weeks)', type:'number', min:20, max:42, step:'1' },
    { name:'birthMonth', label:'Birth Month (1=Jan, 12=Dec)', type:'number', min:1, max:12, step:'1' },
    { name:'prematurity', label:'Born premature (<37 weeks)?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes', value:'1' }] },
    { name:'nicuStay', label:'NICU admission at birth?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes', value:'1' }] },
    { name:'siblings', label:'Number of older siblings', type:'number', min:0, max:10, step:'1' },
    { name:'smokeExposure', label:'Household smoking exposure?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes', value:'1' }] },
    { name:'breastfeeding', label:'Breastfeeding?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes', value:'-1' }] },
    { name:'cardiacDisease', label:'Congenital heart disease?', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes', value:'3' }] }
  ],
  compute: (v) => { const ga=parseInt(v.gestationalAge)||38; const month=parseInt(v.birthMonth)||6; const rsvSeason=(month>=10||month<=3)?1:0; const gaRisk=ga<29?5:ga<33?4:ga<37?2:0; const score=gaRisk+parseInt(v.prematurity||'0')*2+parseInt(v.nicuStay||'0')+parseInt(v.smokeExposure||'0')-parseInt(v.breastfeeding||'0')+parseInt(v.cardiacDisease||'0')+rsvSeason+(parseInt(v.siblings||'0')>=1?1:0); let risk='Low'; if(score>=7) risk='High'; else if(score>=4) risk='Moderate'; let rec='Standard care'; if(risk==='High') rec='Consider RSV prophylaxis (palivizumab) per AAP guidelines'; else if(risk==='Moderate'&&rsvSeason) rec='Consider RSV prophylaxis during season'; return { result:score, label:'RSV Risk Score', unit:'/15', steps:[{ label:'Gestational Age Risk', value:gaRisk+'/5' },{ label:'RSV Season (birth)', value:rsvSeason+'/1' },{ label:'Additional Risk Factors', value:(score-gaRisk-rsvSeason)+'' },{ label:'Total Score', value:score+'/15' },{ label:'Risk Level', value:risk },{ label:'Recommendation', value:rec }] } },
  description: 'RSV (Respiratory Syncytial Virus) infant risk assessment for severe infection.',
  formula: 'Weighted scoring: gestational age, seasonality, prematurity, CHD, smoke exposure, siblings, breastfeeding, NICU stay.',
  interpretation: '0-3 Low risk, 4-6 Moderate risk, ≥7 High risk. High risk infants may qualify for palivizumab prophylaxis.'
}
export default calcDef
