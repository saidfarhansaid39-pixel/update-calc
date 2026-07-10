import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ posture: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), squareWindow: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), armRecoil: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), poplitealAngle: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), scarfSign: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), heelToEar: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), skin: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), lanugo: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), plantarSurface: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), breast: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), eyeEar: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4'), genitals: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4') }),
  fields: [
    { name:'posture', label:'Posture (0=fully flexed, 4=fully extended)', type:'number', min:0, max:4, step:'1' },
    { name:'squareWindow', label:'Square Window (wrist flexibility)', type:'number', min:0, max:4, step:'1' },
    { name:'armRecoil', label:'Arm Recoil (0=>90°, 2=90°, 3=90°, 4<90°)', type:'number', min:0, max:4, step:'1' },
    { name:'poplitealAngle', label:'Popliteal Angle (0=100°, 4=>160°)', type:'number', min:0, max:4, step:'1' },
    { name:'scarfSign', label:'Scarf Sign (0=elbow past midline, 4=elbow not to midline)', type:'number', min:0, max:4, step:'1' },
    { name:'heelToEar', label:'Heel to Ear (0=feet to ear, 4=feet far from ear)', type:'number', min:0, max:4, step:'1' },
    { name:'skin', label:'Skin (0=sticky, 2=smooth, 4=peeling)', type:'number', min:0, max:4, step:'1' },
    { name:'lanugo', label:'Lanugo (0=none, 2=abundant, 4=bald areas)', type:'number', min:0, max:4, step:'1' },
    { name:'plantarSurface', label:'Plantar Surface (0=-50% creases, 2=anterior creases, 4=full creases)', type:'number', min:0, max:4, step:'1' },
    { name:'breast', label:'Breast (0=no bud, 2=2mm bud, 4=>10mm)', type:'number', min:0, max:4, step:'1' },
    { name:'eyeEar', label:'Eye/Ear (0=fused lids/flat ear, 2=open/curved, 4=firm/thick)', type:'number', min:0, max:4, step:'1' },
    { name:'genitals', label:'Genitals (0=ambiguous/absent rugae, 2=early rugae/labia, 4=descended/bulging)', type:'number', min:0, max:4, step:'1' }
  ],
  compute: (v) => { const nm=[parseInt(v.posture||'0'),parseInt(v.squareWindow||'0'),parseInt(v.armRecoil||'0'),parseInt(v.poplitealAngle||'0'),parseInt(v.scarfSign||'0'),parseInt(v.heelToEar||'0')].reduce((a,b)=>a+b,0); const phys=[parseInt(v.skin||'0'),parseInt(v.lanugo||'0'),parseInt(v.plantarSurface||'0'),parseInt(v.breast||'0'),parseInt(v.eyeEar||'0'),parseInt(v.genitals||'0')].reduce((a,b)=>a+b,0); const total=nm+phys; const weeks=Math.round(total/2+20); const finalWeeks=Math.min(44,Math.max(20,weeks)); let maturity='Preterm'; if(finalWeeks>=38) maturity='Term'; else if(finalWeeks>=34) maturity='Late Preterm'; else if(finalWeeks>=32) maturity='Moderate Preterm'; else if(finalWeeks>=28) maturity='Very Preterm'; else maturity='Extremely Preterm'; return { result:finalWeeks, label:'Ballard Gestational Age', unit:'weeks', steps:[{ label:'Neuromuscular Score', value:nm+'/24' },{ label:'Physical Score', value:phys+'/24' },{ label:'Total Score', value:total+'/48' },{ label:'Gestational Age', value:finalWeeks+' weeks' },{ label:'Classification', value:maturity }] } },
  description: 'Ballard Score (New Ballard Score) for estimating gestational age in newborns.',
  formula: 'GA = (Total Score / 2) + 20. Score ranges -10 to 50 corresponding to 20-44 weeks. 6 neuromuscular + 6 physical criteria.',
  interpretation: '<28w Extremely Preterm, 28-31w Very Preterm, 32-33w Moderate Preterm, 34-36w Late Preterm, ≥37w Term.'
}
export default calcDef
