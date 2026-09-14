import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ leg: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0') }),
    fields: [numField('leg', 'Leg Length', { min: 0.01 })],
    defaults: { leg: '1' },
    compute: (v) => { const l=n(v.leg); const hyp=l*Math.sqrt(2); const area=(l*l)/2; return { result:hyp, label:'Hypotenuse', unit:'units', steps:[step('Leg:',l.toFixed(4)),step('Hypotenuse:',hyp.toFixed(4)),step('Area:',area.toFixed(4)+' units²')] ,
    extras: [
      { label: "Real-World Application", value: "Used in architecture, engineering, and design for spatial calculations." },
      { label: "Formula Derivation", value: "Derived from geometric definitions and spatial relationships." },
      { label: "Unit Check", value: "All lengths must be in the same unit for accurate results." },
      { label: "Precision Note", value: "Uses standard geometric constants for calculation." },
      { label: "Related Shapes", value: "Explore volume and area calculators for other 2D and 3D shapes." }
    ]} },
    formula: 'hypotenuse = leg×√2, area = leg²/2',
    description: 'Quick 45-45-90 triangle solver given the leg length.',
    interpretation: 'A 45-45-90 triangle has side ratios 1:1:√2.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
