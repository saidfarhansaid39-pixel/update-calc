import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), sleepOnset: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), sleepDuration: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0') }),
  fields: [{ name:'age', label:'Age (years)', type:'number', min:0, max:120, step:'1' }, { name:'sleepOnset', label:'Sleep Onset (minutes)', type:'number', min:0, step:'5' }, { name:'sleepDuration', label:'Sleep Duration (hours)', type:'number', min:0, max:24, step:'0.5' }],
  compute: (v) => { const age=parseFloat(v.age)||30; const onset=parseFloat(v.sleepOnset)||30; const dur=parseFloat(v.sleepDuration)||7; let dose=3; if(age>55)dose=5; else if(age>18&&onset>45)dose=5; else if(onset>60)dose=5; else if(onset<20)dose=1; if(dur<5)dose=Math.min(dose+2,10); return { result:dose, label:'Recommended Dose', unit:'mg', steps:[{ label:'Sleep Onset', value:onset.toFixed(0)+' min' },{ label:'Sleep Duration', value:dur.toFixed(1)+' hours' },{ label:'Suggested Dose', value:dose.toFixed(0)+' mg' }] } },
  description: 'Melatonin dosage recommendation based on age, sleep onset latency, and sleep duration.',
  formula: 'General dosing: 1-3 mg for mild insomnia, 3-5 mg for delayed onset, 5-10 mg for age >55 or severe insomnia.',
  interpretation: 'Start with lowest effective dose. Take 30-60 min before bedtime. Doses >5 mg are for older adults or severe cases.'
}

export default calcDef
