import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ posture: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), squareWindow: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), ankleDorsiflex: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), armRecoil: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), legRecoil: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), popliteal: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), heelToEar: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), scarfSign: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'posture', label:'Posture (0-4)', type:'number', min:0, max:4, step:'1' }, { name:'squareWindow', label:'Square Window (0-4)', type:'number', min:0, max:4, step:'1' }, { name:'ankleDorsiflex', label:'Ankle Dorsiflexion (0-4)', type:'number', min:0, max:4, step:'1' }, { name:'armRecoil', label:'Arm Recoil (0-4)', type:'number', min:0, max:4, step:'1' }, { name:'legRecoil', label:'Leg Recoil (0-4)', type:'number', min:0, max:4, step:'1' }, { name:'popliteal', label:'Popliteal Angle (0-4)', type:'number', min:0, max:4, step:'1' }, { name:'heelToEar', label:'Heel-to-Ear (0-4)', type:'number', min:0, max:4, step:'1' }, { name:'scarfSign', label:'Scarf Sign (0-4)', type:'number', min:0, max:4, step:'1' }],
  compute: (v) => { const po=parseInt(v.posture)||0; const sw=parseInt(v.squareWindow)||0; const ad=parseInt(v.ankleDorsiflex)||0; const ar=parseInt(v.armRecoil)||0; const lr=parseInt(v.legRecoil)||0; const pp=parseInt(v.popliteal)||0; const he=parseInt(v.heelToEar)||0; const ss=parseInt(v.scarfSign)||0; const total=po+sw+ad+ar+lr+pp+he+ss; const ga=Math.round(26+total*0.5); const gaClamped=Math.max(24,Math.min(44,ga)); return { result:gaClamped, label:'Gestational Age (Dubowitz)', unit:'weeks', steps:[{ label:'Total Neuro Score', value:total.toString() },{ label:'Est. Gestational Age', value:gaClamped.toString()+' weeks' }] } },
  description: 'Dubowitz/Ballard scoring for newborn gestational age assessment from neuromuscular maturity.',
  formula: 'GA (weeks) = 26 + (total score × 0.5). Range: 24-44 weeks. 8 neuromuscular signs scored 0-4.',
  interpretation: 'Score matures with GA. Used when LMP unknown. Accuracy ±2 weeks. External criteria also scored.'
}

export default calcDef
