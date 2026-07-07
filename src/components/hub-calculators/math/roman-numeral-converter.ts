import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1), conversionType: z.enum(['int2rom', 'rom2int']) }),
    fields: [numField('a', 'Value'), selectField('conversionType', 'Convert', [{ value: 'int2rom', label: 'Integer to Roman' }, { value: 'rom2int', label: 'Roman to Integer' }])],
    defaults: { a: '2024', conversionType: 'int2rom' },
    compute: (v) => {
      const t = v.conversionType || 'int2rom'
      if (t === 'int2rom') {
        const num = parseInt(v.a)
        if (isNaN(num) || num < 1 || num > 3999) return { result: 'Invalid (1-3999)', label: 'Error' }
        const vals: [number, string][] = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]
        let roman = '', n = num
        for (const [val, sym] of vals) { while (n >= val) { roman += sym; n -= val } }
        return { result: roman, label: 'Roman Numeral', steps: [step('Integer:', '' + num), step('Roman:', roman)] }
      } else {
        const romanMap: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
        let total = 0, prev = 0
        for (let i = v.a.length - 1; i >= 0; i--) {
          const cur = romanMap[v.a[i].toUpperCase()] || 0
          if (cur < prev) total -= cur; else total += cur
          prev = cur
        }
        return { result: '' + total, label: 'Integer', steps: [step('Roman:', v.a.toUpperCase()), step('Integer:', '' + total)] }
      }
    },
    formula: 'Roman numeral conversion using standard rules',
    description: 'Convert between integers (1-3999) and Roman numerals.',
    interpretation: 'The converted value in the target numeral system.',
    presets: [
      { label: '2024 to Roman', values: { a: '2024', conversionType: 'int2rom' } },
      { label: 'MMXXIV to Integer', values: { a: 'MMXXIV', conversionType: 'rom2int' } },
    ]
}

export default calcDef
