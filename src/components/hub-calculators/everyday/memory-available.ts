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
  defaults: { totalGb: '16', osReserve: '30', browserTabs: '15', openApps: '5' },
  presets: [
    { label: 'Basic Office PC (8GB)', values: { totalGb: '8', osReserve: '35', browserTabs: '10', openApps: '3' } },
    { label: 'Gaming Rig (32GB)', values: { totalGb: '32', osReserve: '25', browserTabs: '10', openApps: '4' } },
    { label: 'Heavy Browser User', values: { totalGb: '16', osReserve: '30', browserTabs: '40', openApps: '3' } },
    { label: 'Developer Workstation', values: { totalGb: '32', osReserve: '25', browserTabs: '25', openApps: '8' } },
  ],
  compute: (v) => {
    const osUsage = v.totalGb * (v.osReserve / 100)
    const tabMemory = v.browserTabs * 0.15
    const appMemory = v.openApps * 0.5
    const usedMemory = osUsage + tabMemory + appMemory
    const availableMemory = v.totalGb - usedMemory
    const usagePct = (usedMemory / v.totalGb) * 100
    const recommendation = availableMemory < 1 ? 'CRITICAL — System may be swapping/throttling. Close applications or upgrade RAM.' : availableMemory < 2 ? 'LOW — Performance may degrade. Consider closing unused tabs.' : availableMemory < 4 ? 'ADEQUATE — Normal usage, some headroom.' : 'GOOD — Plenty of free memory for demanding tasks.'
    return { result: availableMemory, label: 'Available RAM', unit: 'GB', steps: [
      { label: 'Total System RAM', value: `${v.totalGb} GB` },
      { label: 'OS & Background', value: `${v.totalGb} GB × ${v.osReserve}% = ${osUsage.toFixed(1)} GB` },
      { label: 'Browser Tabs (~0.15 GB each)', value: `${v.browserTabs} × 0.15 GB = ${tabMemory.toFixed(1)} GB` },
      { label: 'Other Apps (~0.5 GB each)', value: `${v.openApps} × 0.5 GB = ${appMemory.toFixed(1)} GB` },
      { label: 'Total Memory Used', value: `${usedMemory.toFixed(1)} GB (${usagePct.toFixed(0)}% of total)` },
      { label: 'Available Free RAM', value: `${availableMemory.toFixed(1)} GB` },
      { label: 'Performance Status', value: recommendation },
    ] ,
    extras: [
      { label: 'Chrome Memory Usage', value: 'Chrome uses 150-500 MB per tab (varies by site content). With 15 tabs open, expect 2-8 GB of RAM usage. Use Tab Groups and extensions like One Tab to reduce.' },
      { label: 'App Memory Benchmarks', value: 'Slack/Teams: 500-1000 MB each. VS Code: 400-800 MB. Photoshop: 1-3 GB. Zoom: 200-500 MB. Each open app adds significant overhead.' },
      { label: 'OS Requirements', value: 'Windows 11: ~4 GB idle. macOS Sonoma: ~6 GB idle. Linux (GNOME): ~2 GB idle. Linux (XFCE/LXDE): ~500 MB idle — better for low-RAM systems.' },
      { label: 'Upgrade Guidelines', value: '8 GB: minimum for basic use (web, email). 16 GB: recommended for multitasking, office work. 32 GB: gaming, creative work, VMs. 64 GB+: professional video/3D/AI.' },
      { label: 'Free Memory Myth', value: 'Modern OSes cache aggressively — "free" RAM is often used for cache. The system releases cache when apps need it. Focus on available (not free) memory.' },
      { label: 'Virtual Memory', value: 'When RAM runs low, the OS uses SSD/HDD as "virtual memory" (swap/pagefile). This is 10-100× slower than RAM and causes noticeable lag.' },
    ]}
  },
  description: 'Estimate how much RAM is available on your computer after accounting for the operating system, browser tabs, and running applications. Get performance recommendations based on your usage.',
  formula: 'AvailableRAM = TotalRAM − (TotalRAM × OS_Reserve% + BrowserTabs × 0.15GB + OpenApps × 0.5GB) | Usage% = UsedRAM / TotalRAM × 100',
  interpretation: 'Modern operating systems use 2-6 GB of RAM at idle depending on the OS. Each Chrome tab consumes ~150-500 MB, and applications like Slack, Teams, or VS Code use 500-1000 MB each. On a typical 16 GB system with 15 browser tabs and 5 apps, you will have ~5-8 GB available. Keep at least 1-2 GB free to avoid system slowdowns from swapping/paging. 8 GB is the minimum for comfortable general use; 16 GB is recommended for multitaskers and gamers; 32 GB for creative professionals and developers running VMs.'
}

export default calcDef
