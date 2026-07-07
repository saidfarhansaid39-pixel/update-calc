import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ device: z.enum(['room-air','nasal-cannula','simple-mask','nonrebreather','venturi','ventilator']), flowRate: z.string().min(1,'Required').refine(v=>parseFloat(v)>=0,'≥0') }),
  fields: [{ name:'device', label:'Oxygen Delivery Device', type:'select', options:[{ label:'Room Air', value:'room-air' },{ label:'Nasal Cannula', value:'nasal-cannula' },{ label:'Simple Mask', value:'simple-mask' },{ label:'Non-Rebreather', value:'nonrebreather' },{ label:'Venturi Mask', value:'venturi' },{ label:'Ventilator', value:'ventilator' }] }, { name:'flowRate', label:'Flow Rate (L/min)', type:'number', min:0, max:60, step:'0.5' }],
  compute: (v) => { const d=v.device||'room-air'; const fr=parseFloat(v.flowRate)||0; let fiO2=0.21; if(d==='room-air') fiO2=0.21; else if(d==='nasal-cannula') fiO2=0.21+0.04*fr; else if(d==='simple-mask') fiO2=0.35+0.05*Math.min(fr,10); else if(d==='nonrebreather') fiO2=0.6+0.1*Math.min(fr,15); else if(d==='venturi') fiO2=0.24+0.04*fr; else if(d==='ventilator') fiO2=parseFloat(v.flowRate)/100; const fiO2Clamped=Math.max(0.21,Math.min(1,fiO2)); return { result:fiO2Clamped, label:'Estimated FiO₂', unit:'', steps:[{ label:'Device', value:d },{ label:'Flow Rate', value:fr.toString()+' L/min' },{ label:'Est. FiO₂', value:(fiO2Clamped*100).toFixed(0)+'%' }] } },
  description: 'Estimated FiO₂ from oxygen delivery device type and flow rate.',
  formula: 'NC: 21+4%×L/min. Simple mask: 35+5%×L/min. NRB: 60+10%×L/min.',
  interpretation: 'Nasal cannula 1-6 L/min (24-44%). Simple mask 5-10 L/min (35-50%). NRB 10-15 L/min (60-80%).'
}

export default calcDef
