import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalGb: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), osReserve: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), browserTabs: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), openApps: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'totalGb', label: 'Total RAM (GB)', type: 'number', min: 1, step: '4' },
    { name: 'osReserve', label: 'OS & Background (%)', type: 'number', min: 10, max: 80, step: '5' },
    { name: 'browserTabs', label: 'Browser Tabs Open', type: 'number', min: 0, step: '5' },
    { name: 'openApps', label: 'Other Applications', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const osUsage = v.totalGb * (v.osReserve / 100)
    const tabMemory = v.browserTabs * 0.15
    const appMemory = v.openApps * 0.5
    const usedMemory = osUsage + tabMemory + appMemory
    const availableMemory = v.totalGb - usedMemory
    const usagePct = (usedMemory / v.totalGb) * 100
    return { result: availableMemory, label: 'Available RAM', unit: 'GB', steps: [{ label: 'Total RAM', value: `${v.totalGb} GB` }, { label: 'OS Usage', value: `${osUsage.toFixed(1)} GB` }, { label: 'Browser Tabs', value: `${tabMemory.toFixed(1)} GB` }, { label: 'Applications', value: `${appMemory.toFixed(1)} GB` }, { label: 'Total Used', value: `${usedMemory.toFixed(1)} GB (${usagePct.toFixed(0)}%)` }, { label: 'Available', value: `${availableMemory.toFixed(1)} GB` }] }
  },
  description: 'Estimate available system memory (RAM) after accounting for OS, browser tabs, and running applications.',
  formula: 'Available = Total - (OS%×Total + Tabs×0.15GB + Apps×0.5GB)',
  interpretation: 'Chrome: 150-300 MB per tab. Slack/Teams: 500-1000 MB. Keep at least 2-4 GB free for smooth performance. 8 GB minimum for general use, 16 GB for gaming/creative work.'
}

export default calcDef
