import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ fileSize: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), speed: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), unit: z.enum(['MB', 'GB', 'KB']) }),
  defaults: { fileSize: '2', unit: 'GB', speed: '100' },
  presets: [
    { label: 'HD Movie (5 GB)', values: { fileSize: '5', unit: 'GB', speed: '100' } },
    { label: 'Gaming Download (50 GB)', values: { fileSize: '50', unit: 'GB', speed: '200' } },
    { label: 'Large PDF (50 MB)', values: { fileSize: '50', unit: 'MB', speed: '25' } },
  ],
  fields: [
    { name: 'fileSize', label: 'File Size', type: 'number', min: 0.1, step: '1' },
    { name: 'unit', label: 'File Size Unit', type: 'select', options: [{ label: 'Kilobytes (KB)', value: 'KB' }, { label: 'Megabytes (MB)', value: 'MB' }, { label: 'Gigabytes (GB)', value: 'GB' }] },
    { name: 'speed', label: 'Internet Speed (Mbps)', type: 'number', min: 0.1, step: '5' },
  ],
  compute: (v) => { const S = parseFloat(v.fileSize)||0; const SP = parseFloat(v.speed)||0; const multiplier = v.unit === 'GB' ? 1024 : v.unit === 'MB' ? 1 : 1 / 1024; const fileMb = S * multiplier; const downloadTimeSec = (fileMb * 8) / SP; const downloadTimeMin = downloadTimeSec / 60; const downloadTimeHr = downloadTimeMin / 60; const displayTime = downloadTimeHr >= 1 ? `${downloadTimeHr.toFixed(2)} hrs` : downloadTimeMin >= 1 ? `${downloadTimeMin.toFixed(1)} min` : `${downloadTimeSec.toFixed(1)} sec`; return { result: downloadTimeSec, label: 'Download Time', unit: 'seconds', steps: [
    { label: '1. File Size (MB)', value: `${S} ${v.unit} = ${fileMb.toFixed(0)} MB` },
    { label: '2. Convert to Megabits', value: `${fileMb.toFixed(0)} MB × 8 = ${(fileMb*8).toFixed(0)} Mb (1 byte = 8 bits)` },
    { label: '3. Divide by Speed', value: `${(fileMb*8).toFixed(0)} Mb ÷ ${SP} Mbps = ${downloadTimeSec.toFixed(0)} sec` },
    { label: '4. Human Readable', value: `${displayTime}` },
  ] ,
    extras: [
      { label: 'Mbps vs MB/s', value: 'Mbps = megabits per second. MB/s = megabytes per second (1 MB/s = 8 Mbps). A 100 Mbps connection = 12.5 MB/s. File sizes are in bytes, speed is in bits.' },
      { label: 'Real vs Advertised Speed', value: 'Actual speeds are 50-80% of advertised due to: WiFi interference, network congestion (peak 7-11 PM), ISP throttling, and protocol overhead (TCP/IP adds 5-10% overhead).' },
      { label: 'WiFi vs Ethernet', value: 'WiFi 5 (802.11ac): 200-400 Mbps real. WiFi 6: 400-800 Mbps. Ethernet (Cat 5e): 1 Gbps. Ethernet is always faster and more stable. For large downloads, plug in directly.' },
      { label: 'Speed Tier Guide', value: '25 Mbps: 1-2 users, streaming HD. 100 Mbps: 3-4 users, 4K streaming, gaming. 500 Mbps: 5-7 users, multiple 4K streams. 1 Gbps: heavy usage, large file transfers, many devices.' },
      { label: 'Cloud Backup Time', value: 'A 100 GB backup at 50 Mbps takes ~4.5 hrs. At 500 Mbps, ~27 min. Most ISPs throttle uploads to 10-20% of download speeds — check your plan.' },
      { label: 'Streaming Bandwidth', value: 'Netflix HD: 5 Mbps. Netflix 4K: 25 Mbps. Zoom 1080p: 3.5 Mbps. YouTube 4K: 20 Mbps. Twitch 1080p60: 6 Mbps. Game streaming (GeForce Now): 25 Mbps.' },
      { label: 'Latency Matters', value: 'Speed (bandwidth) is how much data you can download. Latency (ping) is how fast data travels. Gaming needs <50ms ping. Video calls need <100ms. Satellite internet has 500-800ms latency.' },
      { label: 'Data Caps', value: 'Many ISPs have 1-1.2 TB monthly caps. A 4K movie is ~7 GB. 50 GB game × 5 = 250 GB. 100 GB backup = 350 GB. Exceeding cap: $10-50 per 50 GB overage.' },
    ]} },
  description: 'Estimate download time for any file based on your internet connection speed in Mbps. Includes conversion between bits and bytes, real-world speed factors, and streaming bandwidth guides.',
  formula: 'Time (sec) = (FileSize in MB × 8) / Speed in Mbps. Example: 2 GB = 2048 MB. 2048 × 8 = 16,384 Mb. ÷ 100 Mbps = 164 sec (2 min 44 sec).',
  interpretation: 'Actual download speeds are typically 50-80% of advertised due to WiFi loss, network congestion, and protocol overhead. A 100 Mbps connection downloads at 12.5 MB/s theoretical, ~8-10 MB/s real-world. Use wired Ethernet for maximum speed. For a 5 GB movie: 100 Mbps = ~7 min, 500 Mbps = ~1.4 min, 1 Gbps = ~40 sec.'
}

export default calcDef
