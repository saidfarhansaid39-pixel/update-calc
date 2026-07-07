import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ x: z.string().min(1, 'Required'), y: z.string().min(1, 'Required'), zCtrl: z.string().min(1, 'Required') }),
  fields: [{ name: 'x', label: 'X Values', type: 'number', step: 'any' }, { name: 'y', label: 'Y Values', type: 'number', step: 'any' }, { name: 'zCtrl', label: 'Z (control) Values', type: 'number', step: 'any' }],
  compute: (v) => { const x = parseList(v.x); const y = parseList(v.y); const z = parseList(v.zCtrl); if (x.length !== y.length || x.length !== z.length || x.length < 3) return { result: 'Need ≥3 obs', label: '', unit: '', steps: [] }; const mx = x.reduce((a, b) => a + b, 0) / x.length; const my = y.reduce((a, b) => a + b, 0) / y.length; const mz = z.reduce((a, b) => a + b, 0) / z.length; const rxy = x.reduce((acc, xi, i) => acc + (xi - mx) * (y[i] - my), 0) / Math.sqrt(x.reduce((acc, xi) => acc + (xi - mx) ** 2, 0) * y.reduce((acc, yi) => acc + (yi - my) ** 2, 0)); const rxz = x.reduce((acc, xi, i) => acc + (xi - mx) * (z[i] - mz), 0) / Math.sqrt(x.reduce((acc, xi) => acc + (xi - mx) ** 2, 0) * z.reduce((acc, zi) => acc + (zi - mz) ** 2, 0)); const ryz = y.reduce((acc, yi, i) => acc + (yi - my) * (z[i] - mz), 0) / Math.sqrt(y.reduce((acc, yi) => acc + (yi - my) ** 2, 0) * z.reduce((acc, zi) => acc + (zi - mz) ** 2, 0)); const sr = (rxy - rxz * ryz) / Math.sqrt(1 - rxz * rxz); return { result: sr, label: 'Semi-partial r', unit: '', steps: [{ label: 'r(XY)', value: `${rxy.toFixed(4)}` }, { label: 'r(XZ)', value: `${rxz.toFixed(4)}` }, { label: 'Semi-partial r', value: `${sr.toFixed(4)}` }] } },
  description: 'Semi-partial (part) correlation measures the unique contribution of X to Y after removing Z from X but not from Y.',
  formula: 'sr = (r_{xy} - r_{xz}r_{yz}) / √(1 - r²_{xz})',
  interpretation: 'Squared semi-partial correlation (sr²) equals the change in R² when adding X to a model that already includes Z.'
}

export default calcDef
