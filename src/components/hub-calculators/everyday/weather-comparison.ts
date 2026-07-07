import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wc2City1Temp: z.string().min(1).refine(v => parseFloat(v) >= -50, '>=-50'), wc2City1Humid: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wc2City2Temp: z.string().min(1).refine(v => parseFloat(v) >= -50, '>=-50'), wc2City2Humid: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wc2Unit: z.string().min(1) }),
  fields: [
    { name: 'wc2City1Temp', label: 'City 1 Temperature', type: 'number', min: -50, max: 130, step: '5' },
    { name: 'wc2City1Humid', label: 'City 1 Humidity (%)', type: 'number', min: 0, max: 100, step: '5' },
    { name: 'wc2City2Temp', label: 'City 2 Temperature', type: 'number', min: -50, max: 130, step: '5' },
    { name: 'wc2City2Humid', label: 'City 2 Humidity (%)', type: 'number', min: 0, max: 100, step: '5' },
    { name: 'wc2Unit', label: 'Temperature Unit', type: 'select', options: [{ label: 'Fahrenheit', value: 'F' }, { label: 'Celsius', value: 'C' }] },
  ],
  compute: (v) => {
    const toC = (temp: number, unit: string) => unit === 'F' ? (temp - 32) * 5 / 9 : temp
    const heatIndex = (tempC: number, humidity: number) => {
      if (tempC < 26) return tempC
      const c1 = -8.784695, c2 = 1.611394, c3 = 2.338549, c4 = -0.146116, c5 = -0.012308, c6 = -0.016425, c7 = 0.002211, c8 = 0.000725, c9 = -0.000003
      return c1 + c2 * tempC + c3 * humidity + c4 * tempC * humidity + c5 * tempC * tempC + c6 * humidity * humidity + c7 * tempC * tempC * humidity + c8 * tempC * humidity * humidity + c9 * tempC * tempC * humidity * humidity
    }
    const c1 = toC(v.wc2City1Temp, v.wc2Unit)
    const c2 = toC(v.wc2City2Temp, v.wc2Unit)
    const hi1 = heatIndex(c1, v.wc2City1Humid)
    const hi2 = heatIndex(c2, v.wc2City2Humid)
    const tempDiff = Math.abs(v.wc2City1Temp - v.wc2City2Temp)
    let moreComfortable = ''
    if (hi1 < hi2) moreComfortable = 'City 1 feels cooler (lower heat index)'
    else if (hi2 < hi1) moreComfortable = 'City 2 feels cooler (lower heat index)'
    else moreComfortable = 'Similar comfort level'
    return { result: tempDiff, label: 'Temperature Difference', unit: 'deg ' + v.wc2Unit, steps: [{ label: 'City 1', value: v.wc2City1Temp + ' deg ' + v.wc2Unit + ', ' + v.wc2City1Humid + '% RH' }, { label: 'City 2', value: v.wc2City2Temp + ' deg ' + v.wc2Unit + ', ' + v.wc2City2Humid + '% RH' }, { label: 'City 1 Heat Index', value: hi1.toFixed(1) + ' deg C (feels like)' }, { label: 'City 2 Heat Index', value: hi2.toFixed(1) + ' deg C (feels like)' }, { label: 'Comfort Verdict', value: moreComfortable }] }
  },
  description: 'Compare weather between two cities including temperature, humidity, and heat index to determine which feels more comfortable.',
  formula: 'Heat Index = Complex temp/humidity formula | Humidity makes hot feel hotter and cold feel colder | Wind chill not included',
  interpretation: 'Heat index: 80-90F = caution, 90-105F = extreme caution, 105-130F = danger. High humidity above 60% makes 90F feel like 100F+. Low humidity below 30% makes dry skin and respiratory discomfort more likely.'
}

export default calcDef
