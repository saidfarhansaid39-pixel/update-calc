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
  defaults: { fileSize: '50', sizeUnit: 'GB', speedMbps: '100', overheadPct: '10' },
  presets: [
    { label: 'HD Movie (5 GB)', values: { fileSize: '5', sizeUnit: 'GB', speedMbps: '50', overheadPct: '10' } },
    { label: 'AAA Game (100 GB)', values: { fileSize: '100', sizeUnit: 'GB', speedMbps: '200', overheadPct: '15' } },
    { label: 'Large App (500 MB)', values: { fileSize: '500', sizeUnit: 'MB', speedMbps: '25', overheadPct: '5' } },
    { label: 'Phone Photo (5 MB)', values: { fileSize: '5', sizeUnit: 'MB', speedMbps: '10', overheadPct: '10' } },
  ],
  compute: (v) => {
    const sizeMb = v.sizeUnit === 'GB' ? v.fileSize * 1024 : v.fileSize
    const sizeMbits = sizeMb * 8
    const effectiveSpeed = v.speedMbps * (1 - v.overheadPct / 100)
    const seconds = sizeMbits / effectiveSpeed
    const minutes = seconds / 60
    const hours = minutes / 60
    const timeStr = hours >= 1 ? `${hours.toFixed(2)} hrs` : minutes >= 1 ? `${minutes.toFixed(2)} min` : `${seconds.toFixed(1)} sec`
    const speedMbpsReal = v.speedMbps * 0.9
    const timeRealSeconds = sizeMbits / (speedMbpsReal * (1 - v.overheadPct / 100))
    const throughputMBps = effectiveSpeed / 8
    return { result: seconds, label: 'Download Time', unit: 'sec', steps: [
      { label: 'File Size', value: `${sizeMb} MB (${v.fileSize} ${v.sizeUnit})` },
      { label: 'Convert to Megabits', value: `${sizeMb} MB × 8 = ${sizeMbits} Mbits` },
      { label: 'Advertised Speed', value: `${v.speedMbps} Mbps` },
      { label: 'Protocol Overhead', value: `-${v.overheadPct}% = ${effectiveSpeed.toFixed(1)} Mbps effective` },
      { label: 'Estimated Throughput', value: `${throughputMBps.toFixed(1)} MB/s` },
      { label: 'Download Time', value: timeStr },
      { label: 'Real-World Est. (90% speed)', value: `${timeRealSeconds >= 3600 ? `${(timeRealSeconds / 3600).toFixed(2)} hrs` : timeRealSeconds >= 60 ? `${(timeRealSeconds / 60).toFixed(2)} min` : `${timeRealSeconds.toFixed(1)} sec`}` },
      { label: 'File Size in Different Units', value: `${sizeMb >= 1024 ? `${(sizeMb / 1024).toFixed(2)} GB` : `${sizeMb.toFixed(1)} MB`} = ${sizeMbits.toFixed(0)} Mbits` },
    ] ,
    extras: [
      { label: "Mbps vs MB/s Explained", value: "MB (megabytes) = 8× bigger than Mb (megabits). A 100 Mbps connection downloads at 12.5 MB/s max. ISPs advertise in Mbps because the number looks bigger. Divide by 8 to get real MB/s throughput." },
      { label: "Real-World vs Advertised Speed", value: "FCC reports US ISPs deliver 70-90% of advertised speeds on average. Fiber (95%+) is most consistent. Cable (70-85%) varies with neighborhood congestion. Fixed wireless (50-70%) drops in rain. 5G home internet (60-250 Mbps) varies by tower load." },
      { label: "Wi-Fi vs Ethernet", value: "Wi-Fi adds 10-30% overhead vs ethernet. A 500 Mbps plan on Wi-Fi 5 (802.11ac) often delivers 200-350 Mbps. Ethernet (Cat5e/Cat6) achieves 95%+ of wired plan speed. For large downloads, plugging in can cut time by 20-40%." },
      { label: "Steam/Console Download Tips", value: "Steam, Xbox, and PlayStation use content delivery networks (CDNs) that max out at 30-300 Mbps depending on server load. Pausing and resuming may reconnect to a closer CDN node. Changing DNS to Cloudflare (1.1.1.1) or Google (8.8.8.8) helps routing." },
      { label: "Data Caps and Throttling", value: "Many ISPs have 1-1.5 TB monthly data caps. Exceeding triggers $10-50 overage fees or throttling to 10-50 Mbps. A 100 GB game download uses 7-10% of a 1 TB cap. Unlimited data plans cost $10-30/mo extra." },
      { label: "Upload vs Download", value: "Most ISPs provision asymmetrical speeds: 100/10 Mbps (download/upload). Large uploads (videos, backups) take 8-10× longer. Cloud backup of 50 GB at 10 Mbps upload = ~11 hrs. Fiber provides symmetrical speeds." },
      { label: "Connection Types Comparison", value: "Fiber: 100-10,000 Mbps, <10 ms latency, $50-300/mo. Cable: 50-1,200 Mbps, 15-30 ms, $40-120/mo. DSL: 5-100 Mbps, 20-50 ms, $30-70/mo. Starlink: 50-200 Mbps, 25-50 ms, $120/mo. 5G Home: 60-250 Mbps, 20-40 ms, $50-70/mo." },
      { label: "Download Time Table Reference", value: "10 GB file: 25 Mbps = 57 min, 50 Mbps = 28 min, 100 Mbps = 14 min, 500 Mbps = 2.8 min, 1 Gbps = 1.4 min. 50 GB game: 50 Mbps = 2.4 hrs, 200 Mbps = 36 min, 1 Gbps = 7 min. 100 MB photo album: 10 Mbps = 1.5 min, 50 Mbps = 18 sec." },
    ]}
  },
  description: 'Calculate download time for any file size across MB and GB units. Factors in protocol overhead and real-world throughput degradation to give both theoretical and realistic time estimates.',
  formula: 'Time(sec) = [File(MB) × 8] / [Speed(Mbps) × (1 - Overhead%/100)] | Effective = Speed / 8 in MB/s',
  interpretation: 'The gap between advertised and real-world speeds is significant: expect 70-90% of plan speed for downloads due to TCP/IP overhead, Wi-Fi interference, and ISP congestion. A 50 GB game at a 100 Mbps plan takes ~71 min theoretically but often 85-95 min in practice. Key tip: use ethernet for large downloads, download overnight (ISPs throttle less at 2-6 AM), and pause/resume slow downloads to find faster CDN routes.'
}

export default calcDef
