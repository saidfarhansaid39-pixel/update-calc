import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ admitAge: z.string().min(1,'Required').refine(v=>parseInt(v)>=18,'>=18'), admitWbc: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), admitGlucose: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), admitAst: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), admitLdh: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), forty8Hct: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), forty8Bun: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), forty8Ca: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), forty8Po2: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), forty8Be: z.string().min(1,'Required').refine(v=>parseFloat(v)>=-30,'>=-30'), forty8Fluid: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0') }),
  fields: [
    { name:'admitAge', label:'Age >55 years? (0=No,1=Yes)', type:'number', min:0, max:1, step:'1' },
    { name:'admitWbc', label:'WBC >16,000/µL? (0=No,1=Yes)', type:'number', min:0, max:1, step:'1' },
    { name:'admitGlucose', label:'Glucose >200 mg/dL? (0=No,1=Yes)', type:'number', min:0, max:1, step:'1' },
    { name:'admitAst', label:'AST >250 U/L? (0=No,1=Yes)', type:'number', min:0, max:1, step:'1' },
    { name:'admitLdh', label:'LDH >350 U/L? (0=No,1=Yes)', type:'number', min:0, max:1, step:'1' },
    { name:'forty8Hct', label:'48h Hct drop >10%? (0=No,1=Yes)', type:'number', min:0, max:1, step:'1' },
    { name:'forty8Bun', label:'48h BUN increase >5 mg/dL? (0=No,1=Yes)', type:'number', min:0, max:1, step:'1' },
    { name:'forty8Ca', label:'48h Ca <8 mg/dL? (0=No,1=Yes)', type:'number', min:0, max:1, step:'1' },
    { name:'forty8Po2', label:'48h PaO2 <60 mmHg? (0=No,1=Yes)', type:'number', min:0, max:1, step:'1' },
    { name:'forty8Be', label:'48h Base Deficit >4 mEq/L? (0=No,1=Yes)', type:'number', min:0, max:1, step:'1' },
    { name:'forty8Fluid', label:'48h Fluid Sequestration >6L? (0=No,1=Yes)', type:'number', min:0, max:1, step:'1' }
  ],
  compute: (v) => { const admit=[v.admitAge,v.admitWbc,v.admitGlucose,v.admitAst,v.admitLdh].reduce((a,b)=>a+(b==='1'?1:0),0); const forty8=[v.forty8Hct,v.forty8Bun,v.forty8Ca,v.forty8Po2,v.forty8Be,v.forty8Fluid].reduce((a,b)=>a+(b==='1'?1:0),0); const total=admit+forty8; let mortality='<1%'; if(total>=7) mortality='>50%'; else if(total>=5) mortality='10-20%'; else if(total>=3) mortality='3-10%'; return { result:total, label:'Ranson Criteria Total', unit:'/11', steps:[{ label:'Admission Criteria', value:admit+'/5' },{ label:'48-Hour Criteria', value:forty8+'/6' },{ label:'Total Score', value:total+'/11' },{ label:'Predicted Mortality', value:mortality }] } },
  description: 'Complete Ranson criteria with 5 admission and 6 at-48h criteria for pancreatitis severity.',
  formula: '5 admission (age,WBC,glucose,AST,LDH) + 6 at 48h (Hct,BUN,Ca,PaO2,BE,fluid). Range 0-11.',
  interpretation: '0-2: <1% mortality. 3-4: 3% mortality. 5-6: 10-20% mortality. ≥7: >50% mortality.'
}
export default calcDef
