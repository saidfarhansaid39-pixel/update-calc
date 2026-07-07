import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ re: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), im: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('re', 'Real part'), numField('im', 'Imaginary part')],
    defaults: { re: '3', im: '4' },
    compute: (v) => {
      const re = n(v.re), im = n(v.im); const mod = Math.sqrt(re * re + im * im); const arg = Math.atan2(im, re) * 180 / Math.PI; const conjRe = re, conjIm = -im
      return { result: `${re} + ${im}i`, label: 'Complex Number', steps: [step('Cartesian', `${re} + ${im}i`), step('Modulus', mod.toFixed(4)), step('Argument', arg.toFixed(2) + '�'), step('Conjugate', `${conjRe} + ${conjIm}i`)] }
    },
    formula: 'z = a + bi. |z| = v(a�+b�). arg(z) = arctan(b/a).',
    description: 'Analyze a complex number � modulus, argument, conjugate.',
    interpretation: 'Complex number in Cartesian form with key properties.'
}

export default calcDef
