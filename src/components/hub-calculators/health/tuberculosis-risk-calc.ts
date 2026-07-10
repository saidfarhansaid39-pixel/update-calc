import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tstInduration: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), hiv: z.string().min(1,'Required'), immunosup: z.string().min(1,'Required'), contact: z.string().min(1,'Required'), fibroticCxr: z.string().min(1,'Required') }),
  fields: [{ name:'tstInduration', label:'TST Induration (mm)', type:'number', min:0, max:50, step:'1' }, { name:'hiv', label:'HIV Positive (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }, { name:'immunosup', label:'Immunosuppressed (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }, { name:'contact', label:'TB Contact (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }, { name:'fibroticCxr', label:'Fibrotic CXR Changes (1=Yes,0=No)', type:'number', min:0, max:1, step:'1' }],
  compute: (v) => { const tst=parseFloat(v.tstInduration)||0; const hiv=parseFloat(v.hiv)||0; const immune=parseFloat(v.immunosup)||0; const contact=parseFloat(v.contact)||0; const fib=parseFloat(v.fibroticCxr)||0; const positive=tst>=5&&(hiv||immune||fib)||tst>=10&&(contact||immune)||tst>=15; const riskScore=hiv*3+immune*2+contact*2+fib*2+(tst>=5?1:0)+(tst>=10?1:0); return { result:riskScore, label:'TB Risk Assessment', steps:[{ label:'TST', value:tst.toFixed(0)+' mm' },{ label:'Positive?', value:positive?'Yes':'No' },{ label:'Risk Score', value:riskScore.toFixed(0) }] } },
  description: 'Tuberculosis risk assessment evaluates likelihood of latent TB infection based on TST and risk factors.',
  formula: 'Positive if: ≥5mm (HIV, immunosuppressed, fibrotic CXR) OR ≥10mm (contact, other risks) OR ≥15mm (no risk factors).',
  interpretation: 'Risk-based positive thresholds per CDC/ATS guidelines. Higher risk score indicates greater need for LTBI treatment. Consider IGRA for BCG-vaccinated individuals.'
}
export default calcDef
