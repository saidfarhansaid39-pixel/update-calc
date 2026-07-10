import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ pct: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0') }),
  fields: [{ name:'pct', label:'Procalcitonin (ng/mL)', type:'number', min:0, step:'0.01' }],
  compute: (v) => { const pct=parseFloat(v.pct)||0.5; let category=''; if(pct<0.05){ category='Normal (no infection)' }else if(pct<0.5){ category='Low likelihood of bacterial infection' }else if(pct<2){ category='Moderate likelihood, consider antibiotics' }else if(pct<10){ category='High likelihood of bacterial infection' }else{ category='Severe bacterial sepsis/septic shock likely' }; return { result:pct, label:'Procalcitonin', unit:'ng/mL', steps:[{ label:'PCT Level', value:pct.toFixed(2)+' ng/mL' },{ label:'Interpretation', value:category }] } },
  description: 'Procalcitonin is a biomarker that helps differentiate bacterial from viral infections and guides antibiotic therapy.',
  formula: 'PCT measured in ng/mL. Interpretation thresholds per clinical guidelines.',
  interpretation: '<0.05 ng/mL: normal. 0.05-0.5: bacterial infection unlikely (may be viral). 0.5-2: possible bacterial infection. 2-10: moderate to severe bacterial infection. >10: severe sepsis/septic shock. Serial PCT monitoring guides antibiotic stopping decisions.'
}
export default calcDef
