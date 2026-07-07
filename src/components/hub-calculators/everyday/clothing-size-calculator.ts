import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ chestIn: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), waistIn: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), heightIn: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), genderSize: z.string().min(1) }),
  fields: [
    { name: 'chestIn', label: 'Chest (inches)', type: 'number', min: 20, max: 70, step: '1' },
    { name: 'waistIn', label: 'Waist (inches)', type: 'number', min: 18, max: 60, step: '1' },
    { name: 'heightIn', label: 'Height (inches)', type: 'number', min: 36, max: 96, step: '1' },
    { name: 'genderSize', label: 'Gender', type: 'select', options: [{ label: 'Men', value: 'men' }, { label: 'Women', value: 'women' }] },
  ],
  compute: (v) => {
    const chest = Number(v.chestIn); const waist = Number(v.waistIn); const height = Number(v.heightIn)
    let topSize = ''; let bottomSize = ''; let dressSize = 0
    if (v.genderSize === 'men') {
      topSize = chest <= 34 ? 'XS' : chest <= 38 ? 'S' : chest <= 42 ? 'M' : chest <= 46 ? 'L' : chest <= 50 ? 'XL' : '2XL+'
      bottomSize = waist <= 28 ? 'XS' : waist <= 32 ? 'S' : waist <= 36 ? 'M' : waist <= 40 ? 'L' : 'XL+'
    } else {
      dressSize = Math.round((chest + waist + height) / 36 * 2) * 2
      topSize = chest <= 32 ? 'XS' : chest <= 34 ? 'S' : chest <= 36 ? 'M' : chest <= 40 ? 'L' : 'XL+'
      bottomSize = waist <= 26 ? 'XS' : waist <= 28 ? 'S' : waist <= 31 ? 'M' : waist <= 34 ? 'L' : 'XL+'
    }
    const sizeLabel = v.genderSize === 'men' ? `${topSize} top / ${bottomSize} bottom` : `Dress ${dressSize} / ${topSize} top / ${bottomSize} bottom`
    const numericSize = v.genderSize === 'women' ? dressSize : chest
    return { result: numericSize, label: sizeLabel, unit: '', steps: [{ label: 'Chest', value: `${chest} in` }, { label: 'Waist', value: `${waist} in` }, { label: 'Height', value: `${height} in` }, { label: 'Size', value: sizeLabel }] }
  },
  description: 'Estimate your clothing size based on chest, waist, and height measurements for men\'s and women\'s apparel. Approximate sizing — brands vary.',
  formula: 'Men: Chest 34-50+ → XS-2XL+; Waist 28-40+ → XS-XL+ | Women: Dress = round((Chest+Waist+Height)/36×2)×2',
  interpretation: 'Sizing varies significantly by brand (vanity sizing). These are general guidelines. Always check brand-specific size charts. Athletic builds may need sizing up in shoulders/thighs.'
}

export default calcDef
