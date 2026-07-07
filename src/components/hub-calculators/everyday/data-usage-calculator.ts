import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ streamingHrs: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), browseHrs: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), socialHrs: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), videoQuality: z.string().min(1) }),
  fields: [
    { name: 'streamingHrs', label: 'Streaming Video (hrs/day)', type: 'number', min: 0, step: '0.5' },
    { name: 'browseHrs', label: 'Web Browsing (hrs/day)', type: 'number', min: 0, step: '0.5' },
    { name: 'socialHrs', label: 'Social Media (hrs/day)', type: 'number', min: 0, step: '0.5' },
    { name: 'videoQuality', label: 'Video Quality', type: 'select', options: [{ label: 'SD (480p) ~1 GB/hr', value: '1' }, { label: 'HD (1080p) ~3 GB/hr', value: '3' }, { label: '4K (2160p) ~7 GB/hr', value: '7' }] },
  ],
  compute: (v) => {
    const videoGbHr = parseFloat(v.videoQuality)
    const streamingGb = v.streamingHrs * videoGbHr
    const browsingGb = v.browseHrs * 0.15
    const socialGb = v.socialHrs * 0.2
    const dailyGb = streamingGb + browsingGb + socialGb
    const monthlyGb = dailyGb * 30
    return { result: monthlyGb, label: 'Monthly Data Usage', unit: 'GB', steps: [{ label: 'Daily Streaming', value: `${streamingGb.toFixed(1)} GB` }, { label: 'Daily Browsing', value: `${browsingGb.toFixed(1)} GB` }, { label: 'Daily Social', value: `${socialGb.toFixed(1)} GB` }, { label: 'Monthly Total', value: `${monthlyGb.toFixed(1)} GB` }] }
  },
  description: 'Estimate your monthly internet data usage based on streaming, browsing, and social media habits. Compare against your data cap.',
  formula: 'Monthly = (Streaming hrs×Quality + Browse hrs×0.15 + Social hrs×0.2) × 30',
  interpretation: 'HD streaming uses ~3 GB/hr, 4K uses ~7 GB/hr. Typical data caps: 1-1.2 TB (1000-1200 GB). A heavy streaming household of 4 can hit the cap in 12-14 days with 4K content.'
}

export default calcDef
