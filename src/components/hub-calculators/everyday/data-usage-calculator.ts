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
  defaults: { streamingHrs: '2', browseHrs: '1.5', socialHrs: '2', videoQuality: '3' },
  presets: [
    { label: 'Light User (50 GB plan)', values: { streamingHrs: '0.5', browseHrs: '1', socialHrs: '1', videoQuality: '1' } },
    { label: 'Average Couple', values: { streamingHrs: '3', browseHrs: '2', socialHrs: '1.5', videoQuality: '3' } },
    { label: 'Family with Kids', values: { streamingHrs: '6', browseHrs: '3', socialHrs: '3', videoQuality: '7' } },
    { label: 'Cord-Cutter', values: { streamingHrs: '8', browseHrs: '1', socialHrs: '1', videoQuality: '7' } },
  ],
  compute: (v) => {
    const videoGbHr = parseFloat(v.videoQuality)
    const streamingGb = v.streamingHrs * videoGbHr
    const browsingGb = v.browseHrs * 0.15
    const socialGb = v.socialHrs * 0.2
    const dailyGb = streamingGb + browsingGb + socialGb
    const monthlyGb = dailyGb * 30
    const planGauge = monthlyGb > 1200 ? 'Exceeds 1.2 TB cap' : monthlyGb > 1000 ? 'Near 1 TB cap' : monthlyGb > 500 ? 'Moderate' : 'Well under cap'
    return { result: monthlyGb, label: 'Monthly Data Usage', unit: 'GB', steps: [{ label: 'Daily Streaming', value: `${streamingGb.toFixed(1)} GB (${v.streamingHrs} hrs × ${videoGbHr} GB/hr)` }, { label: 'Daily Browsing', value: `${browsingGb.toFixed(1)} GB (${v.browseHrs} hrs × 0.15 GB/hr)` }, { label: 'Daily Social', value: `${socialGb.toFixed(1)} GB (${v.socialHrs} hrs × 0.2 GB/hr)` }, { label: 'Daily Total', value: `${dailyGb.toFixed(1)} GB` }, { label: 'Weekly Estimate', value: `${(dailyGb * 7).toFixed(1)} GB` }, { label: 'Monthly Estimate', value: `${monthlyGb.toFixed(1)} GB` }, { label: 'Cap Assessment', value: `${planGauge} (typical cap: 1,000-1,200 GB)` }] ,
    extras: [
      { label: "4K Data Math", value: "One 2-hour 4K movie = 14 GB. A family watching 4K for 4 hrs/night = 28 GB/day = 840 GB/month—just from evening TV, before phones, laptops, or gaming." },
      { label: "Hidden Savers", value: "Netflix downloads for offline viewing use the same data once and save re-streaming. Download your series on WiFi for zero cap impact later." },
      { label: "Music Streaming", value: "Music streaming (Spotify, Apple Music) uses only 40-150 MB/hr—about 1-5% of what video uses. It's a rounding error in your cap calculation." },
      { label: "Smart Home Leak", value: "Always-on devices: security cameras (300-500 GB/month for 4K cams), smart speakers (minimal), video doorbells (50-150 GB/month). Check your camera settings." },
      { label: "Router QoS Settings", value: "Quality of Service (QoS) on your router prioritizes latency-sensitive apps (gaming, video calls) and can throttle background data—helping you stay under cap." },
      { label: "ISP Throttling", value: "Some ISPs (T-Mobile, Verizon 5G home) deprioritize after 50-100 GB/month. Speed drops from 300 Mbps to 5-25 Mbps during congestion. Check your plan's fine print." },
      { label: "Unlimited Plans", value: "True unlimited (no cap, no throttle) costs $70-120/month. Most 'unlimited' plans throttle after 50-200 GB. If you use >800 GB/month, pay for actual unlimited." },
      { label: "Self-Install Monitor", value: "Most ISP routers show data usage in the admin panel (192.168.0.1). Many have mobile apps (Xfinity, Spectrum) with real-time usage—check weekly to avoid overage fees." },
    ]}
  },
  description: 'Estimate your monthly internet data usage based on video streaming, web browsing, and social media habits. See how your usage stacks up against typical ISP caps (1-1.2 TB) and identify the biggest data drains in your household.',
  formula: 'Monthly GB = ((Streaming hrs × Quality) + (Browse hrs × 0.15) + (Social hrs × 0.2)) × 30',
  interpretation: 'HD streaming consumes ~3 GB/hr, 4K uses ~7 GB/hr, and SD uses ~1 GB/hr. A typical household of two moderate-streaming adults uses 250-400 GB/month. A family of four with 4K streaming and gaming can hit 800-1,200 GB/month—brushing against typical 1-1.2 TB ISP caps. Video streaming accounts for 65-80% of all data usage, making video quality the single most impactful lever for staying under the cap.'
}

export default calcDef
