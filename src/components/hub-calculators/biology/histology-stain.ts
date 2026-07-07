import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    sectionThick: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 1 && n <= 50 }, '1-50'),
    stainType: z.string()
}),
  fields: [
    { name: 'sectionThick', label: 'Section Thickness', type: 'number', unit: 'µm', min: 1, max: 50, step: '1' },
    { name: 'stainType', label: 'Stain Type', type: 'select', options: [
      { label: 'H&E (Hematoxylin & Eosin)', value: 'he' },
      { label: "Masson's Trichrome", value: 'trichrome' },
      { label: 'PAS (Periodic Acid-Schiff)', value: 'pas' },
      { label: 'Oil Red O (frozen)', value: 'oilred' },
      { label: 'Nissl', value: 'nissl' },
    ] },
  ],
  compute: (v) => {
    const stainTimes: Record<string,{deparaff:string,stain:string,dehyd:string}> = {
      'he': { deparaff: '20 min (xylene)', stain: 'H: 5 min, E: 2 min', dehyd: '10 min' },
      'trichrome': { deparaff: '20 min', stain: '30-60 min', dehyd: '10 min' },
      'pas': { deparaff: '20 min', stain: 'PAS: 15 min, hematoxylin: 2 min', dehyd: '10 min' },
      'oilred': { deparaff: 'Frozen sections only (no deparaffinization)', stain: 'Oil Red O: 15 min, hematoxylin: 2 min', dehyd: 'Aqueous mount' },
      'nissl': { deparaff: '20 min', stain: '10-20 min', dehyd: '10 min' }
}
    const info = stainTimes[v.stainType] || stainTimes['he']
    return {
      result: 0, label: 'Histology Stain Protocol', unit: '',
      steps: [
        { label: 'Section thickness', value: `${v.sectionThick} µm` },
        { label: 'Stain selected', value: v.stainType },
        { label: 'Deparaffinization', value: info.deparaff },
        { label: 'Staining time', value: info.stain },
        { label: 'Dehydration/clearing', value: info.dehyd },
        { label: 'Mounting', value: 'Apply coverslip with mounting medium (e.g., Permount, DPX, aqueous)' },
      ]
}
  },
  description: 'Histology staining protocols vary by stain type and tissue thickness. H&E is the most common general stain; special stains highlight specific tissue components.',
  formula: 'Stain time varies by tissue type, fixation method, and section thickness. Thicker sections require longer stain times. Microwave or automated stainers reduce staining time.',
  interpretation: 'H&E: nuclei (blue/black), cytoplasm/pink (eosin). Trichrome: collagen (blue/green), muscle (red). PAS: glycogen/mucin (magenta). Oil Red O: lipid (red). Compare with positive control tissue sections.'
}

export default calcDef
