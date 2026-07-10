import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ tsh: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), ft4: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), ft3: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'tsh', label:'TSH (mIU/L)', type:'number', min:0, step:'0.01' }, { name:'ft4', label:'Free T4 (ng/dL)', type:'number', min:0, step:'0.01' }, { name:'ft3', label:'Free T3 (pg/mL)', type:'number', min:0, step:'0.1' }],
  compute: (v) => { const tsh=parseFloat(v.tsh)||2.5; const ft4=parseFloat(v.ft4)||1.2; const ft3=parseFloat(v.ft3)||3.5; const bmr=66+13.7*70+5*175-6.8*30; const bmrAdj=ft3>4?bmr*1.15:ft3<2?bmr*0.85:bmr; let pattern:string; if(tsh>4.5&&ft4<0.8){pattern='Primary Hypothyroidism'}else if(tsh<0.4&&ft4>1.8){pattern='Primary Hyperthyroidism'}else if(tsh<0.4&&ft4<0.8){pattern='Central Hypothyroidism'}else if(tsh>4.5&&ft4>1.8){pattern='TSH-Secreting Tumor'}else{pattern='Euthyroid'} return { result:bmrAdj, label:'Estimated BMR (Adj. Thyroid)', unit:'kcal', steps:[{ label:'TSH', value:tsh.toFixed(2)+' mIU/L' },{ label:'Free T4', value:ft4.toFixed(2)+' ng/dL' },{ label:'Free T3', value:ft3.toFixed(1)+' pg/mL' },{ label:'Pattern', value:pattern },{ label:'Adj. BMR', value:bmrAdj.toFixed(0)+' kcal' }] } },
  description: 'Estimates BMR adjustment based on thyroid function test results including TSH, FT4, and FT3.',
  formula: 'BMR adjusted by FT3: +15% if FT3>4, -15% if FT3<2. Pattern classification from TSH/FT4/FT3 relationship.',
  interpretation: 'TSH 0.4-4.5, FT4 0.8-1.8, FT3 2.0-4.4 is euthyroid. Hyperthyroid raises BMR; hypothyroid lowers BMR significantly.'
}
export default calcDef