import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ a260: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'), dilFactor: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 1, 'Must be = 1') }),
  fields: [{ name: 'a260', label: 'A260 Absorbance', type: 'number', min: 0.001, step: '0.001' }, { name: 'dilFactor', label: 'Dilution Factor', type: 'number', min: 1, step: '1' }],
  compute: (v) => { const conc = parseFloat(v.a260) * 50 * parseFloat(v.dilFactor || '1'); const concUg = conc / 1000; return { result: conc, label: 'DNA Concentration', unit: 'ng/µL', steps: [{ label: 'A260', value: `${v.a260}` }, { label: 'Dilution factor', value: `${v.dilFactor}` }, { label: 'Conc = A260 x 50 x DF', value: `${conc.toFixed(1)} ng/µL` }, { label: 'In µg/µL', value: `${concUg.toFixed(4)} µg/µL` }, { label: 'For 50 µL reaction', value: `${(conc * 50).toFixed(0)} ng total` }] } },
  description: 'DNA concentration is determined by UV absorbance at 260 nm using the conversion factor of 50 ng/µL per A260 unit for double-stranded DNA, adjusted for sample dilution.',
  formula: '[DNA] (ng/µL) = A260 × 50 × Dilution Factor | 1 µg/µL = 1000 ng/µL',
  interpretation: 'Pure dsDNA: A260/A280 ˜ 1.8. This calculation assumes a 1 cm path length. For micro-volume instruments (e.g., NanoDrop), path length correction is automatic.'
}

export default calcDef
