import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseInt(v)>=18,'≥18'), ivDrugUse: z.string().min(1,'Required'), bloodTransfusion: z.string().min(1,'Required'), tattoo: z.string().min(1,'Required'), healthcareWorker: z.string().min(1,'Required'), multiplePartners: z.string().min(1,'Required') }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:18, step:'1' }, { name:'ivDrugUse', label:'IV Drug Use', type:'select', options:[{value:'no',label:'No'},{value:'yes',label:'Yes'}] }, { name:'bloodTransfusion', label:'Blood Transfusion before 1992', type:'select', options:[{value:'no',label:'No'},{value:'yes',label:'Yes'}] }, { name:'tattoo', label:'Tattoo/Piercing', type:'select', options:[{value:'no',label:'No'},{value:'yes',label:'Yes'}] }, { name:'healthcareWorker', label:'Healthcare Worker', type:'select', options:[{value:'no',label:'No'},{value:'yes',label:'Yes'}] }, { name:'multiplePartners', label:'Multiple Sexual Partners', type:'select', options:[{value:'no',label:'No'},{value:'yes',label:'Yes'}] }],
  compute: (v) => { const a=parseInt(v.age)||30; const r=((v.ivDrugUse==='yes'?4:0)+(v.bloodTransfusion==='yes'?2:0)+(v.tattoo==='yes'?1:0)+(v.healthcareWorker==='yes'?1:0)+(v.multiplePartners==='yes'?1:0)+(a>50?1:0)); const l=r<=2?'Low risk (screen routinely)':r<=4?'Moderate risk (consider HCV RNA)':'High risk (recommend HCV RNA + genotype)'; return { result:r, label:'Hepatitis C Risk Score', unit:'', steps:[{ label:'IV Drug Use', value:v.ivDrugUse==='yes'?'+4':'0' },{ label:'Transfusion', value:v.bloodTransfusion==='yes'?'+2':'0' },{ label:'Tattoo', value:v.tattoo==='yes'?'+1':'0' },{ label:'HCW', value:v.healthcareWorker==='yes'?'+1':'0' },{ label:'Partners', value:v.multiplePartners==='yes'?'+1':'0' },{ label:'Age >50', value:a>50?'+1':'0' },{ label:'Total (0-10)', value:r.toString() },{ label:'Recommendation', value:l }] } },
  description: 'Hepatitis C risk assessment based on CDC risk factor stratification for targeted screening.',
  formula: 'Score = IVDU (4) + Transfusion (2) + Tattoo (1) + HCW (1) + Multiple Partners (1) + Age >50 (1). Range 0-10.',
  interpretation: '0-2: routine screening; 3-4: HCV RNA if ALT elevated; 5+: universal HCV RNA + genotype testing.'
}

export default calcDef
