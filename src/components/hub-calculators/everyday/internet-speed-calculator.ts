import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ fileSize: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), speed: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), unit: z.enum(['MB', 'GB', 'KB']) }),
  fields: [
    { name: 'fileSize', label: 'File Size', type: 'number', min: 0.1, step: '1' },
    { name: 'unit', label: 'File Size Unit', type: 'select', options: [{ label: 'Kilobytes (KB)', value: 'KB' }, { label: 'Megabytes (MB)', value: 'MB' }, { label: 'Gigabytes (GB)', value: 'GB' }] },
    { name: 'speed', label: 'Internet Speed (Mbps)', type: 'number', min: 0.1, step: '5' },
  ],
  compute: (v) => { const multiplier = v.unit === 'GB' ? 1024 : v.unit === 'MB' ? 1 : 1 / 1024; const fileMb = v.fileSize * multiplier; const downloadTimeSec = (fileMb * 8) / v.speed; const downloadTimeMin = downloadTimeSec / 60; const downloadTimeHr = downloadTimeMin / 60; const displayTime = downloadTimeHr >= 1 ? `${downloadTimeHr.toFixed(2)} hrs` : downloadTimeMin >= 1 ? `${downloadTimeMin.toFixed(1)} min` : `${downloadTimeSec.toFixed(1)} sec`; return { result: downloadTimeSec, label: 'Download Time', unit: 'seconds', steps: [{ label: 'File Size', value: `${v.fileSize} ${v.unit} = ${fileMb.toFixed(1)} MB` }, { label: 'Speed', value: `${v.speed} Mbps` }, { label: 'Download Time', value: `${downloadTimeSec.toFixed(1)} sec (${displayTime})` }] } },
  description: 'Estimate download time for any file based on your internet connection speed in Mbps.',
  formula: 'Time (sec) = (File Size in MB × 8) / Speed (Mbps)',
  interpretation: 'Actual speeds are typically 50-90% of advertised due to overhead, network congestion, and WiFi limitations. Use wired Ethernet for max speed.'
}

export default calcDef
