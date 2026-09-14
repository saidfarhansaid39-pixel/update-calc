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
  defaults: { utFileSize: '500', utSizeUnit: 'MB', utUploadSpeed: '20', utSpeedUnit: 'Mbps' },
  presets: [
    { label: 'HD Video (4GB)', values: { utFileSize: '4', utSizeUnit: 'GB', utUploadSpeed: '10', utSpeedUnit: 'Mbps' } },
    { label: 'Phone Photo (5MB)', values: { utFileSize: '5', utSizeUnit: 'MB', utUploadSpeed: '50', utSpeedUnit: 'Mbps' } },
    { label: 'Large Backup (100GB)', values: { utFileSize: '100', utSizeUnit: 'GB', utUploadSpeed: '100', utSpeedUnit: 'Mbps' } },
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
    return { result: seconds, label: 'Estimated Upload Time', unit: 'sec', steps: [
      { label: 'Formula', value: 'Time = (FileSize × Conversion) / (Speed × Conversion)' },
      { label: 'Substitution', value: '(' + v.utFileSize + ' ' + v.utSizeUnit + ' × ' + sizeConversions[v.utSizeUnit].toFixed(0) + ') / (' + v.utUploadSpeed + ' ' + v.utSpeedUnit + ' × ' + speedConversions[v.utSpeedUnit].toFixed(0) + ')' },
      { label: 'File Size', value: sizeKb.toFixed(0) + ' KB' },
      { label: 'Upload Speed', value: speedKbps.toFixed(0) + ' Kbps' },
      { label: 'Upload Time', value: timeStr + ' (' + minutesOnly.toFixed(1) + ' min)' },
    ] ,
    extras: [
      { label: 'Speed Ratio', value: 'Upload speeds are typically 5-20% of download speeds on residential connections' },
      { label: 'Cloud Backup', value: '100+ GB cloud backups can take hours — use overnight scheduling or incremental sync' },
      { label: 'Compression', value: 'Compress files (ZIP, tar.gz) before upload to reduce transfer time by 30-70%' },
      { label: 'Wired vs WiFi', value: 'Use Ethernet for large uploads — WiFi adds 5-20% overhead and is less stable' },
      { label: 'Throttling', value: 'Some ISPs throttle uploads during peak hours (7-11 PM) — check your plan' },
      { label: 'Resume Support', value: 'Use upload tools that support resume — a dropped connection at 95% wastes all progress' },
      { label: 'MB vs Mb', value: '1 MB/s = 8 Mbps. A 100 Mbps connection = 12.5 MB/s theoretical max upload' },
      { label: 'Cloud Sync', value: 'Google Drive / Dropbox sync at 50-80% of your max upload speed due to encryption overhead' },
    ]}
  },
  description: 'Calculate the time required to upload a file based on its size and your upload speed. Supports KB, MB, GB and Kbps, Mbps, MB/s units. Essential for planning large file transfers, cloud backups, and video uploads.',
  formula: 'Time (seconds) = (FileSize × Size-to-KB Factor) / (Speed × Speed-to-Kbps Factor). Example: 500 MB at 20 Mbps = (500 × 1024) / (20 × 1024) = 25 seconds.',
  interpretation: 'A 500 MB file at 20 Mbps upload takes ~25 seconds. Large files (4K video, backups) at typical residential upload speeds (10-50 Mbps) take minutes to hours. For cloud workflows, use incremental backups and off-peak scheduling. Real-world speeds are usually 80-90% of advertised due to overhead.'
}

export default calcDef
