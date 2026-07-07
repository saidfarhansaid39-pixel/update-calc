import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ivs: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), lvid: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), lvpw: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'ivs', label:'IVS Thickness (cm)', type:'number', min:0, step:'0.01' }, { name:'lvid', label:'LV Internal Diameter (cm)', type:'number', min:0, step:'0.01' }, { name:'lvpw', label:'LV Posterior Wall (cm)', type:'number', min:0, step:'0.01' }],
  compute: (v) => { const ivs=parseFloat(v.ivs)||1; const lvid=parseFloat(v.lvid)||4.5; const lvpw=parseFloat(v.lvpw)||1; const mass=0.8*(1.04*((ivs+lvid+lvpw)**3-lvid**3))+0.6; return { result:mass, label:'LV Mass', unit:'g', steps:[{ label:'IVS', value:ivs.toFixed(2)+' cm' },{ label:'LVID', value:lvid.toFixed(2)+' cm' },{ label:'LVPW', value:lvpw.toFixed(2)+' cm' },{ label:'LV Mass (Devereux)', value:mass.toFixed(1)+' g' }] } },
  description: 'Left ventricular mass calculated from 2D echocardiography using the Devereux formula.',
  formula: 'LV Mass = 0.8 × [1.04 × ((IVS + LVID + LVPW)³ - LVID³)] + 0.6 g.',
  interpretation: 'Normal: 67-162 g (female) / 88-224 g (male). Increased LV mass predicts cardiovascular events.'
}

export default calcDef
