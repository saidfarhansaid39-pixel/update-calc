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
  defaults: { widthPx: '6000', heightPx: '4000', dpi: '300', bitDepth: '24' },
  presets: [
    { label: '24 MP Photo (6000×4000)', values: { widthPx: '6000', heightPx: '4000', dpi: '300', bitDepth: '24' } },
    { label: 'Full HD Screen (1920×1080)', values: { widthPx: '1920', heightPx: '1080', dpi: '72', bitDepth: '24' } },
    { label: '4K UHD (3840×2160)', values: { widthPx: '3840', heightPx: '2160', dpi: '72', bitDepth: '24' } },
    { label: 'Smartphone Camera (12 MP)', values: { widthPx: '4000', heightPx: '3000', dpi: '300', bitDepth: '24' } },
  ],
  compute: (v) => {
    const widthIn = v.widthPx / v.dpi
    const heightIn = v.heightPx / v.dpi
    const megapixels = (v.widthPx * v.heightPx) / 1000000
    const totalPixels = v.widthPx * v.heightPx
    const rawBytes = v.widthPx * v.heightPx * (v.bitDepth / 8)
    const rawMb = rawBytes / 1024 / 1024
    const rawGb = rawMb / 1024
    const aspectRatio = (v.widthPx / v.heightPx).toFixed(2)
    const printCmW = widthIn * 2.54
    const printCmH = heightIn * 2.54
    return { result: megapixels, label: 'Resolution', unit: 'MP',
      steps: [
        { label: 'Pixel Dimensions', value: `${v.widthPx} × ${v.heightPx} = ${totalPixels.toLocaleString()} pixels` },
        { label: 'Megapixels', value: `${totalPixels.toLocaleString()} ÷ 1,000,000 = ${megapixels.toFixed(2)} MP` },
        { label: 'Aspect Ratio', value: `${v.widthPx}:${v.heightPx} = ${aspectRatio}:1` },
        { label: 'Print Size at Current DPI', value: `${v.widthPx} ÷ ${v.dpi} × ${v.heightPx} ÷ ${v.dpi} = ${widthIn.toFixed(1)} × ${heightIn.toFixed(1)} in (${printCmW.toFixed(1)} × ${printCmH.toFixed(1)} cm)` },
        { label: 'Uncompressed File Size', value: `${totalPixels.toLocaleString()} × ${v.bitDepth} bits ÷ 8 ÷ 1024² = ${rawMb.toFixed(2)} MB (${rawGb.toFixed(3)} GB)` },
        { label: 'Print Quality Rating', value: v.dpi >= 300 ? 'Print-quality (≥300 DPI)' : v.dpi >= 200 ? 'Good print quality' : v.dpi >= 150 ? 'Acceptable for large prints' : 'Screen/web quality only' },
        { label: 'Max Print Size at 300 DPI', value: `${(v.widthPx / 300).toFixed(1)} × ${(v.heightPx / 300).toFixed(1)} in` },
        { label: 'Max Print Size at 150 DPI', value: `${(v.widthPx / 150).toFixed(1)} × ${(v.heightPx / 150).toFixed(1)} in (acceptable for large format)` },
      ],
      extras: [
        { label: '🖼️ 300 DPI Print Standard', value: '300 DPI is the industry standard for high-quality photo prints. At 300 DPI, the human eye cannot distinguish individual pixels at normal viewing distance. 150 DPI is acceptable for large wall prints viewed from farther away.' },
        { label: '📱 Screen Resolution vs Print', value: '72 DPI is the traditional screen standard (Mac), 96 DPI for Windows. Retina displays use 2-3× (144-288 DPI at 2×, 216-432 at 3×). A 1920×1080 screen at 96 DPI = 20" wide.' },
        { label: '📸 Camera Megapixel Reality', value: 'More MP doesn\'t always mean better photos. A 12 MP full-frame sensor outperforms a 48 MP smartphone sensor due to larger individual pixels. Good lenses matter more than MP count after 12-16 MP.' },
        { label: '💾 File Size vs Quality Trade-off', value: 'JPEG compresses raw data 10:1-20:1 with minimal visible quality loss. A 24 MP raw file (69 MB) becomes a 3-7 MB JPEG. For web use, JPEG at 80-85% quality is the sweet spot.' },
        { label: '🖨️ Common Print Sizes', value: '4×6: 1200×1800 px at 300 DPI. 5×7: 1500×2100 px. 8×10: 2400×3000 px. 11×14: 3300×4200 px. 16×20: 4800×6000 px. 24×36: 7200×10800 px.' },
        { label: '🔢 Bit Depth Explained', value: '8-bit = 256 colors per channel (16.7M total). 16-bit = 65,536 colors/channel (281 trillion). 24-bit is standard for display. Higher bit depth gives smoother gradients and more editing headroom.' },
        { label: '🌐 Web Image Optimization', value: 'For web: max 2000 px on the longest side, JPEG quality 80%, file size under 300 KB. Use WebP format for 25-35% smaller files. Next-gen formats (AVIF) save another 20-30%.' },
        { label: '📐 Upscaling vs Downscaling', value: 'Downscaling (reducing resolution) creates sharper-looking images. Upscaling (increasing resolution) never adds real detail — AI upscalers can approximate but not replace true resolution.' },
      ]
    }
  },
  description: 'Calculate print size, megapixels, aspect ratio, and uncompressed file size from pixel dimensions and DPI. Includes print quality ratings, max print sizes at common DPIs, and practical file size context.',
  formula: 'Megapixels = (Width × Height) ÷ 1,000,000 | Print Width (in) = Width (px) ÷ DPI | Print Height (in) = Height (px) ÷ DPI | Raw File Size (MB) = (W × H × BitDepth/8) ÷ 1024²',
  interpretation: '300 DPI is the print industry standard for sharp images viewed at arm\'s length. 150 DPI is acceptable for large format prints viewed from 3-6 ft. 72 DPI is the traditional screen standard. A 24-megapixel photo (6000×4000 px) prints 20×13.3 in at 300 DPI — sufficient for most wall prints. For reference: a 4×6 print needs only 1200×1800 px at 300 DPI (2.2 MP). Higher megapixel counts matter most for cropping flexibility, large prints, and commercial use.'
}

export default calcDef
