import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    retrievalTemp: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 60 && n <= 130 }, '60-130'),
    retrievalTime: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    bufferPh: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 1 && n <= 14 }, '1-14')
}),
  fields: [
    { name: 'retrievalTemp', label: 'Retrieval Temperature', type: 'number', unit: '°C', min: 60, max: 130, step: '5' },
    { name: 'retrievalTime', label: 'Retrieval Time', type: 'number', unit: 'min', min: 1, max: 120, step: '5' },
    { name: 'bufferPh', label: 'Buffer pH', type: 'number', min: 1, max: 14, step: '0.5' },
  ],
  compute: (v) => {
    const severity = v.retrievalTemp * v.retrievalTime
    const isHiPh = v.bufferPh >= 8
    const isLowPh = v.bufferPh <= 4
    const hiTemp = v.retrievalTemp >= 100
    return {
      result: severity, label: 'Retrieval Severity Index', unit: '°C-min',
      steps: [
        { label: 'Temperature', value: `${v.retrievalTemp}°C` },
        { label: 'Time', value: `${v.retrievalTime} min` },
        { label: 'Buffer pH', value: `${v.bufferPh.toFixed(1)}` },
        { label: 'Severity index = T × t', value: `${severity.toLocaleString()}` },
        { label: 'Buffer type', value: isHiPh ? 'High pH (Tris-EDTA, pH 9) — recommended for nuclear antigens' : isLowPh ? 'Low pH (citrate, pH 6) — cytoplasmic antigens' : 'Neutral pH — moderate retrieval' },
        { label: 'Method note', value: hiTemp ? 'Pressure cooker or autoclave needed' : 'Microwave or water bath suitable' },
      ]
}
  },
  description: 'Heat-induced epitope retrieval (HIER) reverses formaldehyde crosslinks to expose masked epitopes. Temperature, time, and buffer pH determine retrieval effectiveness. Over-retrieval damages tissue morphology.',
  formula: 'Severity index = T(°C) × t(min) | Standard: 95-100°C × 20-40 min in citrate (pH 6) or EDTA (pH 9) | Pressure cooker: 120°C × 5-10 min',
  interpretation: 'pH 9 (EDTA) is stronger retrieval — use for nuclear proteins and phospho-epitopes. pH 6 (citrate) is gentler — use for membrane/cytoplasmic proteins. Over-retrieval causes background and tissue damage. Proteolytic retrieval (proteinase K) is an alternative for some antigens.'
}

export default calcDef
