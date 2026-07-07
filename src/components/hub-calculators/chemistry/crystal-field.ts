import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    geometry: z.string().min(1, 'Required'),
    delta: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    dElectrons: z.string().min(1, 'Required').refine(v => { const n = parseInt(v); return n >= 1 && n <= 10 }, '1-10')
}),
  fields: [
    { name: 'geometry', label: 'Complex Geometry', type: 'select', options: [
      { label: 'Octahedral', value: 'oct' },
      { label: 'Tetrahedral', value: 'tet' },
      { label: 'Square planar', value: 'sqp' },
    ] },
    { name: 'delta', label: 'Crystal Field Splitting Δₒ', type: 'number', unit: 'cm⁻¹', min: 1000, step: '100' },
    { name: 'dElectrons', label: 'Number of d Electrons', type: 'number', unit: '', min: 1, max: 10, step: '1' },
  ],
  compute: (v) => {
    const e = parseInt(v.dElectrons)
    const isOct = v.geometry === 'oct'
    const isSqp = v.geometry === 'sqp'
    let cfse = 0
    const config: string[] = []
    let unpaired = 0
    if (isOct || v.geometry === 'tet') {
      const t2g = isOct ? 3 : 2
      const eg = isOct ? 2 : 3
      const ratio = isOct ? 1 : 4 / 9
      const split = v.delta * ratio
      let idx = 0
      for (let i = 0; i < e; i++) {
        if (idx < t2g) { cfse += -0.4 * split; config.push(idx < t2g ? 't₂g' : 'e_g'); idx++ }
        else { cfse += 0.6 * split; config.push('e_g') }
      }
      unpaired = e <= 3 ? e : e >= 8 ? e - 4 : (e - 3) + (isOct ? 0 : 0)
    }
    return {
      result: cfse, label: 'Crystal Field Stabilization Energy (CFSE)', unit: 'cm⁻¹',
      steps: [
        { label: 'Geometry', value: isOct ? 'Octahedral' : v.geometry === 'tet' ? 'Tetrahedral' : 'Square planar' },
        { label: 'Δ value', value: `${v.delta} cm⁻¹` },
        { label: 'd electrons', value: `${e}` },
        { label: 'CFSE', value: `${cfse.toFixed(1)} cm⁻¹ (${(cfse / 1000).toFixed(2)} kJ/mol)` },
        { label: 'Unpaired electrons', value: `${unpaired}` },
      ]
}
  },
  description: 'Crystal Field Theory explains the electronic structure and properties of transition metal complexes. The splitting of d orbitals (Δ) determines color, magnetism, and stability.',
  formula: 'CFSE = (-0.4 × n_t₂g + 0.6 × n_e_g) × Δₒ for octahedral',
  interpretation: 'Larger Δₒ gives higher CFSE and more stable complexes. Δₒ depends on the metal ion, oxidation state, and ligand (spectrochemical series: I⁻ < Br⁻ < S²⁻ < Cl⁻ < F⁻ < OH⁻ < H₂O < NH₃ < en < NO₂⁻ < CN⁻ < CO).'
}

export default calcDef
