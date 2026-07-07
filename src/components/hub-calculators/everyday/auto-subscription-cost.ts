import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ asubStreaming: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), asubMusic: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), asubCloud: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), asubSoftware: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), asubBox: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), asubGym: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'asubStreaming', label: 'Streaming ($/mo)', type: 'number', min: 0, step: '5' },
    { name: 'asubMusic', label: 'Music ($/mo)', type: 'number', min: 0, step: '5' },
    { name: 'asubCloud', label: 'Cloud Storage ($/mo)', type: 'number', min: 0, step: '5' },
    { name: 'asubSoftware', label: 'Software/Apps ($/mo)', type: 'number', min: 0, step: '5' },
    { name: 'asubBox', label: 'Subscription Boxes ($/mo)', type: 'number', min: 0, step: '5' },
    { name: 'asubGym', label: 'Gym/Membership ($/mo)', type: 'number', min: 0, step: '10' },
  ],
  compute: (v) => {
    const monthlyTotal = v.asubStreaming + v.asubMusic + v.asubCloud + v.asubSoftware + v.asubBox + v.asubGym
    const annualTotal = monthlyTotal * 12
    return { result: monthlyTotal, label: 'Total Monthly Subscriptions', unit: '$', steps: [{ label: 'Streaming', value: '$' + v.asubStreaming.toFixed(2) }, { label: 'Music', value: '$' + v.asubMusic.toFixed(2) }, { label: 'Cloud + Software', value: '$' + (v.asubCloud + v.asubSoftware).toFixed(2) }, { label: 'Boxes + Gym', value: '$' + (v.asubBox + v.asubGym).toFixed(2) }, { label: 'Monthly Total', value: '$' + monthlyTotal.toFixed(2) }, { label: 'Annual Total', value: '$' + annualTotal.toFixed(2) }] }
  },
  description: 'Track all your monthly subscription costs across streaming, music, cloud storage, software, boxes, and memberships.',
  formula: 'Monthly Total = Streaming + Music + Cloud + Software + Boxes + Gym | Annual = Monthly x 12',
  interpretation: 'Average American spends $219/month on subscriptions. Streaming ($50-100), music ($10-20), cloud ($10-30), software ($10-50), boxes ($20-50), gym ($30-100). Review annually and cancel unused services to save 15-25%.'
}

export default calcDef
