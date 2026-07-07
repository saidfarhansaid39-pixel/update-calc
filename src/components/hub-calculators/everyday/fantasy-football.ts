import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ passingYds: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), passingTds: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ints: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), rushingYds: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), rushingTds: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), receptions: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), receivingYds: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), receivingTds: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), fumblesLost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), twoPtConv: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'passingYds', label: 'Passing Yards', type: 'number', min: 0, step: '1' },
    { name: 'passingTds', label: 'Passing TDs', type: 'number', min: 0, step: '1' },
    { name: 'ints', label: 'Interceptions', type: 'number', min: 0, step: '1' },
    { name: 'rushingYds', label: 'Rushing Yards', type: 'number', min: 0, step: '1' },
    { name: 'rushingTds', label: 'Rushing TDs', type: 'number', min: 0, step: '1' },
    { name: 'receptions', label: 'Receptions', type: 'number', min: 0, step: '1' },
    { name: 'receivingYds', label: 'Receiving Yards', type: 'number', min: 0, step: '1' },
    { name: 'receivingTds', label: 'Receiving TDs', type: 'number', min: 0, step: '1' },
    { name: 'fumblesLost', label: 'Fumbles Lost', type: 'number', min: 0, step: '1' },
    { name: 'twoPtConv', label: '2-Pt Conversions', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const pts = v.passingYds * 0.04 + v.passingTds * 4 - v.ints * 2 + v.rushingYds * 0.1 + v.rushingTds * 6 + v.receptions * 0.5 + v.receivingYds * 0.1 + v.receivingTds * 6 - v.fumblesLost * 2 + v.twoPtConv * 2
    return { result: pts, label: 'Fantasy Points (PPR)', unit: 'pts', steps: [{ label: 'Passing', value: `${v.passingYds} yds × 0.04 + ${v.passingTds} TD × 4 - ${v.ints} INT × 2` }, { label: 'Rushing', value: `${v.rushingYds} yds × 0.1 + ${v.rushingTds} TD × 6` }, { label: 'Receiving', value: `${v.receptions} rec × 0.5 + ${v.receivingYds} yds × 0.1 + ${v.receivingTds} TD × 6` }, { label: 'Total', value: `${pts.toFixed(2)} pts` }] }
  },
  description: 'Calculate PPR fantasy football points from passing, rushing, and receiving stats. Scoring: 0.04 per pass yd, 4 per pass TD, -2 per INT, 0.1 per rush yd, 6 per rush TD, 0.5 per reception, 0.1 per rec yd, 6 per rec TD.',
  formula: 'P = (PassYds×0.04 + PassTD×4 - INT×2) + (RushYds×0.1 + RushTD×6) + (Rec×0.5 + RecYds×0.1 + RecTD×6) - FumLost×2 + 2Pt×2',
  interpretation: 'Half-PPR: use 0.5 per reception. Standard: 0 per reception. This calculator uses Full PPR (1 pt per reception). Adjust scoring as needed for your league settings.'
}

export default calcDef
