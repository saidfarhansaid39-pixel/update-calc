import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ initialLambda: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), angle: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= 0 && n <= 180 }, '0-180') }),
  fields: [{ name: 'initialLambda', label: 'Initial Wavelength', type: 'number', unit: 'pm', min: 0.1, step: '0.1' }, { name: 'angle', label: 'Scattering Angle', type: 'number', unit: 'degrees', min: 0, max: 180, step: '1' }],
  defaults: { wavelength: '1e-10', angle: '90' },
  presets: [
    { label: 'X-ray (0.1 nm) scattered 90°', values: { wavelength: '1e-10', angle: '90' } },
    { label: 'Gamma ray (0.01 nm) scattered 180°', values: { wavelength: '1e-11', angle: '180' } },
    { label: 'Visible light (500 nm) scattered 45°', values: { wavelength: '5e-7', angle: '45' } },
  ],
  compute: (v) => { const h = 6.626e-34; const me = 9.109e-31; const c = 299792458; const pm = 1e-12; const lambdaC = h / (me * c); const rad = v.angle * Math.PI / 180; const shift = lambdaC * (1 - Math.cos(rad)); const finalLambda = v.initialLambda * pm + shift; return { result: shift, label: 'Compton Shift', unit: 'm', steps: [{ label: 'Formula', value: 'Δλ = h/(mₑc)(1 - cosθ)' }, { label: 'Compton wavelength', value: `${(lambdaC * 1e12).toFixed(2)} pm` }, { label: 'Shift Δλ', value: `${shift.toExponential(4)} m` }, { label: 'Final λ', value: `${(finalLambda * 1e12).toFixed(2)} pm` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Compton scattering demonstrated light particle nature (Compton, 1927 Nobel Prize). Used in medical imaging (Compton cameras) and X-ray spectroscopy.' },
        { label: 'Common Values', value: 'Compton wavelength of electron: λ_C = h/(m_ec) = 2.426×10⁻¹² m. Δλ = λ_C(1 - cosθ). Max Δλ at 180°: 2λ_C = 0.00485 nm.' },
        { label: 'Precision Tip', value: 'Δλ = h/(m_ec)(1 - cosθ). λ_C = h/(mc) = 2.43 pm for electron. Energy shift is significant for X-rays and gamma rays, negligible for visible light.' },
        { label: 'Related Formula', value: 'Δλ = h/(m_ec)(1 - cosθ). λ_C = 2.426×10⁻¹² m. Scattered photon energy: E\' = E/(1+(E/mc²)(1-cosθ)). KE_recoil = hc/λ - hc/λ\'.' },
        { label: 'Unit Conversion Note', value: 'λ in m. θ in degrees. λ_C = h/(m_ec) = 2.426 pm. h/m_ec = 2.426×10⁻¹² m. 1 pm = 10⁻¹² m. 1 Å = 10⁻¹⁰ m.' }
      ]} },
  description: 'Compton scattering: X-ray photons scatter off electrons, increasing wavelength. The wavelength shift depends only on the scattering angle.',
  formula: 'Δλ = h/(mₑc) · (1 - cosθ)',
  interpretation: 'Compton wavelength of electron = h/(mₑc) = 2.426 pm. The maximum shift (180° backscatter) is 2λ_C = 4.852 pm. This effect confirmed the particle nature of photons.'
}

export default calcDef
