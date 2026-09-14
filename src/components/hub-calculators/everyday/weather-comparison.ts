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
  defaults: { wc2City1Temp: '90', wc2City1Humid: '70', wc2City2Temp: '85', wc2City2Humid: '30', wc2Unit: 'F' },
  presets: [
    { label: 'Phoenix vs Miami Summer', values: { wc2City1Temp: '95', wc2City1Humid: '25', wc2City2Temp: '90', wc2City2Humid: '75', wc2Unit: 'F' } },
    { label: 'Dry Heat vs Humid Heat', values: { wc2City1Temp: '100', wc2City1Humid: '15', wc2City2Temp: '85', wc2City2Humid: '80', wc2Unit: 'F' } },
    { label: 'Mild vs Cold Winter', values: { wc2City1Temp: '55', wc2City1Humid: '60', wc2City2Temp: '35', wc2City2Humid: '80', wc2Unit: 'F' } },
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
    return { result: tempDiff, label: 'Temperature Difference', unit: 'deg ' + v.wc2Unit, steps: [{ label: 'City 1 Conditions', value: `${v.wc2City1Temp}°${v.wc2Unit}, ${v.wc2City1Humid}% RH` }, { label: 'City 2 Conditions', value: `${v.wc2City2Temp}°${v.wc2Unit}, ${v.wc2City2Humid}% RH` }, { label: 'City 1 in Celsius', value: `${c1.toFixed(1)}°C` }, { label: 'City 2 in Celsius', value: `${c2.toFixed(1)}°C` }, { label: 'City 1 Heat Index (feels like)', value: `${hi1.toFixed(1)}°C = ${(hi1 * 9/5 + 32).toFixed(1)}°F` }, { label: 'City 2 Heat Index (feels like)', value: `${hi2.toFixed(1)}°C = ${(hi2 * 9/5 + 32).toFixed(1)}°F` }, { label: 'Raw Temp Difference', value: `${tempDiff}°${v.wc2Unit}` }, { label: 'Comfort Verdict', value: moreComfortable }] ,
    extras: [
      { label: 'Heat Index Danger Levels', value: 'NWS Heat Index: 80-90°F = Caution (fatigue possible), 90-103°F = Extreme Caution (heat cramps/sunstroke), 103-124°F = Danger (heat cramps/sunstroke likely), 125°F+ = Extreme Danger (heat stroke imminent). Humidity above 60% dramatically amplifies these effects.' },
      { label: 'Humidity & Perceived Temperature', value: 'At 95°F: 20% humidity feels like 95°F, 50% humidity feels like 107°F, 80% humidity feels like 132°F. The heat index formula shows that high humidity reduces sweat evaporation, making the body unable to cool itself effectively.' },
      { label: 'Winter Wind Chill Context', value: 'This calculator uses heat index (for warm conditions). For cold weather, wind chill is the key factor: 35°F with 20 mph wind feels like 24°F. Exposed skin freezes in 30 min at -19°F wind chill. Wind chill only applies to living skin, not objects.' },
      { label: 'Comfort Zone Range', value: 'Most people feel comfortable at 68-74°F with 30-50% humidity. Below 30% RH: dry skin, static electricity, scratchy throat. Above 60% RH: sticky feeling, mold growth risk, breathing discomfort. Ideal dew point: 50-60°F.' },
      { label: 'Urban Heat Island Effect', value: 'Cities are 2-5°F warmer than surrounding rural areas due to concrete/ asphalt absorbing heat. A city at 92°F with 60% humidity (HI = 108°F) may feel significantly worse than the same temperature in a park or suburban area.' },
      { label: 'Acclimatization Factor', value: 'People acclimated to hot climates feel heat differently. After 2 weeks of exposure, sweat rate increases and electrolyte conservation improves. A Phoenix resident (dry heat) may feel 100°F as "not bad" while a Miami resident feels 90°F as "miserable" due to humidity expectations.' },
      { label: 'Apparent Temperature Formula', value: 'The heat index used here is the NWS Steadman model (1979, refined by Rothfusz 1990). It accounts for temperature and humidity but not wind speed or solar radiation. On sunny days, add 10-15°F to the heat index for "real feel" due to direct sun exposure.' },
    ]}
  },
  description: 'Compare weather between two cities including temperature, humidity, and the NWS Steadman heat index calculation to determine which location actually feels more comfortable. Accounts for humidity\'s dramatic effect on perceived temperature.',
  formula: 'HeatIndex(°C) = -8.7847 + 1.6114×T + 2.3385×H - 0.1461×T×H - 0.0123×T² - 0.0164×H² + 0.0022×T²×H + 0.0007×T×H² - 0.000003×T²×H². Used when temp ≥ 26°C (79°F). Below 26°C: heat index = actual temperature.',
  interpretation: 'A 90°F day with 70% humidity (typical southeastern US summer) has a heat index of 113°F — feeling 23°F hotter than the actual air temperature. Compare this to a 100°F day with 15% humidity (typical Arizona summer) with a heat index of 100°F. Despite being 10°F cooler by the thermometer, the humid city feels 13°F hotter due to the humidity penalty. The NWS heat index shows that humidity above 50% adds 5-20°F to perceived temperature, making humid heat significantly more dangerous and uncomfortable than dry heat at the same thermometer reading.'
}

export default calcDef
