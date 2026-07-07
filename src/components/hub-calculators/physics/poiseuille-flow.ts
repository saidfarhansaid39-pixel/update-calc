import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ pressureDrop: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), radius: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), viscosity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'pressureDrop', label: 'Pressure Drop ΔP', type: 'number', unit: 'Pa', min: 1, step: '1' }, { name: 'radius', label: 'Pipe Radius r', type: 'number', unit: 'm', min: 0.001, step: '0.001' }, { name: 'viscosity', label: 'Dynamic Viscosity η', type: 'number', unit: 'Pa·s', min: 1e-6, step: '1e-6' }, { name: 'length', label: 'Pipe Length L', type: 'number', unit: 'm', min: 0.01, step: '0.01' }],
  compute: (v) => { const Q = Math.PI * v.pressureDrop * Math.pow(v.radius, 4) / (8 * v.viscosity * v.length); return { result: Q, label: 'Volumetric Flow Rate', unit: 'm³/s', steps: [{ label: 'Formula', value: 'Q = πΔP·r⁴/(8ηL)' }, { label: 'Result', value: `${Q.toExponential(6)} m³/s` }] } },
  description: 'Poiseuille\'s Law describes laminar flow of a viscous fluid through a cylindrical pipe. Flow rate is proportional to the fourth power of radius.',
  formula: 'Q = π·ΔP·r⁴/(8ηL)',
  interpretation: 'Doubling the radius increases flow by factor 16! This is why arteries are so effective. The law applies only to laminar flow (low Re). High flow rates cause turbulence, reducing efficiency.'
}

export default calcDef
