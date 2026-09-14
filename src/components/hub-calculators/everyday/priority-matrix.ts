import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ urgent: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), important: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), effort: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'urgent', label: 'Urgency Score (1-10)', type: 'number', min: 1, max: 10, step: '1' },
    { name: 'important', label: 'Importance Score (1-10)', type: 'number', min: 1, max: 10, step: '1' },
    { name: 'effort', label: 'Effort Score (1-10)', type: 'number', min: 1, max: 10, step: '1' },
  ],
  defaults: { urgent: '7', important: '8', effort: '5' },
  presets: [
    { label: 'Critical Client Issue', values: { urgent: '9', important: '9', effort: '6' } },
    { label: 'Strategic Planning', values: { urgent: '3', important: '9', effort: '7' } },
    { label: 'Email Reply Overdue', values: { urgent: '7', important: '3', effort: '2' } },
    { label: 'Low-Value Busywork', values: { urgent: '2', important: '2', effort: '3' } },
  ],
  compute: (v) => {
    const importanceAvg = v.urgent * 0.5 + v.important * 0.5
    const priority = importanceAvg / v.effort * 10
    const quadrant = v.urgent >= 5 && v.important >= 5 ? 'Do First (Q1)' : v.urgent >= 5 ? 'Delegate/Do Quickly (Q3)' : v.important >= 5 ? 'Schedule (Q2)' : 'Eliminate/Minimize (Q4)'
    const actionAdvice = v.urgent >= 5 && v.important >= 5 ? 'Do this task now — it is both time-sensitive and high-value' : v.urgent >= 5 ? 'Delegate if possible, otherwise do it quickly — it is time-sensitive but not strategically important' : v.important >= 5 ? 'Schedule this into your calendar — it is important for long-term goals but not urgent' : 'Consider eliminating or minimizing this task — it neither drives value nor demands timeliness'
    return { result: priority, label: 'Priority Score', unit: '',
      steps: [
        { label: 'Urgency × 0.5', value: `${v.urgent} × 0.5 = ${(v.urgent * 0.5).toFixed(1)}` },
        { label: 'Importance × 0.5', value: `${v.important} × 0.5 = ${(v.important * 0.5).toFixed(1)}` },
        { label: 'Weighted Importance Avg', value: `${(v.urgent * 0.5).toFixed(1)} + ${(v.important * 0.5).toFixed(1)} = ${importanceAvg.toFixed(1)}` },
        { label: 'Divided by Effort', value: `${importanceAvg.toFixed(1)} ÷ ${v.effort} = ${(importanceAvg / v.effort).toFixed(3)}` },
        { label: 'Priority Score', value: `${(importanceAvg / v.effort).toFixed(3)} × 10 = ${priority.toFixed(1)}/10` },
        { label: 'Eisenhower Quadrant', value: quadrant },
        { label: 'Action Recommendation', value: actionAdvice },
        { label: 'Urgency/Importance Balance', value: `U:${v.urgent}/10, I:${v.important}/10, E:${v.effort}/10` },
      ],
      extras: [
        { label: '📋 Eisenhower Matrix Origin', value: 'Dwight D. Eisenhower said: "What is important is seldom urgent, and what is urgent is seldom important." This framework helped him prioritize as a 5-star general and US President.' },
        { label: '🎯 Focus on Q2 (Schedule)', value: 'Stephen Covey\'s research shows that highly effective people spend most of their time in Quadrant 2 (important, not urgent) — planning, relationship-building, and personal growth.' },
        { label: '⏰ The 2-Minute Rule', value: 'If a task takes ≤2 minutes, do it immediately — even if it\'s a Q3 task. This prevents small tasks from accumulating and clogging your queue. David Allen\'s GTD methodology.' },
        { label: '🔄 Re-evaluate Weekly', value: 'Priorities change. What was urgent last week may not be today. Schedule a 15-min weekly review to reassess your quadrant placement and reprioritize.' },
        { label: '⚡ Effort Should Guide Sequence', value: 'Among same-quadrant tasks, do low-effort items first to build momentum. The "eat the frog" method (hardest first) works for Q1, but for Q2, start with small wins.' },
        { label: '📱 The Decision Matrix', value: 'Combine this with the "consequence matrix": if a task scores high urgency/importance AND the cost of delay is high, it becomes non-negotiable. If delay cost is low, it can wait.' },
        { label: '🧠 Cognitive Load Consideration', value: 'Quadrant 1 (Do First) consumes the most mental energy. Limit yourself to 1-2 Q1 tasks per day. Everything else in Q2. A full day of Q1 tasks leads to burnout.' },
        { label: '💼 Delegation Strategy', value: 'For Q3 tasks (urgent, not important), ask: "Does this require my unique expertise?" If not, delegate. A manager\'s job is to work on Q2 and ensure Q3 is handled by others.' },
      ]
    }
  },
  description: 'Score and categorize tasks using a weighted Eisenhower Matrix with effort consideration. Get quadrant placement (Do First/Schedule/Delegate/Eliminate), a quantitative priority score (0-10), and specific action recommendations for each task.',
  formula: 'Weighted Avg = (Urgency × 0.5) + (Importance × 0.5) | Priority Score = Weighted Avg / Effort × 10 | Quadrant determined by urgency and importance thresholds (≥5).',
  interpretation: 'The Eisenhower Matrix has 4 quadrants: Q1 (Do First) = urgent + important — crises and deadlines. Q2 (Schedule) = important, not urgent — strategy and growth. Q3 (Delegate) = urgent, not important — interruptions and busywork. Q4 (Eliminate) = neither — time wasters. Research by Covey shows that spending 60-70% of your time in Q2 is the hallmark of highly effective people. The effort-weighting helps break ties: among same-quadrant tasks, prioritize those requiring less effort for quick wins or more effort for high-impact projects.'
}

export default calcDef
