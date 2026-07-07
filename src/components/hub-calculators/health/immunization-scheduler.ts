import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ageMonths: z.string().min(1,'Required').refine(v=>parseInt(v)>=0,'≥0'), vaccineType: z.string().min(1,'Required'), priorDoses: z.string().min(1,'Required').refine(v=>parseInt(v)>=0,'≥0'), highRisk: z.string().min(1,'Required') }),
  fields: [{ name:'ageMonths', label:'Age (months)', type:'number', min:0, step:'1' }, { name:'vaccineType', label:'Vaccine', type:'select', options:[{value:'dtap',label:'DTaP'},{value:'mmr',label:'MMR'},{value:'hepB',label:'Hepatitis B'},{value:'ipv',label:'IPV (Polio)'},{value:'pcv',label:'PCV13'}] }, { name:'priorDoses', label:'Prior Doses', type:'number', min:0, max:5, step:'1' }, { name:'highRisk', label:'High Risk Condition', type:'select', options:[{value:'no',label:'No'},{value:'immunocompromised',label:'Immunocompromised'},{value:'chronic',label:'Chronic Disease'},{value:'pregnant',label:'Pregnancy/Contact'}] }],
  compute: (v) => { const a=parseInt(v.ageMonths)||0; const p=parseInt(v.priorDoses)||0; const sched=({dtap:[2,4,6,15,48],mmr:[12,48],hepB:[0,1,6],ipv:[2,4,6,48],pcv:[2,4,6,12]} as unknown as Record<string, number[]>)[v.vaccineType]||[]; const due=p<sched.length&&a>=sched[p]; const next=p<sched.length?sched[p]:-1; return { result:due?1:0, label:due?'Due now':'Not due', unit:'', steps:[{ label:'Vaccine', value:v.vaccineType },{ label:'Age', value:a+' months' },{ label:'Doses Received', value:p.toString() },{ label:'Next Due', value:next>=0?next+' months':'Series complete' },{ label:'Status', value:due?'Due - administer':'Wait until scheduled' }] } },
  description: 'CDC-recommended childhood immunization schedule checker for age-appropriate vaccine due dates.',
  formula: 'CDC ACIP schedule: DTaP at 2,4,6,15,48mo. MMR at 12,48mo. HepB at birth,1,6mo. IPV at 2,4,6,48mo. PCV13 at 2,4,6,12mo.',
  interpretation: 'Administer all due vaccines at same visit. Minimum intervals between doses must be respected. Catch-up schedules available.'
}

export default calcDef
