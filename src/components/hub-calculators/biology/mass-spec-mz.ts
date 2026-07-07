import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    mass: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    charge: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, '>0')
}),
  fields: [
    { name: 'mass', label: 'Molecular Mass (M)', type: 'number', unit: 'Da', min: 1, step: '0.1' },
    { name: 'charge', label: 'Charge State (z)', type: 'number', min: 1, max: 50, step: '1' },
  ],
  compute: (v) => {
    const mz = (v.mass + v.charge * 1.00784) / v.charge
    return {
      result: mz, label: 'm/z Ratio', unit: 'Th',
      steps: [
        { label: 'Molecular mass (M)', value: `${v.mass.toFixed(2)} Da` },
        { label: 'Charge (z)', value: `${v.charge}` },
        { label: 'Adduct (z × H? = z × 1.00784)', value: `${(v.charge * 1.00784).toFixed(4)} Da` },
        { label: 'm/z = (M + z·H?) / z', value: `${mz.toFixed(4)} Th` },
      ]
}
  },
  description: 'Mass-to-charge ratio (m/z) is the fundamental measurement in mass spectrometry. Calculate m/z from molecular mass and charge state for identifying ions.',
  formula: 'm/z = (M + z·m(H?)) / z | m(H?) = 1.00784 Da | ESI-MS typically produces z = 2-20; MALDI-TOF typically z = 1',
  interpretation: 'Higher m/z = heavier or lower charge. ESI produces a charge envelope; deconvolution reconstructs neutral mass. Th (Thomson) is the unit of m/z. Adjacent charge states differ by 1/z in m/z.'
}

export default calcDef
