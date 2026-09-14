import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

function fmt(x: number) { return parseFloat(x.toFixed(6)).toString() }

const calcDef: CalcDef = {
    schema: num3Schema,
    fields: [numField('a', 'Coefficient a'), numField('b', 'Coefficient b'), numField('c', 'Coefficient c')],
    defaults: { a: '1', b: '-3', c: '2' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c)
      if (a === 0) {
        if (b === 0) return { result: c === 0 ? 'All real numbers' : 'No solution', label: 'Error' }
        const x = -c / b
        return { result: fmt(x), label: 'Solution (linear)', steps: [step('Linear:', `${b}x + ${c} = 0`), step('x =', fmt(x))]
          , extras: [] }
      }
      const disc = b * b - 4 * a * c
      const h = -b / (2 * a)
      const k = c - b * b / (4 * a)
      const root1 = (-b + Math.sqrt(Math.max(0, disc))) / (2 * a)
      const root2 = (-b - Math.sqrt(Math.max(0, disc))) / (2 * a)
      const vertexForm = `f(x) = ${fmt(a)}(x ${h >= 0 ? '- ' + fmt(Math.abs(h)) : '+ ' + fmt(Math.abs(-h))})² ${k >= 0 ? '+ ' + fmt(k) : '- ' + fmt(Math.abs(k))}`
      const steps: { label: string; value: string }[] = [
        step('Discriminant', `Δ = ${fmt(b)}² - 4×${fmt(a)}×${fmt(c)} = ${fmt(disc)}`),
      ]
      const extras: { label: string; value: string | number }[] = [
        { label: 'Discriminant (Δ)', value: disc },
        { label: 'Vertex form', value: vertexForm },
      ]
      if (disc > 0) {
        steps.push(
          step('Two real roots', `x₁ = ${fmt(root1)}, x₂ = ${fmt(root2)}`),
          step('x₁', `(${fmt(-b)} + √${fmt(disc)}) / (2×${fmt(a)}) = ${fmt(root1)}`),
          step('x₂', `(${fmt(-b)} - √${fmt(disc)}) / (2×${fmt(a)}) = ${fmt(root2)}`),
        )
        const factoredForm = `f(x) = ${fmt(a)}(x ${root1 >= 0 ? '- ' + fmt(Math.abs(root1)) : '+ ' + fmt(Math.abs(-root1))})(x ${root2 >= 0 ? '- ' + fmt(Math.abs(root2)) : '+ ' + fmt(Math.abs(-root2))})`
        extras.push({ label: 'Factored form', value: factoredForm })
        return { result: `${fmt(root1)}, ${fmt(root2)}`, label: 'Two Real Solutions', steps, extras }
      } else if (disc === 0) {
        const x = -b / (2 * a)
        steps.push(step('One double root', `x = ${fmt(x)}`))
        const factoredForm = `f(x) = ${fmt(a)}(x ${x >= 0 ? '- ' + fmt(Math.abs(x)) : '+ ' + fmt(Math.abs(-x))})²`
        extras.push({ label: 'Factored form', value: factoredForm })
        extras.push({ label: 'Vertex', value: `H = ${fmt(h)}, K = ${fmt(k)}` })
        return { result: fmt(x), label: 'One Real Solution (double root)', steps, extras }
      } else {
        const real = (-b / (2 * a))
        const imag = Math.sqrt(-disc) / (2 * a)
        steps.push(
          step('Complex roots', `${fmt(real)} ± ${fmt(imag)}i`),
          step('Real part', `-${fmt(b)} / (2×${fmt(a)}) = ${fmt(real)}`),
          step('Imaginary part', `√${fmt(-disc)} / (2×${fmt(a)}) = ${fmt(imag)}`),
        )
        extras.push({ label: 'Vertex', value: `H = ${fmt(h)}, K = ${fmt(k)}` })
        extras.push({ label: 'Nature', value: 'Complex — parabola does not cross x-axis' })
        return { result: `${fmt(real)} ± ${fmt(imag)}i`, label: 'Complex Solutions', steps, extras }
      }
    },
    formula: 'x = (-b ± √(b² - 4ac)) / 2a | Vertex: H = -b/(2a), K = c - b²/(4a) | Factored: a(x - x₁)(x - x₂)',
    description: 'Solve quadratic equations of the form ax² + bx + c = 0. Shows discriminant, roots, vertex form, and factored form.',
    interpretation: 'The discriminant (Δ) determines the nature of solutions: Δ > 0 two real, Δ = 0 one real (double), Δ < 0 complex. Vertex (H,K) is the parabola\'s turning point.',
    presets: [
      { label: 'x² - 3x + 2 = 0', values: { a: '1', b: '-3', c: '2' } },
      { label: 'x² + 5x + 6 = 0', values: { a: '1', b: '5', c: '6' } },
      { label: '2x² - 4x - 6 = 0', values: { a: '2', b: '-4', c: '-6' } },
      { label: 'x² + 1 = 0 (complex)', values: { a: '1', b: '0', c: '1' } },
    ]
}

export default calcDef
