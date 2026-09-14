import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wsDownloadMbps: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wsUploadMbps: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wsDevices: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), wsUsageType: z.string().min(1) }),
  fields: [
    { name: 'wsDownloadMbps', label: 'Download Speed (Mbps)', type: 'number', min: 1, step: '10' },
    { name: 'wsUploadMbps', label: 'Upload Speed (Mbps)', type: 'number', min: 1, step: '5' },
    { name: 'wsDevices', label: 'Connected Devices', type: 'number', min: 1, step: '1' },
    { name: 'wsUsageType', label: 'Primary Usage', type: 'select', options: [{ label: 'Basic Browsing/Email', value: 'basic' }, { label: 'Streaming HD', value: 'streaming' }, { label: 'Streaming 4K', value: '4k' }, { label: 'Gaming', value: 'gaming' }, { label: 'Work from Home', value: 'wfh' }, { label: 'Content Creation', value: 'creator' }] },
  ],
  defaults: { wsDownloadMbps: '200', wsUploadMbps: '20', wsDevices: '8', wsUsageType: 'wfh' },
  presets: [
    { label: 'Small Apt — Light Use', values: { wsDownloadMbps: '50', wsUploadMbps: '10', wsDevices: '3', wsUsageType: 'basic' } },
    { label: 'Family Home — Streaming', values: { wsDownloadMbps: '300', wsUploadMbps: '30', wsDevices: '10', wsUsageType: '4k' } },
    { label: 'Remote Worker + Gamer', values: { wsDownloadMbps: '500', wsUploadMbps: '50', wsDevices: '8', wsUsageType: 'wfh' } },
    { label: 'Content Creator Setup', values: { wsDownloadMbps: '1000', wsUploadMbps: '100', wsDevices: '6', wsUsageType: 'creator' } },
  ],
  compute: (v) => {
    const requiredMbps: Record<string, number> = { basic: 5, streaming: 25, '4k': 50, gaming: 25, wfh: 50, creator: 100 }
    const perDeviceOverhead = 1.5
    const needed = requiredMbps[v.wsUsageType] || 25
    const totalNeeded = needed + v.wsDevices * perDeviceOverhead
    const isEnough = v.wsDownloadMbps >= totalNeeded
    const margin = v.wsDownloadMbps - totalNeeded
    const pctUsed = (totalNeeded / v.wsDownloadMbps) * 100
    return { result: totalNeeded, label: 'Recommended Speed', unit: 'Mbps', steps: [{ label: 'Primary Usage Base', value: `${v.wsUsageType} = ${needed} Mbps` }, { label: 'Device Overhead', value: `${v.wsDevices} × 1.5 Mbps = ${(v.wsDevices * perDeviceOverhead)} Mbps` }, { label: 'Total Speed Needed', value: `${needed} + ${(v.wsDevices * perDeviceOverhead)} = ${totalNeeded.toFixed(0)} Mbps` }, { label: 'Your Current Download', value: `${v.wsDownloadMbps} Mbps` }, { label: 'Capacity Assessment', value: isEnough ? `Sufficient — ${margin.toFixed(0)} Mbps headroom` : `Insufficient — need ${Math.abs(margin).toFixed(0)} more Mbps` }, { label: 'Bandwidth Utilization', value: `${pctUsed.toFixed(0)}% of your plan's download` }, { label: 'Upload Recommendation', value: v.wsUploadMbps < totalNeeded * 0.2 ? `Upload ${v.wsUploadMbps} Mbps may be low — consider symmetrical plan` : 'Upload speed is adequate' }] ,
    extras: [
      { label: 'FCC Speed Benchmark', value: 'The FCC defines broadband as 25 Mbps download / 3 Mbps upload minimum. However, a modern household of 4 needs 100-300 Mbps for HD streaming, video calls, and gaming simultaneously. Only 40 Mbps per active user is the practical baseline.' },
      { label: 'WiFi vs Ethernet Reality', value: 'WiFi 6 (802.11ax) delivers ~40-60% of wired speeds in real-world conditions due to signal interference, wall attenuation, and channel congestion. For gaming and video calls: use ethernet. For streaming: WiFi 5 GHz band is best.' },
      { label: 'Video Call Bandwidth', value: 'Zoom/Teams HD video: 2-4 Mbps per call. 4-person call on same network = 8-16 Mbps. With screen sharing: add 1-2 Mbps. Ask household members to pause streaming during important video meetings.' },
      { label: 'Gaming Latency vs Speed', value: 'Gaming needs low latency (<50 ms ping) more than raw speed. Online gaming uses only 3-10 Mbps, but requires stable connection without jitter. Wired ethernet reduces ping by 30-50% vs WiFi. Enable QoS on your router.' },
      { label: 'Mesh vs Single Router', value: 'For homes >1,500 sq ft or multiple floors, mesh systems (eero, Orbi, Google Nest) eliminate dead spots better than extenders. Mesh reduces speed by 10-20% per hop vs single-router wired backhaul. Best: wired ethernet backhaul.' },
      { label: 'Speed Tier Recommendations', value: '1-2 people basic use: 50 Mbps. 3-4 people HD streaming: 200 Mbps. 4+ people 4K streaming + gaming: 500 Mbps. Heavy upload/content creation: 1 Gbps. Most users over-provision by buying plans with 2× their actual needed speed.' },
      { label: 'Download Time Reference', value: 'At 200 Mbps: 1 GB file downloads in ~40 sec, 4K movie (15 GB) in ~10 min, game (50 GB) in ~33 min. At 50 Mbps: 1 GB takes ~2.7 min. Speed matters most for large downloads and simultaneous multi-device use.' },
    ]}
  },
  description: 'Check if your internet speed is sufficient for your household usage patterns. Compares current download/upload against FCC-recommended speeds for various activities plus per-device overhead for realistic capacity planning.',
  formula: 'RequiredSpeed = BaseUsageSpeed + (Devices × 1.5 Mbps overhead). Base speeds: Basic 5, HD Streaming 25, 4K Streaming 50, Gaming 25, WFH 50, Content Creator 100 Mbps. Margin = ActualSpeed - RequiredSpeed. Utilization% = RequiredSpeed ÷ ActualSpeed × 100.',
  interpretation: 'A household with 8 devices and WFH primary usage needs ~62 Mbps total (50 base + 12 device overhead). With a 200 Mbps plan, you have 138 Mbps headroom (69% utilization) — plenty for simultaneous 4K streaming, video calls, and gaming. The FCC minimum of 25 Mbps is inadequate for modern households; 200+ Mbps is recommended for smooth multi-device experiences. WiFi typically delivers 50-60% of wired speed, so a 200 Mbps plan yields ~100-120 Mbps over WiFi. For best performance, wire critical devices (desktop, gaming console, streaming box) via ethernet and reserve WiFi for mobile devices.'
}

export default calcDef
