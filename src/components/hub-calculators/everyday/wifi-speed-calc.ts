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
  compute: (v) => {
    const requiredMbps: Record<string, number> = { basic: 5, streaming: 25, '4k': 50, gaming: 25, wfh: 50, creator: 100 }
    const perDeviceOverhead = 1.5
    const needed = requiredMbps[v.wsUsageType] || 25
    const totalNeeded = needed + v.wsDevices * perDeviceOverhead
    const isEnough = v.wsDownloadMbps >= totalNeeded
    const margin = v.wsDownloadMbps - totalNeeded
    const pctUsed = (totalNeeded / v.wsDownloadMbps) * 100
    return { result: totalNeeded, label: 'Recommended Speed', unit: 'Mbps', steps: [{ label: 'Base Need (' + v.wsUsageType + ')', value: needed + ' Mbps' }, { label: 'Device Overhead', value: v.wsDevices + ' x 1.5 = ' + (v.wsDevices * perDeviceOverhead) + ' Mbps' }, { label: 'Total Needed', value: totalNeeded.toFixed(0) + ' Mbps' }, { label: 'Your Speed', value: v.wsDownloadMbps + ' Mbps' }, { label: 'Assessment', value: isEnough ? 'Sufficient (+' + margin.toFixed(0) + ' Mbps)' : 'Insufficient (need ' + Math.abs(margin).toFixed(0) + ' more Mbps)' }] }
  },
  description: 'Check if your internet speed is sufficient for your household usage. Compares current speed against recommended speeds for various activities.',
  formula: 'Needed = Base(by usage) + Devices x 1.5 | Basic: 5, HD: 25, 4K: 50, Gaming: 25, WFH: 50, Creator: 100 Mbps',
  interpretation: 'FCC minimum: 25 Mbps. For 4K streaming + gaming + multiple devices: 100+ Mbps recommended. WiFi speeds are typically 50% of wired due to signal loss. Mesh systems improve coverage but not raw speed. Ethernet is best for gaming.'
}

export default calcDef
