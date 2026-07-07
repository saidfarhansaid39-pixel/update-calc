import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    motherCarrier: z.string(), fatherAffected: z.string()
}),
  fields: [
    { name: 'motherCarrier', label: 'Mother is Carrier (X-linked recessive)', type: 'select', options: [
      { label: 'Yes (X?X?)', value: 'yes' }, { label: 'No (X?X?)', value: 'no' },
    ] },
    { name: 'fatherAffected', label: 'Father is Affected', type: 'select', options: [
      { label: 'Yes (X?Y)', value: 'yes' }, { label: 'No (X?Y)', value: 'no' },
    ] },
  ],
  compute: (v) => {
    const mCar = v.motherCarrier === 'yes'; const fAff = v.fatherAffected === 'yes'
    const sonRisk = mCar ? 50 : 0; const dauCarrier = mCar || fAff ? (mCar && fAff ? 100 : 50) : 0
    const dauAff = mCar && fAff ? 50 : fAff ? 0 : 0
    return {
      result: sonRisk, label: 'Son Affected Risk', unit: '%',
      steps: [
        { label: 'Mother carrier', value: mCar ? 'Yes' : 'No' },
        { label: 'Father affected', value: fAff ? 'Yes' : 'No' },
        { label: 'Risk for each son', value: `${sonRisk}%` },
        { label: 'Daughters: affected', value: `${dauAff}%` },
        { label: 'Daughters: carriers', value: `${dauCarrier}%` },
      ]
}
  },
  description: 'X-linked recessive traits (like hemophilia, color blindness) primarily affect males. Females are typically carriers unless homozygous.',
  formula: 'Males: XY (single X). Affected if X?Y. Females: XX. Affected only if X?X?. Carrier if X?X?.',
  interpretation: 'Sons inherit X from mother. Affected father passes Y to sons (unaffected), X? to daughters (all carriers if mother normal). Carrier mother: 50% sons affected, 50% daughters carriers.'
}

export default calcDef
