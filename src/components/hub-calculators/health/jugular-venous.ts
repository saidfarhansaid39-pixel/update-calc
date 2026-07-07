import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ jvpCm: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), patientAngle: z.string().min(1,'Required'), hepatojugular: z.string().min(1,'Required'), symptoms: z.string().min(1,'Required') }),
  fields: [{ name:'jvpCm', label:'JVP Height (cm above sternal angle)', type:'number', min:0, step:'0.5' }, { name:'patientAngle', label:'Patient Angle', type:'select', options:[{value:'0',label:'Supine (0°)'},{value:'30',label:'Semi-upright (30°)'},{value:'45',label:'Sitting (45°)'},{value:'90',label:'Upright (90°)'}] }, { name:'hepatojugular', label:'Hepatojugular Reflux', type:'select', options:[{value:'negative',label:'Negative'},{value:'positive',label:'Positive'}] }, { name:'symptoms', label:'Associated Symptoms', type:'select', options:[{value:'none',label:'None'},{value:'dyspnea',label:'Dyspnea'},{value:'edema',label:'Peripheral Edema'},{value:'chest-pain',label:'Chest Pain'},{value:'hepatomegaly',label:'Hepatomegaly'}] }],
  compute: (v) => { const jvp=parseFloat(v.jvpCm)||0; const angle=parseInt(v.patientAngle)||45; const hjr=v.hepatojugular==='positive'; const elev=jvp+angle*0.1; const norm=jvp<=8; const cause=elev>12?'Elevated JVP: consider CHF, constrictive pericarditis, SVC syndrome, PE':elev>8?'Borderline elevated: consider right heart strain':'Normal JVP'; const hjrNote=hjr?'HJR + suggests RV failure, TR, constrictive pericarditis':'HJR - normal'; return { result:jvp, label:'JVP', unit:'cm', steps:[{ label:'JVP Height', value:jvp.toFixed(1)+' cm' },{ label:'Angle Correction', value:angle+'°' },{ label:'Estimated RAP', value:elev.toFixed(1)+' cmH2O' },{ label:'Status', value:norm?'Normal':'Elevated' },{ label:'HJR', value:hjrNote }] } },
  description: 'Jugular venous pressure assessment for right heart function, fluid status, and central venous pressure estimation.',
  formula: 'JVP >8 cm above sternal angle = elevated. RAP (cmH2O) = JVP height + (angle × 0.1). Normal RAP: 3-8 cmH2O.',
  interpretation: 'Elevated JVP (>8 cm): RV failure, pulmonary HTN, TR, constrictive pericarditis. Low JVP: hypovolemia. HJR: sustained rise >10s = abnormal.'
}

export default calcDef
