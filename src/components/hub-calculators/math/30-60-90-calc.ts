import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ shortLeg: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0') }),
    fields: [numField('shortLeg', 'Short Leg (opposite 30°)', { min: 0.01 })],
    defaults: { shortLeg: '1' },
    compute: (v) => { const s=n(v.shortLeg); const long=s*Math.sqrt(3); const hyp=s*2; const area=(s*long)/2; return { result:hyp, label:'Hypotenuse', unit:'units', steps:[step('Short Leg:',s.toFixed(4)),step('Long Leg:',long.toFixed(4)),step('Hypotenuse:',hyp.toFixed(4)),step('Area:',area.toFixed(4)+' units²')] } },
    formula: 'longLeg = shortLeg×√3, hypotenuse = shortLeg×2, area = (shortLeg×longLeg)/2',
    description: 'Quick 30-60-90 triangle solver given the short leg.',
    interpretation: 'A 30-60-90 triangle has side ratios 1:√3:2.'
}

export default calcDef
