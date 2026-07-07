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
    const browseGb = v.browseHrs * 0.15
    const socialGb = v.socialHrs * 0.2
    const dailyGb = streamingGb + browseGb + socialGb
    const weeklyGb = dailyGb * 7
    const monthlyGb = dailyGb * 30
    return { result: monthlyGb, label: 'Monthly Data Usage', unit: 'GB', steps: [{ label: 'Streaming', value: `${streamingGb.toFixed(1)} GB/day` }, { label: 'Browsing', value: `${browseGb.toFixed(1)} GB/day` }, { label: 'Social Media', value: `${socialGb.toFixed(1)} GB/day` }, { label: 'Daily Total', value: `${dailyGb.toFixed(1)} GB` }, { label: 'Monthly Total', value: `${monthlyGb.toFixed(1)} GB` }] }
  },
  description: 'Estimate monthly internet data usage based on streaming, browsing, and social media habits for choosing the right data plan.',
  formula: 'Monthly GB = (Streaming Hrs × Video Rate + Browse Hrs × 0.15 + Social Hrs × 0.2) × 30',
  interpretation: 'Average household uses 300-500 GB/month. 4K streaming uses 7 GB/hr, HD uses 3 GB/hr, SD uses 1 GB/hr. Video calls (Zoom/Teams) use ~1 GB/hr. Gaming downloads can spike usage 50-100 GB per game.'
}

export default calcDef
