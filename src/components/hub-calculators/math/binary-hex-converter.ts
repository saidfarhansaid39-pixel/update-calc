import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1), conversionType: z.enum(['bin2dec', 'dec2bin', 'hex2dec', 'dec2hex', 'bin2hex', 'hex2bin', 'oct2dec', 'dec2oct']) }),
    fields: [numField('a', 'Value'), selectField('conversionType', 'Convert', [{ value: 'bin2dec', label: 'Binary to Decimal' }, { value: 'dec2bin', label: 'Decimal to Binary' }, { value: 'hex2dec', label: 'Hexadecimal to Decimal' }, { value: 'dec2hex', label: 'Decimal to Hexadecimal' }, { value: 'bin2hex', label: 'Binary to Hexadecimal' }, { value: 'hex2bin', label: 'Hexadecimal to Binary' }, { value: 'oct2dec', label: 'Octal to Decimal' }, { value: 'dec2oct', label: 'Decimal to Octal' }])],
    defaults: { a: '1101', conversionType: 'bin2dec' },
    compute: (v) => {
      const t = v.conversionType || 'bin2dec'
      let result = '', label = ''
      if (t === 'bin2dec') { result = '' + parseInt(v.a, 2); label = 'Decimal' }
      else if (t === 'dec2bin') { result = parseInt(v.a, 10).toString(2); label = 'Binary' }
      else if (t === 'hex2dec') { result = '' + parseInt(v.a, 16); label = 'Decimal' }
      else if (t === 'dec2hex') { result = parseInt(v.a, 10).toString(16).toUpperCase(); label = 'Hexadecimal' }
      else if (t === 'bin2hex') { result = parseInt(v.a, 2).toString(16).toUpperCase(); label = 'Hexadecimal' }
      else if (t === 'hex2bin') { result = parseInt(v.a, 16).toString(2); label = 'Binary' }
      else if (t === 'oct2dec') { result = '' + parseInt(v.a, 8); label = 'Decimal' }
      else if (t === 'dec2oct') { result = parseInt(v.a, 10).toString(8); label = 'Octal' }
      return { result: isNaN(parseInt(result)) ? 'Invalid input' : result, label, steps: [step('Convert:', '' + t + ' of ' + v.a), step('Result:', result)] }
    },
    formula: 'Base conversion',
    description: 'Convert numbers between binary, decimal, hexadecimal, and octal bases.',
    interpretation: 'The number in the target base system.',
    presets: [
      { label: 'Binary to Decimal', values: { a: '11111111', conversionType: 'bin2dec' } },
      { label: 'Decimal to Hex', values: { a: '255', conversionType: 'dec2hex' } },
    ]
}

export default calcDef
