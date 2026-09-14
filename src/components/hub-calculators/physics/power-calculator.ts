import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ work: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), time: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'work', label: 'Work', type: 'number', unit: 'J', min: 0.001, step: '0.001' }, { name: 'time', label: 'Time', type: 'number', unit: 's', min: 0.001, step: '0.001' }],
  defaults: { work: '1000', time: '2' },
  presets: [
    { label: 'Light bulb (60 J in 1 s)', values: { work: '60', time: '1' } },
    { label: 'Car engine (300 kJ in 6 s)', values: { work: '300000', time: '6' } },
    { label: 'Human output (2000 J in 10 s)', values: { work: '2000', time: '10' } },
  ],
  compute: (v) => ({ result: v.work / v.time, label: 'Power', unit: 'W', steps: [{ label: 'Formula', value: 'P = W/t' }, { label: 'Substitute', value: `${v.work} / ${v.time}` }, { label: 'Result', value: `${(v.work / v.time).toFixed(2)} W` }],
      extras: [
        { label: 'Real-World Application', value: 'Power ratings define engines, appliances, and human output. A 100 W bulb uses 100 J/s. A typical car engine produces ~100 kW (134 hp).' },
        { label: 'Common Values', value: 'Human resting: ~80 W. Cycling: 200-400 W. Microwave: 800-1200 W. Car engine: 50-300 kW. Power plant: 500-1000 MW.' },
        { label: 'Precision Tip', value: 'Power = work/time = energy/time. Electrical power: P = IV = I²R. Mechanical power: P = Fv = τω.' },
        { label: 'Related Formula', value: 'Energy = Power × time. 1 kWh = 3.6 MJ. Horsepower: 1 hp = 745.7 W. Apparent power (AC): S = VI (VA).' },
        { label: 'Unit Conversion Note', value: '1 W = 1 J/s. 1 hp = 745.7 W. 1 kW = 1.34 hp. 1 MW = 10^6 W. 1 GW = 10^9 W.' }
      ] }),
  description: 'Power is the rate at which work is done or energy is transferred. P = W/t.',
  formula: 'P = W / t',
  interpretation: 'Power is measured in watts (W). 1 W = 1 J/s. Higher power means work is done more quickly.'
}

export default calcDef
