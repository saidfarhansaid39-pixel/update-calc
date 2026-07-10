import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ migrationRLQ: z.string().min(1), anorexia: z.string().min(1), nauseaVomit: z.string().min(1), tendernessRLQ: z.string().min(1), reboundPain: z.string().min(1), fever: z.string().min(1), leukocytosis: z.string().min(1), leftShift: z.string().min(1) }),
  fields: [
    { name:'migrationRLQ', label:'Migration of pain to Right Lower Quadrant', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes (1)', value:'yes' }] },
    { name:'anorexia', label:'Anorexia or loss of appetite', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes (1)', value:'yes' }] },
    { name:'nauseaVomit', label:'Nausea / Vomiting', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes (1)', value:'yes' }] },
    { name:'tendernessRLQ', label:'Tenderness in RLQ', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes (2)', value:'yes' }] },
    { name:'reboundPain', label:'Rebound Pain', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes (1)', value:'yes' }] },
    { name:'fever', label:'Fever (≥37.3°C)', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes (1)', value:'yes' }] },
    { name:'leukocytosis', label:'Leukocytosis (WBC >10,000)', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes (2)', value:'yes' }] },
    { name:'leftShift', label:'Left shift (neutrophils >75%)', type:'select', options:[{ label:'No', value:'no' },{ label:'Yes (1)', value:'yes' }] }
  ],
  compute: (v) => { const score=((v.migrationRLQ==='yes'?1:0)+(v.anorexia==='yes'?1:0)+(v.nauseaVomit==='yes'?1:0)+(v.tendernessRLQ==='yes'?2:0)+(v.reboundPain==='yes'?1:0)+(v.fever==='yes'?1:0)+(v.leukocytosis==='yes'?2:0)+(v.leftShift==='yes'?1:0)); let prob='Low'; if(score>=7) prob='High'; else if(score>=5) prob='Moderate'; else if(score>=3) prob='Possible'; return { result:score, label:'Alvarado Score', unit:'/10', steps:[{ label:'Score', value:score+'/10' },{ label:'Appendicitis Probability', value:prob }] } },
  description: 'Alvarado Score (MANTRELS) for acute appendicitis risk stratification in adults.',
  formula: 'Migration + Anorexia + Nausea + RLQ Tenderness(2) + Rebound + Fever + Leukocytosis(2) + Left Shift. Range 0-10.',
  interpretation: '1-4 Low probability, 5-6 Possible, 7-8 Moderate probability, 9-10 High probability of appendicitis.'
}
export default calcDef
