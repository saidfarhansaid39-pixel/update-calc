import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ rows: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && Number.isInteger(Number(v)) && Number(v) <= 20, '1-20 integer') }),
    fields: [numField('rows', 'Number of rows', { min: 1, max: 20, step: '1' })],
    defaults: { rows: '6' },
    compute: (v) => {
      const r = Math.round(n(v.rows)); const tri: number[][] = []
      for (let i = 0; i < r; i++) { tri[i] = []; for (let j = 0; j <= i; j++) tri[i][j] = (j === 0 || j === i) ? 1 : tri[i - 1][j - 1] + tri[i - 1][j] }
      const rowsStr = tri.map(row => row.join(' ')).join(' | ')
      return { result: rowsStr, label: 'Pascal Triangle', steps: [step('Rows', '' + r), ...tri.map((row, i) => step(`Row ${i}`, row.join(' ')))] ,
    extras: [
      { label: "Mathematical Significance", value: "Fundamental concept in number theory and discrete mathematics." },
      { label: "Computational Note", value: "Large inputs may require optimized algorithms for performance." },
      { label: "Historical Context", value: "Studied by mathematicians across centuries for its unique properties." },
      { label: "Related Sequences", value: "Related to other integer sequences and special numbers." },
      { label: "Pattern Recognition", value: "Observe recurring patterns and relationships between values." }
    ]}
    },
    formula: 'Each entry = sum of two above it. Row n sums to 2n.',
    description: 'Generate Pascal triangle rows.',
    interpretation: 'Pascal triangle gives binomial coefficients C(n,k).',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
