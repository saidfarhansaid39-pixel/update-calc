import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ rating: z.string().min(1).refine(v => parseFloat(v) >= 1 && parseFloat(v) <= 10, '1-10'), entries: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), goodThreshold: z.string().min(1).refine(v => parseFloat(v) >= 1 && parseFloat(v) <= 10, '1-10') }),
  fields: [
    { name: 'rating', label: 'Today Mood (1-10)', type: 'number', min: 1, max: 10, step: '1' },
    { name: 'entries', label: 'Total Tracked Entries', type: 'number', min: 1, step: '1' },
    { name: 'goodThreshold', label: '"Good Day" Threshold (1-10)', type: 'number', min: 1, max: 10, step: '1' },
  ],
  defaults: { rating: '7', entries: '30', goodThreshold: '6' },
  presets: [
    { label: 'Great Week', values: { rating: '8', entries: '30', goodThreshold: '6' } },
    { label: 'Average Month', values: { rating: '6', entries: '30', goodThreshold: '6' } },
    { label: 'Rough Patch', values: { rating: '4', entries: '14', goodThreshold: '6' } },
  ],
  compute: (v) => { const avg = v.rating; const goodPct = (avg >= v.goodThreshold ? 1 : 0) * 100; const projectedGoodDays = Math.round((goodPct / 100) * 365); const scoreLabel = v.rating <= 3 ? 'Low — Consider professional support' : v.rating <= 6 ? 'Moderate — Room for improvement' : 'High — Keep up what you are doing'; const colorCode = v.rating <= 3 ? '🔴' : v.rating <= 6 ? '🟡' : '🟢'; return { result: avg, label: 'Mood Score', unit: '/10', steps: [
    { label: 'Today\'s Rating', value: `${v.rating}/10` },
    { label: 'Mood Category', value: scoreLabel },
    { label: 'Good Day Threshold', value: `${v.goodThreshold}/10 or above` },
    { label: 'Today is a "Good Day"', value: avg >= v.goodThreshold ? 'Yes' : 'No' },
    { label: 'If This Pattern Held', value: `${projectedGoodDays} good days per year (${goodPct}%)` },
    { label: 'Entries Tracked', value: `${v.entries} entries` },
  ] ,
    extras: [
      { label: 'Track Consistently', value: 'Daily tracking reveals patterns. Use the same time each day (evening recommended) for consistent data.' },
      { label: 'Key Mood Factors', value: 'Sleep (7-9 hrs), exercise (30 min+), diet, sunlight exposure, and social connections are the top 5 mood influencers.' },
      { label: 'When to Seek Help', value: 'If your average is consistently below 4/10 for 2+ weeks, or if mood interferes with daily function, talk to a professional.' },
      { label: 'Mood Boosters', value: 'Quick lifts: 10 min sunlight, 5 min deep breathing, call a friend, listen to upbeat music, or do a small win task.' },
      { label: 'Seasonal Patterns', value: 'Mood often dips in winter (SAD) and peaks in summer. Track across seasons to see your natural rhythm.' },
      { label: 'Goal Setting', value: `Aim for an average of ${(v.goodThreshold + 1) > 10 ? 10 : v.goodThreshold + 1}/10 next week. Small consistent improvements compound.` },
    ]} },
  description: 'Track and analyze your daily mood on a 1-10 scale. See how today compares to your "good day" threshold and project annual well-being patterns based on your entries.',
  formula: 'GoodDay% = (Rating ≥ Threshold ? 100 : 0) | ProjectedGoodDays = GoodDay% × 365 | Category: 1-3 = Low, 4-6 = Moderate, 7-10 = High',
  interpretation: 'Consistent mood tracking reveals powerful patterns. Sleep quality, exercise, diet, and social connections are the strongest predictors of daily mood. Aim for a weekly average above 6/10 — this correlates with positive mental health outcomes. If your average stays below 4/10 for more than two weeks, consider speaking with a mental health professional. Tracking for 30+ days gives reliable baseline data.'
}

export default calcDef
