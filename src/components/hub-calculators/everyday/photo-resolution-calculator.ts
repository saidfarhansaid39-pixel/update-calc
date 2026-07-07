import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ widthPx: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), heightPx: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), dpi: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bitDepth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'widthPx', label: 'Width (pixels)', type: 'number', min: 1, step: '100' },
    { name: 'heightPx', label: 'Height (pixels)', type: 'number', min: 1, step: '100' },
    { name: 'dpi', label: 'DPI (Dots Per Inch)', type: 'number', min: 72, step: '72' },
    { name: 'bitDepth', label: 'Bit Depth', type: 'number', min: 1, step: '8' },
  ],
  compute: (v) => {
    const widthIn = v.widthPx / v.dpi
    const heightIn = v.heightPx / v.dpi
    const megapixels = (v.widthPx * v.heightPx) / 1000000
    const rawBytes = v.widthPx * v.heightPx * (v.bitDepth / 8)
    const rawMb = rawBytes / 1024 / 1024
    return { result: megapixels, label: 'Resolution', unit: 'MP', steps: [{ label: 'Print Size', value: `${widthIn.toFixed(1)}×${heightIn.toFixed(1)} in` }, { label: 'Megapixels', value: `${megapixels.toFixed(2)} MP` }, { label: 'Uncompressed Size', value: `${rawMb.toFixed(2)} MB` }] }
  },
  description: 'Calculate print size, megapixels, and uncompressed file size from pixel dimensions and DPI. Ideal for photographers and designers planning prints.',
  formula: 'Print(in) = Px/DPI | MP = (W×H)/1,000,000 | Raw(MB) = (W×H×BitDepth/8)/1024²',
  interpretation: '300 DPI is print standard. 72 DPI is screen standard. A 12 MP photo (4000×3000) prints 13.3×10 in at 300 DPI. Retina displays require 2-3× standard resolution.'
}

export default calcDef
