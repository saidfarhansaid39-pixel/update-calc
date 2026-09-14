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
  defaults: { sessionMinutes: '10', sessionsPerDay: '1', goalType: 'stress', experienceLevel: 'beginner' },
  presets: [
    { label: 'Beginner Stress Relief', values: { sessionMinutes: '5', sessionsPerDay: '1', goalType: 'stress', experienceLevel: 'beginner' } },
    { label: 'Focus Booster', values: { sessionMinutes: '15', sessionsPerDay: '1', goalType: 'focus', experienceLevel: 'intermediate' } },
    { label: 'Sleep Routine', values: { sessionMinutes: '20', sessionsPerDay: '1', goalType: 'sleep', experienceLevel: 'intermediate' } },
    { label: 'Anxiety Management', values: { sessionMinutes: '10', sessionsPerDay: '2', goalType: 'anxiety', experienceLevel: 'intermediate' } },
  ],
  compute: (v) => {
    const dailyMinutes = v.sessionMinutes * v.sessionsPerDay
    const weeklyMinutes = dailyMinutes * 7
    const monthlyMinutes = dailyMinutes * 30
    const monthlyHours = monthlyMinutes / 60
    const goalRecs: Record<string, { recSession: number; recFreq: string; note: string; technique: string }> = { stress: { recSession: 10, recFreq: '2× daily', note: 'Short frequent sessions help regulate stress response', technique: 'Breath focus, body scan' }, focus: { recSession: 15, recFreq: '1-2× daily', note: 'Consistent morning sessions improve daytime focus', technique: 'Breath counting, open monitoring' }, sleep: { recSession: 20, recFreq: '1× evening', note: 'Evening sessions 30 min before bed optimize sleep', technique: 'Body scan, yoga nidra' }, mindfulness: { recSession: 20, recFreq: '1× daily', note: 'Daily practice builds sustained awareness', technique: 'Open awareness, loving-kindness' }, anxiety: { recSession: 10, recFreq: '2-3× daily', note: 'Multiple short sessions help manage acute anxiety', technique: 'Box breathing, grounding' } }
    const rec = goalRecs[v.goalType as keyof typeof goalRecs] || goalRecs.stress
    const isOnTrack = v.sessionMinutes >= rec.recSession
    const levelAdvice = v.experienceLevel === 'beginner' ? 'Start with 5 min and gradually increase' : v.experienceLevel === 'intermediate' ? 'Try varying techniques and extending sessions' : 'Deepen practice with retreats and advanced techniques'
    const hoursByYear = (dailyMinutes * 365) / 60
    return { result: dailyMinutes, label: 'Daily Practice', unit: 'min', steps: [
      { label: 'Session Length', value: `${v.sessionMinutes} min` },
      { label: 'Sessions per Day', value: `${v.sessionsPerDay}× daily` },
      { label: 'Daily Total', value: `${dailyMinutes} min/day` },
      { label: 'Weekly Total', value: `${weeklyMinutes} min (${(weeklyMinutes / 60).toFixed(1)} hrs)` },
      { label: 'Monthly Total', value: `${monthlyMinutes} min (${monthlyHours.toFixed(1)} hrs)` },
      { label: 'Yearly Practice', value: `~${hoursByYear.toFixed(0)} hours of meditation per year` },
      { label: 'Goal Recommendation', value: `${rec.recSession} min, ${rec.recFreq} — ${rec.note}` },
      { label: 'Status Check', value: isOnTrack ? `✓ Your session meets the ${v.goalType} goal recommendation` : `Increase to ${rec.recSession} min for optimal ${v.goalType} results` },
    ] ,
    extras: [
      { label: 'Start Small, Be Consistent', value: 'Research shows 10 min/day of meditation produces measurable benefits after 8 weeks. Consistency matters more than session length.' },
      { label: 'Recommended Technique', value: `For ${v.goalType} goals, try: ${rec.technique}. This technique pairs best with ${rec.recFreq} practice.` },
      { label: 'Brain Changes', value: '8 weeks of daily meditation (30 min) shows measurable increases in grey matter density in the hippocampus and decreases in amygdala size (stress response).' },
      { label: 'Best Times to Meditate', value: 'Morning (prepares focus for the day), before meals (empty stomach aids alertness), or before bed (sleep improvement). Avoid meditating right after heavy meals.' },
      { label: 'Meditation Styles', value: 'Guided: best for beginners. Breath awareness: foundational. Body scan: relaxation-focused. Loving-kindness: compassion-building. Walking meditation: movement-based.' },
      { label: 'Level-Based Advice', value: levelAdvice },
      { label: 'Apps & Resources', value: 'Headspace (guided basics), Calm (sleep/relaxation), Insight Timer (free, large library), 10% Happier (skeptic-friendly), Waking Up (philosophy-based).' },
    ]}
  },
  description: 'Plan your meditation practice with science-backed session recommendations tailored to your goals (stress relief, focus, sleep, mindfulness, or anxiety). Tracks daily, weekly, monthly, and yearly practice totals.',
  formula: 'DailyMin = SessionMin × SessionsPerDay | WeeklyMin = DailyMin × 7 | MonthlyMin = DailyMin × 30 | YearlyHours = DailyMin × 365 / 60 | Goal recommendations: Stress: 10 min 2×/day, Focus: 15 min 1-2×/day, Sleep: 20 min 1× evening, Mindfulness: 20 min 1×/day, Anxiety: 10 min 2-3×/day',
  interpretation: 'Scientific research shows that 10-20 minutes of daily meditation produces measurable brain and health changes after 8 weeks. Consistency is far more important than session length — even 5 minutes daily outperforms 30 minutes once a week. Beginners should start with 5-10 minutes and gradually increase. For stress relief, 2 short sessions (10 min morning + 10 min evening) are more effective than one long session. Sleep improvement works best when done 30 minutes before bed.'
}

export default calcDef
