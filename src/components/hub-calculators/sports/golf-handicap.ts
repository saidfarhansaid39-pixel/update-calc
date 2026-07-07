import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    score1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    score2: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    score3: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    score4: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0'),
    score5: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0'),
    courseRating: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    slope: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val >= 55 && val <= 155 }, '55-155')
}),
  fields: [
    { name: 'score1', label: 'Score 1 (recent)', type: 'number', min: 60, step: '1' },
    { name: 'score2', label: 'Score 2', type: 'number', min: 60, step: '1' },
    { name: 'score3', label: 'Score 3', type: 'number', min: 60, step: '1' },
    { name: 'score4', label: 'Score 4 (optional)', type: 'number', min: 60, step: '1' },
    { name: 'score5', label: 'Score 5 (optional)', type: 'number', min: 60, step: '1' },
    { name: 'courseRating', label: 'Course Rating', type: 'number', min: 60, max: 80, step: '0.1' },
    { name: 'slope', label: 'Slope Rating', type: 'number', min: 55, max: 155, step: '1' },
  ],
  compute: (v) => {
    const scores = [v.score1, v.score2, v.score3]
    if (v.score4) scores.push(v.score4)
    if (v.score5) scores.push(v.score5)
    const diffs = scores.map(s => (s - v.courseRating) * 113 / v.slope)
    const bestDiffs = diffs.sort((a, b) => a - b).slice(0, Math.min(3, diffs.length))
    const avgDiff = bestDiffs.reduce((sum, d) => sum + d, 0) / bestDiffs.length
    const handicap = avgDiff * 0.96
    return {
      result: handicap, label: 'Handicap Index', unit: '',
      steps: [
        { label: 'Scores entered', value: `${scores.length}` },
        { label: 'Best 3 differentials', value: bestDiffs.map(d => d.toFixed(1)).join(', ') },
        { label: 'Average differential', value: `${avgDiff.toFixed(1)}` },
        { label: 'Handicap Index (96%)', value: `${handicap.toFixed(1)}` },
        { label: 'Playing level', value: handicap < 5 ? 'Low handicap (excellent)' : handicap < 13 ? 'Mid handicap (good)' : handicap < 20 ? 'High handicap' : 'Beginner' },
      ]
}
  },
  description: 'Calculate your golf handicap index using the USGA formula. The handicap is based on the best differentials from recent scores, adjusted for course rating and slope rating.'
}

export default calcDef
