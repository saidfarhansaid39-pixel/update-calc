import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ cvsCableBill: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), cvsStreamCount: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), cvsAvgStreamCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), cvsInternetCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'cvsCableBill', label: 'Monthly Cable Bill ($)', type: 'number', min: 0, step: '20' },
    { name: 'cvsStreamCount', label: 'Streaming Services', type: 'number', min: 0, step: '1' },
    { name: 'cvsAvgStreamCost', label: 'Avg Cost per Service ($)', type: 'number', min: 0, step: '5' },
    { name: 'cvsInternetCost', label: 'Internet Cost ($/mo)', type: 'number', min: 0, step: '10' },
  ],
  compute: (v) => {
    const streamingTotal = v.cvsStreamCount * v.cvsAvgStreamCost + v.cvsInternetCost
    const annualCable = v.cvsCableBill * 12
    const annualStreaming = streamingTotal * 12
    const savings = annualCable - annualStreaming
    const pctSaved = annualCable > 0 ? (savings / annualCable) * 100 : 0
    return { result: savings, label: 'Annual Savings with Streaming', unit: '$', steps: [{ label: 'Cable Annual', value: '$' + annualCable.toFixed(2) }, { label: 'Streaming Monthly', value: '$' + streamingTotal.toFixed(2) }, { label: 'Streaming Annual', value: '$' + annualStreaming.toFixed(2) }, { label: 'Annual Savings', value: '$' + savings.toFixed(2) + ' (' + pctSaved.toFixed(0) + '%)' }] }
  },
  description: 'Compare cable TV costs versus streaming services including internet. See how much you could save by cutting the cord.',
  formula: 'Savings = Cable x 12 - (StreamingServices x Cost + Internet) x 12 | Avg cable: $100-200/mo | Avg streaming: $50-80/mo',
  interpretation: 'Average cable bill: $120/month. Streaming bundle (3-4 services + internet): $80-100/month. Savings: $240-600/year. Add an antenna ($20-40) for local channels and sports. Rotate services monthly for variety.'
}

export default calcDef
