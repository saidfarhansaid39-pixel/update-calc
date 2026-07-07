import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ pts: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0), fga: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0), fgm: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0), fta: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0), ftm: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0), reb: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0), ast: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0), stl: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0), blk: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0), tov: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0), gp: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0) }),
  fields: [
    { name: 'pts', label: 'Total Points', type: 'number', min: 0, step: '1' },
    { name: 'fga', label: 'Field Goals Attempted', type: 'number', min: 0, step: '1' },
    { name: 'fgm', label: 'Field Goals Made', type: 'number', min: 0, step: '1' },
    { name: 'fta', label: 'Free Throws Attempted', type: 'number', min: 0, step: '1' },
    { name: 'ftm', label: 'Free Throws Made', type: 'number', min: 0, step: '1' },
    { name: 'reb', label: 'Total Rebounds', type: 'number', min: 0, step: '1' },
    { name: 'ast', label: 'Assists', type: 'number', min: 0, step: '1' },
    { name: 'stl', label: 'Steals', type: 'number', min: 0, step: '1' },
    { name: 'blk', label: 'Blocks', type: 'number', min: 0, step: '1' },
    { name: 'tov', label: 'Turnovers', type: 'number', min: 0, step: '1' },
    { name: 'gp', label: 'Games Played', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const missed = v.fga - v.fgm + v.fta - v.ftm
    const rawPER = (v.pts + v.reb + v.ast + v.stl + v.blk - missed - v.tov) / v.gp
    const adjustedPER = rawPER * 15 / 11.5
    return { result: adjustedPER, label: 'Player Efficiency Rating', unit: '', steps: [
      { label: 'Scoring', value: v.pts+' pts ('+(v.pts/v.gp).toFixed(1)+' ppg)' },
      { label: 'Missed shots', value: ''+missed }, { label: 'Turnovers', value: ''+v.tov },
      { label: 'PER (simplified)', value: adjustedPER.toFixed(1) },
      { label: 'NBA benchmark', value: adjustedPER > 20 ? 'All-Star level' : adjustedPER > 15 ? 'Above average' : adjustedPER > 10 ? 'Average' : 'Below average' },
    ]}
  }, description: 'Calculate a simplified Player Efficiency Rating (PER). PER summarizes a player\'s per-minute statistical production into a single number.', formula: 'PER ≈ (PTS + REB + AST + STL + BLK - MissedShots - TO) / GP', interpretation: 'NBA average PER is ~15. A PER above 20 indicates All-Star level performance; above 25 is MVP caliber.'
}

export default calcDef
