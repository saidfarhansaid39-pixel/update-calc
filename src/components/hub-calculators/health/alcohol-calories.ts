import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ drinks: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0'), ozPerDrink: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), abv: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [{ name:'drinks', label:'Number of Drinks', type:'number', min:0, step:'0.5' }, { name:'ozPerDrink', label:'Volume per Drink (oz)', type:'number', min:0.5, step:'0.5' }, { name:'abv', label:'ABV (%)', type:'number', min:1, max:100, step:'0.5' }],
  compute: (v) => { const d=parseFloat(v.drinks)||0; const oz=parseFloat(v.ozPerDrink)||12; const abv=parseFloat(v.abv)||5; const totalOz=d*oz; const alcG=totalOz*abv/100*0.2366*0.789; const cal=alcG*7; return { result:cal, label:'Calories from Alcohol', unit:'kcal', steps:[{ label:'Total Volume', value:totalOz.toFixed(1)+' oz' },{ label:'Alcohol Grams', value:alcG.toFixed(1) },{ label:'Calories (7 cal/g)', value:cal.toFixed(0) }] } },
  description: 'Caloric content of alcoholic beverages by drink count, volume, and ABV.',
  formula: 'Cal = drinks×oz×(ABV/100)×0.2366×0.789×7. Alcohol = 7 kcal/g.',
  interpretation: 'Excess alcohol calories contribute to weight gain, fatty liver, and metabolic syndrome.'
}

export default calcDef
