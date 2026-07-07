import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), height: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bitDepth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), compression: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), count: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'width', label: 'Image Width (pixels)', type: 'number', min: 1, step: '100' },
    { name: 'height', label: 'Image Height (pixels)', type: 'number', min: 1, step: '100' },
    { name: 'bitDepth', label: 'Color Depth (bits/pixel)', type: 'number', min: 1, step: '8' },
    { name: 'compression', label: 'Compression Ratio (:1)', type: 'number', min: 1, step: '1' },
    { name: 'count', label: 'Number of Images', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const rawBytes = v.width * v.height * (v.bitDepth / 8)
    const compressedBytes = rawBytes / v.compression
    const totalBytes = compressedBytes * v.count
    const totalKb = totalBytes / 1024
    const totalMb = totalKb / 1024
    return { result: totalMb, label: 'Total File Size', unit: 'MB', steps: [{ label: 'Raw Size', value: `${(rawBytes / 1024 / 1024).toFixed(2)} MB` }, { label: 'Compressed Size', value: `${(compressedBytes / 1024 / 1024).toFixed(2)} MB` }, { label: 'Total for All Images', value: `${totalMb.toFixed(2)} MB` }] }
  },
  description: 'Calculate image file sizes based on resolution, color depth, and compression. Estimate storage needs for photos and digital assets.',
  formula: 'File Size = (Width × Height × Bit Depth/8) / Compression × Count',
  interpretation: 'Typical sizes: 24-bit 12MP photo (4000×3000) = 36 MB raw, 3-6 MB JPEG. 8-bit color = 256 colors, 24-bit = 16.7M colors. JPEG compression ratios: 10:1 (high quality), 20:1 (medium), 30:1 (low quality).'
}

export default calcDef
