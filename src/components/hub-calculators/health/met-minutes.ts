import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ walkingMinutes: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), moderateMinutes: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), vigorousMinutes: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0') }),
  fields: [{ name:'walkingMinutes', label:'Walking (min/week)', type:'number', min:0, step:'5' }, { name:'moderateMinutes', label:'Moderate Activity (min/week)', type:'number', min:0, step:'5' }, { name:'vigorousMinutes', label:'Vigorous Activity (min/week)', type:'number', min:0, step:'5' }],
  compute: (v) => { const walk=parseFloat(v.walkingMinutes)||0; const mod=parseFloat(v.moderateMinutes)||0; const vig=parseFloat(v.vigorousMinutes)||0; const walkMET=walk*3.3; const modMET=mod*4; const vigMET=vig*8; const total=walkMET+modMET+vigMET; const meetsGuidelines=total>=500; return { result:total, label:'Total MET-minutes/week', unit:'MET-min/wk', steps:[{ label:'Walking (3.3 METs)', value:walkMET.toFixed(0)+' MET-min' },{ label:'Moderate (4 METs)', value:modMET.toFixed(0)+' MET-min' },{ label:'Vigorous (8 METs)', value:vigMET.toFixed(0)+' MET-min' },{ label:'Total', value:total.toFixed(0)+' MET-min/wk' },{ label:'Guideline', value:meetsGuidelines?'Meets 500 MET-min/wk target':'Below 500 MET-min/wk target' }] } },
  description: 'MET-minutes quantify weekly physical activity volume using standard metabolic equivalent intensities.',
  formula: 'Total MET-min/week = (3.3 × walking min) + (4 × moderate min) + (8 × vigorous min). Target: ≥500 MET-min/week.',
  interpretation: '≥500 MET-min/week: meets physical activity guidelines. ≥1000: substantial health benefits. <500: insufficient activity.'
}

export default calcDef
