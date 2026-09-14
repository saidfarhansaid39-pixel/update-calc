import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

function emBand(nm: number): string {
  if (nm <= 0.01) return 'Gamma rays'
  if (nm <= 10) return 'X-rays'
  if (nm <= 380) return 'Ultraviolet'
  if (nm <= 450) return 'Visible — Violet'
  if (nm <= 485) return 'Visible — Blue'
  if (nm <= 500) return 'Visible — Cyan'
  if (nm <= 565) return 'Visible — Green'
  if (nm <= 590) return 'Visible — Yellow'
  if (nm <= 625) return 'Visible — Orange'
  if (nm <= 700) return 'Visible — Red'
  if (nm <= 1e6) return 'Infrared'
  if (nm <= 1e9) return 'Microwave'
  return 'Radio wave'
}

const calcDef: CalcDef = {
  schema: z.object({ speed: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), frequency: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'speed', label: 'Wave Speed', type: 'number', unit: 'm/s', min: 0.001, step: '0.001' }, { name: 'frequency', label: 'Frequency', type: 'number', unit: 'Hz', min: 0.001, step: '0.001' }],
  defaults: { speed: '299792458', frequency: '5e14' },
  presets: [
    { label: 'Light (vacuum)', values: { speed: '299792458', frequency: '5e14' } },
    { label: 'Sound (air 20°C)', values: { speed: '343', frequency: '440' } },
    { label: 'Radio FM 100 MHz', values: { speed: '299792458', frequency: '1e8' } },
    { label: 'Wi-Fi 2.4 GHz', values: { speed: '299792458', frequency: '2.4e9' } },
  ],
  compute: (v) => {
    const lambda = v.speed / v.frequency
    const period = 1 / v.frequency
    const wavenumber = lambda > 0 ? 1 / lambda : 0
    const lambdaNm = lambda * 1e9
    const band = emBand(lambdaNm)
    return {
      result: lambda, label: 'Wavelength', unit: 'm',
      steps: [
        { label: 'Formula', value: 'λ = v / f' },
        { label: 'Substitute', value: `${Number(v.speed).toExponential(3)} / ${Number(v.frequency).toExponential(3)}` },
        { label: 'Wavelength', value: `${lambda.toExponential(4)} m (${lambdaNm.toFixed(2)} nm)` },
        { label: 'Period (T = 1/f)', value: `${period.toExponential(4)} s` },
        { label: 'Wavenumber (1/λ)', value: `${wavenumber.toExponential(4)} m⁻¹` },
        { label: 'EM spectrum band', value: band },
      ],
      extras: [
        { label: 'Wavelength (nm)', value: lambdaNm.toFixed(2) },
        { label: 'Period', value: period.toExponential(4) + ' s' },
        { label: 'Wavenumber', value: wavenumber.toExponential(4) + ' m⁻¹' },
        { label: 'EM spectrum band', value: band },
        { label: 'Frequency (THz)', value: (v.frequency / 1e12).toFixed(4) },
        { label: 'Speed of light (vacuum)', value: '299,792,458 m/s' },
        { label: 'Speed of sound (air 20°C)', value: '343 m/s' },
        { label: 'Visible range', value: '380-700 nm (violet to red)' },
        { label: 'Audible sound range', value: '20 Hz - 20 kHz (λ ≈ 17 mm - 17 m)' },
      ],
    }
  },
  description: 'Wavelength is the distance between successive wave crests, calculated from wave speed and frequency. Identifies EM spectrum band and wave period.',
  formula: 'λ = v / f | T = 1/f | k = 1/λ',
  interpretation: 'Visible light: 380-700 nm. Shorter λ = higher energy. Radio waves have the longest λ, gamma rays the shortest.'
}

export default calcDef
