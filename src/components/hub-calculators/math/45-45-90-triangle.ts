import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ leg: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), hypotenuse: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('leg','Leg Length'),numField('hypotenuse','Hypotenuse')],
    defaults: { leg:'5',hypotenuse:'0' },
    compute: (v) => { const leg=n(v.leg),hyp=n(v.hypotenuse); let l=0,h=0; if(leg>0){l=leg;h=leg*Math.sqrt(2)} else{h=hyp;l=h/Math.sqrt(2)}; const area=(l*l)/2; return { result:area, label:'Area', unit:'units²', steps:[step('Leg:',l.toFixed(4)),step('Hypotenuse:',h.toFixed(4)),step('Area:',area.toFixed(4)+' units²')] } },
    formula: 'hypotenuse = leg×√2, area = leg²/2',
    description: 'Solve a 45-45-90 isosceles right triangle given leg or hypotenuse.',
    interpretation: 'A 45-45-90 triangle has side ratios 1:1:√2.'
}

export default calcDef
