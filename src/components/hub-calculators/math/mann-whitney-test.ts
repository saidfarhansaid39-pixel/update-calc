import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({
      a: z.string().min(1, 'Required'),
      b: z.string().min(1, 'Required')
}),
    fields: [textField('a', 'Group 1 (comma-separated)'), textField('b', 'Group 2 (comma-separated)')],
    defaults: { a: '10, 12, 14, 16, 18', b: '5, 7, 9, 11, 13' },
    compute: (v) => {
      const g1 = String(v.a || '').split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x))
      const g2 = String(v.b || '').split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x))
      if (g1.length === 0 || g2.length === 0) return { result: 'Need data in both groups', label: 'Error' }
      const all: { v: number; g: number; rank: number }[] = [...g1.map(v => ({ v, g: 1, rank: 0 })), ...g2.map(v => ({ v, g: 2, rank: 0 }))].sort((a, b) => a.v - b.v)
      all.forEach((item, i) => { item['rank'] = i + 1 })
      const r1 = all.filter(x => x.g === 1).reduce((s, x) => s + x['rank'], 0)
      const n1 = g1.length, n2 = g2.length
      const u1 = r1 - (n1 * (n1 + 1)) / 2
      const u2 = n1 * n2 - u1
      return { result: Math.min(u1, u2), label: 'U Statistic', steps: [step('Group 1 ranks sum:', 'R1 = ' + r1), step('U1:', r1 + ' - (' + n1 + 'x' + (n1 + 1) + ')/2 = ' + u1), step('U2:', '' + n1 + 'x' + n2 + ' - ' + u1 + ' = ' + u2), step('Result:', 'U = ' + Math.min(u1, u2))], extras: [{ label: 'U1', value: u1 }, { label: 'U2', value: u2 }] }
    },
    formula: 'U = R1 - n1(n1+1)/2',
    description: 'Mann-Whitney U test for comparing two independent groups (non-parametric).',
    interpretation: 'The U statistic measures the difference between the two groups.'
}

export default calcDef
