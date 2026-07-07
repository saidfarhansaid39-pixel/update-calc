import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tempDiff: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), thickness: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), conductivity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'area', label: 'Area', type: 'number', unit: 'm^2', min: 0.001, step: '0.001' }, { name: 'tempDiff', label: 'Temperature Difference', type: 'number', unit: 'K', min: 0.1, step: '0.1' }, { name: 'thickness', label: 'Thickness', type: 'number', unit: 'm', min: 0.001, step: '0.001' }, { name: 'conductivity', label: 'Thermal Conductivity', type: 'number', unit: 'W/(m·K)', min: 0.01, step: '0.01' }],
  compute: (v) => ({ result: v.conductivity * v.area * v.tempDiff / v.thickness, label: 'Heat Transfer Rate', unit: 'W', steps: [{ label: 'Formula', value: 'Q = kAΔT/d' }, { label: 'Substitute', value: `${v.conductivity} × ${v.area} × ${v.tempDiff} / ${v.thickness}` }, { label: 'Result', value: `${(v.conductivity * v.area * v.tempDiff / v.thickness).toFixed(2)} W` }] }),
  description: 'Conductive heat transfer rate depends on material conductivity, area, temperature difference, and thickness. Fourier\'s Law.',
  formula: 'Q = k·A·ΔT / d',
  interpretation: 'Copper (k ≈ 400 W/(m·K)) conducts heat much better than wood (k ≈ 0.1 W/(m·K)). Insulation minimizes heat transfer.'
}

export default calcDef
