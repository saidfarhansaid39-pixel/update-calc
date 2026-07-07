import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ fundalHeight: z.string().min(1,'Required').refine(v=>parseFloat(v)>=10,'≥10'), week: z.string().min(1,'Required').refine(v=>parseFloat(v)>=12,'≥12') }),
  fields: [{ name:'fundalHeight', label:'Fundal Height (cm)', type:'number', min:10, max:50, step:'0.5' }, { name:'week', label:'Gestational Week', type:'number', min:12, max:42, step:'1' }],
  compute: (v) => { const fh=parseFloat(v.fundalHeight)||0; const w=parseFloat(v.week)||20; const expected=w; const diff=fh-expected; const pct=diff<=-3?'Small for GA (<10th pct)':diff>=3?'Large for GA (>90th pct)':'Appropriate for GA'; return { result:fh, label:'Fundal Height', unit:'cm', steps:[{ label:'Expected (≈ GA weeks)', value:expected.toString()+' cm' },{ label:'Actual', value:fh.toFixed(1)+' cm' },{ label:'Difference', value:diff>=0?'+'+diff.toFixed(1):diff.toFixed(1) },{ label:'Assessment', value:pct }] } },
  description: 'Fetal growth assessment by fundal height measurement correlating to gestational age.',
  formula: 'Fundal height (cm) ≈ gestational weeks after 12-14 weeks. ±3 cm = normal. Discordance: refer for US.',
  interpretation: 'Large: GDM, macrosomia, polyhydramnios. Small: IUGR, oligohydramnios, incorrect dates.'
}

export default calcDef
