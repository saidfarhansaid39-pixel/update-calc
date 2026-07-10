import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const calcDef: CalcDef = {
  schema: z.object({ stoolFreq: z.string().min(1,'Required').refine(v=>parseInt(v)>=0,'>=0'), abdoPain: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=3,'0-3'), wellBeing: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=4,'0-4',), extraIntestinal: z.string().min(1,'Required').refine(v=>parseInt(v)>=0,'>=0'), antiDiarrheal: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'>=0'), abdoMass: z.string().min(1,'Required').refine(v=>parseInt(v)>=0&&parseInt(v)<=5,'0-5'), hematocrit: z.string().min(1,'Required').refine(v=>parseFloat(v)>0&&parseFloat(v)<60,'0-60'), weight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0'), stdWeight: z.string().min(1,'Required').refine(v=>parseFloat(v)>0,'>0') }),
  fields: [
    { name:'stoolFreq', label:'Liquid Stool Frequency (per day)', type:'number', min:0, max:50, step:'1' },
    { name:'abdoPain', label:'Abdominal Pain (0=none, 1=mild, 2=mod, 3=severe)', type:'number', min:0, max:3, step:'1' },
    { name:'wellBeing', label:'General Well-Being (0=well, 1=slightly under, 2=poor, 3=very poor, 4=terrible)', type:'number', min:0, max:4, step:'1' },
    { name:'extraIntestinal', label:'Extra-Intestinal Manifestations (# of: arthritis, iritis, fistulas, abscess, fever >38°C)', type:'number', min:0, max:10, step:'1' },
    { name:'antiDiarrheal', label:'Antidiarrheal Use (0=none, 1=occasional, 2=regular)', type:'number', min:0, max:2, step:'1' },
    { name:'abdoMass', label:'Abdominal Mass (0=none, 1-5: increasingly severe)', type:'number', min:0, max:5, step:'1' },
    { name:'hematocrit', label:'Hematocrit (%)', type:'number', min:15, max:55, step:'0.1' },
    { name:'weight', label:'Current Weight (kg)', type:'number', min:20, max:200, step:'0.1' },
    { name:'stdWeight', label:'Standard Weight (kg)', type:'number', min:20, max:200, step:'0.1' }
  ],
  compute: (v) => { const sf=parseInt(v.stoolFreq)||4; const ap=parseInt(v.abdoPain)||1; const wb=parseInt(v.wellBeing)||1; const ei=parseInt(v.extraIntestinal)||0; const ad=parseInt(v.antiDiarrheal)||0; const am=parseInt(v.abdoMass)||0; const hct=parseFloat(v.hematocrit)||40; const wt=parseFloat(v.weight)||70; const sw=parseFloat(v.stdWeight)||70; const wf=sw>wt?Math.round((sw-wt)/sw*100):0; const score=sf*2+ap*10+wb*7+ei*20+ad*10+am*10+Math.round(100-(hct/47*100)+(wf*10)); let activity='Remission'; if(score>=450) activity='Severe'; else if(score>=220) activity='Moderate'; else if(score>=150) activity='Mild'; return { result:score, label:'CDAI Score', steps:[{ label:'Stool Component', value:sf*2+'' },{ label:'Pain Component', value:ap*10+'' },{ label:'Well-Being Component', value:wb*7+'' },{ label:'Extra-Intestinal', value:ei*20+'' },{ label:'Antidiarrheal Use', value:ad*10+'' },{ label:'Mass Component', value:am*10+'' },{ label:'Hematocrit Adjustment', value:Math.round(100-(hct/47*100))+'' },{ label:'Weight Deficit', value:wf*10+'' },{ label:'Disease Activity', value:activity }] } },
  description: 'Crohn\'s Disease Activity Index (CDAI) scoring disease activity across 8 weighted components.',
  formula: 'CDAI = stoolFreq×2 + pain×10 + wellBeing×7 + extraIntestinal×20 + antiDiarrheal×10 + mass×10 + (100-Hct/47×100) + weightDeficit×10.',
  interpretation: '<150 Remission, 150-219 Mild, 220-450 Moderate, >450 Severe disease activity.'
}
export default calcDef
