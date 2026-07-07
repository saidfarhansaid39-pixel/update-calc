import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'temp', label: 'Temperature', type: 'number', min: -50, step: '1' },
      { name: 'fromUnit', label: 'From', type: 'select', options: [{ label: 'Celsius', value: 'C' }, { label: 'Fahrenheit', value: 'F' }, { label: 'Gas Mark', value: 'gas' }] },
      { name: 'toUnit', label: 'To', type: 'select', options: [{ label: 'Celsius', value: 'C' }, { label: 'Fahrenheit', value: 'F' }, { label: 'Gas Mark', value: 'gas' }] },
    ],
    compute: (v) => {
      let celsius = Number(v.temp); if (v.fromUnit === 'F') celsius = (Number(v.temp) - 32) * 5 / 9; if (v.fromUnit === 'gas') celsius = [140, 150, 165, 180, 190, 200, 220, 230, 245][Math.min(Math.max(Math.round(Number(v.temp)) - 1, 0), 8)]
      let result = celsius; let unit = v.toUnit
      if (v.toUnit === 'F') result = celsius * 9 / 5 + 32; if (v.toUnit === 'gas') result = [1, 2, 3, 4, 5, 6, 7, 8, 9].find(i => [140, 150, 165, 180, 190, 200, 220, 230, 245][i - 1] >= celsius) || 1
      return { result, label: 'Converted Temperature', unit: v.toUnit === 'C' ? '°C' : v.toUnit === 'F' ? '°F' : 'Gas Mark', steps: [
        { label: 'Input', value: `${v.temp}°${v.fromUnit === 'gas' ? ' Gas Mark' : v.fromUnit}` },
        { label: 'To Celsius', value: `${celsius.toFixed(1)}°C` },
        { label: 'To target', value: `${result.toFixed(v.toUnit === 'gas' ? 0 : 1)}${v.toUnit === 'gas' ? ' Gas Mark' : '°' + v.toUnit}` },
      ]}
    },
    description: 'Convert cooking temperatures between Celsius, Fahrenheit, and Gas Mark. Essential for following international recipes with different temperature scales.',
    example: { label: '350°F to Celsius', value: '177°C (Gas Mark 4)' }
}

export default calcDef
