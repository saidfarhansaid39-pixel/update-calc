import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ spo2: z.string().min(1,'Required').refine(v=>parseFloat(v)>=50&&parseFloat(v)<=100,'50-100'), fio2: z.string().min(1,'Required').refine(v=>parseFloat(v)>=21,'≥21') }),
  fields: [{ name:'spo2', label:'SpO₂ (%)', type:'number', min:50, max:100, step:'1' }, { name:'fio2', label:'FiO₂ (%)', type:'number', min:21, max:100, step:'1' }],
  compute: (v) => { const spo2=parseFloat(v.spo2)||97; const fio2=parseFloat(v.fio2)||21; const ratio=spo2/fio2*100; return { result:spo2, label:'Oxygen Saturation', unit:'%', steps:[{ label:'SpO₂', value:spo2.toFixed(0)+'%' },{ label:'FiO₂', value:fio2.toFixed(0)+'%' },{ label:'SpO₂/FiO₂ Ratio', value:ratio.toFixed(0) }] } },
  description: 'Oxygen saturation (SpO₂) measures the percentage of hemoglobin binding sites occupied by oxygen.',
  formula: 'SpO₂ measured by pulse oximetry. SpO₂/FiO₂ ratio estimates oxygenation efficiency.',
  interpretation: 'Normal SpO₂: 95-100%. Mild hypoxemia: 91-94%. Moderate: 86-90%. Severe: ≤85%. SpO₂/FiO₂ <300 indicates hypoxemia. Target SpO₂ >92% in most patients.'
}
export default calcDef
