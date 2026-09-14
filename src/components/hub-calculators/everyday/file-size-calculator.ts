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
  defaults: { width: '4000', height: '3000', bitDepth: '24', compression: '10', count: '1' },
  presets: [
    { label: '12MP Smartphone JPEG', values: { width: '4000', height: '3000', bitDepth: '24', compression: '10', count: '1' } },
    { label: '24MP DSLR RAW', values: { width: '6000', height: '4000', bitDepth: '14', compression: '1', count: '1' } },
    { label: 'Web Banner PNG', values: { width: '1200', height: '628', bitDepth: '24', compression: '1.5', count: '1' } },
    { label: 'Photo Album (200 pics)', values: { width: '4000', height: '3000', bitDepth: '24', compression: '8', count: '200' } },
  ],
  compute: (v) => {
    const rawBytes = v.width * v.height * (v.bitDepth / 8)
    const compressedBytes = rawBytes / v.compression
    const totalBytes = compressedBytes * v.count
    const totalKb = totalBytes / 1024
    const totalMb = totalKb / 1024
    const totalGb = totalMb / 1024
    const rawMb = rawBytes / 1024 / 1024
    const rawGb = rawMb / 1024
    const megapixels = v.width * v.height / 1000000
    const millionColors = Math.pow(2, v.bitDepth)
    const compressedKbPerImage = compressedBytes / 1024
    const totalTb = totalGb / 1024
    const formatGuess = v.bitDepth <= 8 ? 'Indexed/GIF (256 colors)' : v.compression >= 10 ? 'JPEG (lossy)' : v.compression >= 2 ? 'Compressed TIFF/PNG' : 'RAW/BMP (lossless)'
    const imgDpi = 300
    const printInchesW = v.width / imgDpi
    const printInchesH = v.height / imgDpi
    return { result: totalMb, label: 'Total File Size', unit: 'MB', steps: [
      { label: 'Resolution', value: `${v.width} × ${v.height} px (${megapixels.toFixed(1)} MP)` },
      { label: 'Color Depth', value: `${v.bitDepth}-bit (${millionColors >= 1000000 ? `${(millionColors / 1000000).toFixed(1)}M` : millionColors >= 1000 ? `${(millionColors / 1000).toFixed(0)}K` : millionColors} colors)` },
      { label: 'Raw Size (uncompressed)', value: `${rawMb.toFixed(2)} MB${rawGb >= 1 ? ` (${rawGb.toFixed(2)} GB)` : ''}` },
      { label: 'Compression Ratio', value: `${v.compression}:1 (${formatGuess})` },
      { label: 'Compressed per Image', value: `${compressedKbPerImage >= 1024 ? `${(compressedKbPerImage / 1024).toFixed(2)} MB` : `${compressedKbPerImage.toFixed(1)} KB`}` },
      { label: `${v.count} Image${v.count > 1 ? 's' : ''} Total`, value: totalGb >= 1 ? `${totalGb.toFixed(2)} GB` : totalMb >= 1 ? `${totalMb.toFixed(2)} MB` : `${totalKb.toFixed(2)} KB` },
      { label: 'Print Size at 300 DPI', value: `${printInchesW.toFixed(1)} × ${printInchesH.toFixed(1)} in` },
      { label: 'Storage for 1,000 images', value: `${(totalMb * 1000 / v.count / 1024).toFixed(1)} GB` },
    ] ,
    extras: [
      { label: "Megapixel & Sensor Resolution Guide", value: "8 MP = 3,264×2,448 (good for 8×10 print). 12 MP = 4,000×3,000 (standard phone, 11×14 print). 24 MP = 6,000×4,000 (pro DSLR, 16×20 print). 45 MP = 8,192×5,464 (pro landscape, 24×36 print). 100 MP = 11,600×8,700 (medium format, billboard-size). For web/social: 2-5 MP is plenty. More megapixels = larger files, slower workflow, and diminishing returns unless cropping heavily or printing large." },
      { label: "Color Depth & File Format Trade-offs", value: "8-bit (256 colors): GIF, PNG-8 — small files, good for graphics/logos, poor for photos. 24-bit (16.7M colors): JPEG, PNG-24, TIFF — standard for photos. 48-bit (281 trillion): ProPhoto RGB, some RAW formats — pro use only, 2-3× larger files, many screens can't display. HEIF (10-bit, 30-50% smaller than JPEG): modern Apple/Google format, limited software support. AVIF: 50% smaller than JPEG with better quality — the emerging standard." },
      { label: "JPEG Quality vs File Size Trade-off", value: "Quality 100 (compression ~2:1): 10-15 MB per 12MP photo, visually identical to RAW, 92-98 IQ score. Quality 90 (~8:1): 4-6 MB, excellent quality, 88-92 IQ score. Quality 75 (~15:1): 2-3 MB, good quality, 78-85 IQ score. Quality 50 (~25:1): 1-1.5 MB, acceptable, 68-75 IQ. Quality 25 (~40:1): 0.5-0.8 MB, visible artifacts, 50-65 IQ. Sweet spot: Quality 85-90 for archival, 70-80 for web sharing." },
      { label: "Storage Needs by Use Case", value: "Casual photo (5 MP JPEG, 2 MB): 500 photos/GB. Enthusiast (24 MP RAW, 40 MB): 25 photos/GB. Pro landscape (45 MP RAW, 80 MB): 12 photos/GB. Video: 4K 60fps = 600 MB/min, 1080p 30fps = 150 MB/min. Average smartphone user generates 50-200 GB of photos/videos per year. Pro photographer: 2-8 TB/year. A 2 TB external drive ($60-100) holds ~500,000 web JPEGs or ~25,000 RAW photos." },
      { label: "Cloud Storage Cost Comparison", value: "Google Photos: 15 GB free (compressed 'Storage Saver' quality). iCloud: 5 GB free, $0.99/mo for 50 GB, $2.99/mo for 200 GB, $9.99/mo for 2 TB. Dropbox: 2 GB free, $9.99/mo for 2 TB. Amazon Photos: free unlimited photo storage (compressed) for Prime members ($139/yr). Google One: $1.99/mo for 100 GB, $9.99/mo for 2 TB. 10-year cost for 2 TB: Google One $1,200 vs local SSD $100 (one-time) — local is 12× cheaper long-term." },
      { label: "Image Dimension & Aspect Ratio Standards", value: "Social media: Instagram square 1080×1080, landscape 1080×566, story 1080×1920. Twitter in-stream: 1600×900. Facebook: 1200×630 (link preview), 1200×1200 (post). YouTube thumbnail: 1280×720. Website hero: 1920×800. Email header: 600×200. Print 4×6: 1,200×1,800 @ 300 DPI. Print 8×10: 2,400×3,000 @ 300 DPI. Resizing to exact target dimensions saves 20-40% file size vs letting CSS resize oversize images." },
      { label: "Bulk Image Compression Tools", value: "Squoosh (free, browser-based): WebP/AVIF/JPEG/PNG, adjustable quality per-image, batch up to 20. TinyPNG/TinyJPG (free up to 5 MB, $25/yr unlimited): reduces PNG/JPEG 50-80% with minimal quality loss. ImageOptim (Mac, free): removes EXIF/metadata, best-in-class compression, batch processing. IrfanView (Windows, free): batch resize + compress 100s of images in seconds. Command line: `ffmpeg -i in.jpg -q:v 82 out.jpg` or ImageMagick `mogrify -quality 82 *.jpg`." },
      { label: "EXIF & Metadata Size", value: "Camera adds 2-50 KB of EXIF data per photo (camera model, GPS location, date, lens, aperture, shutter speed, copyright). GPS tags add 5-15 KB. Thumbnail embedded in EXIF: 10-50 KB. For 10,000 photos, EXIF alone = 200-500 MB. Tools like ExifTool or ImageOptim strip metadata (saving 1-5% file size) — useful for web publishing but irreversible. iPhone ProRes RAW includes 3-5 MB preview + depth map — the metadata can exceed the image data." },
    ]}
  },
  description: 'Calculate image file sizes from raw pixels to compressed output. Understand how resolution, color depth, compression ratio, and quantity affect total storage. Includes print size estimation and format intelligence.',
  formula: 'Raw Bytes = Width × Height × (Bit Depth / 8) | Compressed = Raw / Compression | Total = Compressed × Count | Megapixels = Width × Height / 1,000,000',
  interpretation: 'A 12 MP (4,000×3,000) 24-bit photo at JPEG quality 90 (~8:1 compression) occupies ~4.5 MB — 10× smaller than the 45 MB RAW file. The compression ratio is the single biggest lever for file size: increasing from 8:1 to 15:1 cuts size by 47% with minimal visible quality loss. For most uses, the optimal approach is: shoot RAW (for editing flexibility), export to JPEG quality 85 (for delivery), and convert to WebP/AVIF (for web — saves 30-50% over JPEG with identical quality). A typical smartphone user\'s 10,000-photo library at 4 MB each = 40 GB — manageable on a 128 GB phone with 30-40% headroom.'
}

export default calcDef
