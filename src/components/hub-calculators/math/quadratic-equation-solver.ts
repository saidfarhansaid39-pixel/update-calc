import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num3Schema,
    fields: [numField('a', 'Coefficient a'), numField('b', 'Coefficient b'), numField('c', 'Coefficient c')],
    defaults: { a: '1', b: '-3', c: '2' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c)
      if (a === 0) {
        if (b === 0) return { result: c === 0 ? 'All real numbers' : 'No solution', label: 'Error' }
        return { result: (-c / b).toFixed(4), label: 'Solution (linear)', steps: [step('Linear:', '' + b + 'x + ' + c + ' = 0'), step('x =', '' + (-c / b).toFixed(4))] }
      }
      const disc = b * b - 4 * a * c
      if (disc > 0) {
        const x1 = (-b + Math.sqrt(disc)) / (2 * a), x2 = (-b - Math.sqrt(disc)) / (2 * a)
        return { result: x1.toFixed(4) + ', ' + x2.toFixed(4), label: 'Two Real Solutions', steps: [step('Discriminant:', 'D = ' + b + '2 - 4x' + a + 'x' + c + ' = ' + disc.toFixed(4)), step('x1:', '(-' + b + ' + sqrt(' + disc + ')) / (2x' + a + ') = ' + x1.toFixed(4)), step('x2:', '(-' + b + ' - sqrt(' + disc + ')) / (2x' + a + ') = ' + x2.toFixed(4))], extras: [{ label: 'Discriminant', value: disc }] }
      } else if (disc === 0) {
        const x = -b / (2 * a)
        return { result: x.toFixed(4), label: 'One Real Solution (double root)', steps: [step('Discriminant:', 'D = 0'), step('x:', '-' + b + ' / (2x' + a + ') = ' + x.toFixed(4))], extras: [{ label: 'Discriminant', value: 0 }] }
      } else {
        const real = (-b / (2 * a)).toFixed(4), imag = (Math.sqrt(-disc) / (2 * a)).toFixed(4)
        return { result: real + ' +/- ' + imag + 'i', label: 'Complex Solutions', steps: [step('Discriminant:', 'D = ' + disc.toFixed(4) + ' < 0'), step('Real part:', '-' + b + ' / (2x' + a + ') = ' + real), step('Imaginary part:', 'sqrt(' + (-disc).toFixed(4) + ') / (2x' + a + ') = ' + imag)], extras: [{ label: 'Discriminant', value: disc }] }
      }
    },
    formula: 'x = (-b +/- sqrt(b2 - 4ac)) / 2a',
    description: 'Solve quadratic equations of the form ax2 + bx + c = 0.',
    interpretation: 'The solutions of the quadratic equation. The discriminant determines if solutions are real or complex.',
    presets: [
      { label: 'x2 - 3x + 2 = 0', values: { a: '1', b: '-3', c: '2' } },
      { label: 'x2 + 5x + 6 = 0', values: { a: '1', b: '5', c: '6' } },
      { label: '2x2 - 4x - 6 = 0', values: { a: '2', b: '-4', c: '-6' } },
    ]
}

export default calcDef
