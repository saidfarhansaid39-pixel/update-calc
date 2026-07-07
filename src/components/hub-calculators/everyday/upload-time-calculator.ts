import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ utFileSize: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), utSizeUnit: z.string().min(1), utUploadSpeed: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), utSpeedUnit: z.string().min(1) }),
  fields: [
    { name: 'utFileSize', label: 'File Size', type: 'number', min: 1, step: '10' },
    { name: 'utSizeUnit', label: 'Size Unit', type: 'select', options: [{ label: 'MB', value: 'MB' }, { label: 'GB', value: 'GB' }, { label: 'KB', value: 'KB' }] },
    { name: 'utUploadSpeed', label: 'Upload Speed', type: 'number', min: 0.1, step: '1' },
    { name: 'utSpeedUnit', label: 'Speed Unit', type: 'select', options: [{ label: 'Mbps', value: 'Mbps' }, { label: 'MB/s', value: 'MBs' }, { label: 'Kbps', value: 'Kbps' }] },
  ],
  compute: (v) => {
    const sizeConversions: Record<string, number> = { KB: 1, MB: 1024, GB: 1048576 }
    const speedConversions: Record<string, number> = { Kbps: 1, Mbps: 1024, MBs: 8388.608 }
    const sizeKb = v.utFileSize * sizeConversions[v.utSizeUnit]
    const speedKbps = v.utUploadSpeed * speedConversions[v.utSpeedUnit]
    const seconds = speedKbps > 0 ? sizeKb / speedKbps : 0
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.round(seconds % 60)
    const minutesOnly = seconds / 60
    let timeStr = ''
    if (hours > 0) timeStr += hours + 'h '
    if (minutes > 0) timeStr += minutes + 'm '
    timeStr += secs + 's'
    return { result: seconds, label: 'Estimated Upload Time', unit: 'sec', steps: [{ label: 'File Size', value: v.utFileSize + ' ' + v.utSizeUnit + ' (' + sizeKb.toFixed(0) + ' KB)' }, { label: 'Upload Speed', value: v.utUploadSpeed + ' ' + v.utSpeedUnit + ' (' + speedKbps.toFixed(0) + ' Kbps)' }, { label: 'Upload Time', value: timeStr + ' (' + minutesOnly.toFixed(1) + ' min)' }] }
  },
  description: 'Calculate time required to upload a file based on file size and upload speed. Supports KB, MB, GB and Kbps, Mbps, MB/s.',
  formula: 'Time = (FileSize x Conversion) / (Speed x Conversion) | Result in hours/minutes/seconds',
  interpretation: 'Upload speeds are typically 5-20% of download speeds. A 1 GB file at 10 Mbps upload = ~14 min. At 100 Mbps = ~1.4 min. Cloud backups of 100+ GB may take hours. Compress files before upload to reduce time.'
}

export default calcDef
