import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a1: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)), 'Integer'), m1: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) > 0, 'Integer > 0'), a2: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)), 'Integer'), m2: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) > 0, 'Integer > 0') }),
    fields: [numField('a1', 'a1 (x ? a1 mod m1)', { step: '1' }), numField('m1', 'm1', { min: 1, step: '1' }), numField('a2', 'a2 (x ? a2 mod m2)', { step: '1' }), numField('m2', 'm2', { min: 1, step: '1' })],
    defaults: { a1: '2', m1: '3', a2: '3', m2: '5' },
    compute: (v) => {
      const a1 = Math.round(n(v.a1)), m1 = Math.round(n(v.m1)), a2 = Math.round(n(v.a2)), m2 = Math.round(n(v.m2))
      const g = (x: number, y: number): number => y === 0 ? x : g(y, x % y)
      if (g(m1, m2) !== 1) return { result: 'Moduli not coprime', label: 'Error', steps: [step('gcd(' + m1 + ',' + m2 + ')', '' + g(m1, m2))] ,
    extras: [
      { label: "Mathematical Significance", value: "Fundamental concept in number theory and discrete mathematics." },
      { label: "Computational Note", value: "Large inputs may require optimized algorithms for performance." },
      { label: "Historical Context", value: "Studied by mathematicians across centuries for its unique properties." },
      { label: "Related Sequences", value: "Related to other integer sequences and special numbers." },
      { label: "Pattern Recognition", value: "Observe recurring patterns and relationships between values." }
    ]}
      let x = a1; while (x % m2 !== a2) x += m1
      const lcm = m1 * m2
      return { result: x + ' mod ' + lcm, label: 'General solution', steps: [step('System', 'x ? ' + a1 + ' (mod ' + m1 + '), x ? ' + a2 + ' (mod ' + m2 + ')'), step('Solution', 'x = ' + x + ' (mod ' + lcm + ')')] }
    },
    formula: 'For coprime m1, m2, there is unique solution modulo m1 x m2.',
    description: 'Solve a system of two congruences using the Chinese Remainder Theorem.',
    interpretation: 'The unique solution modulo m1 x m2 that satisfies both congruences.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
