import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    thickness: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0.5 && n <= 100 }, '0.5-100'),
    blockSize: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    sectionsNeeded: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, '>0')
}),
  fields: [
    { name: 'thickness', label: 'Section Thickness', type: 'number', unit: 'µm', min: 0.5, max: 100, step: '0.5' },
    { name: 'blockSize', label: 'Tissue Block Thickness', type: 'number', unit: 'mm', min: 0.1, step: '0.1' },
    { name: 'sectionsNeeded', label: 'Number of Sections Needed', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const totalSectionsAvail = Math.floor(v.blockSize * 1000 / v.thickness)
    const tissueUsed = v.sectionsNeeded * v.thickness / 1000
    return {
      result: totalSectionsAvail, label: 'Total Sections Available from Block', unit: 'sections',
      steps: [
        { label: 'Block thickness', value: `${v.blockSize} mm` },
        { label: 'Section thickness', value: `${v.thickness} µm` },
        { label: 'Sections available = block / thickness', value: `${totalSectionsAvail.toLocaleString()} sections` },
        { label: 'Tissue consumed for needed sections', value: `${tissueUsed.toFixed(2)} mm (${(tissueUsed / v.blockSize * 100).toFixed(1)}% of block)` },
        { label: 'Paraffin vs frozen', value: 'Paraffin: 4-5 µm standard | Frozen: 8-20 µm typical for IHC' },
      ]
}
  },
  description: 'Microtome sectioning produces thin tissue slices for microscopy. Section thickness depends on tissue type, embedding medium, and intended application. A typical paraffin block yields hundreds of sections.',
  formula: 'Total sections = Block thickness (µm) / Section thickness (µm) | Paraffin: 3-10 µm | Frozen: 5-30 µm | Plastic: 0.5-3 µm',
  interpretation: 'Thinner sections (4-5 µm) give better cellular detail for H&E. Thicker sections (10-30 µm) for confocal or stereology. Serial sectioning: collect every nth section for unbiased sampling. Ribbon sections float on water bath at 40-45°C.'
}

export default calcDef
