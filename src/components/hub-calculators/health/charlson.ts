import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ mi: z.string().min(1), chf: z.string().min(1), pad: z.string().min(1), cva: z.string().min(1), dementia: z.string().min(1), copd: z.string().min(1), ctd: z.string().min(1), pud: z.string().min(1), liverMild: z.string().min(1), diabetesMild: z.string().min(1), hemiplegia: z.string().min(1), renalMod: z.string().min(1), diabetesSevere: z.string().min(1), liverModSevere: z.string().min(1), metastatic: z.string().min(1), aids: z.string().min(1), age: z.string().min(1,'Required').refine(v=>parseInt(v)>=0,'>=0') }),
  fields: [
    { name:'mi', label:'Myocardial Infarction', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (1)', value:'1' }] },
    { name:'chf', label:'Congestive Heart Failure', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (1)', value:'1' }] },
    { name:'pad', label:'Peripheral Vascular Disease', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (1)', value:'1' }] },
    { name:'cva', label:'CVA / TIA', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (1)', value:'1' }] },
    { name:'dementia', label:'Dementia', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (1)', value:'1' }] },
    { name:'copd', label:'COPD', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (1)', value:'1' }] },
    { name:'ctd', label:'Connective Tissue Disease', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (1)', value:'1' }] },
    { name:'pud', label:'Peptic Ulcer Disease', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (1)', value:'1' }] },
    { name:'liverMild', label:'Mild Liver Disease', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (2)', value:'2' }] },
    { name:'diabetesMild', label:'Diabetes (mild-mod, no complications)', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (1)', value:'1' }] },
    { name:'hemiplegia', label:'Hemiplegia', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (2)', value:'2' }] },
    { name:'renalMod', label:'Moderate-Severe Renal Disease', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (2)', value:'2' }] },
    { name:'diabetesSevere', label:'Diabetes with chronic complications', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (2)', value:'2' }] },
    { name:'liverModSevere', label:'Moderate-Severe Liver Disease', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (3)', value:'3' }] },
    { name:'metastatic', label:'Metastatic Solid Tumor', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (6)', value:'6' }] },
    { name:'aids', label:'AIDS', type:'select', options:[{ label:'No', value:'0' },{ label:'Yes (6)', value:'6' }] },
    { name:'age', label:'Age (years)', type:'number', min:0, max:120, step:'1' }
  ],
  compute: (v) => { const comorbidities=parseInt(v.mi||'0')+parseInt(v.chf||'0')+parseInt(v.pad||'0')+parseInt(v.cva||'0')+parseInt(v.dementia||'0')+parseInt(v.copd||'0')+parseInt(v.ctd||'0')+parseInt(v.pud||'0')+parseInt(v.liverMild||'0')+parseInt(v.diabetesMild||'0')+parseInt(v.hemiplegia||'0')+parseInt(v.renalMod||'0')+parseInt(v.diabetesSevere||'0')+parseInt(v.liverModSevere||'0')+parseInt(v.metastatic||'0')+parseInt(v.aids||'0'); const age=parseInt(v.age)||50; const ageScore=age<50?0:age<60?1:age<70?2:age<80?3:4; const total=comorbidities+ageScore; let tenYear=''; if(total>=9) tenYear='Severe (90%)'; else if(total>=7) tenYear='Moderate-High (50-90%)'; else if(total>=4) tenYear='Moderate (20-50%)'; else tenYear='Low (<20%)'; return { result:total, label:'Charlson Comorbidity Index', steps:[{ label:'Comorbidity Score', value:comorbidities+'' },{ label:'Age Score', value:ageScore+' (age '+age+')' },{ label:'Total CCI', value:total+'' },{ label:'10-Year Survival', value:tenYear }] } },
  description: 'Charlson Comorbidity Index (CCI) predicting 10-year mortality based on weighted comorbidities.',
  formula: 'CCI = weighted sum of 16 comorbidities (weights 1,2,3,6) + age score (1 per decade >50).',
  interpretation: 'Higher scores predict lower 10-year survival. ≥9: ~90% 10-year mortality. Each point increases hazard ratio ~2.3.'
}
export default calcDef
