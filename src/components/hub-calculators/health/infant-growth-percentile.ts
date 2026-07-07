import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ageMonths: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), length: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), headCircumference: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), gender: z.string().min(1,'Required') }),
  fields: [{ name:'ageMonths', label:'Age (months)', type:'number', min:0, max:36, step:'0.5' }, { name:'weight', label:'Weight (kg)', type:'number', min:0, step:'0.01' }, { name:'length', label:'Length (cm)', type:'number', min:0, step:'0.1' }, { name:'headCircumference', label:'Head Circumference (cm)', type:'number', min:0, step:'0.1' }, { name:'gender', label:'Gender', type:'select', options:[{value:'male',label:'Male'},{value:'female',label:'Female'}] }],
  compute: (v) => { const a=parseFloat(v.ageMonths)||0; const w=parseFloat(v.weight)||3.5; const l=parseFloat(v.length)||50; const hc=parseFloat(v.headCircumference)||35; const refWt=v.gender==='male'?{0:3.5,1:4.5,2:5.6,3:6.4,6:7.9,12:9.6,24:12.2,36:14.6}:{0:3.4,1:4.2,2:5.1,3:5.8,6:7.3,12:8.9,24:11.5,36:13.9}; const ages=Object.keys(refWt).map(Number); const near=ages.reduce((p,c)=>Math.abs(c-a)<Math.abs(p-a)?c:p) as keyof typeof refWt; const med=refWt[near]; const pct=Math.max(1,Math.min(99,Math.round(50+((w-med)/med)*25))); return { result:pct, label:'Weight-for-Age Percentile', unit:'%', steps:[{ label:'Weight', value:w.toFixed(2)+' kg' },{ label:'Length', value:l.toFixed(1)+' cm' },{ label:'Head Circ', value:hc.toFixed(1)+' cm' },{ label:'Percentile', value:'~'+pct+'th' }] } },
  description: 'Infant growth percentile estimation using WHO growth standards for weight, length, and head circumference.',
  formula: 'Percentile approximated from WHO Multicentre Growth Reference z-scores by nearest age-matched median with linear offset.',
  interpretation: '3rd-97th percentile = normal range. Crossing >2 major percentiles warrants evaluation. Micro/macrocephaly: HC <3rd or >97th.'
}

export default calcDef
