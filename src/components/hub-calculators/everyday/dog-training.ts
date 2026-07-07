import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ sessions: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), sessionLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), trainerRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), selfTrain: z.string().min(1) }),
  fields: [
    { name: 'sessions', label: 'Training Sessions/Week', type: 'number', min: 1, step: '1' },
    { name: 'sessionLength', label: 'Minutes per Session', type: 'number', min: 5, step: '5' },
    { name: 'trainerRate', label: 'Private Trainer Cost/Session ($)', type: 'number', min: 0, step: '25' },
    { name: 'selfTrain', label: 'Training Method', type: 'select', options: [{ label: 'Self-Training', value: 'self' }, { label: 'Group Classes', value: 'group' }, { label: 'Private Trainer', value: 'private' }, { label: 'Board & Train', value: 'board' }] },
  ],
  compute: (v) => {
    const totalMinutesPerWeek = v.sessions * v.sessionLength
    const totalHoursForBasics = 40
    const weeksToComplete = totalHoursForBasics / (totalMinutesPerWeek / 60)
    const methodCosts: Record<string, number> = { self: 0, group: v.sessions * 25, private: v.trainerRate || 75, board: 1500 }
    const weeklyCost = methodCosts[v.selfTrain] || 0
    const totalCost = weeklyCost * weeksToComplete
    return { result: weeksToComplete, label: 'Weeks to Basic Obedience', unit: 'weeks', steps: [{ label: 'Training Intensity', value: `${totalMinutesPerWeek} min/week` }, { label: 'Total Training Hours', value: `${totalHoursForBasics} hrs for basics` }, { label: 'Estimated Duration', value: `${weeksToComplete.toFixed(1)} weeks` }, { label: 'Weekly Cost', value: `$${weeklyCost.toFixed(2)}` }, { label: 'Total Cost', value: `$${totalCost.toFixed(2)}` }] }
  },
  description: 'Estimate the time and cost required to train your dog based on session frequency, training method, and trainer rates.',
  formula: 'Weeks to Complete = 40 hours / (Sessions/Week × Session Length / 60) | Cost = Weekly Cost × Weeks',
  interpretation: 'Basic obedience typically takes 4-8 weeks. Puppies (8-16 weeks) learn faster. Positive reinforcement is the most effective and humane method. Consistency is key: train daily for 5-10 min sessions. Professional training costs $50-150/session private, $150-300 for 6-week group classes.'
}

export default calcDef
