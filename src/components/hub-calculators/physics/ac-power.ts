import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ voltage: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), current: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), phase: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= -90 && n <= 90 }, '-90 to 90') }),
  fields: [{ name: 'voltage', label: 'RMS Voltage', type: 'number', unit: 'V', min: 0.1, step: '0.1' }, { name: 'current', label: 'RMS Current', type: 'number', unit: 'A', min: 0.001, step: '0.001' }, { name: 'phase', label: 'Phase Angle', type: 'number', unit: 'degrees', min: -90, max: 90, step: '1' }],
  defaults: { work: '1000', time: '2' },
  presets: [
    { label: 'Light bulb (60 J in 1 s)', values: { work: '60', time: '1' } },
    { label: 'Car engine (300 kJ in 6 s)', values: { work: '300000', time: '6' } },
    { label: 'Human output (2000 J in 10 s)', values: { work: '2000', time: '10' } },
  ],
  compute: (v) => { const rad = v.phase * Math.PI / 180; const pf = Math.cos(rad); const P = v.voltage * v.current * pf; const Q = v.voltage * v.current * Math.sin(rad); const S = v.voltage * v.current; return { result: P, label: 'Real Power', unit: 'W', steps: [{ label: 'Formula', value: 'P = VI·cos(φ)' }, { label: 'Apparent power S', value: `${S.toFixed(2)} VA` }, { label: 'Power factor', value: `${pf.toFixed(4)}` }, { label: 'Reactive power Q', value: `${Q.toFixed(2)} VAR` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Power ratings define engines, appliances, and human output. A 100 W bulb uses 100 J/s. A typical car engine produces ~100 kW (134 hp).' },
        { label: 'Common Values', value: 'Human resting: ~80 W. Cycling: 200-400 W. Microwave: 800-1200 W. Car engine: 50-300 kW. Power plant: 500-1000 MW.' },
        { label: 'Precision Tip', value: 'Power = work/time = energy/time. Electrical power: P = IV = I²R. Mechanical power: P = Fv = τω.' },
        { label: 'Related Formula', value: 'Energy = Power × time. 1 kWh = 3.6 MJ. Horsepower: 1 hp = 745.7 W. Apparent power (AC): S = VI (VA).' },
        { label: 'Unit Conversion Note', value: '1 W = 1 J/s. 1 hp = 745.7 W. 1 kW = 1.34 hp. 1 MW = 10^6 W. 1 GW = 10^9 W.' }
      ]} },
  description: 'AC power calculations: real power (W), apparent power (VA), reactive power (VAR), and power factor from RMS voltage, current, and phase angle.',
  formula: 'P = VI·cos(φ), S = VI, Q = VI·sin(φ)',
  interpretation: 'Power factor cos(φ) = 1 for pure resistive loads, 0 for pure reactive. Utilities charge for real power but must supply apparent power. Low PF means higher current for same real power.'
}

export default calcDef
