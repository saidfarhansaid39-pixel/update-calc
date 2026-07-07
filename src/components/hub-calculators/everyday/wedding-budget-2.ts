import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wed2Guests: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), wed2TotalBudget: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wed2Venue: z.string().min(1), wed2CateringPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wed2PhotoPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'wed2Guests', label: 'Number of Guests', type: 'number', min: 1, step: '10' },
    { name: 'wed2TotalBudget', label: 'Total Budget ($)', type: 'number', min: 1000, step: '1000' },
    { name: 'wed2Venue', label: 'Venue Style', type: 'select', options: [{ label: 'Ballroom/Hotel', value: 'ballroom' }, { label: 'Barn/Rustic', value: 'barn' }, { label: 'Garden/Outdoor', value: 'garden' }, { label: 'Beach', value: 'beach' }, { label: 'Church/Religious', value: 'church' }] },
    { name: 'wed2CateringPct', label: 'Catering (% of budget)', type: 'number', min: 0, max: 70, step: '5' },
    { name: 'wed2PhotoPct', label: 'Photo/Video (% of budget)', type: 'number', min: 0, max: 30, step: '2' },
  ],
  compute: (v) => {
    const venuePcts: Record<string, number> = { ballroom: 40, barn: 35, garden: 30, beach: 25, church: 20 }
    const venuePct = venuePcts[v.wed2Venue] || 30
    const venueBudget = v.wed2TotalBudget * (venuePct / 100)
    const cateringBudget = v.wed2TotalBudget * (v.wed2CateringPct / 100)
    const photoBudget = v.wed2TotalBudget * (v.wed2PhotoPct / 100)
    const attire = v.wed2TotalBudget * 0.08
    const flowers = v.wed2TotalBudget * 0.07
    const music = v.wed2TotalBudget * 0.06
    const misc = v.wed2TotalBudget * 0.04
    const accounted = venueBudget + cateringBudget + photoBudget + attire + flowers + music
    const remaining = v.wed2TotalBudget - accounted - misc
    const perGuest = v.wed2TotalBudget / v.wed2Guests
    return { result: perGuest, label: 'Cost per Guest', unit: '$', steps: [{ label: 'Venue (' + venuePct + '%)', value: '$' + venueBudget.toFixed(0) }, { label: 'Catering (' + v.wed2CateringPct + '%)', value: '$' + cateringBudget.toFixed(0) }, { label: 'Photo/Video (' + v.wed2PhotoPct + '%)', value: '$' + photoBudget.toFixed(0) }, { label: 'Attire + Flowers + Music', value: '$' + (attire + flowers + music).toFixed(0) }, { label: 'Misc/Contingency', value: '$' + misc.toFixed(0) }, { label: 'Cost per Guest', value: '$' + perGuest.toFixed(0) }] }
  },
  description: 'Plan your wedding budget by allocating funds across venue, catering, photography, attire, flowers, and music based on total budget.',
  formula: 'Allocations based on budget percentages | Venue 20-40% | Catering 30-40% | Photo 8-12% | Attire 8% | Flowers 7% | Music 6%',
  interpretation: 'Average US wedding: $30,000 (100 guests). Typical breakdown: venue 35%, catering 30%, photo 10%, attire 8%, flowers 7%, music 6%, misc 4%. Per guest cost: $200-400. Off-season and Sunday weddings save 10-30%.'
}

export default calcDef
