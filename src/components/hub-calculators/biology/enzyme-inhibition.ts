import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    vmaxNoI: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    kmNoI: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    inhibitor: z.string(),
    vmaxWithI: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    kmWithI: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'vmaxNoI', label: 'Vmax (no inhibitor)', type: 'number', unit: 'µM/min', min: 0.1, step: '0.1' },
    { name: 'kmNoI', label: 'Km (no inhibitor)', type: 'number', unit: 'mM', min: 0.001, step: '0.001' },
    { name: 'inhibitor', label: 'Inhibition Type', type: 'select', options: [
      { label: 'Competitive', value: 'comp' }, { label: 'Non-competitive', value: 'noncomp' }, { label: 'Uncompetitive', value: 'uncomp' },
    ] },
    { name: 'vmaxWithI', label: 'Vmax (with inhibitor)', type: 'number', unit: 'µM/min', min: 0.1, step: '0.1' },
    { name: 'kmWithI', label: 'Km (with inhibitor)', type: 'number', unit: 'mM', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const vRatio = v.kmNoI > 0 && v.vmaxNoI > 0 ? v.kmWithI / v.kmNoI : 1
    const nameMap: Record<string, string> = { comp: 'Competitive', noncomp: 'Non-competitive', uncomp: 'Uncompetitive' }; const name = nameMap[v.inhibitor] || 'Competitive'
    const match = (
      (v.inhibitor === 'comp' && v.vmaxWithI >= v.vmaxNoI * 0.95 && v.kmWithI > v.kmNoI * 1.5) ||
      (v.inhibitor === 'noncomp' && v.vmaxWithI < v.vmaxNoI * 0.8 && Math.abs(v.kmWithI / v.kmNoI - 1) < 0.2) ||
      (v.inhibitor === 'uncomp' && v.vmaxWithI < v.vmaxNoI * 0.8 && v.kmWithI < v.kmNoI * 0.8)
    )
    return {
      result: match ? 1 : 0, label: 'Pattern Match', unit: '',
      steps: [
        { label: 'Inhibition type selected', value: name },
        { label: 'Vmax change', value: `${(v.vmaxWithI / v.vmaxNoI * 100).toFixed(1)}% of control` },
        { label: 'Km change (ratio)', value: `${(v.kmWithI / v.kmNoI).toFixed(2)}×` },
        { label: 'Pattern match', value: match ? '? Matches expected pattern' : '? May be a different inhibition type' },
        { label: 'Expected pattern', value: name === 'Competitive' ? 'Vmax unchanged, Km ?' : name === 'Non-competitive' ? 'Vmax ?, Km unchanged' : 'Both Vmax ? and Km ?' },
      ]
}
  },
  description: 'Enzyme inhibition patterns distinguish competitive, non-competitive, and uncompetitive mechanisms by their effects on Vmax and Km in Michaelis-Menten kinetics.',
  formula: 'Competitive: Vmax unchanged, Km? (apparent Km = Km × (1 + [I]/Ki)) | Non-competitive: Vmax?, Km unchanged | Uncompetitive: both Vmax? and Km?',
  interpretation: 'Competitive inhibitors bind the active site; overcome by high [S]. Non-competitive bind elsewhere (allosteric); cannot be overcome. Uncompetitive bind only enzyme-substrate complex. Use Lineweaver-Burk plots to visualize these patterns.'
}

export default calcDef
