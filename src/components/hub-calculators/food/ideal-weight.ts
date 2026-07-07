import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'height', label: 'Height', type: 'number', unit: 'cm', units: [{ value: 'cm', label: 'cm' }, { value: 'in', label: 'in' }], defaultUnit: 'cm', min: 100, step: '0.5' },
      { name: 'formula', label: 'Formula', type: 'select', options: [
        { label: 'Hamwi (standard)', value: 'hamwi' }, { label: 'Devine (clinical)', value: 'devine' },
        { label: 'Robinson (modified)', value: 'robinson' }, { label: 'Miller (modern)', value: 'miller' },
      ] },
    ],
    compute: (v) => {
      const hIn = v.height / 2.54
      let result: number
      if (v.formula === 'hamwi') result = 48 + 2.7 * (hIn - 60)
      else if (v.formula === 'devine') result = 50 + 2.3 * (hIn - 60)
      else if (v.formula === 'robinson') result = 52 + 1.9 * (hIn - 60)
      else result = 56.2 + 1.41 * (hIn - 60)
      return { result, label: 'Ideal Weight', unit: 'kg', steps: [
        { label: 'Height', value: `${v.height} cm (${hIn.toFixed(1)} inches)` },
        { label: 'Formula used', value: v.formula.charAt(0).toUpperCase() + v.formula.slice(1) },
        { label: 'Ideal weight', value: `${result.toFixed(1)} kg (${(result * 2.20462).toFixed(1)} lbs)` },
        { label: 'Note', value: 'Ideal weight is a population-based estimate. Individual healthy weight may vary by muscle mass, frame size, and body composition.' },
      ]}
    },
    description: 'Ideal body weight calculated using four clinical formulas. Hamwi is most common in clinical settings. These are population estimates — individual variation is normal.',
    example: { label: '175cm, Hamwi formula', value: '~70.5 kg (155 lbs)' }
}

export default calcDef
