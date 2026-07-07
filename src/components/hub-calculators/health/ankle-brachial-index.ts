import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ankleSystolic: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), brachialSystolic: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'ankleSystolic', label:'Ankle Systolic BP (mmHg)', type:'number', min:30, max:300, step:'1' }, { name:'brachialSystolic', label:'Brachial Systolic BP (mmHg)', type:'number', min:50, max:300, step:'1' }],
  compute: (v) => { const ankle=parseFloat(v.ankleSystolic)||0; const brachial=parseFloat(v.brachialSystolic)||0; const abi=brachial>0?ankle/brachial:0; let grade=''; if(abi>=1.4) grade='Non-compressible vessels'; else if(abi>=0.9) grade='Normal'; else if(abi>=0.6) grade='Mild-Moderate PAD'; else grade='Severe PAD'; return { result:abi, label:'Ankle-Brachial Index', unit:'', steps:[{ label:'ABI = Ankle/Brachial', value:abi.toFixed(2) },{ label:'Classification', value:grade }] } },
  description: 'Ankle-brachial index for peripheral arterial disease screening.',
  formula: 'ABI = highest ankle SBP / highest brachial SBP. Normal: 0.9-1.4.',
  interpretation: 'ABI >1.4: non-compressible; 0.9-1.4: normal; 0.6-0.89: mild-moderate PAD; <0.6: severe PAD.'
}

export default calcDef
