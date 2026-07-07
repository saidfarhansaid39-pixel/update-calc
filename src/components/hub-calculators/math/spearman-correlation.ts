import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({
      a: z.string().min(1, 'Required'),
      b: z.string().min(1, 'Required')
}),
    fields: [textField('a', 'Variable X (comma-separated)'), textField('b', 'Variable Y (comma-separated)')],
    defaults: { a: '10, 20, 30, 40, 50', b: '15, 25, 35, 45, 55' },
    compute: (v) => {
      const x = String(v.a || '').split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x))
      const y = String(v.b || '').split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x))
      if (x.length !== y.length || x.length < 3) return { result: 'Need at least 3 paired values', label: 'Error' }
      const rank = (arr: number[]) => {
        const sorted: { v: number; i: number; r: number }[] = [...arr].map((v, i) => ({ v, i, r: 0 })).sort((a, b) => a.v - b.v)
        sorted.forEach((item, i) => { item['r'] = i + 1 })
        const ranks = new Array(arr.length)
        sorted.forEach(item => { ranks[item.i] = item['r'] })
        return ranks
      }
      const rX = rank(x), rY = rank(y)
      const dSq = rX.reduce((s, r, i) => s + (r - rY[i]) ** 2, 0)
      const n = x.length
      const rho = 1 - (6 * dSq) / (n * (n * n - 1))
      const strength = Math.abs(rho) >= 0.8 ? 'very strong' : Math.abs(rho) >= 0.6 ? 'strong' : Math.abs(rho) >= 0.4 ? 'moderate' : Math.abs(rho) >= 0.2 ? 'weak' : 'very weak'
      return { result: rho.toFixed(4), label: "Spearman's rho", steps: [step('Ranks computed', n + ' pairs'), step('Formula:', 'rho = 1 - (6 x ' + dSq + ') / (' + n + ' x (' + n + '2 - 1)) = ' + rho.toFixed(4)), step('Interpretation:', strength + ' ' + (rho >= 0 ? 'positive' : 'negative') + ' correlation')] }
    },
    formula: 'rho = 1 - (6 x Sum(di2)) / (n x (n2 - 1))',
    description: "Calculate Spearman's rank correlation coefficient between two variables.",
    interpretation: "Spearman's rho measures the monotonic relationship between two ranked variables."
}

export default calcDef
