import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ shortLeg: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), longLeg: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), hypotenuse: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('shortLeg','Short Leg (opposite 30°)'),numField('longLeg','Long Leg (opposite 60°)'),numField('hypotenuse','Hypotenuse (opposite 90°)')],
    defaults: { shortLeg:'5',longLeg:'0',hypotenuse:'0' },
    compute: (v) => { const sl=n(v.shortLeg),ll=n(v.longLeg),hyp=n(v.hypotenuse); let short=0,long=0,h=0; if(sl>0){short=sl;long=sl*Math.sqrt(3);h=sl*2} else if(ll>0){long=ll;short=ll/Math.sqrt(3);h=short*2} else{h=hyp;short=h/2;long=short*Math.sqrt(3)}; const area=(short*long)/2; return { result:area, label:'Area', unit:'units²', steps:[step('Short Leg:',short.toFixed(4)),step('Long Leg:',long.toFixed(4)),step('Hypotenuse:',h.toFixed(4)),step('Area:',area.toFixed(4)+' units²')] } },
    formula: 'longLeg = shortLeg×√3, hypotenuse = shortLeg×2, area = (shortLeg×longLeg)/2',
    description: 'Solve a 30-60-90 special right triangle given any one side.',
    interpretation: 'A 30-60-90 triangle has side ratios 1:√3:2.'
}

export default calcDef
