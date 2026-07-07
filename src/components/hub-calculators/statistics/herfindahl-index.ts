import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ shares: z.string().min(1, 'Required') }),
  fields: [{ name: 'shares', label: 'Market Shares (%, comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const vals = parseList(v.shares); if (vals.length < 2) return { result: 'Need ≥2 shares', label: '', unit: '', steps: [] }; const hhi = vals.reduce((acc, s) => acc + s * s, 0); const normHHI = (hhi - 10000 / vals.length) / (10000 - 10000 / vals.length); return { result: hhi, label: 'HHI', unit: '', steps: [{ label: 'Firms', value: `${vals.length}` }, { label: 'HHI', value: `${hhi.toFixed(2)}` }, { label: 'Normalized HHI', value: `${normHHI.toFixed(4)}` }, { label: 'Concentration', value: hhi < 1000 ? 'Unconcentrated' : hhi < 2500 ? 'Moderately concentrated' : 'Highly concentrated' }] } },
  description: 'The Herfindahl-Hirschman Index (HHI) measures market concentration as the sum of squared market shares.',
  formula: 'HHI = Σsᵢ² where sᵢ is the market share of firm i',
  interpretation: 'HHI < 1000: unconcentrated, 1000-2500: moderate, > 2500: highly concentrated. DOJ uses HHI for merger review.'
}

export default calcDef
