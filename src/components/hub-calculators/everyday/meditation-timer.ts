import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ sessionMinutes: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), sessionsPerDay: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), goalType: z.string().min(1), experienceLevel: z.string().min(1) }),
  fields: [
    { name: 'sessionMinutes', label: 'Session Length (min)', type: 'number', min: 1, step: '5' },
    { name: 'sessionsPerDay', label: 'Sessions per Day', type: 'number', min: 1, max: 10, step: '1' },
    { name: 'goalType', label: 'Primary Goal', type: 'select', options: [{ label: 'Stress Relief', value: 'stress' }, { label: 'Focus/Concentration', value: 'focus' }, { label: 'Sleep Improvement', value: 'sleep' }, { label: 'Mindfulness', value: 'mindfulness' }, { label: 'Anxiety Reduction', value: 'anxiety' }] },
    { name: 'experienceLevel', label: 'Experience Level', type: 'select', options: [{ label: 'Beginner', value: 'beginner' }, { label: 'Intermediate', value: 'intermediate' }, { label: 'Advanced', value: 'advanced' }] },
  ],
  compute: (v) => {
    const dailyMinutes = v.sessionMinutes * v.sessionsPerDay
    const weeklyMinutes = dailyMinutes * 7
    const monthlyMinutes = dailyMinutes * 30
    const goalRecs: Record<string, { recSession: number; recFreq: string; note: string }> = { stress: { recSession: 10, recFreq: '2× daily', note: 'Short frequent sessions help regulate stress response' }, focus: { recSession: 15, recFreq: '1-2× daily', note: 'Consistent morning sessions improve daytime focus' }, sleep: { recSession: 20, recFreq: '1× evening', note: 'Evening sessions 30 min before bed optimize sleep' }, mindfulness: { recSession: 20, recFreq: '1× daily', note: 'Daily practice builds sustained awareness' }, anxiety: { recSession: 10, recFreq: '2-3× daily', note: 'Multiple short sessions help manage acute anxiety' } }
    const rec = goalRecs[v.goalType as keyof typeof goalRecs] || goalRecs.stress
    const isOnTrack = v.sessionMinutes >= rec.recSession
    return { result: dailyMinutes, label: 'Daily Practice Time', unit: 'min', steps: [{ label: 'Daily Total', value: `${dailyMinutes} min (${v.sessionsPerDay}×${v.sessionMinutes} min)` }, { label: 'Weekly Total', value: `${weeklyMinutes} min` }, { label: 'Monthly Total', value: `${monthlyMinutes} min (${(monthlyMinutes / 60).toFixed(1)} hours)` }, { label: 'Goal Recommendation', value: `${rec.recSession} min, ${rec.recFreq} — ${rec.note}` }, { label: 'Status', value: isOnTrack ? '✓ On track for your goal' : 'Consider increasing to recommended session length' }] }
  },
  description: 'Plan your meditation practice with recommended session lengths and frequencies based on your goals and experience level.',
  formula: 'DailyMin = SessionMin × Sessions | WeeklyMin = DailyMin × 7 | MonthlyMin = DailyMin × 30',
  interpretation: 'Research shows 10-20 min daily meditation produces measurable benefits after 8 weeks. Beginners: start with 5-10 min. Consistency matters more than duration.'
}

export default calcDef
