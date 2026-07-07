import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ urgent: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), important: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), effort: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'urgent', label: 'Urgency Score (1-10)', type: 'number', min: 1, max: 10, step: '1' },
    { name: 'important', label: 'Importance Score (1-10)', type: 'number', min: 1, max: 10, step: '1' },
    { name: 'effort', label: 'Effort Score (1-10)', type: 'number', min: 1, max: 10, step: '1' },
  ],
  compute: (v) => {
    const priority = (v.urgent * 0.5 + v.important * 0.5) / v.effort * 10
    const quadrant = v.urgent >= 5 && v.important >= 5 ? 'Do First' : v.urgent >= 5 ? 'Delegate/Quickly' : v.important >= 5 ? 'Schedule' : 'Eliminate'
    return { result: priority, label: 'Priority Score', unit: '', steps: [{ label: 'Urgency × Importance', value: `${(v.urgent * 0.5 + v.important * 0.5).toFixed(1)}` }, { label: 'Effort Divisor', value: `${v.effort}` }, { label: 'Priority Score', value: `${priority.toFixed(1)}/10` }, { label: 'Eisenhower Quadrant', value: quadrant }] }
  },
  description: 'Score tasks using the Eisenhower Matrix combined with effort weighting to prioritize what to do first.',
  formula: 'Priority = (Urgency×0.5 + Importance×0.5) / Effort × 10 | Urgent+Important=Do First',
  interpretation: 'Eisenhower Matrix: Quadrant 1 (Do First) = urgent + important. Q2 (Schedule) = important, not urgent. Q3 (Delegate) = urgent, not important. Q4 (Eliminate) = neither. Focus on Q2 for long-term success.'
}

export default calcDef
