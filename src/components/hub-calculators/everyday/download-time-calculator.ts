import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ fileSize: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), sizeUnit: z.string().min(1), speedMbps: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), overheadPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'fileSize', label: 'File Size', type: 'number', min: 0.1, step: '1' },
    { name: 'sizeUnit', label: 'File Size Unit', type: 'select', options: [{ label: 'MB', value: 'MB' }, { label: 'GB', value: 'GB' }] },
    { name: 'speedMbps', label: 'Download Speed (Mbps)', type: 'number', min: 0.5, step: '5' },
    { name: 'overheadPct', label: 'Protocol Overhead (%)', type: 'number', min: 0, max: 50, step: '5' },
  ],
  compute: (v) => {
    const sizeMb = v.sizeUnit === 'GB' ? v.fileSize * 1024 : v.fileSize
    const sizeMbits = sizeMb * 8
    const effectiveSpeed = v.speedMbps * (1 - v.overheadPct / 100)
    const seconds = sizeMbits / effectiveSpeed
    const minutes = seconds / 60
    const hours = minutes / 60
    const timeStr = hours >= 1 ? `${hours.toFixed(1)} hrs` : minutes >= 1 ? `${minutes.toFixed(1)} min` : `${seconds.toFixed(0)} sec`
    return { result: seconds, label: 'Download Time', unit: 'sec', steps: [{ label: 'File Size', value: `${sizeMb} MB (${sizeMbits} Mbits)` }, { label: 'Effective Speed', value: `${effectiveSpeed.toFixed(1)} Mbps` }, { label: 'Download Time', value: timeStr }] }
  },
  description: 'Calculate download time based on file size and internet speed. Accounts for protocol overhead. Supports MB and GB file sizes.',
  formula: 'Time(sec) = File Size(Mbits) / Speed(Mbps) × (1 + Overhead%)',
  interpretation: 'Actual throughput is typically 70-90% of advertised speed due to overhead and network congestion. Mbps = megabits/sec, MB = megabytes (1 byte = 8 bits). A 50 GB game at 100 Mbps takes ~71 min.'
}

export default calcDef
