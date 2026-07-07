import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    tissueThick: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    tissueType: z.string()
}),
  fields: [
    { name: 'tissueThick', label: 'Tissue Thickness', type: 'number', unit: 'mm', min: 0.5, max: 10, step: '0.5' },
    { name: 'tissueType', label: 'Tissue Type', type: 'select', options: [
      { label: 'Brain', value: 'brain' },
      { label: 'Liver/Kidney', value: 'liver' },
      { label: 'Heart/Muscle', value: 'muscle' },
      { label: 'Lung', value: 'lung' },
      { label: 'Skin', value: 'skin' },
      { label: 'Tumor (dense)', value: 'tumor' },
      { label: 'Intestine', value: 'intestine' },
    ] },
  ],
  compute: (v) => {
    const baseTimes: Record<string,{fix:string,dehyd:string,clear:string,infiltrate:string,total:string}> = {
      'brain': { fix: '24-48h', dehyd: '2h × 3', clear: '1h × 2', infiltrate: '1h × 3', total: '~10-12h' },
      'liver': { fix: '24h', dehyd: '1.5h × 3', clear: '1h × 2', infiltrate: '1h × 3', total: '~8-10h' },
      'muscle': { fix: '24-48h', dehyd: '2h × 3', clear: '1.5h × 2', infiltrate: '1.5h × 3', total: '~12-14h' },
      'lung': { fix: '24h', dehyd: '1h × 3', clear: '1h × 2', infiltrate: '1h × 3', total: '~7-9h' },
      'skin': { fix: '24-48h', dehyd: '2h × 3', clear: '1.5h × 2', infiltrate: '1.5h × 3', total: '~12-14h' },
      'tumor': { fix: '24-48h', dehyd: '2h × 3', clear: '1.5h × 2', infiltrate: '1.5h × 3', total: '~13-16h' },
      'intestine': { fix: '24h', dehyd: '1h × 3', clear: '1h × 2', infiltrate: '1h × 3', total: '~7-9h' }
}
    const info = baseTimes[v.tissueType] || baseTimes['liver']
    const extraThick = v.tissueThick > 3 ? `Add ${Math.ceil((v.tissueThick - 3) * 0.5)}h per step for thick tissue` : 'Standard thickness — times as above'
    return {
      result: 0, label: 'Processing Schedule', unit: 'total time',
      steps: [
        { label: 'Tissue', value: v.tissueType },
        { label: 'Thickness', value: `${v.tissueThick} mm` },
        { label: 'Fixation (10% NBF)', value: info.fix },
        { label: 'Dehydration (ethanol)', value: info.dehyd },
        { label: 'Clearing (xylene)', value: info.clear },
        { label: 'Paraffin infiltration', value: info.infiltrate },
        { label: 'Estimated total', value: info.total },
        { label: 'Thickness adjustment', value: extraThick },
      ]
}
  },
  description: 'Tissue processing prepares fixed tissue for paraffin embedding through sequential dehydration, clearing, and paraffin infiltration. Processing times depend on tissue type, size, and density.',
  formula: 'Processing = Fixation ? Dehydration (70% ? 95% ? 100% ethanol) ? Clearing (xylene) ? Infiltration (molten paraffin, 58-62°C) | Total time: 6-16h for most tissues',
  interpretation: 'Under-processed tissue: hard, brittle, difficult to section. Over-processed: shrinks, becomes brittle. Fatty tissues (brain, breast) need longer clearing. Automated processors run overnight. Microwave processing reduces time to 1-4h.'
}

export default calcDef
