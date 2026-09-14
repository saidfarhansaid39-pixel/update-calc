import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ habitName: z.string().min(1), habitGoalDays: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), habitDaysDone: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'habitName', label: 'Habit Name', type: 'text' },
    { name: 'habitGoalDays', label: 'Goal (days)', type: 'number', min: 1, step: '7' },
    { name: 'habitDaysDone', label: 'Days Completed', type: 'number', min: 0, step: '1' },
  ],
  defaults: { habitName: 'Exercise', habitGoalDays: '66', habitDaysDone: '14' },
  presets: [
    { label: 'Daily Reading Habit', values: { habitName: 'Read 20 min', habitGoalDays: '66', habitDaysDone: '21' } },
    { label: 'Dry January / Sober Month', values: { habitName: 'No alcohol', habitGoalDays: '31', habitDaysDone: '7' } },
    { label: 'Morning Routine', values: { habitName: 'Wake at 6am', habitGoalDays: '66', habitDaysDone: '10' } },
    { label: 'Meditation Streak', values: { habitName: 'Meditate 10 min', habitGoalDays: '30', habitDaysDone: '18' } },
  ],
  compute: (v) => {
    const progress = Math.min(100, (v.habitDaysDone / v.habitGoalDays) * 100)
    const remaining = Math.max(0, v.habitGoalDays - v.habitDaysDone)
    const phase = v.habitDaysDone < 21 ? 'Honeymoon' : v.habitDaysDone < 66 ? 'Struggle' : v.habitDaysDone >= 66 ? 'Automation' : 'Forming'
    const streakOutlook = v.habitDaysDone > 0 && v.habitDaysDone < 21 ? 'Keep going — first 21 days are hardest' : v.habitDaysDone >= 21 && v.habitDaysDone < 66 ? 'You are past the hardest part — consistency now builds automation' : v.habitDaysDone >= 66 ? 'This habit is becoming automatic — well done!' : 'Start building momentum'
    const daysTo21 = Math.max(0, 21 - v.habitDaysDone)
    const daysTo66 = Math.max(0, 66 - v.habitDaysDone)
    const missedDays = Math.max(0, v.habitGoalDays - v.habitDaysDone)
    const daysSinceStart = v.habitDaysDone
    return { result: progress, label: 'Habit Progress', unit: '%', steps: [{ label: 'Habit', value: v.habitName }, { label: 'Goal Duration', value: `${v.habitGoalDays} days` }, { label: 'Days Completed', value: `${v.habitDaysDone} days` }, { label: 'Remaining', value: `${remaining} days` }, { label: 'Progress', value: `${progress.toFixed(0)}%` }, { label: 'Phase', value: phase }, { label: 'Days to 3-Week Milestone', value: `${daysTo21} days` }, { label: 'Days to Automatic (66)', value: `${daysTo66} days` }] ,
    extras: [
      { label: 'The Science of Habit Formation (21 vs 66 Days)', value: `The "21 days to form a habit" is a myth from 1960s plastic surgery observations. Real research (Lally et al., 2009, European Journal of Social Psychology): 18-254 days range, 66 days average to automation. Simple habits (drinking water): ~21-40 days. Complex habits (exercise, diet): ~60-90 days. Your ${v.habitDaysDone} days in: you're ${v.habitDaysDone < 21 ? 'in the conscious effort phase — the hardest part' : v.habitDaysDone < 66 ? 'past the initial struggle — neural pathways are forming' : 'in the automation zone — the habit is becoming automatic'}.` },
      { label: 'Missing a Day: The "Never Miss Twice" Rule', value: `Missing one day doesn't break a habit. Missing TWO days in a row is the real threat — it starts a new "chain of absence." The "never miss twice" rule: if you miss a day, make sure you do it the next day NO MATTER WHAT. One slip day = reset to ${Math.max(0, v.habitDaysDone - 1)} effective days. Two slip days in a row = can drop success rate by ${(2 / v.habitGoalDays * 100).toFixed(0)}%. Research: perfection isn't the goal — 80% consistency beats 100% intensity followed by burnout.` },
      { label: 'The 2-Minute Rule & Starting Small', value: `James Clear's Atomic Habits: any habit can be scaled down to 2 minutes. "Exercise" → "put on workout clothes." "Read 20 pages" → "read 1 page." "Meditate 20 min" → "sit in silence for 2 min." Once started, momentum carries you 80% of the time. Your "${v.habitName}" habit: what's the 2-minute version? Do that every day without fail. The 2-minute version is never too hard, so zero resistance means zero excuses.` },
      { label: 'Environment Design for Success', value: `Willpower is a limited resource — design your environment to make good habits easy and bad habits hard. For "${v.habitName}": make the cue obvious (put running shoes by the bed), make it attractive (listen to favorite podcast only while doing it), make it easy (prepare everything the night before), make it satisfying (check it off a visible tracker). Each environment tweak increases success by 20-40%. Your current ${progress.toFixed(0)}% progress: environment redesign could accelerate you to ${Math.min(100, progress + 15).toFixed(0)}%.` },
      { label: 'Habit Stacking & Implementation Intentions', value: `Habit stacking formula: "After/Before [CURRENT HABIT], I will [NEW HABIT]." Examples: "After I pour my morning coffee, I will meditate for 2 minutes." "Before I shower, I will do 10 pushups." Implementation intentions: "I will [BEHAVIOR] at [TIME] in [LOCATION]." Studies show implementation intentions increase follow-through by 200-300%. For "${v.habitName}": create your specific plan now — "I will [do ${v.habitName}] at [specific time] in [specific place]."` },
      { label: 'Reward Scheduling & Dopamine Loops', value: `Immediate rewards are critical — dopamine from the reward builds the habit loop (cue → craving → response → reward). Don't rely on long-term benefits (health, savings) — the brain prioritizes immediate pleasure. Reward strategy: check off a calendar (visual progress = dopamine), treat yourself after ${v.habitDaysDone >= 7 ? 'a week' : 'each session'} (small reward), celebrate tiny wins publicly (accountability = motivation). Your "${v.habitName}" needs a reward system: what feels good immediately after doing it?` },
      { label: 'Accountability & Social Commitment', value: `Research: telling someone your goal increases likelihood of success by 65%. Even better: having a specific accountability partner with weekly check-ins (95% success vs 35% for keep-it-to-yourself). Apps: StickK (put money on the line — loss aversion is 2× more powerful than gain motivation). For "${v.habitName}": who will you tell? When will they check? What's at stake if you skip? Write it down: "I commit to ${v.habitName} for ${v.habitGoalDays} days. My accountability partner is [NAME]. If I miss a day, I will [CONSEQUENCE]."` },
      { label: 'Tracking & Measurement Matters', value: `People who track their habits daily are 33% more successful than those who don't. Your ${v.habitDaysDone}/${v.habitGoalDays} = ${progress.toFixed(0)}%. Tracking methods: paper calendar (visual streak = strongest motivator — "don't break the chain"), app (Habitica, Streaks, Loop), journal, or simple tally. Seeing ${v.habitDaysDone} days of ${v.habitName} creates identity shift: "I'm not trying to exercise, I AM someone who exercises." Identity-based habits last 3-5× longer than goal-based ones.` },
    ]}
  },
  description: 'Track your habit formation progress with science-backed phase analysis (honeymoon, struggle, automation). Based on Lally et al. research showing 18-254 days to form a habit (66-day average). Features the 2-minute rule, habit stacking, environment design, accountability systems, and identity-based habit formation strategies.',
  formula: 'Progress % = (Days Completed ÷ Goal Days) × 100 | Remaining Days = Goal − Completed | Days to 21 = max(0, 21 − Completed) | Days to 66 = max(0, 66 − Completed) | Phase = Honeymoon (<21) → Struggle (21-66) → Automation (>66)',
  interpretation: 'The "21-day rule" is a myth. Real research (Lally, 2009): 18-254 days range, 66 days average for automaticity. Simple habits (water, 2-min routines): ~21-40 days. Complex habits (exercise, diet): ~60-90 days. Missing an occasional day is fine — the "never miss twice" rule is critical. The 2-minute rule (scale down to 2 min/day) eliminates resistance. Environment design beats willpower: make cues obvious and responses easy. Tracking creates identity shift — "I am the type of person who does this." Accountability boosts success 65-95%. Reward your immediate effort, not just the result.'
}

export default calcDef
