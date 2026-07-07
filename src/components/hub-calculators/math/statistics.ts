import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ values: z.string().min(1, 'Required') }),
    fields: [textField('values', 'Data Values', { placeholder: 'e.g. 10, 20, 30, 40, 50' })],
    defaults: { values: '10, 20, 30, 40, 50' },
    compute: (v) => {
      const nums = String(v.values || '').split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x))
      const count = nums.length
      if (count === 0) return { result: 'No data', label: 'Error' }
      const sum = nums.reduce((a, b) => a + b, 0)
      const mean = sum / count
      const sorted = [...nums].sort((a, b) => a - b)
      const median = count % 2 === 0 ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2 : sorted[Math.floor(count / 2)]
      const variance = count > 1 ? nums.reduce((s, v) => s + (v - mean) ** 2, 0) / (count - 1) : 0
      const stdDev = Math.sqrt(variance)
      const min = Math.min(...nums), max = Math.max(...nums)
      const range = max - min
      return {
        result: mean, label: 'Mean',
        steps: [step('Count:', count + ' values'), step('Sum:', 'Sum = ' + sum), step('Mean:', sum + ' / ' + count + ' = ' + mean.toFixed(4)), step('Sorted:', sorted.join(', ')), step('Median:', median.toFixed(4)), step('Variance:', 's2 = ' + variance.toFixed(4)), step('Std Dev:', 's = ' + stdDev.toFixed(4))],
        extras: [{ label: 'Count', value: count }, { label: 'Sum', value: sum }, { label: 'Median', value: median }, { label: 'Min', value: min }, { label: 'Max', value: max }, { label: 'Range', value: range }, { label: 'Std Dev', value: stdDev }, { label: 'Variance', value: variance }]
      }
    },
    formula: 'Mean = Sum(x) / n | Median = middle value | SD = sqrt(Sum(x-mean)2/(n-1))',
    description: 'Descriptive statistics: mean, median, mode, standard deviation, variance, range.',
    interpretation: 'The mean is the average. The median is the middle value. Standard deviation measures spread from the mean.',
    presets: [
      { label: 'Test Scores', values: { values: '85, 90, 78, 92, 88' } },
      { label: 'Ages', values: { values: '25, 32, 45, 28, 36' } },
    ]
}

export default calcDef
