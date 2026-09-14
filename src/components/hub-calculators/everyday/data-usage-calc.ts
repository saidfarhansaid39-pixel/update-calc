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
  defaults: { streamingHrs: '3', browseHrs: '2', socialHrs: '1.5', videoQuality: '3' },
  presets: [
    { label: 'Light User (1 person)', values: { streamingHrs: '1', browseHrs: '1', socialHrs: '1', videoQuality: '1' } },
    { label: 'Moderate Household (2)', values: { streamingHrs: '4', browseHrs: '2', socialHrs: '2', videoQuality: '3' } },
    { label: 'Heavy Streaming Family (4)', values: { streamingHrs: '8', browseHrs: '3', socialHrs: '3', videoQuality: '7' } },
    { label: 'Work-from-Home + Gaming', values: { streamingHrs: '5', browseHrs: '6', socialHrs: '2', videoQuality: '3' } },
  ],
  compute: (v) => {
    const videoGbHr = parseFloat(v.videoQuality)
    const streamingGb = v.streamingHrs * videoGbHr
    const browseGb = v.browseHrs * 0.15
    const socialGb = v.socialHrs * 0.2
    const dailyGb = streamingGb + browseGb + socialGb
    const weeklyGb = dailyGb * 7
    const monthlyGb = dailyGb * 30
    const capUtilization = (monthlyGb / 1200) * 100
    return { result: monthlyGb, label: 'Monthly Data Usage', unit: 'GB', steps: [{ label: 'Video Streaming', value: `${streamingGb.toFixed(1)} GB/day (${v.streamingHrs} hrs × ${videoGbHr} GB/hr)` }, { label: 'Web Browsing', value: `${browseGb.toFixed(1)} GB/day (${v.browseHrs} hrs × 0.15 GB/hr)` }, { label: 'Social Media', value: `${socialGb.toFixed(1)} GB/day (${v.socialHrs} hrs × 0.2 GB/hr)` }, { label: 'Daily Total', value: `${dailyGb.toFixed(1)} GB` }, { label: 'Weekly Total', value: `${weeklyGb.toFixed(1)} GB` }, { label: 'Monthly Total', value: `${monthlyGb.toFixed(1)} GB` }, { label: 'vs Typical 1.2 TB Cap', value: `${capUtilization.toFixed(0)}% utilized` }] ,
    extras: [
      { label: "Video Dominates", value: "Streaming video accounts for 65-80% of all household data usage. Switching from 4K to HD reduces usage 57% with minimal visual difference on screens under 55 in." },
      { label: "Gaming Impact", value: "A single AAA game download (Call of Duty, Baldur's Gate 3) is 100-250 GB. Two such downloads per month add 200-500 GB on top of your streaming." },
      { label: "Video Calls", value: "Zoom/Teams/Google Meet use 0.6-2.5 GB/hr depending on resolution. A 4-hour workday of video calls adds 2.5-10 GB/day—often overlooked in estimates." },
      { label: "Cap Warning", value: "Most US ISPs (Comcast, Spectrum, Cox) enforce 1-1.2 TB monthly caps. Exceeding the cap costs $10-50 per 50 GB block. A 4K-heavy family of 4 can hit 800-1,200 GB/month." },
      { label: "WiFi vs Cellular", value: "Home WiFi traffic doesn't count against mobile data caps. But 5G home internet often has lower caps (300-500 GB). Check your ISP's fine print on deprioritization." },
      { label: "Data-Saving Settings", value: "Netflix: 4K→HD saves 57%. YouTube: auto quality saves 30-50%. Browsers: ad blockers reduce page weight 40-60%. Each adjustment saves 50-150 GB/month." },
      { label: "Multiple Devices", value: "A family of 4 with 2 TVs streaming 4K, 3 phones on social, and 2 laptops browsing simultaneously uses 40-60 GB/day—1,200-1,800 GB/month." },
      { label: "Peak vs Off-Peak", value: "Many ISPs throttle during peak hours (7-11 PM). Schedule large downloads (game updates, 4K movies) for off-peak midnight-6 AM for full speeds." },
    ]}
  },
  description: 'Estimate your household\'s monthly internet data usage based on streaming, browsing, and social media habits. Calibrated with realistic per-activity rates and a utilization gauge against common 1.2 TB data caps.',
  formula: 'Monthly GB = ((Streaming Hrs × Video Rate) + (Browse Hrs × 0.15) + (Social Hrs × 0.2)) × 30 | Video Rate: SD=1, HD=3, 4K=7 GB/hr',
  interpretation: 'The average US household uses 300-500 GB/month, but heavy streaming families easily reach 800-1,200 GB/month—dangerously close to the 1-1.2 TB caps of most ISPs. Video streaming dominates (65-80% of usage). The single biggest lever is video quality: switching from 4K to HD cuts streaming data by 57% while preserving most of the viewing experience on screens under 55 inches. Gaming downloads, video calls, and security cameras are often-overlooked sources that add 100-500 GB/month.'
}

export default calcDef
